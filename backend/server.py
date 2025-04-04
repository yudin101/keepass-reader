import os
from pykeepass import PyKeePass, exceptions
import pyotp
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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

        try:
            kp = PyKeePass(file_path, password)
        except FileNotFoundError:
            return jsonify({"message": "File not found!"}), 404
        except exceptions.CredentialsError:
            return jsonify({"message": "Wrong Password!"}), 401
        except exceptions.HeaderChecksumError:
            return jsonify({"message": "Not a KeePass database!"}), 415

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


if __name__ == "__main__":
    app.run()
