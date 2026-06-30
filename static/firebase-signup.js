import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js"

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCshphcyfrOnutpKfBdsFfMgnGwtPO29SM",
    authDomain: "logintest-84c5d.firebaseapp.com",
    projectId: "logintest-84c5d",
    storageBucket: "logintest-84c5d.firebasestorage.app",
    messagingSenderId: "651006093167",
    appId: "1:651006093167:web:3a1bf962be99e496e66a9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Registration handler
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeatPassword').value;

    if (password !== repeatPassword) {
        alert("Passwords don't match!");
        return;
    }

    const auth = getAuth(app);
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Add user to Firestore
            return setDoc(doc(db, "users", user.uid), {
                email: email,
                createdAt: new Date()
            });
        })
        .then(() => {
            alert("Registration successful!");
            window.location.href = 'login.html';
        })
        .catch((error) => {
            let errorMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered";
            }
            alert(`Registration failed: ${errorMessage}`);
        });
});