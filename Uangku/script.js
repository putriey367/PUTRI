// Mengambil elemen dari HTML
const formSaldo = document.getElementById("formSaldo");
const formTransaksi = document.getElementById("formTransaksi");

const daftarTransaksi = document.getElementById("daftarTransaksi");
const pilihBulan = document.getElementById("pilihBulan");

// Menyimpan saldo dan transaksi
let saldoAwal = 0;
let transaksi = [];

// Mengambil bulan saat ini
let sekarang = new Date();
pilihBulan.value =
    sekarang.getFullYear() + "-" +
    String(sekarang.getMonth() + 1).padStart(2, "0");

// Mengubah angka menjadi Rupiah
function rupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// Menghitung dan menampilkan saldo
function hitungSaldo() {
    let uangMasuk = 0;
    let uangKeluar = 0;

    transaksi.forEach(function(data) {
        if (data.jenis === "masuk") {
            uangMasuk += data.nominal;
        } else {
            uangKeluar += data.nominal;
        }
    });

    let saldo = saldoAwal + uangMasuk - uangKeluar;

    document.getElementById("totalMasuk").textContent =
        rupiah(uangMasuk);

    document.getElementById("totalKeluar").textContent =
        rupiah(uangKeluar);

    document.getElementById("saldoSekarang").textContent =
        rupiah(saldo);
}

// Menampilkan riwayat transaksi
function tampilkanTransaksi() {
    daftarTransaksi.innerHTML = "";

    let bulanDipilih = pilihBulan.value;

    let dataBulan = transaksi
        .map(function(data, index) {
            return { ...data, index: index };
        })
        .filter(function(data) {
            return data.tanggal.startsWith(bulanDipilih);
        });

    if (dataBulan.length === 0) {
        daftarTransaksi.innerHTML =
            '<tr><td colspan="5">Belum ada transaksi bulan ini</td></tr>';
    }

    dataBulan.forEach(function(data) {
        let baris = document.createElement("tr");

        let tanggal = document.createElement("td");
        tanggal.textContent = data.tanggal;

        let keterangan = document.createElement("td");
        keterangan.textContent = data.keterangan;

        let jenis = document.createElement("td");
        jenis.textContent =
            data.jenis === "masuk" ? "Pemasukan" : "Pengeluaran";

        let nominal = document.createElement("td");
        nominal.textContent =
            (data.jenis === "masuk" ? "+ " : "- ") +
            rupiah(data.nominal);

        let aksi = document.createElement("td");
        let tombol = document.createElement("button");

        tombol.textContent = "Hapus";
        tombol.className = "hapus";

        tombol.addEventListener("click", function() {
            transaksi.splice(data.index, 1);
            tampilkanTransaksi();
            hitungSaldo();
        });

        aksi.appendChild(tombol);

        baris.appendChild(tanggal);
        baris.appendChild(keterangan);
        baris.appendChild(jenis);
        baris.appendChild(nominal);
        baris.appendChild(aksi);

        daftarTransaksi.appendChild(baris);
    });
}

// Menyimpan saldo awal
formSaldo.addEventListener("submit", function(event) {
    event.preventDefault();

    saldoAwal = Number(
        document.getElementById("saldoAwal").value
    );

    hitungSaldo();
    formSaldo.reset();

    alert("Saldo awal berhasil disimpan!");
});

// Menambahkan transaksi
formTransaksi.addEventListener("submit", function(event) {
    event.preventDefault();

    let tanggal = document.getElementById("tanggal").value;
    let jenis = document.getElementById("jenis").value;
    let keterangan = document.getElementById("keterangan").value;
    let nominal = Number(document.getElementById("nominal").value);

    if (jenis === "keluar") {
        let saldoSekarang = saldoAwal;

        transaksi.forEach(function(data) {
            if (data.jenis === "masuk") {
                saldoSekarang += data.nominal;
            } else {
                saldoSekarang -= data.nominal;
            }
        });

        if (nominal > saldoSekarang) {
            alert("Saldo tidak mencukupi!");
            return;
        }
    }

    let dataBaru = {
        tanggal: tanggal,
        jenis: jenis,
        keterangan: keterangan,
        nominal: nominal
    };

    transaksi.push(dataBaru);

    tampilkanTransaksi();
    hitungSaldo();

    formTransaksi.reset();
});

// Mengganti riwayat saat bulan dipilih
pilihBulan.addEventListener("change", function() {
    tampilkanTransaksi();
});

// Tampilan awal
tampilkanTransaksi();
hitungSaldo();