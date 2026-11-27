export const siteConfig = {
  name: "Kopi Lima",
  // TODO: Ganti alamat kedai setelah pemilik konfirmasi.
  address: "Alamat kedai belum diisi",
  // TODO: Ganti jam buka setelah pemilik konfirmasi.
  hours: "Jam buka belum diisi",
  // TODO: Ganti dengan nomor WhatsApp aktif, format internasional tanpa tanda +.
  whatsapp: "",
  // TODO: Ganti dengan URL Google Maps tempat kedai.
  mapsUrl: "",
  loyalty: {
    stampTarget: 5,
    // Bisa diubah: jeda minimum satu stempel untuk satu pelanggan.
    stampCooldownMinutes: 10,
  },
  // Tentang kedai
  about: {
    tagline: "Kopi to go di depan kampus.",
    story: [
      "Kopi Lima lahir dari kegemaran kopi dan keinginan membuat tempat nongkrong yang nyaman buat mahasiswa.",
      "Kami pilih biji kopi lokal, sangrai dengan hati, dan sajikan dengan harga yang tetap waras buat kantong pelajar.",
      "Setiap kopi yang kamu beli membantu kami tetap bisa buka dan nongkrong bareng kamu.",
    ],
  },
  // Seni bulan ini
  artOfTheMonth: {
    title: "Seni Bulan Ini",
    subtitle: "Karya lokal di dinding Kopi Lima",
    artist: "Nama seniman belum diisi",
    year: new Date().getFullYear(),
    description: "Deskripsi karya seni belum diisi.",
    imageUrl: "", // TODO: Isi URL gambar karya seni
  },
};
