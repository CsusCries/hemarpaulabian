import sqlite3
import requests
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

# Lab 9: partner's deployed API addresses
PARTNER_READ_URL = "https://jadewarrencasas-1.onrender.com/students"
PARTNER_POST_URL = "https://jadewarrencasas-1.onrender.com/api/students"


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


# Display all students (used by the filter and search views)
@app.route('/students')
def get_students():
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
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
        'SELECT * FROM students WHERE year = ?', (year,)
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


# Lab 8 and Lab 9: list all records (GET) and add a record (POST)
@app.route('/api/students', methods=['GET', 'POST'])
def api_students():
    if request.method == 'GET':
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM students').fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])

    data = request.get_json()
    source = data.get('source', 'External API')
    conn = get_db_connection()
    cursor = conn.execute(
        """INSERT INTO students
           (student_id, name, program, year, section, source)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (data['student_id'], data['name'], data['program'],
         data['year'], data['section'], source)
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


# Lab 9: retrieve the partner's records on the server side (read-only)
@app.route('/partner-records')
def partner_records():
    try:
        response = requests.get(PARTNER_READ_URL, timeout=15)
        response.raise_for_status()
        return jsonify(response.json())
    except (requests.RequestException, ValueError):
        return jsonify({"error": "Unable to retrieve partner data"}), 502


# Lab 9: save a selected partner record into my own database
@app.route('/import-student', methods=['POST'])
def import_student():
    data = request.get_json()
    conn = get_db_connection()
    conn.execute(
        """INSERT INTO students
           (student_id, name, program, year, section, source)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (data['student_id'], data['name'], data['program'],
         data['year'], data['section'], 'Classmate API')
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Remote record saved"}), 201


# Lab 9: send one practice record to the partner's POST endpoint
@app.route('/send-to-partner', methods=['POST'])
def send_to_partner():
    record = {
        "student_id": "EXT-001",
        "name": "Sample Exchange Record",
        "program": "BSIT",
        "year": 1,
        "section": "A",
        "source": "Partner API"
    }
    try:
        response = requests.post(PARTNER_POST_URL, json=record, timeout=15)
        return jsonify({"status": response.status_code, "response": response.text})
    except requests.RequestException:
        return jsonify({"error": "Unable to send record to partner."}), 502


if __name__ == '__main__':
    app.run(debug=True)