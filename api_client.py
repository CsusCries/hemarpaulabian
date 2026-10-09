import requests

BASE_URL = "https://hemarpaulabian.onrender.com"


# Step 6: Read the /student JSON data
def get_student():
    response = requests.get(f"{BASE_URL}/student", timeout=60)

    if response.status_code == 200:
        data = response.json()
        print("Student ID:", data["student_id"])
        print("Name:", data["name"])
        print("Program:", data["program"])
        print("Year:", data["year"])
        print("Section:", data["section"])
    else:
        print("Request failed.")
        print("Status Code:", response.status_code)


# Step 7: Send your first name to the /hello endpoint
def say_hello():
    name = input("Enter your first name: ")
    response = requests.get(f"{BASE_URL}/hello", params={"name": name}, timeout=60)

    if response.status_code == 200:
        data = response.json()
        print(data["message"])
    else:
        print("Request failed.")
        print("Status Code:", response.status_code)


# Step 8: Access one of your own Lab 4 endpoints (/favorite_food)
def get_favorite_food():
    response = requests.get(f"{BASE_URL}/favorite_food", timeout=60)

    if response.status_code == 200:
        data = response.json()
        print("--- Favorite Food ---")
        print("Preferred cuisine:", data["preferred_cuisine"])
        print("Favorite dish:", data["favorite_dish"])
        print("Restaurant:", data["restaurant"])
        print("Rating:", data["rating"])
    else:
        print("Request failed.")
        print("Status Code:", response.status_code)


if __name__ == "__main__":
    get_student()
    say_hello()
    get_favorite_food()
