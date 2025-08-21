from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import *
import requests
from werkzeug.security import generate_password_hash, check_password_hash
import os
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import gridfs
from bson.objectid import ObjectId
import io
from flask import Flask, send_file
from io import BytesIO
import datetime
from datetime import *
from pymongo import MongoClient
import subprocess
import json
from bcrypt import hashpw, gensalt, checkpw
load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)
db = client['phish_or_miss']
users = db['users']
leaderboards = db['leaderboards']
fs = gridfs.GridFS(db)
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)


@app.route('/')
def home():
    return "Flask backend is running!"

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    hashed_pw = generate_password_hash(password)
    
    # Initialize default achievements
    achievements = [
        { "id": "first_steps", "earned": False },
        { "id": "first_mistake", "earned": False },
        { "id": "perfect_combo", "earned": False },
        { "id": "what_are_you_doing", "earned": False }
    ]

    users.insert_one({
        "username": username,
        "password": hashed_pw,
        "profilePic": "",
        "achievements": achievements
    })

    return jsonify({"message": "Registered successfully"}), 200


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = users.find_one({ "username": username },{"_id": 1, "username": 1, "password": 1, "profilePic": 1})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({ "error": "Invalid username or password" }), 401

    resp = {
        "_id": str(user["_id"]),
        "username": user["username"],
        "profilePic": str(user['profilePic'])
    }
    return jsonify(resp), 200


@app.route('/api/leaderboards', methods=['GET'])
def get_leaderboards():
    rankings = []
    rankings = leaderboards.find({}, {"_id": 0}).sort("score", -1).limit(10)
    
    if not rankings:
        return jsonify({ "error": "No leaderboards found" }), 404
    else:
        return jsonify(list(rankings)), 200
    
@app.route('/api/get_user', methods=['GET'])
def get_user():
    username = request.args.get('username')
    user_id = request.args.get('id')

    try:
        if user_id:
            user = users.find_one({"_id": ObjectId(user_id)}, {"_id": 1, "username": 1, "profilePic": 1})
        elif username:
            user = users.find_one({"username": username}, {"_id": 1, "username": 1, "profilePic": 1})
        else:
            return jsonify({"error": "No identifier provided"}), 400

        if user:
            user['_id'] = str(user['_id'])  # Always as string for front-end
            if 'profilePic' in user and user['profilePic']:
                user['profilePic'] = str(user['profilePic'])
            else:
                user['profilePic'] = None
            return jsonify(user)
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/update_profile', methods=['POST'])
def update_profile():
    user_id = request.form.get('id')  # <-- Correct for FormData
    profile_pic = request.files.get('profilePic')
    print(f"Received: user_id={user_id}, profile_pic={profile_pic}")

    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_username = request.form.get('username')
    update_data = {"username": new_username}

    if profile_pic:
        # Delete old image from GridFS (if exists)
        old_pic_id = user.get("profilePic")
        if old_pic_id:
            try:
                fs.delete(ObjectId(old_pic_id))
            except Exception as e:
                print(f"[WARN] Could not delete old profile pic: {e}")

        # Upload new image
        pic_id = fs.put(profile_pic, filename=profile_pic.filename, content_type=profile_pic.content_type)
        update_data["profilePic"] = pic_id

    users.update_one({"_id": user["_id"]}, {"$set": update_data})
    return jsonify({"message": "Profile updated!"}), 200

@app.route('/api/profile_picture/<pic_id>', methods=['GET'])
def get_profile_picture(pic_id):
    try:
        image = fs.get(ObjectId(pic_id))
        return send_file(io.BytesIO(image.read()), mimetype=image.content_type)
    except Exception as e:
        print(f"[ERROR] Could not fetch image {pic_id}: {e}")
        return jsonify({"error": "Image not found"}), 404

@app.route('/api/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    user_id = data.get("id")
    new_password = data.get("newPassword")

    if not user_id or not new_password:
        return jsonify({"error": "Missing parameters"}), 400

    hashed_pw = generate_password_hash(new_password)
    users.update_one({"_id": ObjectId(user_id)}, {"$set": {"password": hashed_pw}})
    return jsonify({"message": "Password updated!"}), 200

@app.route('/api/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    user_id = data.get("id")

    if not user_id:
        return jsonify({"error": "Missing user ID"}), 400

    users.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "Account deleted successfully"}), 200

@app.route('/api/achievements', methods=['GET'])
def get_achievements():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Missing username"}), 400

    user = users.find_one({"username": username}, {"_id": 0, "username": 1, "achievements": 1})

    if not user:
        return jsonify({"error": "User not found"}), 404

    achievements = user.get("achievements", [])

    return jsonify({"achievements": achievements}), 200


from flask import request, jsonify
from datetime import datetime, timezone

@app.route('/api/report', methods=['POST'])
def report():
    data = request.get_json()
    username = data.get("username")
    answers = data.get("answers")  # array of 10 email interactions

    if not username or not answers:
        return jsonify({"error": "Missing username or answers"}), 400

    # === Score and Performance Calculation ===
    correct = sum(1 for a in answers if a['isCorrect'])
    incorrect = sum(1 for a in answers if not a['isCorrect'] and a['userAnswer'] != 'miss')
    missed = sum(1 for a in answers if a['userAnswer'] == 'miss')

    # Time penalty: 1 point per second over 15 seconds per question
    time_penalty = sum(max(0, a.get("timeTaken", 0) - 15) for a in answers)
    score = max(0, correct * 10 - time_penalty)  # avoid negative score

    # === Determine Achievements Earned ===
    earned_achievement_ids = []

    if correct == 10:
        earned_achievement_ids.append("perfect_combo")
    if incorrect >= 3 or missed >= 3 or incorrect + missed >= 3:
        earned_achievement_ids.append("what_are_you_doing")
    if any(a['userAnswer'] == 'phishing' and a['isCorrect'] for a in answers):
        earned_achievement_ids.append("first_mistake")
    if any(a['userAnswer'] == 'legit' and a['isCorrect'] for a in answers):
        earned_achievement_ids.append("first_steps")

    print("Earned Achievements This Session:", earned_achievement_ids)

    # === Ensure User Exists ===
    user = users.find_one({"username": username})
    if not user:
        users.insert_one({
            "username": username,
            "highScore": score,
            "achievements": [
                {"id": "first_steps", "earned": False},
                {"id": "first_mistake", "earned": False},
                {"id": "perfect_combo", "earned": False},
                {"id": "what_are_you_doing", "earned": False}
            ],
            "reports": []
        })
        user = users.find_one({"username": username})

    # === Get Already Earned Achievements ===
    existing_achievements = user.get("achievements", [])
    already_earned_ids = {a["id"] for a in existing_achievements if a["earned"]}

    # === Mark Newly Earned Achievements ===
    newly_earned = []
    for achievement_id in earned_achievement_ids:
        if achievement_id not in already_earned_ids:
            result = users.update_one(
                {"username": username, "achievements.id": achievement_id},
                {"$set": {"achievements.$.earned": True}}
            )
            if result.modified_count > 0:
                newly_earned.append(achievement_id)

    print("Newly Earned Achievements:", newly_earned)

    # === Store Report Session ===
    users.update_one(
        {"username": username},
        {"$push": {"reports": {
            "answers": answers,
            "timestamp": datetime.now(timezone.utc),
            "correct": correct,
            "incorrect": incorrect,
            "missed": missed,
            "score": score,
            "timePenalty": time_penalty,
            "earnedThisSession": newly_earned
        }}}
    )

    # === Update High Score if Needed ===
    users.update_one(
        {"username": username},
        {"$max": {"highScore": score}}
    )

    # === Return Report Data ===
    return jsonify({
        "correct": correct,
        "incorrect": incorrect,
        "missed": missed,
        "score": score,
        "timePenalty": time_penalty,
        "achievements": earned_achievement_ids,
        "firstTime": newly_earned,
        "answers": answers
    })


@app.route('/api/report/latest', methods=['GET'])
def get_latest_report():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Missing username"}), 400

    user = users.find_one({"username": username}, {})
    if not user:
        return jsonify({})  # Treat as no report

    reports = user.get("reports", [])
    if not reports:
        return jsonify({})  # Return empty, not error

    latest_report = reports[-1]
    latest_report["achievements"] = latest_report.get("earnedThisSession", [])
    return jsonify(latest_report)

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    leaderboard = []

    # Fetch all users
    all_users = users.find({}, {"username": 1, "reports": 1, "achievements": 1,'highScore':1})

    for user in all_users:
        username = user.get("username")
        reports = user.get("reports", [])
        achievements = user.get("achievements", [])

        if not reports:
            continue  # Skip users without reports

        latest_report = reports[-1]
        score = user.get("highScore", 0)
        game_mode = latest_report.get("gameMode", "Timed Mode (10 Emails)")  # fallback
        earned = latest_report.get("earnedThisSession", [])

        # Display badge = number of achievements earned in total
        total_badges = sum(1 for a in achievements if a.get("earned"))

        leaderboard.append({
            "username": username,
            "score": round(score),
            "gameMode": game_mode,
            "badge": f"{total_badges} badges"
        })

    # Sort leaderboard by score descending
    leaderboard.sort(key=lambda x: x["score"], reverse=True)

    return jsonify(leaderboard)

@app.route('/api/user/achievements', methods=['GET'])
def get_user_achievements():
    username = request.args.get("username")
    print("🎯 /api/user/achievements called with username:", username)  # ✅ Add this

    if not username:
        return jsonify({"error": "Missing username"}), 400

    user = users.find_one({"username": username}, {"_id": 0, "achievements": 1})
    if not user:
        return jsonify({"error": "User not found"}), 404

    safe_achievements = [
        {
            "id": a.get("id"),
            "earned": a.get("earned", False),
            "imageUrl": a.get("imageUrl", "")
        }
        for a in user.get("achievements", [])
    ]

    print("Returning:", safe_achievements)  # ✅ Debug log
    return jsonify(safe_achievements)

#This is used to generate image from the Sogni SDK
@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    prompt = request.json.get("prompt")
    if not prompt:
        return jsonify({"error": "Missing prompt"}), 400

    try:
        result = subprocess.run(
            ['node', 'sogni_generate.js', prompt],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=os.path.dirname(os.path.abspath(__file__)),
            encoding='utf-8'  
        )

        if result.returncode != 0:
            return jsonify({"error": "Node script error", "details": result.stderr}), 500

        stdout = result.stdout.strip()
        print("✅ Raw Node output:\n", stdout)  # useful for debugging

        # Safely extract JSON object from stdout
        for line in reversed(stdout.splitlines()):
            try:
                data = json.loads(line)
                if isinstance(data, dict) and "images" in data:
                    return jsonify(data), 200
            except json.JSONDecodeError:
                continue

        return jsonify({"error": "No valid JSON found in Node output"}), 500

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Node script timed out"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/upload-medal', methods=['POST'])
def upload_medal():
    username = request.form.get("username")
    achievement_id = request.form.get("achievementId")
    image = request.files.get("image")

    if not username or not achievement_id or not image:
        return jsonify({"error": "Missing required fields"}), 400

    # Save to GridFS
    file_id = fs.put(image, filename=f"{username}_{achievement_id}_upload", content_type=image.content_type)

    # Return permanent image URL
    return jsonify({
        "imageUrl": f"/api/image/{str(file_id)}"
    }), 200

    
@app.route('/api/set-medal', methods=['POST'])
def set_medal():
    data = request.get_json()
    username = data.get("username")
    achievement_id = data.get("achievementId")
    image_url = data.get("imageUrl")

    if not username or not achievement_id or not image_url:
        return jsonify({"error": "Missing required fields"}), 400

    # Find user by username
    user = users.find_one({ "username": username })
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the specific achievement
    result = users.update_one(
        {
            "username": username,
            "achievements.id": achievement_id
        },
        {
            "$set": { "achievements.$.imageUrl": image_url }
        }
    )
    print(result)

    
    return jsonify({ "message": "Meme set successfully!" }), 200
    
@app.route('/api/reports', methods=['GET'])
def get_reports():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Missing username"}), 400

    user = users.find_one({"username": username}, {"_id": 0, "reports": 1})
    if not user:
        return jsonify({"error": "User not found"}), 404

    reports = user.get("reports", [])

    # Add explanation field to each answer (basic logic)
    for report in reports:
        for ans in report.get("answers", []):
            if ans["correctType"] == "phishing" and ans["userAnswer"] == "legit":
                ans["explanation"] = "This was a phishing email. Check the sender domain and generic greeting."
            elif ans["correctType"] == "legit" and ans["userAnswer"] == "phishing":
                ans["explanation"] = "This was a real email. It used a verified sender and no suspicious links."
            elif ans["correctType"] == ans["userAnswer"]:
                ans["explanation"] = "Correct! You identified this email accurately."
            else:
                ans["explanation"] = "No answer given."

    return jsonify({ "reports": reports }), 200

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('newPassword')

    if not username or not new_password:
        return jsonify({'error': 'Missing username or new password'}), 400

    user = users.find_one({'username': username})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    hashed_pw = generate_password_hash(new_password)
    users.update_one({'username': username}, {'$set': {'password': hashed_pw}})
    return jsonify({'message': 'Password reset successful'}), 200

@app.route('/api/upload-medal-image', methods=['POST'])
def upload_medal_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    username = request.form.get("username")
    achievement_id = request.form.get("achievementId")

    if not username or not achievement_id:
        return jsonify({"error": "Missing user or achievement ID"}), 400

    # Save to GridFS
    file_id = fs.put(file.stream, filename=f"{username}_{achievement_id}_manual.png", content_type="image/png")

    # Update user record in DB
    # Assuming you store user achievements in MongoDB
    db.users.update_one(
        {"username": username, "achievements.id": achievement_id},
        {"$set": {"achievements.$[elem].imageUrl": f"/api/image/{str(file_id)}"}},
        array_filters=[{"elem.id": achievement_id}]
    )


    return jsonify({"imageUrl": f"/api/image/{str(file_id)}"}), 200

@app.route("/api/image/<file_id>", methods=["GET"])
def get_image(file_id):
    try:
        file = fs.get(ObjectId(file_id))
        return send_file(BytesIO(file.read()), mimetype="image/png")
    except Exception:
        return jsonify({"error": "Image not found"}), 404
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
