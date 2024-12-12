// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8S0YVUbFpOZqjVTQzv2aYdmAbbcZRsGI",
  authDomain: "bsubangsa-14b0b.firebaseapp.com",
  projectId: "bsubangsa-14b0b",
  storageBucket: "bsubangsa-14b0b.firebasestorage.app",
  messagingSenderId: "864902976477",
  appId: "1:864902976477:web:2310838c32c6797f5a9c34",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fungsi untuk menampilkan pesan pada elemen HTML
function showMessage(message, elementId) {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.innerText = message;
    messageElement.style.display = "block";
  } else {
    alert(message);
  }
}

// Fungsi untuk login menggunakan Firebase Authentication
async function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const signInMessage = document.getElementById("signInMessage");

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Email dan password wajib diisi.", "signInMessage");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login berhasil:", userCredential.user);
    showMessage("Login berhasil!", "signInMessage");

    setTimeout(() => {
      window.location.href = "/template/index.html";
    }, 2000);
  } catch (error) {
    console.error("Login gagal:", error.message);
    showMessage("Gagal login. Periksa email dan password Anda.", "signInMessage");
  }
}

// Tambahkan event listener pada tombol submit
document.getElementById("submit").addEventListener("click", handleLogin);

// Fungsi untuk logout
const logoutBtn = document.getElementById("keluar");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // Mencegah perilaku default anchor
    try {
      await signOut(auth);
      console.log("Logout berhasil");
      window.location.href = "/template/pages/samples/login.html";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  });
} else {
  console.error("Tombol logout tidak ditemukan di DOM.");
}

// Fungsi untuk memastikan user hanya dapat mengakses halaman jika login
function enforceLogin() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("Pengguna belum login, mengarahkan ke login.html");
      window.location.href = "/template/pages/samples/login.html";
    } else {
      console.log("Pengguna sedang login:", user.email);
    }
  });
}

// Proteksi akses halaman kecuali login.html
if (window.location.pathname !== "/template/pages/samples/login.html") {
  enforceLogin();
}

// Fungsi untuk mengecek status login (opsional)
function checkLoginStatus() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Pengguna sedang login:", user.email);
    } else {
      console.log("Tidak ada pengguna yang login.");
    }
  });
}

// Panggil fungsi untuk mengecek status login (opsional jika sudah ada enforceLogin)
checkLoginStatus();
