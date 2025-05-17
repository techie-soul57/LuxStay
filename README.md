# LuxStay Hotel Management App

This project is a full-stack hotel management application with a Flask backend and a React frontend.

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

## Project Structure
```
Backend/      # Flask backend (API, database)
frontend/     # React frontend (UI)
```

---

## Backend Setup (Flask)

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```
3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
5. **Run the Flask app:**
   ```bash
   python app.py
   ```
   The backend will start on [http://localhost:5000](http://localhost:5000)


---

## Frontend Setup (React)

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn
   ```
3. **Start the React app:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will start on [http://localhost:5173](http://localhost:5173)

---

## Usage
- Register or log in as a user.
- Browse rooms, make reservations, and manage your profile.
- Admin users can manage rooms and view all reservations.

---

## Notes
- Room and user images are stored in `frontend/public/assets/`.
- Environment variables can be set in `.env` files in each project.
- The backend uses SQLite by default (see `Backend/app.py`).

