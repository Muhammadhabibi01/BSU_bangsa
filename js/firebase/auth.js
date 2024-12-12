import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA7JJcu4nfmfGvuGHzlpJpXfUp4U_S5jow",
    authDomain: "pelitabangsa-b06b8.firebaseapp.com",
    projectId: "pelitabangsa-b06b8",
    storageBucket: "pelitabangsa-b06b8.firebasestorage.app",
    messagingSenderId: "379130653123",
    appId: "1:379130653123:web:f84c9adb9f92f2498d7576",
    measurementId: "G-9M5J5FTVPW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inisialisasi auth di luar fungsi

// Cek status autentikasi pengguna
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Jika user tidak login, arahkan ke halaman login
    window.location.href = "/template/pages/samples/login.html";
  } else {
    console.log(`Pengguna sudah login: ${user.email}`);
  }
});

