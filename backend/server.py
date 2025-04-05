import os
from pykeepass import PyKeePass, exceptions
import pyotp
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

kp = None


@app.route("/upload", methods=["POST"])
def upload():
    if request.method == "POST":
        if "db-file" not in request.files:
            return jsonify({"message": "No file provided!"}), 400

        file = request.files["db-file"]
        if file.filename == "":
            return jsonify({"message": "Empty file name!"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        password = request.form.get("db-password")

        global kp

        try:
            kp = PyKeePass(file_path, password)
        except FileNotFoundError:
            return jsonify({"error": "File not found!"}), 404
        except exceptions.CredentialsError:
            return jsonify({"error": "Wrong Password!"}), 401
        except exceptions.HeaderChecksumError:
            return jsonify({"error": "Not a KeePass database!"}), 415

        def get_otp(otp):
            if otp:
                return pyotp.parse_uri(otp).now()
            return None

        entries = [
            {
                "id": entry.uuid,
                "title": entry.title,
                "username": entry.username,
                "password": entry.password,
                "url": entry.url,
                "otp": get_otp(entry.otp),
            }
            for entry in kp.entries
        ]

        return jsonify({"message": "Entries sent!", "entries": entries}), 200
    else:
        return jsonify({"error": "Method Not Allowed!"}), 405


@app.route("/update", methods=["POST"])
def update():
    if request.method == "POST":
        global kp

        title = request.form.get("title")

        try:
            entry = kp.find_entries(title=title, first=True)
        except AttributeError:
            return jsonify({"error": "Submit the database again!"}), 410

        otp = pyotp.parse_uri(entry.otp).now()

        return jsonify({"message": f"OTP updated for: {title}", "otp": otp}), 200
    else:
        return jsonify({"error": "Method Not Allowes!"}), 405


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
