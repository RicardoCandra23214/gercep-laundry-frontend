import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import "../components/css/karyawan.css";

const Karyawan = () => {
  const [dataKaryawan, setDataKaryawan] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal untuk edit
  const [newKaryawan, setNewKaryawan] = useState({
    nama: "",
    alamat: "",
    no_whatsapp: "",
    tanggal_masuk: "",
    gaji: "",
  });
  const [editKaryawan, setEditKaryawan] = useState(null); // State untuk karyawan yang sedang diedit

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const response = await fetch("https://backend-gerceplaundry.up.railway.app/api/karyawan");
        if (!response.ok) {
          throw new Error("Gagal mendapatkan data dari server");
        }
        const data = await response.json();
        setDataKaryawan(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchKaryawan();

    // Event listener untuk klik di luar modal
    const handleClickOutside = (event) => {
      const modal = document.querySelector(".modal-content");
      if (modal && !modal.contains(event.target)) {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditModalOpen) {
      setEditKaryawan({
        ...editKaryawan,
        [name]: value,
      });
    } else {
      setNewKaryawan({
        ...newKaryawan,
        [name]: value,
      });
    }
  };

  const handleAddKaryawan = async () => {
    const { nama, alamat, no_whatsapp, tanggal_masuk, gaji } = newKaryawan;
  
    // Validasi input
    if (!nama || !alamat || !no_whatsapp || !tanggal_masuk || !gaji) {
      alert("Ada data yang belum diisi");
      return;
    }
  
    try {
      const response = await fetch("https://backend-gerceplaundry.up.railway.app/api/karyawan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKaryawan),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambah karyawan");
      }
  
      const newData = await response.json();
      setDataKaryawan([...dataKaryawan, newData]);
      setIsModalOpen(false);
      setNewKaryawan({ nama: "", alamat: "", no_whatsapp: "", tanggal_masuk: "", gaji: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (karyawan) => {
    setEditKaryawan(karyawan); // Isi data karyawan ke form edit
    setIsEditModalOpen(true);
  };

  const handleUpdateKaryawan = async () => {
    try {
      const response = await fetch(`https://backend-gerceplaundry.up.railway.app/api/karyawan/${editKaryawan.id_karyawan}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editKaryawan),
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengupdate data karyawan");
      }
  
      const updatedData = await response.json();
  
      // Update state langsung tanpa perlu refresh
      setDataKaryawan((prevData) =>
        prevData.map((karyawan) =>
          karyawan.id_karyawan === updatedData.id_karyawan ? updatedData : karyawan
        )
      );
  
      setIsEditModalOpen(false); // Tutup modal edit
      setEditKaryawan(null); // Reset state edit
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleDeleteKaryawan = async (id) => {
    try {
      const response = await fetch(`https://backend-gerceplaundry.up.railway.app/api/karyawan/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data karyawan");
      }

      setDataKaryawan(dataKaryawan.filter((karyawan) => karyawan.id_karyawan !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatGaji = (gaji) => {
    const formattedGaji = gaji.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp.${formattedGaji}`;
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h1>Data Karyawan</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={() => setIsModalOpen(true)} className="btn-tambah-karyawan">
          Tambah Karyawan
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>No WhatsApp</th>
              <th>Tanggal Masuk</th>
              <th>Gaji</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataKaryawan.length > 0 ? (
              dataKaryawan.map((karyawan, index) => (
                <tr key={karyawan.id_karyawan}>
                  <td>{index + 1}</td>
                  <td>{karyawan.nama}</td>
                  <td className="long-text">{karyawan.alamat}</td>
                  <td>{karyawan.no_whatsapp}</td>
                  <td>
                    {new Date(karyawan.tanggal_masuk).toLocaleDateString("id-ID", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>{formatGaji(karyawan.gaji)}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEditClick(karyawan)}>Edit</button>
                    <button onClick={() => handleDeleteKaryawan(karyawan.id_karyawan)}>Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Tidak ada data karyawan</td>
              </tr>
            )}
          </tbody>
      </table>

        {/* Modal Tambah */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Tambah Karyawan</h2>
              <label>
                Nama:
                <input type="text" name="nama" value={newKaryawan.nama} onChange={handleInputChange} />
              </label>
              <label>
                Alamat:
                <input type="text" name="alamat" value={newKaryawan.alamat} onChange={handleInputChange} />
              </label>
              <label>
                No WhatsApp:
                <input
                  type="tel"
                  name="no_whatsapp"
                  value={newKaryawan.no_whatsapp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Menghapus semua karakter non-angka
                    setNewKaryawan({ ...newKaryawan, no_whatsapp: value });
                  }}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </label>
              <label>
                Tanggal Masuk:
                <input type="date" name="tanggal_masuk" value={newKaryawan.tanggal_masuk} onChange={handleInputChange} />
              </label>
              <label>
                Gaji:
                <input type="number" name="gaji" value={newKaryawan.gaji} onChange={handleInputChange} />
              </label>
              <button onClick={handleAddKaryawan} className="tombo-simpan">
                Simpan
              </button>
              <button onClick={() => setIsModalOpen(false)} className="tombol-batal">
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Modal Edit */}
        {isEditModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Karyawan</h2>
              <label>
                Nama:
                <input type="text" name="nama" value={editKaryawan.nama} onChange={handleInputChange} />
              </label>
              <label>
                Alamat:
                <input type="text" name="alamat" value={editKaryawan.alamat} onChange={handleInputChange} />
              </label>
              <label>
                  No WhatsApp:
                  <input
                    type="tel"
                    name="no_whatsapp"
                    value={editKaryawan.no_whatsapp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Menghapus semua karakter non-angka
                      setEditKaryawan({ ...editKaryawan, no_whatsapp: value });
                    }}
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </label>
              <label>
                Tanggal Masuk:
                <input type="date" name="tanggal_masuk" value={editKaryawan.tanggal_masuk} onChange={handleInputChange} />
              </label>
              <label>
                Gaji:
                <input type="number" name="gaji" value={editKaryawan.gaji} onChange={handleInputChange} />
              </label>
              <button onClick={handleUpdateKaryawan} className="tombo-simpan">
                Simpan
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="tombol-batal">
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Karyawan;
