import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9ZpKaUFww8r0ONr9OIS9IMkjJ42rDZK0",
  authDomain: "cinepulse-movie.firebaseapp.com",
  projectId: "cinepulse-movie",
  storageBucket: "cinepulse-movie.firebasestorage.app",
  messagingSenderId: "196333712920",
  appId: "1:196333712920:web:bde7099acc5c3790e2356d",
  measurementId: "G-PZM0N1K9WH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
