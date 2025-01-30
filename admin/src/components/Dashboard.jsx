import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState("status");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
          headers: { token },
        });

        if (response.data.success) {
          const fetchedOrders = response.data.orders || [];
          const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
          setOrders(sortedOrders);

          // Data processing for all charts
          const statusCounts = sortedOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {});

          const revenueCounts = sortedOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + (order.amount || 0);
            return acc;
          }, {});

          const paymentMethodCounts = sortedOrders.reduce((acc, order) => {
            acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
            return acc;
          }, {});

          const monthlyRevenueData = sortedOrders.reduce((acc, order) => {
            const date = new Date(order.date);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            acc[monthYear] = (acc[monthYear] || 0) + order.amount;
            return acc;
          }, {});

          const ordersOverTime = sortedOrders.reduce((acc, order) => {
            const date = new Date(order.date);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            acc[monthYear] = (acc[monthYear] || 0) + 1;
            return acc;
          }, {});

          const productSales = sortedOrders.reduce((acc, order) => {
            order.items.forEach(item => {
              acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
            });
            return acc;
          }, {});

          const sortedMonths = Object.keys(monthlyRevenueData).sort();
          const monthlyLabels = sortedMonths.map(month => 
            new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          );

          const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          setChartData({
            status: {
              labels: Object.keys(statusCounts),
              datasets: [{
                label: "Orders by Status",
                data: Object.values(statusCounts),
                backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336"],
              }],
            },
            revenue: {
              labels: Object.keys(revenueCounts),
              datasets: [{
                label: "Revenue by Status",
                data: Object.values(revenueCounts),
                backgroundColor: ["#9c27b0", "#3f51b5", "#00bcd4", "#ffc107"],
              }],
            },
            paymentMethod: {
              labels: Object.keys(paymentMethodCounts),
              datasets: [{
                label: 'Orders by Payment Method',
                data: Object.values(paymentMethodCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverOffset: 4
              }]
            },
            monthlyRevenue: {
              labels: monthlyLabels,
              datasets: [{
                label: 'Monthly Revenue',
                data: sortedMonths.map(m => monthlyRevenueData[m]),
                borderColor: '#4BC0C0',
                tension: 0.4,
                fill: false
              }]
            },
            ordersOverTime: {
              labels: monthlyLabels,
              datasets: [{
                label: 'Orders Over Time',
                data: sortedMonths.map(m => ordersOverTime[m]),
                borderColor: '#FF9F40',
                tension: 0.4,
                fill: false
              }]
            },
            topProducts: {
              labels: topProducts.map(([id]) => `Product ${id}`),
              datasets: [{
                label: 'Top Selling Products',
                data: topProducts.map(([, qty]) => qty),
                backgroundColor: '#9CCC65'
              }]
            }
          });
        }
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);
  const totalOrders = orders.length;
  const totalDelivered = orders.filter((order) => order.status === "Delivered").length;
  const totalOrderPlaced = orders.filter((order) => order.status === "Order Placed").length;

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold mt-2">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Total Delivered</h2>
          <p className="text-2xl font-bold mt-2">{totalDelivered}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Total Order Placed</h2>
          <p className="text-2xl font-bold mt-2">{totalOrderPlaced}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Overview</h2>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="status">Orders by Status</option>
              <option value="revenue">Revenue by Status</option>
              <option value="paymentMethod">Payment Methods</option>
              <option value="monthlyRevenue">Monthly Revenue</option>
              <option value="ordersOverTime">Orders Over Time</option>
            
            </select>
          </div>
          {chartData && chartData[selectedChart] ? (
            <div className="h-96">
              {selectedChart === "status" && (
                <Bar
                  data={chartData[selectedChart]}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: { callbacks: { label: (context) => `${context.raw} orders` } }
                    }
                  }}
                />
              )}
              {selectedChart === "revenue" && (
                <Pie
                  data={chartData[selectedChart]}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: { callbacks: { label: (context) => `₹${context.raw.toFixed(2)}` } }
                    }
                  }}
                />
              )}
              {selectedChart === "paymentMethod" && (
                <Doughnut
                  data={chartData[selectedChart]}
                  options={{
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: { callbacks: { label: (context) => `${context.raw} orders` } }
                    }
                  }}
                />
              )}
              {selectedChart === "monthlyRevenue" && (
                <Line
                  data={chartData[selectedChart]}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: { callbacks: { label: (context) => `₹${context.raw.toFixed(2)}` } }
                    },
                    scales: { y: { beginAtZero: true } }
                  }}
                />
              )}
              {selectedChart === "ordersOverTime" && (
                <Line
                  data={chartData[selectedChart]}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: { callbacks: { label: (context) => `${context.raw} orders` } }
                    },
                    scales: { y: { beginAtZero: true } }
                  }}
                />
              )}
              
            </div>
          ) : (
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
              <p>No data available for the chart.</p>
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.date && new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-bold">₹{order.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;