'use client';
import { useEffect, useState } from "react";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
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
  product: string;
  status: string;
  amount: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

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
                <p className="font-medium text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500 font-semibold">{order.customer}</p>
                <p className="text-sm text-red-600">{order.product}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
                <p className="font-medium text-gray-900">{order.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
