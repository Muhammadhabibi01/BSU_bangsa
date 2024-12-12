const beratSampahInput = document.getElementById("beratSampah");
const output = document.getElementById("output");

beratSampahInput.addEventListener("input", function () {
  const inputValue = beratSampahInput.value;

  if (!isNaN(inputValue) && inputValue !== "") {
    output.textContent = `**dalam satuan kg`;
  } else {
    output.textContent = "";
  }
});

// PERHITUNGAN TOTAL
document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".form-check-input");
    const beratSampahInput = document.getElementById("beratSampah");
    const totalInput = document.getElementById("total");
  
    function calculateTotal() {
        const beratSampah = parseFloat(beratSampahInput.value) || 0;
        let total = 0;
      
        // Hitung total berdasarkan checkbox yang dicentang
        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            const hargaPerKg = parseFloat(checkbox.value);
            total += hargaPerKg * beratSampah;
          }
        });
      
        // Masukkan hasil ke input total tanpa format mata uang
        totalInput.value = total; // Hanya angka
      }      
  
    // Event listener untuk setiap checkbox
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", calculateTotal);
    });
  
    // Event listener untuk input berat sampah
    beratSampahInput.addEventListener("input", calculateTotal);
  });
  