// DOM Elements
const credentialsForm = document.getElementById('credentialsForm');
const releaseNotesContent = document.getElementById('releaseNotesContent');
const loading = document.getElementById('loading');
const contentArea = document.getElementById('contentArea');
const versionInput = document.getElementById('versionInput');
const fetchButton = document.getElementById('fetchButton');
const downloadOriginal = document.getElementById('downloadOriginal');
const downloadParaphrased = document.getElementById('downloadParaphrased');

// Global variables to store credentials
let username = '';
let password = '';

// Event Listeners
document.getElementById('submitCredentials').addEventListener('click', handleCredentialsSubmit);
fetchButton.addEventListener('click', fetchReleaseNotes);
downloadOriginal.addEventListener('click', () => downloadDocument('original'));
downloadParaphrased.addEventListener('click', () => downloadDocument('paraphrased'));

// Handle credentials submission
function handleCredentialsSubmit() {
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;

    if (username && password) {
        credentialsForm.style.display = 'none';
        releaseNotesContent.style.display = 'block';
    } else {
        alert('Please enter both username and password');
    }
}

// Fetch release notes from the backend
async function fetchReleaseNotes() {
    const version = versionInput.value;
    if (!version) {
        alert('Please enter a version number');
        return;
    }

    loading.style.display = 'flex';
    contentArea.innerHTML = '';

    try {
        const response = await fetch('http://localhost:5000/fetch-release-notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                version
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch release notes');
        }

        const data = await response.json();
        contentArea.textContent = data.content;
    } catch (error) {
        contentArea.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    } finally {
        loading.style.display = 'none';
    }
}

// Download documents
async function downloadDocument(type) {
    try {
        const response = await fetch(`http://localhost:5000/download-${type}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Failed to download ${type} document`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type === 'original' ? 'Original' : 'Paraphrased'} Release Notes.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        alert(`Error downloading ${type} document: ${error.message}`);
    }
}

// Initialize the UI
function init() {
    releaseNotesContent.style.display = 'none';
}
