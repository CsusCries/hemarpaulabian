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


# Original Student API
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


# Favorite Food API
@app.route('/favorite_food')
def get_favorite_food():
    cuisine = request.args.get('cuisine', 'Filipino')
    return jsonify({
        "preferred_cuisine": cuisine,
        "favorite_dish": "Adobo",
        "restaurant": "Local Filipino Restaurant",
        "rating": 5
    })


# Hobbies API
@app.route('/hobbies')
def get_hobbies():
    return jsonify({
        "name": "Hemar Paul Abian",
        "hobbies": ["Gaming", "Sleeping", "Tinkering game scripts"],
        "favorite": "Gaming",
        "years_of_experience": 5
    })


# Display all students
@app.route('/students')
def get_students():
    conn = get_db_connection()
    students = conn.execute(
        'SELECT * FROM students'
    ).fetchall()
    conn.close()

    return jsonify([dict(student) for student in students])


# Display one student using /students/1
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


# Display one student using /student/1
@app.route('/student/<int:id>')
def get_student_by_id_singular(id):
    conn = get_db_connection()
    student = conn.execute(
        'SELECT * FROM students WHERE id = ?', (id,)
    ).fetchone()
    conn.close()

    if student is None:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(dict(student))


# 18. Display students by program
@app.route('/students/program/<program>')
def get_students_by_program(program):
    conn = get_db_connection()
    students = conn.execute(
        'SELECT * FROM students WHERE UPPER(program) = ?',
        (program.upper(),)
    ).fetchall()
    conn.close()

    return jsonify([dict(student) for student in students])


# 19. Display students by year level
@app.route('/students/year/<int:year>')
def get_students_by_year(year):
    conn = get_db_connection()
    students = conn.execute(
        'SELECT * FROM students WHERE year = ?',
        (year,)
    ).fetchall()
    conn.close()

    return jsonify([dict(student) for student in students])


# 20. Display students by section
@app.route('/students/section/<section>')
def get_students_by_section(section):
    conn = get_db_connection()
    students = conn.execute(
        'SELECT * FROM students WHERE UPPER(section) = ?',
        (section.upper(),)
    ).fetchall()
    conn.close()

    return jsonify([dict(student) for student in students])


# Add a new student
@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.execute(
        """INSERT INTO students
           (student_id, name, program, year, section)
           VALUES (?, ?, ?, ?, ?)""",
        (data['student_id'], data['name'], data['program'],
         data['year'], data['section'])
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({"message": "Student added", "id": new_id}), 201


# Read one student
@app.route('/api/students/<int:id>', methods=['GET'])
def api_get_student(id):
    conn = get_db_connection()
    student = conn.execute(
        'SELECT * FROM students WHERE id = ?', (id,)
    ).fetchone()
    conn.close()

    if student is None:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(dict(student))


# Update one student
@app.route('/api/students/<int:id>', methods=['PUT'])
def update_student(id):
    data = request.get_json()
    conn = get_db_connection()
    conn.execute(
        """UPDATE students SET student_id=?, name=?, program=?,
           year=?, section=? WHERE id=?""",
        (data['student_id'], data['name'], data['program'],
         data['year'], data['section'], id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Student updated"})


# Delete one student
@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM students WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Student deleted"})


if __name__ == '__main__':
    app.run(debug=True)