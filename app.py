from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows all origins to access your API. For production, consider specifying specific origins.

@app.route('/')
def hello_world():
    return jsonify(message="Hello from Flask!1")

@app.route('/api')
def get_data():
    return jsonify(message="Hello from Flask!2")

@app.route('/hello')
def get_data2():
    return jsonify(message="Hello from Flask!3")
if __name__ == '__main__':
    app.run(debug=True)
