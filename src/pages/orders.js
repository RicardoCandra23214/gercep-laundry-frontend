import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar'; // Pastikan path ini sesuai dengan lokasi sidebar di proyekmu
import '../components/css/orders.css'; // Pastikan CSS sudah diatur

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    no_whatsapp: '',
    alamat: '',
    jenis_layanan: '',
    detail_layanan: '',
    waktu_pengerjaan: '',
    tanggal_pesanan: '',
    berat_pakaian: 0,
    total_harga: 0,
    status_pesanan: '',
  });
  const [laundryNormal, setLaundryNormal] = useState([]);
  const [laundrySatuan, setLaundrySatuan] = useState([]);
  const [filterDate, setFilterDate] = useState(new Date()); // Default tanggal saat ini
  const [orderCount, setOrderCount] = useState(0); // Menyimpan jumlah pesanan yang sesuai tanggal
  const [totalPendapatan, setTotalPendapatan] = useState(0);


  useEffect(() => {
    // Fetch dan filter orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://backend-gerceplaundry.up.railway.app/api/orders');
      const filteredOrders = response.data.filter((order) => {
        const orderDate = new Date(order.tanggal_pesanan);
        return (
          orderDate.getDate() === filterDate.getDate() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getFullYear() === filterDate.getFullYear()
        );
      });
      setOrders(filteredOrders);

      const completedOrders = filteredOrders.filter(order => order.status_pesanan === 'selesai'); // Filter status selesai
      setOrderCount(completedOrders.length); // Set jumlah pesanan yang selesai

       // Hitung total pendapatan
       const totalPendapatan = completedOrders.reduce((acc, order) => acc + Number(order.total_harga), 0);
        setTotalPendapatan(totalPendapatan);

    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
    fetchOrders();
    fetchLaundryData();
  }, [filterDate]); // Menjalankan ulang saat filter berubah
  
  
  // Fetch laundry normal and satuan data
  const fetchLaundryData = async () => {
    try {
      const [normalRes, satuanRes] = await Promise.all([
        axios.get('https://backend-gerceplaundry.up.railway.app/api/services/layanan-normal'),
        axios.get('https://backend-gerceplaundry.up.railway.app/api/services/layanan-satuan'),
      ]);
      setLaundryNormal(normalRes.data);
      setLaundrySatuan(satuanRes.data);
    } catch (error) {
      console.error('Error fetching laundry data:', error);
    }
    
  };
  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'jenis_layanan') {
      // Set waktu pengerjaan default berdasarkan jenis layanan
      let defaultWaktuPengerjaan = '';
      if (value === 'normal') {
        // Misalnya, waktu pengerjaan normal adalah 1 hari
        defaultWaktuPengerjaan = '1 Hari';
      } else if (value === 'satuan') {
        // Misalnya, waktu pengerjaan satuan adalah 3 jam
        defaultWaktuPengerjaan = '3 Jam';
      }
  
      setFormData({
        ...formData,
        [name]: value,
        waktu_pengerjaan: defaultWaktuPengerjaan, // Set waktu pengerjaan sesuai jenis layanan
      });
    } else if (name === 'detail_layanan') {
      // Cek apakah layanan adalah normal atau satuan
      const selectedService =
        formData.jenis_layanan === 'normal'
          ? laundryNormal.find(
              (item) =>
                `${item.nama_layanan} - Rp.${parseInt(item.harga).toLocaleString(
                  'id-ID'
                )}` === value
            )
          : laundrySatuan.find(
              (item) =>
                `${item.nama_layanan} - Rp.${parseInt(item.harga).toLocaleString(
                  'id-ID'
                )}` === value
            );
  
      // Update formData dengan layanan lengkap (nama + harga)
      setFormData({
        ...formData,
        [name]: value,
        total_harga: formData.berat_pakaian * (selectedService?.harga || 0), // Hitung total harga
      });
    } else if (name === 'berat_pakaian') {
      // Hitung ulang total harga
      const selectedService =
        formData.jenis_layanan === 'normal'
          ? laundryNormal.find(
              (item) =>
                `${item.nama_layanan} - Rp.${parseInt(item.harga).toLocaleString(
                  'id-ID'
                )}` === formData.detail_layanan
            )
          : laundrySatuan.find(
              (item) =>
                `${item.nama_layanan} - Rp.${parseInt(item.harga).toLocaleString(
                  'id-ID'
                )}` === formData.detail_layanan
            );
  
      setFormData({
        ...formData,
        [name]: value,
        total_harga: value * (selectedService?.harga || 0), // Hitung total harga ulang jika berat berubah
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  
  

  // Format tanggal
  const formatTanggal = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
    return formattedDate;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id_pesanan) {
        // Edit order
        await axios.put(`https://backend-gerceplaundry.up.railway.app/api/orders/${formData.id_pesanan}`, formData);
      } else {
        // Add new order
        await axios.post('https://backend-gerceplaundry.up.railway.app/api/orders', formData);
      }
      
      setShowForm(false);
      setFormData({
        id_pesanan: '',
        nama: '',
        no_whatsapp: '',
        alamat: '',
        jenis_layanan: '',
        detail_layanan: '',
        waktu_pengerjaan: '',
        tanggal_pesanan: '',
        berat_pakaian: 0,
        total_harga: 0,
        status_pesanan: '',
      });
  
      // Fetch ulang data dengan filter tanggal saat ini
      const response = await axios.get('https://backend-gerceplaundry.up.railway.app/api/orders');
      const filteredOrders = response.data.filter((order) => {
        const orderDate = new Date(order.tanggal_pesanan);
        return (
          orderDate.getDate() === filterDate.getDate() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getFullYear() === filterDate.getFullYear()
        );
      });
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };
  
  
                
  const handleEdit = (order) => {
    setFormData({
      id_pesanan: order.id_pesanan,
      nama: order.nama,
      no_whatsapp: order.no_whatsapp,
      alamat: order.alamat,
      jenis_layanan: order.jenis_layanan,
      detail_layanan: order.detail_layanan,
      waktu_pengerjaan: order.waktu_pengerjaan,
      tanggal_pesanan: order.tanggal_pesanan,
      berat_pakaian: order.berat_pakaian,
      total_harga: order.total_harga,
      status_pesanan: order.status_pesanan,
    });
    setShowForm(true); // Menampilkan form modal untuk edit
};

  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?');
    if (confirmDelete) {
      try {
        await axios.delete(`https://backend-gerceplaundry.up.railway.app/api/orders/${id}`);
        setOrders(orders.filter(order => order.id_pesanan !== id)); // Menghapus pesanan dari tampilan
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  // Fungsi untuk mengurutkan pesanan berdasarkan status
  const sortOrdersByStatus = (status) => {
    const sortedOrders = [...orders].sort((a, b) => {
      if (a.status_pesanan === status && b.status_pesanan !== status) {
        return -1;
      }
      if (a.status_pesanan !== status && b.status_pesanan === status) {
        return 1;
      }
      return 0;
    });
    setOrders(sortedOrders);
  };

  const handleSort = (status) => {
    const validStatuses = ["pending", "selesai", "antar-jemput"];
    if (validStatuses.includes(status)) {
      sortOrdersByStatus(status);
    } else {
      console.warn("Status tidak valid");
    }
  };
  

  

  return (
    <div className="orders-page">
      <Sidebar /> {/* Sidebar berada di sebelah kiri */}
      <div className="orders-content">
        <div className="orders-header">
          <h1>Data Pesanan</h1>
          <div className="filter-card">
            <div>
              <div className="d-flex justify-content-between">
                <span>Jumlah Pesanan Selesai :</span>
                <span className='order-count'>{orderCount}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Total Pendapatan :</span>
                <span>Rp {totalPendapatan.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="mt-3">
              <input
                type="date"
                value={filterDate.toISOString().split('T')[0]}
                onChange={(e) => setFilterDate(new Date(e.target.value))}
                className="form-control"
              />
            </div>
          </div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-add-order">
            Tambah Pesanan
          </button>
          <div className="sort-buttons">
          <button onClick={() => handleSort('selesai')} className="btn-sort proses">Selesai</button>
          <button onClick={() => handleSort('pending')} className="btn-sort pending">Pending</button>
          <button onClick={() => handleSort('antar-jemput')} className="btn-sort batal">Antar-Jemput</button>
          </div>

          
        {showForm && (
          <div className="form-modal">
            <form className="order-form" onSubmit={handleSubmit}>
              <span className="close-btn" onClick={() => setShowForm(false)}>
                &times;
              </span>
              <h2>Tambah Pesanan</h2>
              {/* Form Fields */}
              <label htmlFor="nama">Nama:</label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
              />

              <label htmlFor="no_whatsapp">Nomor WhatsApp:</label>
              <input
                type="text"
                id="no_whatsapp"
                name="no_whatsapp"
                value={formData.no_whatsapp}
                onChange={handleChange}
                required
              />

              <label htmlFor="alamat">Alamat:</label>
              <input
                type="text"
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
              />

              <label htmlFor="jenis_layanan">Jenis Layanan:</label>
              <select
                name="jenis_layanan"
                value={formData.jenis_layanan}
                onChange={handleChange}
              >
                  <option value="">pilih jenis layanan</option>
                {['normal', 'satuan'].map((jenis, index) => (
                  <option key={index} value={jenis}>{jenis}</option>
                ))}
              </select>

              <label htmlFor="detail_layanan">Detail Layanan</label>
              <select
                name="detail_layanan"
                value={formData.detail_layanan}
                onChange={handleChange}
              >
                <option value="">Pilih Layanan</option>
                {formData.jenis_layanan === "normal"
                  ? laundryNormal.map((item) => (
                      <option key={item.id_laundry_normal} value={item.nama_layanan}>
                        {`${item.nama_layanan} - Rp.${parseInt(item.harga).toLocaleString('id-ID')}`}
                      </option>
                    ))
                  : laundrySatuan.map((item) => (
                      <option key={item.id_laundry_satuan} value={item.nama_layanan}>
                        {`${item.nama_layanan} - Rp.${parseInt(item.harga).toLocaleString('id-ID')}`}
                      </option>
                    ))}
              </select>

              <label htmlFor="waktu_pengerjaan">Waktu Pengerjaan</label>
              <select
                id="waktu_pengerjaan"
                name="waktu_pengerjaan"
                value={formData.waktu_pengerjaan}
                onChange={handleChange}
                required
              >
                <option value="3 Jam">3 Jam</option>
                <option value="5 Jam">5 Jam</option>
                <option value="1 hari">1 Hari</option>
                <option value="2 Hari">2 Hari</option>
                <option value="3 Hari">3 Hari</option>
                <option value="1 minggu">1 Minggu</option>
              </select>

              <label htmlFor="tanggal_pesanan">Tanggal Pesanan</label>
              <input
                type="date"
                id="tanggal_pesanan"
                name="tanggal_pesanan"
                value={formData.tanggal_pesanan}
                onChange={handleChange}
                required
              />

              <label htmlFor="berat_pakaian">jumlah (kg / pcs):</label>
              <input
                type="number"
                id="berat_pakaian"
                name="berat_pakaian"
                value={formData.berat_pakaian}
                onChange={handleChange}
                required
              />

              <label htmlFor="status_pesanan">Status Pesanan:</label>
              <select
                id="status_pesanan"
                name="status_pesanan"
                value={formData.status_pesanan}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Status</option>
                <option value="pending">Pending</option>
                <option value="selesai">Selesai</option>
                <option value="antar-jemput">Antar-Jemput</option>
              </select>

              <div>
                <button type="submit" className="btn-save">
                  Simpan Pesanan
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="orders-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Nomor WA</th>
              <th>Alamat</th>
              <th>Jenis Layanan</th>
              <th>Detail Layanan</th>
              <th>Waktu Pengerjaan</th>
              <th>Tanggal Pesanan</th>
              <th>Berat</th>
              <th>Total Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id_pesanan}>
                <td>{order.nama}</td>
                <td>{order.no_whatsapp}</td>
                <td>{order.alamat}</td>
                <td>{order.jenis_layanan}</td>
                <td>
                  {(() => {
                    const service = laundryNormal.find(item => item.nama_layanan === order.detail_layanan) || 
                                    laundrySatuan.find(item => item.nama_layanan === order.detail_layanan);
                    return service ? `${order.detail_layanan} - Rp.${parseInt(service.harga).toLocaleString('id-ID')}` : order.detail_layanan;
                  })()}
                </td>
                <td>{order.waktu_pengerjaan}</td>
                <td>{formatTanggal(order.tanggal_pesanan)}</td>
                <td>
                  {order.jenis_layanan === "normal"
                    ? `${order.berat_pakaian} pcs/satuan`
                    : `${order.berat_pakaian} kg`}
                </td>
                <td>Rp.{parseInt(order.total_harga).toLocaleString('id-ID')}</td>
                <td
                className={`status ${
                  order.status_pesanan === 'pending'
                    ? 'status-pending'
                    : order.status_pesanan === 'selesai'
                    ? 'status-selesai'
                    : 'status-batal'
                }`}
              >
                {order.status_pesanan}
              </td>

                <td>
                  <button onClick={() => handleEdit(order)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(order.id_pesanan)} className="btn-delete">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;