# Release Notes Manager

A web-based interface for managing and paraphrasing release notes from Confluence.

## Features
- Fetch release notes from Confluence
- Secure credential management
- Download original and paraphrased versions
- Modern, responsive UI

## Setup
1. Clone the repository:
```bash
git clone <your-repository-url>
```

2. Set up the Python backend:
- Navigate to the backend directory
- Install requirements: `pip install -r requirements.txt`
- Run the backend server: `python app.py`

3. Run the frontend:
- Open `index.html` in a web browser
- Or use a local development server:
  ```bash
  python -m http.server 8000
  ```
  Then visit `http://localhost:8000`

## Usage
1. Enter your Confluence credentials
2. Input the desired version number (e.g., "8.6")
3. Click "Fetch Release Notes" to retrieve content
4. Use the download buttons to get original or paraphrased versions

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- Python (Backend)
