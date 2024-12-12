// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// Ambil elemen HTML
const form = document.getElementById("tunai");
const buttonCari = document.getElementById("buttonCari");
const kodeNasabahInput = document.getElementById("kodeNasabah");
const namaNasabahInput = document.getElementById("namaNasabah");
const saldoNasabahInput = document.getElementById("saldoNasabah");
const tarikDanaInput = document.getElementById("tarikDana");
const sisaSaldoInput = document.getElementById("sisaSaldo");

// Fungsi untuk mencari data nasabah berdasarkan kodeNasabah
buttonCari.addEventListener("click", async () => {
  const kodeNasabah = kodeNasabahInput.value;

  if (!kodeNasabah) {
    alert("Silakan masukkan kode nasabah.");
    return;
  }

  // Query ke koleksi rekeningNasabah
  const rekeningNasabahRef = collection(db, "rekeningNasabah");
  const q = query(rekeningNasabahRef, where("kodeNasabah", "==", kodeNasabah));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("Data nasabah tidak ditemukan.");
    namaNasabahInput.value = "";
    saldoNasabahInput.value = "";
    return;
  }

  // Ambil data dari query
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    namaNasabahInput.value = data.namaNasabah;
    saldoNasabahInput.value = data.saldoNasabah;
  });
});

// Perhitungan sisa saldo berdasarkan tarik dana
tarikDanaInput.addEventListener("input", () => {
  const saldoNasabah = parseFloat(saldoNasabahInput.value) || 0;
  const tarikDana = parseFloat(tarikDanaInput.value) || 0;

  if (tarikDana > saldoNasabah) {
    alert("Jumlah penarikan melebihi saldo nasabah.");
    tarikDanaInput.value = saldoNasabah;
    sisaSaldoInput.value = 0;
  } else {
    sisaSaldoInput.value = saldoNasabah - tarikDana;
  }
});

// Simpan data ke Firebase
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const kodeNasabah = kodeNasabahInput.value;
  const namaNasabah = namaNasabahInput.value;
  const tanggal = document.getElementById("tanggal").value;
  const tarikDana = parseFloat(tarikDanaInput.value) || 0;
  const sisaSaldo = parseFloat(sisaSaldoInput.value) || 0;

  if (!kodeNasabah || !namaNasabah || !tanggal || !tarikDana) {
    alert("Silakan lengkapi semua form sebelum submit.");
    return;
  }

  // Query ke koleksi rekeningNasabah untuk menemukan dokumen
  const rekeningNasabahRef = collection(db, "rekeningNasabah");
  const q = query(rekeningNasabahRef, where("kodeNasabah", "==", kodeNasabah));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("Data nasabah tidak ditemukan.");
    return;
  }

  let docId = "";
  querySnapshot.forEach((doc) => {
    docId = doc.id;
  });

  // Update data di Firebase untuk saldoNasabah
  const docRef = doc(db, "rekeningNasabah", docId);
  await updateDoc(docRef, {
    saldoNasabah: sisaSaldo, // Update saldoNasabah
    sisaSaldo: sisaSaldo,   // Update sisaSaldo
  });

  // Simpan data penarikan ke koleksi riwayatPenarikan
  const riwayatPenarikanRef = collection(db, "riwayatPenarikan");
  await addDoc(riwayatPenarikanRef, {
    kodeNasabah: kodeNasabah,
    namaNasabah: namaNasabah,
    tanggal: tanggal,
    tarikDana: tarikDana,
    sisaSaldo: sisaSaldo,
  });

  alert("Data berhasil disimpan dan transaksi tercatat!");
  form.reset();
});
