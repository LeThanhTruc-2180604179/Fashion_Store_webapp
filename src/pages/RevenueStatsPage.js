import React, { useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};
const getMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
const getYear = () => {
  return String(new Date().getFullYear());
};

function getAllDeliveredOrders() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  let allOrders = [];
  users.forEach(user => {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
    allOrders = allOrders.concat(userOrders.filter(o => o.status === 'delivered'));
  });
  return allOrders;
}

// Hàm tính tổng doanh thu đã trừ giảm giá
function getOrderNetTotal(order) {
  return order.total - (order.discountValue || 0);
}

const RevenueStatsPage = () => {
  const [mode, setMode] = useState('today'); // today, month, year, total
  const [deliveredOrders, setDeliveredOrders] = useState(getAllDeliveredOrders());

  // Cập nhật realtime khi có sự kiện order-updated
  React.useEffect(() => {
    const reload = () => setDeliveredOrders(getAllDeliveredOrders());
    window.addEventListener('order-updated', reload);
    return () => window.removeEventListener('order-updated', reload);
  }, []);

  // Tính doanh thu
  const today = getToday();
  const month = getMonth();
  const year = getYear();

  const revenueToday = deliveredOrders.filter(o => o.orderDate.slice(0, 10) === today).reduce((sum, o) => sum + getOrderNetTotal(o), 0);
  const revenueMonth = deliveredOrders.filter(o => o.orderDate.slice(0, 7) === month).reduce((sum, o) => sum + getOrderNetTotal(o), 0);
  const revenueYear = deliveredOrders.filter(o => o.orderDate.slice(0, 4) === year).reduce((sum, o) => sum + getOrderNetTotal(o), 0);
  const revenueTotal = deliveredOrders.reduce((sum, o) => sum + getOrderNetTotal(o), 0);

  // Dữ liệu cho biểu đồ
  const chartData = useMemo(() => {
    if (mode === 'today') {
      // Biểu đồ giờ trong ngày
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const data = hours.map(h =>
        deliveredOrders.filter(o => {
          const d = new Date(o.orderDate);
          return d.toISOString().slice(0, 10) === today && d.getHours() === h;
        }).reduce((sum, o) => sum + getOrderNetTotal(o), 0)
      );
      return {
        labels: hours.map(h => `${h}h`),
        datasets: [{ label: 'Doanh thu (VNĐ)', data, backgroundColor: '#2563eb' }],
      };
    } else if (mode === 'month') {
      // Biểu đồ từng ngày trong tháng
      const daysInMonth = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      const data = days.map(d =>
        deliveredOrders.filter(o => {
          const dO = new Date(o.orderDate);
          return dO.toISOString().slice(0, 7) === month && dO.getDate() === d;
        }).reduce((sum, o) => sum + getOrderNetTotal(o), 0)
      );
      return {
        labels: days.map(d => `${d}`),
        datasets: [{ label: 'Doanh thu (VNĐ)', data, backgroundColor: '#22c55e' }],
      };
    } else if (mode === 'year') {
      // Biểu đồ từng tháng trong năm
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const data = months.map(m =>
        deliveredOrders.filter(o => {
          const dO = new Date(o.orderDate);
          return dO.toISOString().slice(0, 4) === year && dO.getMonth() + 1 === m;
        }).reduce((sum, o) => sum + getOrderNetTotal(o), 0)
      );
      return {
        labels: months.map(m => `Th${m}`),
        datasets: [{ label: 'Doanh thu (VNĐ)', data, backgroundColor: '#f59e42' }],
      };
    } else {
      // Tổng doanh thu
      return {
        labels: ['Tổng doanh thu'],
        datasets: [{ label: 'Doanh thu (VNĐ)', data: [revenueTotal], backgroundColor: '#6366f1' }],
      };
    }
  }, [mode, deliveredOrders, today, month, year, revenueTotal]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Thống Kê Doanh Thu</h2>
      <div className="flex space-x-2 mb-6">
        <button onClick={() => setMode('today')} className={`px-4 py-2 rounded-lg font-medium ${mode === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Hôm nay</button>
        <button onClick={() => setMode('month')} className={`px-4 py-2 rounded-lg font-medium ${mode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Tháng này</button>
        <button onClick={() => setMode('year')} className={`px-4 py-2 rounded-lg font-medium ${mode === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Năm nay</button>
        <button onClick={() => setMode('total')} className={`px-4 py-2 rounded-lg font-medium ${mode === 'total' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Tổng</button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {mode === 'today' ? (
          <Bar data={chartData} />
        ) : mode === 'month' ? (
          <Line data={chartData} />
        ) : mode === 'year' ? (
          <Bar data={chartData} />
        ) : (
          <Bar data={chartData} />
        )}
      </div>
      <div className="mt-6 text-right text-lg font-semibold">
        {mode === 'today' && `Tổng doanh thu hôm nay: ${revenueToday.toLocaleString()}đ`}
        {mode === 'month' && `Tổng doanh thu tháng này: ${revenueMonth.toLocaleString()}đ`}
        {mode === 'year' && `Tổng doanh thu năm nay: ${revenueYear.toLocaleString()}đ`}
        {mode === 'total' && `Tổng doanh thu: ${revenueTotal.toLocaleString()}đ`}
      </div>
    </div>
  );
};

export default RevenueStatsPage; 