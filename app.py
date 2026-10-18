import sqlite3
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)


def get_db_connection():
    conn = sqlite3.connect('students.db')
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/student')
def get_student():
    return jsonify({
        "student_id": "24-00200",
        "name": "Hemar Paul Abian",
        "program": "BSIT",
        "year": 3,
        "section": "A"
    })


@app.route('/hello')
def say_hello():
    name = request.args.get('name', 'Student')
    return jsonify({
        "message": f"Hello, {name}!"
    })


# NEW ENDPOINT 1 (accepts input from URL)
@app.route('/favorite_food')
def get_favorite_food():
    cuisine = request.args.get('cuisine', 'Filipino')
    return jsonify({
        "preferred_cuisine": cuisine,
        "favorite_dish": "Adobo",
        "restaurant": "Local Filipino Restaurant",
        "rating": 5
    })


# NEW ENDPOINT 2 (different purpose)
@app.route('/hobbies')
def get_hobbies():
    return jsonify({
        "name": "Hemar Paul Abian",
        "hobbies": ["Gaming", "Sleeping", "Tinkering game scripts"],
        "favorite": "Gaming",
        "years_of_experience": 5
    })

@app.route('/students')
def get_students():
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
    conn.close()

    return jsonify([dict(student) for student in students])

@app.route('/students/<int:id>')
def get_student_by_id(id):
    conn = get_db_connection()
    student = conn.execute(
        'SELECT * FROM students WHERE id = ?', (id,)
    ).fetchone()
    conn.close()

    if student is None:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(dict(student))

if __name__ == '__main__':
    app.run(debug=True)
