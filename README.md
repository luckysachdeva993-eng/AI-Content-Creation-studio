# AI Content Creation Studio

A Generative AI-based web application that helps users create professional digital content using AI.

## 📌 About the Project

AI Content Creation Studio is a web application developed using Node.js and the Gemini API.

The project provides a simple interface where users can select a content type, describe their idea, and generate AI-powered content or professional prompts.

The project was developed as part of my BCA academic/internship project and is designed to demonstrate the practical use of Generative AI, prompt engineering, and Node.js backend development.

## ✨ Features

- 📝 AI Text Content Generation
- 🖼️ AI Image Prompt Generation
- 🎨 AI Poster Prompt Generation
- 🎬 AI Video Prompt Generation
- 🎵 AI Song/Music Prompt Generation
- 📋 Copy Generated Results
- 🕘 Generation History
- 🗑️ Clear Generation History
- 🤖 Google Gemini API Integration
- 🔐 Environment variable support for API key protection
- 📱 Responsive and user-friendly interface

## 🛠️ Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Node.js HTTP module
- File System (`fs`) module
- Path (`path`) module
- Google Gemini API
- JSON

## 📂 Project Structure

```text
AI-Content-Creation-Studio/
│
├── server.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── modules/
│   ├── contentGenerator.js
│   └── promptGenerator.js
│
├── data/
│   └── history.json
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## ⚙️ How It Works

The application follows this basic workflow:

```text
User selects content type
        ↓
User enters an idea
        ↓
Node.js receives the request
        ↓
Prompt is generated
        ↓
Prompt is sent to Gemini API
        ↓
Gemini generates the result
        ↓
Result is displayed to the user
        ↓
Generation is saved in history
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/AI-Content-Creation-Studio.git
```

### 2. Open the project folder

```bash
cd AI-Content-Creation-Studio
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

Create a file named:

```text
.env
```

Add your own Gemini API key:

```text
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

**Never upload your `.env` file or API key to GitHub.**

### 5. Start the server

```bash
node --env-file=.env server.js
```

### 6. Open the application

Open your browser and visit:

```text
http://localhost:5000
```

## 🔑 API Key

This project uses the Google Gemini API.

Each user should create and use their own Gemini API key.

The API key should be stored in the `.env` file and should never be committed to the repository.

## 📚 Learning Objectives

This project demonstrates practical understanding of:

- Generative AI
- Prompt Engineering
- Node.js
- HTTP servers
- REST-style API endpoints
- JavaScript
- File handling
- JSON data storage
- API integration
- Frontend and backend communication
- Environment variables
- Basic error handling

## 🎓 Academic Project

This project was developed as a BCA academic/internship project to demonstrate the practical application of Generative AI and Node.js.

## 📄 License

This project is licensed under the MIT License.

You are free to use, modify, and distribute the code according to the terms of the MIT License.

## 👨‍💻 Author

**Lucky Sachdeva**

BCA – 5th Semester

Kurukshetra University
