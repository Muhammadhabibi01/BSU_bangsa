// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8S0YVUbFpOZqjVTQzv2aYdmAbbcZRsGI",
  authDomain: "bsubangsa-14b0b.firebaseapp.com",
  projectId: "bsubangsa-14b0b",
  databaseURL: "https://bsubangsa-14b0b.firebaseio.com",
  storageBucket: "bsubangsa-14b0b.firebasestorage.app",
  messagingSenderId: "864902976477",
  appId: "1:864902976477:web:2310838c32c6797f5a9c34",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Event listener untuk tombol "Cari"
document.getElementById("cariNasabah").addEventListener("click", async () => {
  const kodeNasabah = document.getElementById("kodeNasabah").value.trim();

  // Validasi input kodeNasabah
  if (!kodeNasabah) {
    alert("Harap masukkan kode nasabah.");
    return;
  }

  try {
    // Buat query untuk mencari nasabah berdasarkan kodeNasabah
    const q = query(collection(db, "user"), where("kodeNasabah", "==", kodeNasabah));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Ambil data pertama dari hasil pencarian
      const doc = querySnapshot.docs[0];
      const data = doc.data();

      // Tampilkan nama nasabah di form
      document.getElementById("namaNasabah").value = data.namaNasabah || "Tidak ditemukan";
    } else {
      alert("Nasabah tidak ditemukan!");
      document.getElementById("namaNasabah").value = ""; // Reset input namaNasabah
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    alert("Terjadi kesalahan saat mencari data.");
  }
});
