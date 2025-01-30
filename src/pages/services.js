import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar";
import "../components/css/services.css";
import "../components/css/sidebar.css"

const Services = () => {
  const [layananNormal, setLayananNormal] = useState([]);
  const [layananSatuan, setLayananSatuan] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('normal');
  const [formData, setFormData] = useState({
    nama_layanan: '',
    harga: '',
    waktu_pengerjaan: '3 Jam'
  });
  const [editFormData, setEditFormData] = useState({
    id: '',
    nama_layanan: '',
    harga: '',
    waktu_pengerjaan: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5001/api/services/layanan-normal')
      .then(response => setLayananNormal(response.data))
      .catch(error => console.error('Error fetching normal services:', error));

    axios.get('http://localhost:5001/api/services/layanan-satuan')
      .then(response => setLayananSatuan(response.data))
      .catch(error => console.error('Error fetching unit services:', error));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiEndpoint =
        selectedTable === 'normal'
          ? 'http://localhost:5001/api/services/layanan-normal'
          : 'http://localhost:5001/api/services/layanan-satuan';
  
      const response = await axios.post(apiEndpoint, formData);
      console.log('Data berhasil ditambahkan:', response.data);
  
      // Perbarui state dengan data yang baru ditambahkan
      if (selectedTable === 'normal') {
        setLayananNormal((prevData) => [...prevData, response.data.data]);
      } else {
        setLayananSatuan((prevData) => [...prevData, response.data.data]);
      }
  
      // Reset form setelah menambah data
      setFormData({ nama_layanan: '', harga: '', waktu_pengerjaan: '3 Jam' });
      setShowFormModal(false);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };
  

  const handleEdit = (id, table) => {
    const service = table === 'normal'
      ? layananNormal.find(item => item.id_laundry_normal === id)
      : layananSatuan.find(item => item.id_laundry_satuan === id);

    setEditFormData({
      id,
      nama_layanan: service.nama_layanan,
      harga: service.harga,
      waktu_pengerjaan: service.waktu_pengerjaan
    });

    setSelectedTable(table);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint =
      selectedTable === 'normal'
        ? `http://localhost:5001/api/services/layanan-normal/${editFormData.id}`
        : `http://localhost:5001/api/services/layanan-satuan/${editFormData.id}`;
    try {
      await axios.put(apiEndpoint, editFormData);

      if (selectedTable === 'normal') {
        setLayananNormal(layananNormal.map(item => 
          item.id_laundry_normal === editFormData.id ? editFormData : item
        ));
      } else {
        setLayananSatuan(layananSatuan.map(item => 
          item.id_laundry_satuan === editFormData.id ? editFormData : item
        ));
      }

      setShowEditModal(false);
    } catch (error) {
      console.error('Error editing service:', error);
    }
  };

  //fungsi untuk memformat harga
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(number).replace('IDR', 'Rp').trim();
  };

  const handleDelete = async (id, table) => {
    const apiEndpoint =
      table === 'normal'
        ? `http://localhost:5001/api/services/layanan-normal/${id}`
        : `http://localhost:5001/api/services/layanan-satuan/${id}`;

    try {
      await axios.delete(apiEndpoint);

      if (table === 'normal') {
        setLayananNormal(layananNormal.filter(item => item.id_laundry_normal !== id));
      } else {
        setLayananSatuan(layananSatuan.filter(item => item.id_laundry_satuan !== id));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className="services-page-container">
      <Sidebar />
      <div className="services-main-content">
        <h1>Layanan Gercep Laundry</h1>
        <button className="btn-add" onClick={() => setShowFormModal(true)}>Tambah Layanan</button>

{/* Modal Tambah Layanan */}
{showFormModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Tambah Layanan</h2>
              <form onSubmit={handleFormSubmit}>
                <label>Pilih Jenis Layanan</label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                >
                  <option value="normal">Laundry Normal</option>
                  <option value="satuan">Laundry Satuan</option>
                </select>
                <label>Nama Layanan</label>
                <input
                  type="text"
                  value={formData.nama_layanan}
                  onChange={(e) => setFormData({ ...formData, nama_layanan: e.target.value })}
                />
                <label>Harga per Kg</label>
                <input
                  type="number"
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                />
                <label>Waktu Pengerjaan</label>
                <select
                  value={formData.waktu_pengerjaan}
                  onChange={(e) => setFormData({ ...formData, waktu_pengerjaan: e.target.value })}
                >
                  <option value="3 Jam">3 Jam</option>
                  <option value="5 Jam">5 Jam</option>
                  <option value="1 Hari">1 Hari</option>
                  <option value="2 Hari">2 Hari</option>
                  <option value="3 Hari">3 Hari</option>
                  <option value="1 Minggu">1 Minggu</option>
                </select>
                <button type="submit" className="btn-save">Tambah</button>
                <button type="button" className="btn-cancel" onClick={() => setShowFormModal(false)}>Batal</button>
              </form>
            </div>
          </div>
        )}
        


        {/* Layanan Normal */}
        <div className="card">
          <h3>Laundry Normal</h3>
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Layanan</th>
                <th>Harga</th>
                <th>Waktu Pengerjaan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {layananNormal.map((service, index) => (
                <tr key={service.id_laundry_normal || index}>
                  <td>{index + 1}</td>
                  <td>{service.nama_layanan}</td>
                  <td>{formatRupiah(service.harga)}</td>
                  <td>{service.waktu_pengerjaan}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(service.id_laundry_normal, 'normal')}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(service.id_laundry_normal, 'normal')}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Layanan Satuan */}
        <div className="card">
          <h3>Laundry Satuan</h3>
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Layanan</th>
                <th>Harga</th>
                <th>Waktu Pengerjaan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {layananSatuan.map((service, index) => (
                <tr key={service.id_laundry_satuan || index}>
                  <td>{index + 1}</td>
                  <td>{service.nama_layanan}</td>
                  <td>{formatRupiah(service.harga)}</td>
                  <td>{service.waktu_pengerjaan}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(service.id_laundry_satuan, 'satuan')}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(service.id_laundry_satuan, 'satuan')}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal">
            <form onSubmit={handleEditSubmit}>
              <label>Nama Layanan</label>
              <input
                type="text"
                value={editFormData.nama_layanan}
                onChange={(e) => setEditFormData({ ...editFormData, nama_layanan: e.target.value })}
              />
              <label>Harga</label>
              <input
                type="number"
                value={editFormData.harga}
                onChange={(e) => setEditFormData({ ...editFormData, harga: e.target.value })}
              />
              <label>Waktu Pengerjaan</label>
              <select
                value={editFormData.waktu_pengerjaan}
                onChange={(e) => setEditFormData({ ...editFormData, waktu_pengerjaan: e.target.value })}
              >
                <option value="3 Jam">3 Jam</option>
                <option value="5 Jam">5 Jam</option>
                <option value="1 Hari">1 Hari</option>
                <option value="2 Hari">2 Hari</option>
                <option value="3 Hari">3 Hari</option>
                <option value="1 Minggu">1 Minggu</option>
              </select>
              <button type="submit" className="btn-save">Simpan</button>
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Batal</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
