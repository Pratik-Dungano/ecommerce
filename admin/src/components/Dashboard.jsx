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
  const [growthData, setGrowthData] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch orders with populated product data
        const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
          headers: { token },
        });

        if (response.data.success) {
          const fetchedOrders = response.data.orders || [];
          const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
          setOrders(sortedOrders);

          // Calculate month-over-month metrics
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

          const currentMonthOrders = sortedOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
          });

          const lastMonthOrders = sortedOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
          });

          const orderGrowth = ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100).toFixed(1);
          const revenueGrowth = ((currentMonthOrders.reduce((sum, order) => sum + order.amount, 0) - 
                                lastMonthOrders.reduce((sum, order) => sum + order.amount, 0)) / 
                                lastMonthOrders.reduce((sum, order) => sum + order.amount, 0) * 100).toFixed(1);

          setGrowthData({
            orders: orderGrowth,
            revenue: revenueGrowth
          });

          // Enhanced category and product handling
          const categoryGrowth = {};
          const subcategoryData = {};
          const productPerformance = {};
          
          sortedOrders.forEach(order => {
            const month = new Date(order.date).toISOString().slice(0, 7);
            
            order.items.forEach(item => {
              // Handle categories
              const category = item.category || 'Other';
              const subcategory = item.subcategory || 'Other';
              
              // Category growth tracking
              if (!categoryGrowth[month]) {
                categoryGrowth[month] = {};
              }
              if (!categoryGrowth[month][category]) {
                categoryGrowth[month][category] = 0;
              }
              categoryGrowth[month][category] += item.quantity;

              // Subcategory tracking
              if (!subcategoryData[subcategory]) {
                subcategoryData[subcategory] = {
                  quantity: 0,
                  revenue: 0
                };
              }
              subcategoryData[subcategory].quantity += item.quantity;
              subcategoryData[subcategory].revenue += item.price * item.quantity;

              // Product performance tracking
              if (!item.productId) return; // Skip if productId is null
              
              if (!productPerformance[item.productId]) {
                productPerformance[item.productId] = {
                  name: item.name || `Product ${item.productId?.toString()?.slice(-6) || 'Unknown'}`,
                  revenue: 0,
                  quantity: 0,
                  orderCount: 0,
                  averageOrderValue: 0
                };
              }
              productPerformance[item.productId].revenue += item.price * item.quantity;
              productPerformance[item.productId].quantity += item.quantity;
              productPerformance[item.productId].orderCount += 1;
            });
          });

          // Calculate average order values
          Object.values(productPerformance).forEach(product => {
            product.averageOrderValue = product.revenue / product.orderCount;
          });

          // Existing data processing
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

          const topProducts = Object.entries(productPerformance)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 5);

          const sortedMonths = Object.keys(monthlyRevenueData).sort();
          const monthlyLabels = sortedMonths.map(month => 
            new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          );

          // New chart data calculations
          const weeklyRevenue = sortedOrders.reduce((acc, order) => {
            const date = new Date(order.date);
            const weekStart = new Date(date.setDate(date.getDate() - date.getDay())).toISOString().split('T')[0];
            acc[weekStart] = (acc[weekStart] || 0) + (order.amount || 0);
            return acc;
          }, {});

          const sizeDistribution = sortedOrders.reduce((acc, order) => {
            order.items.forEach(item => {
              acc[item.size] = (acc[item.size] || 0) + item.quantity;
            });
            return acc;
          }, {});

          // Update chart data with new charts
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
            },
            weeklyRevenue: {
              labels: Object.keys(weeklyRevenue).map(date => 
                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              ),
              datasets: [{
                label: 'Weekly Revenue',
                data: Object.values(weeklyRevenue),
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            productPerformance: {
              labels: Object.values(productPerformance)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map(p => p.name),
              datasets: [
                {
                  label: 'Revenue',
                  data: Object.values(productPerformance)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map(p => p.revenue),
                  backgroundColor: '#2196f3',
                  order: 1
                },
                {
                  label: 'Average Order Value',
                  data: Object.values(productPerformance)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map(p => p.averageOrderValue),
                  backgroundColor: '#4caf50',
                  order: 2
                }
              ]
            },
            sizeDistribution: {
              labels: Object.keys(sizeDistribution),
              datasets: [{
                data: Object.values(sizeDistribution),
                backgroundColor: [
                  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
                  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'
                ],
                borderWidth: 1
              }]
            },
            categoryGrowth: {
              labels: Object.keys(categoryGrowth).sort(),
              datasets: Object.entries(
                Object.values(categoryGrowth).reduce((acc, monthData) => {
                  Object.entries(monthData).forEach(([category, value]) => {
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(value);
                  });
                  return acc;
                }, {})
              ).map(([category, data], index) => ({
                label: category,
                data: data,
                borderColor: [
                  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
                  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'
                ][index % 8],
                tension: 0.4,
                fill: false
              }))
            },
            subcategoryDistribution: {
              labels: Object.keys(subcategoryData),
              datasets: [{
                data: Object.values(subcategoryData).map(data => data.revenue),
                backgroundColor: [
                  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
                  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'
                ],
                borderWidth: 1
              }]
            }
          });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Calculate average order value
  const averageOrderValue = orders.length > 0
    ? orders.reduce((sum, order) => sum + order.amount, 0) / orders.length
    : 0;

  const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);
  const totalOrders = orders.length;
  const totalDelivered = orders.filter((order) => order.status === "Delivered").length;
  const totalOrderPlaced = orders.filter((order) => order.status === "Order Placed").length;

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={`text-sm font-medium ${growthData.revenue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {growthData.revenue >= 0 ? '↑' : '↓'} {Math.abs(growthData.revenue)}%
            </div>
          </div>
          <h2 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h2>
          <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-green-500">
              {totalDelivered} of {totalOrders}
            </div>
          </div>
          <h2 className="text-gray-500 text-sm font-medium mb-2">Delivered Orders</h2>
          <p className="text-2xl font-bold text-gray-800">{((totalDelivered/totalOrders) * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className={`text-sm font-medium ${growthData.orders >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {growthData.orders >= 0 ? '↑' : '↓'} {Math.abs(growthData.orders)}%
            </div>
          </div>
          <h2 className="text-gray-500 text-sm font-medium mb-2">Total Orders</h2>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-500">Per Order</div>
          </div>
          <h2 className="text-gray-500 text-sm font-medium mb-2">Average Order Value</h2>
          <p className="text-2xl font-bold text-gray-800">₹{averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 md:col-span-2">
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
              <option value="weeklyRevenue">Weekly Revenue Trend</option>
              <option value="productPerformance">Top Performing Products</option>
              <option value="sizeDistribution">Size Distribution</option>
              <option value="categoryGrowth">Category Growth</option>
              <option value="subcategoryDistribution">Subcategory Distribution</option>
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
              {selectedChart === "weeklyRevenue" && (
                <Line 
                  data={chartData.weeklyRevenue} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { callbacks: { label: (context) => `₹${context.raw.toFixed(2)}` } }
                    },
                    scales: { y: { beginAtZero: true } }
                  }}
                />
              )}
              {selectedChart === "productPerformance" && (
                <Bar 
                  data={chartData.productPerformance}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { callbacks: { label: (context) => `₹${context.raw.toFixed(2)}` } }
                    },
                    scales: { y: { beginAtZero: true } }
                  }}
                />
              )}
              {selectedChart === "sizeDistribution" && (
                <Doughnut 
                  data={chartData.sizeDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right' }
                    }
                  }}
                />
              )}
              {selectedChart === "categoryGrowth" && (
                <Line 
                  data={chartData.categoryGrowth}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' }
                    },
                    scales: { y: { beginAtZero: true } }
                  }}
                />
              )}
              {selectedChart === "subcategoryDistribution" && (
                <Pie 
                  data={chartData.subcategoryDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right' },
                      title: {
                        display: true,
                        text: 'Sales by Subcategory'
                      }
                    }
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

        <div className="bg-white shadow-lg rounded-xl p-6">
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
