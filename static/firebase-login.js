import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCshphcyfrOnutpKfBdsFfMgnGwtPO29SM",
    authDomain: "logintest-84c5d.firebaseapp.com",
    projectId: "logintest-84c5d",
    storageBucket: "logintest-84c5d.firebasestorage.app",
    messagingSenderId: "651006093167",
    appId: "1:651006093167:web:3a1bf962be99e496e66a9a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Add this line to initialize auth

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in:", user);
            window.location.href = 'welcome.html';
        })
        .catch((error) => {
            let errorMessage = error.message;
            // More user-friendly error messages
            switch(error.code) {
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Incorrect password";
                    break;
            }
            alert(`Login failed: ${errorMessage}`);
        });
});