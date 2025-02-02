import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "../components/css/dashboard.css";
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [batalOrders, setBatalOrders] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://backend-gerceplaundry.up.railway.app/api/orders');
        const filteredOrders = response.data.filter((order) => {
          const orderDate = new Date(order.tanggal_pesanan);
          return (
            orderDate.getMonth() === selectedMonth &&
            orderDate.getFullYear() === selectedYear
          );
        });
        setOrders(filteredOrders);
        calculateStats(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    
    fetchOrders();
  }, [selectedMonth, selectedYear]);

  const calculateStats = (filteredOrders) => {
    const total = filteredOrders.length;
    const pending = filteredOrders.filter(order => order.status_pesanan === 'pending').length;
    const completed = filteredOrders.filter(order => order.status_pesanan === 'selesai').length;
    const batal = filteredOrders.filter(order => order.status_pesanan === 'antar-jemput').length;
    const completedOrdersData = filteredOrders.filter(order => order.status_pesanan === 'selesai');
    const income = completedOrdersData.reduce((acc, order) => acc + parseFloat(order.total_harga), 0);
    
    setTotalOrders(total);
    setPendingOrders(pending);
    setBatalOrders(batal);
    setCompletedOrders(completed);
    setTotalIncome(income.toFixed(2));
  };

  // Grafik Pendapatan Per Hari
  const dailyIncome = Array(30).fill(0); // Asumsikan 30 hari dalam sebulan
  orders.forEach((order) => {
    const orderDate = new Date(order.tanggal_pesanan);
    const dayOfMonth = orderDate.getDate() - 1; // Indeks dimulai dari 0
    if (order.status_pesanan === 'selesai') {
      dailyIncome[dayOfMonth] += parseFloat(order.total_harga);
    }
  });

  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Hari ${i + 1}`),
    datasets: [{
      label: 'Pendapatan Harian',
      data: dailyIncome,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Warna bar dengan transparansi
      borderColor: 'rgb(0, 0, 0)', // Warna border bar
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(75, 192, 192, 1)', // Warna saat hover
    }],
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Bagian utama dashboard */}
      <div className="main-dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
      

          {/* Pilihan Bulan dan Tahun */}
          <div className="month-selector">
            <label htmlFor="month">Pilih Bulan:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <option value={index} key={index}>
                  {new Date(0, index).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>

            <label htmlFor="year">Pilih Tahun:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, index) => (
                <option value={2024 + index} key={index}>
                  {2024 + index}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Isi utama dashboard */}
        <div className="dashboard-content">
          {/* Container utama untuk 2 dashboard-card */}
          <div className="dashboard-cards-container">
            {/* Card pertama: Statistik */}
            <div className="dashboard-card">
              <div className="card">
                <h3>Jumlah semua pesanan</h3>
                <p>{totalOrders}</p>
              </div>
              <div className="card">
                <h3>Pesanan Pending</h3>
                <p>{pendingOrders}</p>
              </div>
              <div className="card">
                <h3>Pesanan Selesai</h3>
                <p>{completedOrders}</p>
              </div>
              <div className="card">
                <h3>Pesanan perlu di antar</h3>
                <p>{batalOrders}</p>
              </div>
              <div className="card">
                <h3>Total Pendapatan</h3>
                <p>Rp. {new Intl.NumberFormat('id-ID').format(Number(totalIncome))}</p>
                </div>
            </div>

            {/* Card kedua: Grafik Pendapatan */}
            <div className="dashboard-card-chart">
              <div className="chart-container">
                <h3>Pendapatan Harian Dalam Sebulan</h3>
                <Bar data={chartData} />
              </div>
            </div>
          </div>


          {/* Tabel Pesanan */}
          <div className="dashboard-table">
            <h2>Daftar Pesanan</h2>
            <a href="/orders" className="see-all-link">See All</a>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>No WA</th>
                  <th>Alamat</th>
                  <th>Jenis Layanan</th>
                  <th>Tanggal Pesanan</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order, index) => (
                  <tr key={order.id_pesanan}>
                    <td>{index + 1}</td>
                    <td>{order.nama}</td>
                    <td>{order.no_whatsapp}</td>
                    <td>{order.alamat}</td>
                    <td>{order.detail_layanan}</td>
                    <td>{new Date(order.tanggal_pesanan).toLocaleDateString()}</td>
                    <td>Rp {order.total_harga.toLocaleString('id-ID')}</td>
                    <td>{order.status_pesanan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
