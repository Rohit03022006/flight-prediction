# Flight Price Prediction

This project predicts flight ticket prices based on user input such as airline, source/destination city, departure/arrival time, stops, class, and date. It consists of a Python backend (Flask + scikit-learn) and a ReactJS frontend styled with Tailwind CSS.


![Flight Price Prediction Web Page](https://github.com/Rohit03022006/flight-prediction/blob/main/Flight%20Price%20Prediction%20Web%20page.PNG?raw=true)

![Flight Price Prediction](https://github.com/Rohit03022006/flight-prediction/blob/main/Flight%20Price%20Prediction.png?raw=true)

---
## Features

### Backend (`app.py`)
- Trained machine learning model ([model.pkl](model.pkl)) for flight price prediction.
- REST API built with Flask to serve predictions.
- Input validation and error handling.
- Easily retrain model with new data.

### Frontend ([flight-prediction/frontend/src/App.jsx](flight-prediction/frontend/src/App.jsx))
- Modern, responsive UI built with ReactJS and Tailwind CSS.
- Form for entering flight details:
  - Airline, source/destination city, departure/arrival time, stops, class, and date.
- Real-time validation and helpful error messages.
- Displays predicted price with breakdown and booking tips.
- Loading spinner and feedback for API calls.

---

## Tech Stack

- **Python**: Backend, model training
- **Flask**: REST API
- **scikit-learn**: Machine learning
- **ReactJS**: Frontend UI
- **Tailwind CSS**: Styling 
- **Vite**: Frontend tooling 

---

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn package manager
--- 
1. **Clone the repository**:
   ```sh
   git clone https://github.com/Rohit03022006/flight-prediction.git
   cd flight-prediction
   ```

2. **Create and activate virtual environment**:
   ```sh
   # On macOS/Linux
   python -m venv myenv
   source myenv/bin/activate
   
   # On Windows
   python -m venv myenv
   .\myenv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```sh
   pip install -r requirements.txt
   ```

4. **Run the Flask server**:
   ```sh
   python app.py
   ```
   The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```sh
   cd flight-prediction
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Start development server**:
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`
--- 
## Usage

1. Open the frontend in your browser (`localhost:5173` by default).
2. Fill out the flight details form.
3. Click "Predict Flight Price" to get an estimate.
4. View the predicted price, breakdown, and booking tips.

---
## Model Details

The machine learning model is a Random Forest Regressor trained on historical flight data with the following features:

- **Categorical Features**: Airline, source city, destination city, departure time, arrival time, stops, class
- **Temporal Features**: Day of week, month, season extracted from departure date
- **Target Variable**: Flight price (in INR)

**Model Performance**:
- R² Score: 0.92
- Mean Absolute Error: ₹842
- Root Mean Squared Error: ₹1,245

---

## Acknowledgements

- Inspired by various flight price prediction models and APIs.
- Thanks to contributors of the used libraries and frameworks.

---
