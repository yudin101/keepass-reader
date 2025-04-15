import os
from pykeepass import PyKeePass, exceptions
import pyotp
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

kp = None
old_entry_details = None
entry = None


@app.route("/upload", methods=["POST"])
def upload():
    if request.method == "POST":
        global kp

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


@app.route("/updateOtp", methods=["POST"])
def updateOtp():
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
        return jsonify({"error": "Method Not Allowed!"}), 405


@app.route("/edit", methods=["POST"])
def edit():
    if request.method == "POST":
        global kp
        global entry
        global old_entry_details

        title = request.form.get("title")

        try:
            entry = kp.find_entries(title=title, first=True)

            old_entry_details = {
                "title": entry.title,
                "group": entry.group.name,
                "username": entry.username,
                "password": entry.password,
                "url": entry.url,
                "otp": entry.otp,
            }

        except AttributeError:
            return jsonify({"error": "Submit the database again!"}), 410

        return jsonify(old_entry_details), 200
    else:
        return jsonify({"error": "Method Not Allowed!"}), 405


@app.route("/updateEntry", methods=["POST"])
def updateEntry():
    if request.method == "POST":
        global kp
        global entry
        global old_entry_details

        received_title = request.form.get("title")
        received_group = request.form.get("group")
        received_username = request.form.get("username")
        received_password = request.form.get("password")
        received_url = request.form.get("url")
        received_otp = request.form.get("otp")

        new_entry = {
            "title": received_title or old_entry_details["title"],
            "group": received_group or old_entry_details["group"],
            "username": received_username or old_entry_details["username"],
            "password": received_password or old_entry_details["password"],
            "url": received_url or old_entry_details["url"],
            "otp": received_otp or old_entry_details["otp"],
        }

        kp.delete_entry(entry)
        group = kp.find_groups(name=new_entry["group"], first=True)

        if group:
            kp.add_entry(
                group,
                new_entry["title"],
                new_entry["username"],
                new_entry["password"],
                url=new_entry["url"],
                notes=None,
                expiry_time=None,
                tags=None,
                otp=new_entry["otp"],
                icon=None,
                force_creation=False,
            )
        else:
            return jsonify({"error": "Group not found!"}), 404

        kp.save()

        return jsonify(new_entry), 200
    else:
        return jsonify({"error": "Method Not Allowed!"}), 405


@app.route("/download/<file>", methods=["GET"])
def download(file):
    file_path = os.path.join(UPLOAD_FOLDER, file)

    return send_file(file_path, as_attachment=True)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
