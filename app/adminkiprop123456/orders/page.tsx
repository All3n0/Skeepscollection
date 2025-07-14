'use client';

import { useState } from "react";
import { Eye, Search, Filter } from "lucide-react";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: string;
  total: number;
  date: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      customer: { name: "John Doe", email: "john@example.com", phone: "+1234567890" },
      items: [
        { name: "Abstract Waves Tee", quantity: 2, price: 25 },
        { name: "Canvas Tote Bag", quantity: 1, price: 20 },
      ],
      status: "completed",
      total: 70,
      date: "2024-01-15",
      shippingAddress: { street: "123 Main St", city: "New York", state: "NY", zip: "10001" },
    },
    {
      id: "ORD002",
      customer: { name: "Jane Smith", email: "jane@example.com", phone: "+1234567891" },
      items: [{ name: "Vintage Hoodie", quantity: 1, price: 45 }],
      status: "processing",
      total: 45,
      date: "2024-01-14",
      shippingAddress: { street: "456 Oak Ave", city: "Los Angeles", state: "CA", zip: "90210" },
    },
    {
      id: "ORD003",
      customer: { name: "Mike Johnson", email: "mike@example.com", phone: "+1234567892" },
      items: [{ name: "Canvas Tote Bag", quantity: 3, price: 20 }],
      status: "shipped",
      total: 60,
      date: "2024-01-13",
      shippingAddress: { street: "789 Pine Rd", city: "Chicago", state: "IL", zip: "60601" },
    },
    {
      id: "ORD004",
      customer: { name: "Sarah Wilson", email: "sarah@example.com", phone: "+1234567893" },
      items: [{ name: "Minimal Logo Tee", quantity: 1, price: 30 }],
      status: "pending",
      total: 30,
      date: "2024-01-12",
      shippingAddress: { street: "321 Elm St", city: "Houston", state: "TX", zip: "77001" },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "shipped":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "pending":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Manager</h1>
        <p className="text-gray-500">Track and manage customer orders</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 px-3 py-2 border rounded"
          />
        </div>
        <div className="flex items-center border px-2 py-1 rounded">
          <Filter className="h-4 w-4 mr-2 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Orders ({filteredOrders.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Items</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{order.id}</td>
                <td className="px-4 py-2">
                  <p>{order.customer.name}</p>
                  <p className="text-xs text-gray-500">{order.customer.email}</p>
                </td>
                <td className="px-4 py-2">
                  {order.items.map((item, i) => (
                    <p key={i}>{item.quantity}x {item.name}</p>
                  ))}
                </td>
                <td className="px-4 py-2">${order.total}</td>
                <td className="px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`text-xs rounded px-2 py-1 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-1.5 border rounded hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md max-w-2xl w-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Details - {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-1">Customer Info</h3>
                <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shipping Address</h3>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <table className="w-full text-sm border">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-3 py-2">Item</th>
                    <th className="text-left px-3 py-2">Qty</th>
                    <th className="text-left px-3 py-2">Price</th>
                    <th className="text-left px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2">${item.price}</td>
                      <td className="px-3 py-2">${item.quantity * item.price}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold border-t">
                    <td colSpan={3} className="px-3 py-2 text-right">Total</td>
                    <td className="px-3 py-2">${selectedOrder.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
