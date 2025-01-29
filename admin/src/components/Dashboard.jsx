import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { Bar, Line, Pie } from "react-chartjs-2";
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

// Register Chart.js components
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

  // Fetch orders and prepare data for charts
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
          setOrders(fetchedOrders);

          // Prepare data for charts
          const statusCounts = fetchedOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {});

          const revenueCounts = fetchedOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + (order.amount || 0);
            return acc;
          }, {});

          setChartData({
            status: {
              labels: Object.keys(statusCounts),
              datasets: [
                {
                  label: "Orders by Status",
                  data: Object.values(statusCounts),
                  backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336"],
                },
              ],
            },
            revenue: {
              labels: Object.keys(revenueCounts),
              datasets: [
                {
                  label: "Revenue by Status",
                  data: Object.values(revenueCounts),
                  backgroundColor: ["#9c27b0", "#3f51b5", "#00bcd4", "#ffc107"],
                },
              ],
            },
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch orders.");
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
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

      {/* Overview Section with Dropdown for Chart Selection */}
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
            </select>
          </div>
          {chartData && chartData[selectedChart] ? (
            selectedChart === "status" ? (
              <Bar
                data={chartData[selectedChart]}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.raw} orders`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <Pie
                data={chartData[selectedChart]}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw.toFixed(2)}`,
                      },
                    },
                  },
                }}
              />
            )
          ) : (
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
              <p>No data available for the chart.</p>
            </div>
          )}
        </div>

        {/* Recent Sales */}
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
                <p className="font-bold">${order.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
