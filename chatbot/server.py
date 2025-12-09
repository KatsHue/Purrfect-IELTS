from flask import Flask, request, jsonify
from flask_cors import CORS
from chat import get_response  

app = Flask(__name__)

CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get("message")

        if not message:
            return jsonify({"error": "No se recibió ningún mensaje"}), 400

        response = get_response(message)
        return jsonify({"answer": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
