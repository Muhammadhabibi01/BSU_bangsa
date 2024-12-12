// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// HTML elements
const searchKodeNasabah = document.getElementById("searchKodeNasabah");
const dataTable = document.getElementById("dataTable");

// Handle search on Enter key press
searchKodeNasabah.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission or page reload
    const kodeNasabah = searchKodeNasabah.value.trim();

    if (!kodeNasabah) {
      alert("Masukkan kode nasabah untuk mencari data!");
      return;
    }

    // Clear the table
    dataTable.innerHTML = "";

    try {
      // Query Firestore collection `riwayatPenarikan`
      const riwayatPenarikanRef = collection(db, "riwayatPenarikan");
      const q = query(riwayatPenarikanRef, where("kodeNasabah", "==", kodeNasabah));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Data tidak ditemukan untuk kode nasabah tersebut.");
        return;
      }

      // Populate the table with data
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = `
          <tr>
            <td>${data.kodeNasabah}</td>
            <td>${data.namaNasabah}</td>
            <td>${data.tanggal}</td>
            <td>${data.tarikDana}</td>
            <td>${data.sisaSaldo}</td>
          </tr>
        `;
        dataTable.innerHTML += row;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Terjadi kesalahan saat mengambil data.");
    }
  }
});
