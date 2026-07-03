const STORAGE_KEY = "dataLayananMahasiswa";

// Ambil semua data dari localStorage
function getData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Simpan array data ke localStorage
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ============ HALAMAN FORM (index.html) ============
const formInput = document.getElementById("formInput");

if (formInput) {
  formInput.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();
    const jenisLayanan = document.getElementById("jenisLayanan").value;
    const keterangan = document.getElementById("keterangan").value.trim();

    if (!nama || !nim || !jenisLayanan) {
      tampilkanStatus("Mohon lengkapi semua field wajib.", false);
      return;
    }

    const dataBaru = {
      id: Date.now(),
      nama,
      nim,
      jenisLayanan,
      keterangan: keterangan || "-"
    };

    const semuaData = getData();
    semuaData.push(dataBaru);
    saveData(semuaData);

    tampilkanStatus("Data berhasil disimpan!", true);
    formInput.reset();
  });
}

function tampilkanStatus(pesan, sukses) {
  const statusMsg = document.getElementById("statusMsg");
  if (!statusMsg) return;
  statusMsg.textContent = pesan;
  statusMsg.style.color = sukses ? "#27ae60" : "#e74c3c";

  setTimeout(() => {
    statusMsg.textContent = "";
  }, 3000);
}

// ============ HALAMAN TABEL (data.html) ============
const tabelBody = document.getElementById("tabelBody");

if (tabelBody) {
  renderTabel();

  const btnHapusSemua = document.getElementById("btnHapusSemua");
  btnHapusSemua.addEventListener("click", function () {
    if (confirm("Yakin ingin menghapus semua data?")) {
      saveData([]);
      renderTabel();
    }
  });
}

function renderTabel() {
  const semuaData = getData();
  const emptyMsg = document.getElementById("emptyMsg");
  tabelBody.innerHTML = "";

  if (semuaData.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  semuaData.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(item.nama)}</td>
      <td>${escapeHtml(item.nim)}</td>
      <td>${escapeHtml(item.jenisLayanan)}</td>
      <td>${escapeHtml(item.keterangan)}</td>
      <td><button class="btn-hapus-row" data-id="${item.id}">Hapus</button></td>
    `;
    tabelBody.appendChild(tr);
  });

  // Pasang event listener untuk tombol hapus per baris
  document.querySelectorAll(".btn-hapus-row").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number(this.getAttribute("data-id"));
      hapusData(id);
    });
  });
}

function hapusData(id) {
  let semuaData = getData();
  semuaData = semuaData.filter((item) => item.id !== id);
  saveData(semuaData);
  renderTabel();
}

// Mencegah XSS sederhana saat menampilkan data ke tabel
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
