import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/landingPages.css";
import emailjs from "emailjs-com";

const LandingPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message =
      `Hallo Gercep Laundry, saya ingin memesan layanan laundrynya dong. berikut data pesanan saya yaa:%0A%0A` +
      `Nama: ${name}%0A` +
      `Nomor WA: ${phone}%0A` +
      `Alamat: ${address}%0A` +
      `Deskripsi Pesanan: ${description}%0A%0A` +
      `sekian dan terima kasih!!`;

    const waNumber = "6283151727739";
    const url = `https://wa.me/${waNumber}?text=${message}`;
    window.location.href = url;

    setName("");
    setPhone("");
    setAddress("");
    setDescription("");
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsReviewed(checked);

    if (checked) {
      emailjs
        .send(
          "service_jn640ao",
          "template_wfqj14o",
          {
            message: "Website Gercep Laundry sudah direview oleh dosen.",
          },
          "A2R7VdMHewMxALxYU"
        )
        .then(() => {
          alert("✅ Email berhasil dikirim ke Ricardo!");
        })
        .catch((error) => {
          console.error("❌ Gagal mengirim email:", error);
          alert("❌ Email gagal dikirim. Coba cek koneksi atau konfigurasi.");
        });
    }
  };

  return (
    <div className="landing-page-1">
      <div className="container-1">
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <div className="hero-content">
          <h1>
            Welcome to <span>G</span>ercep <span>L</span>aundry
          </h1>
          <p>Atasi masalah pakaian kotor anda</p>
          <p>dengan kami disini!</p>
        </div>
      </div>

      <div className="container-2" id="about">
        <h2 className="about-title">About Us</h2>
        <div className="card-container-2">
          <div className="card-row">
            <div className="card-image"></div>
            <div className="card-about">
              <p>
                <span>Gercep Laundry</span> merupakan usaha layanan jasa laundry
                yang menawarkan kemudahan dan kenyamanan bagi pelanggan. Dengan
                motto "Cepat, Bersih, dan Nyaman", Gercep Laundry berkomitmen
                untuk memberikan pelayanan terbaik dalam membersihkan pakaian,
                seprai, dan lain-lain.
              </p>
              <p>
                Tim Gercep Laundry terdiri dari tenaga kerja yang terlatih dan
                berpengalaman dalam menangani berbagai jenis kain dan noda,
                sehingga pelanggan dapat yakin bahwa barang mereka akan
                dibersihkan dengan baik. Gercep Laundry juga menawarkan berbagai
                layanan tambahan, seperti pengeringan, penyetrikaan, dan
                pengemasan.
              </p>
              <div className="social-media">
                <i className="fab fa-instagram instagram-logo"></i>{" "}
                <a
                  href="https://www.instagram.com/gerceplaundry.id/?igsh=N29hNTY1OW1wemh0#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @gerceplaundry
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-3" id="contact">
        <h2 className="contact-title">Buat Pesanan antar jemput</h2>
        <div className="card-container-3">
          <div className="card-row">
            <div className="card-form">
              <form onSubmit={handleSubmit}>
                <label htmlFor="nama">Nama:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="noWa">No. WhatsApp:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <label htmlFor="alamat">Alamat:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <label htmlFor="deskripsi">Deskripsi Pesanan:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="cth : cuci kering 1 hari (silahkan lihat gambar di samping untuk melihat layanan)"
                ></textarea>

                <button type="submit" className="submit-btn">
                  Kirim Pesanan
                </button>

                <div style={{ marginTop: "1rem" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isReviewed}
                      onChange={handleCheckboxChange}
                    />{" "}
                    Website ini sudah direview oleh dosen
                  </label>
                </div>
              </form>
            </div>

            <div className="card-image-contact"></div>
          </div>
        </div>
        <span>
          catatan : berat minimal 3Kg jika kurang akan di bulatkan menjadi 3Kg
        </span>
      </div>

      <div className="footer-bottom">
        <p>
          Copyright 2023 © All Right Reserved Design by RicardoCandraSUlebaganti
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
