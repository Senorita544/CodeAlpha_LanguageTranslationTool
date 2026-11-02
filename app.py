
from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Translation functionality
@app.route("/translate", methods=["POST"])
def translate():

    try:
        data = request.get_json(silent=True) or {}

        text = data.get("text", "").strip()
        source_lang = data.get("source_lang", "")
        target_lang = data.get("target_lang", "")

        if not text:
            return jsonify({"error": "Please enter some text."}), 400

        if not source_lang or not target_lang:
            return jsonify({"error": "Please select both languages."}), 400

        if source_lang == target_lang:
            return jsonify({"error": "Select two different languages."}), 400

        if len(text) > 5000:
            return jsonify({"error": "Maximum 5000 characters allowed."}), 400

        api_url = "https://api.mymemory.translated.net/get"

        params = {
            "q": text,
            "langpair": f"{source_lang}|{target_lang}"
        }

        response = requests.get(api_url, params=params, timeout=20)
        response.raise_for_status()

        result = response.json()

        if result.get("responseStatus") != 200:
            return jsonify({
                "error": result.get("responseDetails", "Translation failed.")
            }), 502

        translated_text = result["responseData"]["translatedText"]

        return jsonify({
            "translated_text": translated_text
        })

    except requests.exceptions.RequestException:
        return jsonify({
            "error": "Translation service is unavailable. Try again."
        }), 502

    except (KeyError, TypeError, ValueError):
        return jsonify({
            "error": "Invalid response from translation service."
        }), 502


if __name__ == "__main__":
    app.run(debug=True)
