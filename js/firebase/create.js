// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
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
    // window.location.href = "/login/index.html";
  }
});

// Ambil elemen input dan form
const kodeNasabahInput = document.getElementById("kodeNasabah");
const namaNasabahInput = document.getElementById("namaNasabah");
const form = document.getElementById("nasabah");

// Fungsi untuk mencari data nasabah di koleksi `users`
kodeNasabahInput.addEventListener("blur", async () => {
  const kodeNasabah = kodeNasabahInput.value;

  if (!kodeNasabah) {
    alert("Kode nasabah harus diisi.");
    namaNasabahInput.value = "";
    return;
  }

  // Query ke koleksi users berdasarkan kodeNasabah
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("kodeNasabah", "==", kodeNasabah));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("Kode nasabah tidak ditemukan.");
    namaNasabahInput.value = "";
    return;
  }

  // Tampilkan namaNasabah yang ditemukan
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    namaNasabahInput.value = data.namaNasabah;
  });
});

// Form submission logic
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const kodeNasabah = kodeNasabahInput.value;
  const namaNasabah = namaNasabahInput.value;
  const tanggal = document.getElementById("tanggal").value;
  const beratSampah = parseFloat(document.getElementById("beratSampah").value) || 0;

  const selectedCheckboxes = document.querySelectorAll('input[name="jenis"]:checked');
  if (selectedCheckboxes.length === 0) {
    alert("Jenis Sampah harus dipilih!");
    return;
  }

  let total = 0;
  const jenisSampah = [];

  selectedCheckboxes.forEach((checkbox) => {
    const hargaPerKg = parseFloat(checkbox.value);
    const namaJenis = checkbox.getAttribute("data-name");
    total += hargaPerKg * beratSampah;
    jenisSampah.push({ nama: namaJenis, harga: hargaPerKg });
  });

  console.log({ kodeNasabah, namaNasabah, tanggal, jenisSampah, beratSampah, total });

  try {
    // Tambahkan data baru ke koleksi dataSampah
    const docRef = await addDoc(collection(db, "dataSampah"), {
      kodeNasabah,
      namaNasabah,
      tanggal,
      jenisSampah,
      beratSampah,
      total,
    });

    console.log("Document written with ID: ", docRef.id);

    // Ambil data rekeningNasabah berdasarkan kodeNasabah
    const rekeningQuery = query(collection(db, "rekeningNasabah"), where("kodeNasabah", "==", kodeNasabah));
    const querySnapshot = await getDocs(rekeningQuery);

    if (!querySnapshot.empty) {
      // Perbarui saldoNasabah dan sisaSaldo
      const rekeningDoc = querySnapshot.docs[0]; // Ambil dokumen pertama (diasumsikan unik)
      const dataRekening = rekeningDoc.data();
      const saldoNasabahBaru = (dataRekening.saldoNasabah || 0) + total;

      // Perbarui dokumen rekeningNasabah
      await updateDoc(rekeningDoc.ref, {
        saldoNasabah: saldoNasabahBaru,
      });

      console.log("Saldo berhasil diperbarui:", { saldoNasabahBaru });
      alert("Data dan saldo berhasil diperbarui!");
    } else {
      console.warn("RekeningNasabah tidak ditemukan untuk kodeNasabah:", kodeNasabah);
      alert("Kode Nasabah tidak ditemukan di rekeningNasabah!");
    }

    // Reset form
    form.reset();
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Gagal menyimpan data!");
  }
});
