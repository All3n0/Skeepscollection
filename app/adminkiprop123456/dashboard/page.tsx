'use client';
import { useEffect, useState } from "react";
import { Eye, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import axios from "axios";

interface StatData {
  total_products: number;
  total_orders: number;
  total_customers: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  products: string[]; // Changed from product to products array
  status: string;
  amount: string;
  items: { product_name: string; quantity: number; price: number }[]; // Added items array for modal
  customer_name: string;
  customer_email: string;
  created_at: string;
  completed: boolean;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get("http://127.0.0.1:5555/dashboard/stats");
        const ordersRes = await axios.get("http://127.0.0.1:5555/dashboard/recent-orders");
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "processing": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "shipped": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusBadge = (completed: boolean) => {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        completed 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800"
      }`}>
        {completed ? "Completed" : "Pending"}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold text-red-600 underline underline-offset-6">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Products", value: stats.total_products, description: "Active designs", icon: Package },
            { title: "Total Orders", value: stats.total_orders, description: "This month", icon: ShoppingCart },
            { title: "Revenue", value: `Ksh ${stats.revenue.toFixed(2)}`, description: "This month", icon: TrendingUp },
            { title: "Customers", value: stats.total_customers, description: "Active users", icon: Users }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg hover:shadow-red-300">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{stat.title}</h3>
                  <Icon className="h-4 w-4 text-red-400 " />
                </div>
                <div className="text-2xl font-bold text-red-600">{stat.value}</div>
                <p className="text-xs text-gray-500 font-medium">{stat.description}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-500">Latest orders from your customers</p>
        </div>
        <div className="p-4 space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg hover:shadow-red-300">
              <div className="space-y-1">
                <p className="font-medium text-gray-900">#{order.id}</p>
                <p className="text-sm text-gray-500 font-semibold">{order.customer_name}</p>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                  {order.items.length > 0 && (
                    <span className="text-gray-500">• {order.items[0].product_name}</span>
                  )}
                  {order.items.length > 1 && (
                    <span className="text-xs text-gray-500">+{order.items.length - 1} more</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
                <p className="font-medium text-gray-900">{order.amount}</p>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  title="View order details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-2">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Customer Information</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="flex items-center space-x-2 text-red-600"><span className="font-medium text-gray-700">Name:</span> {selectedOrder.customer_name}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="flex items-center space-x-2 text-red-600"><span className="font-medium text-gray-700">Email:</span> {selectedOrder.customer_email}</span>
                    </p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-2">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Order Information</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="flex items-center space-x-2 text-red-600"> <span className="font-medium text-gray-700">Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><span className="font-medium text-gray-700">Status:</span> {getStatusBadge(selectedOrder.completed)}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="flex items-center space-x-2 text-red-600"><span className="font-medium text-gray-700">Total:</span> {selectedOrder.amount}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center space-x-2 border-b pb-2 mb-4">
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h4 className="font-medium text-gray-900">Order Items</h4>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            PRODUCT
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            QTY
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            PRICE
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            TOTAL
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.product_name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Ksh {item.price}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Ksh {item.quantity * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <svg className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    ORDER TOTAL
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {selectedOrder.amount}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;