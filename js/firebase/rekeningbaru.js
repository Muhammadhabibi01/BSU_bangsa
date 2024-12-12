// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
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

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user);
  } else {
    console.log("User is not logged in");
    alert("Login ki dulu kak");
    window.location.href = "/login/index.html";
  }
});

// Handle form submission
const form = document.getElementById("nasabah");

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Ambil elemen dari form
  const kodeNasabah = document.getElementById("kodeNasabah").value.trim();
  const namaNasabah = document.getElementById("namaNasabah").value.trim();
  const Email = document.getElementById("Email").value.trim();
  const tanggalLahir = document.getElementById("tanggalLahir").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const jenisKelamin = document.querySelector('input[name="jenis"]:checked');
  const noTlp = document.getElementById("noTlp").value.trim();
  const role = document.querySelector('input[name="role"]:checked');

  // Validasi input
  const fields = [
    { value: kodeNasabah, message: "Kode Nasabah harus diisi!" },
    { value: namaNasabah, message: "Nama Nasabah harus diisi!" },
    { value: Email, message: "Email harus diisi!" },
    { value: tanggalLahir, message: "Tanggal Lahir harus diisi!" },
    { value: alamat, message: "Alamat harus diisi!" },
    { value: jenisKelamin, message: "Jenis Kelamin harus dipilih!" },
    { value: noTlp, message: "Nomor Telepon harus diisi!" },
    { value: role, message: "Role harus dipilih!" },
  ];

  for (let field of fields) {
    if (!field.value) {
      alert(field.message);
      return;
    }
  }

  // Simpan data ke Firestore
  try {
    // Tambahkan ke koleksi "users"
    const userRef = await addDoc(collection(db, "users"), {
      kodeNasabah: kodeNasabah,
      namaNasabah: namaNasabah,
      Email: Email,
      tanggalLahir: tanggalLahir,
      alamat: alamat,
      jenisKelamin: jenisKelamin.value,
      noTlp: noTlp,
      role: role.value,
    });

    console.log("Document written with ID (users): ", userRef.id);

    // Tambahkan ke koleksi "rekeningNasabah"
    const rekeningRef = await addDoc(collection(db, "rekeningNasabah"), {
      kodeNasabah: kodeNasabah,
      namaNasabah: namaNasabah,
      saldoNasabah: "", // Kosongkan jika data baru
      sisaSaldo: "", // Kosongkan jika data baru
    });

    console.log("Document written with ID (rekeningNasabah): ", rekeningRef.id);

    alert("Data berhasil disimpan di kedua koleksi!");

    // Reset form setelah berhasil menyimpan data
    form.reset();
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Gagal menyimpan data!");
  }
});
