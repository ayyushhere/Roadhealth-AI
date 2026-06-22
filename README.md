# RoadHealth AI 🛣️🤖

An enterprise-grade Smart City platform that utilizes **Computer Vision (YOLOv8)** to autonomously detect, classify, and visualize road infrastructure damage (potholes, cracks, etc.) from uploaded images.

Built with a robust microservice architecture and a stunning modern "Bento Box" user interface.

## 🌟 Key Features

*   **Autonomous Damage Detection:** Uses a custom-trained YOLOv8 machine learning model to identify road hazards with high confidence.
*   **Visual Bounding Boxes:** The AI generates pixel-perfect, normalized bounding box coordinates that are dynamically rendered in the frontend to physically highlight the damage.
*   **Enterprise Bento Box UI:** A deeply modern, responsive, and dark-themed UI featuring glassmorphic touches, toast notifications, and dynamic grid layouts.
*   **Microservice Architecture:** Clean separation of concerns between the React frontend, Laravel API, and Python inference engine.

## 🏗️ Architecture Stack

1.  **Frontend (UI/UX):** React.js + Vite + Tailwind CSS (`lucide-react`, `react-hot-toast`).
2.  **Backend (API & Database):** Laravel 11 + MySQL (Handles auth, image storage, and data persistence).
3.  **ML Service (Inference):** Python + Flask + Ultralytics YOLOv8.

## 🚀 How It Works

1.  A user uploads an image via the React frontend.
2.  The Laravel backend securely stores the image and forwards it to the Python ML Service via an internal API.
3.  YOLOv8 processes the image, extracts normalized bounding box coordinates, identifies the damage type, and returns the data.
4.  Laravel logs the detection in the database.
5.  React dynamically renders the image and overlays a glowing bounding box over the exact pixels where the damage exists.

## 💻 Local Development Setup

### 1. ML Service (Python)
```bash
cd ml-service
python -m venv venv
source venv/Scripts/activate # or venv/bin/activate on Mac/Linux
pip install -r requirements.txt
python app.py
```

### 2. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 4.Service activation timer
-- Whether the ai-service is running or not.
