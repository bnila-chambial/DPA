from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from docx import Document
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

CONFLUENCE_URL = "https://wiki.landisgyr.net"
SPACE_KEY = "US"
WORD_DOC_PATH = "Test Template.docx"
OUTPUT_DOC_PATH = "Updated Template.docx"
PARAPHRASED_DOC_PATH = "Paraphrased Template.docx"

def get_confluence_content(username, password, version):
    PAGE_TITLE = f"TS {version} Release Notes"
    
    # Search for the page to get its ID
    search_url = f"{CONFLUENCE_URL}/rest/api/content"
    params = {'title': PAGE_TITLE, 'spaceKey': SPACE_KEY}
    
    try:
        response = requests.get(search_url, params=params, auth=(username, password))
        response.raise_for_status()
        data = response.json()

        if not data['results']:
            return {"error": "Page not found"}

        page_id = data['results'][0]['id']

        # Fetch the page content
        page_url = f"{CONFLUENCE_URL}/rest/api/content/{page_id}?expand=body.storage"
        response = requests.get(page_url, auth=(username, password))
        response.raise_for_status()
        page_data = response.json()
        
        return {"content": page_data['body']['storage']['value']}
    
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

@app.route('/fetch-release-notes', methods=['POST'])
def fetch_release_notes():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    version = data.get('version')

    if not all([username, password, version]):
        return jsonify({"error": "Missing required fields"}), 400

    result = get_confluence_content(username, password, version)
    
    if "error" in result:
        return jsonify(result), 404
    
    return jsonify(result)

@app.route('/download-original', methods=['GET'])
def download_original():
    try:
        return send_file(OUTPUT_DOC_PATH, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@app.route('/download-paraphrased', methods=['GET'])
def download_paraphrased():
    try:
        return send_file(PARAPHRASED_DOC_PATH, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
