from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to my first API!"

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

if __name__ == '__main__':
    app.run(debug=True)
