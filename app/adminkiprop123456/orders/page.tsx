'use client';

import { useEffect, useState } from "react";
import { Eye, Search, Filter, CheckCircle, XCircle, Trash2, RotateCw, ChevronDown, ChevronUp } from "lucide-react";

type Order = {
  order_id: number;
  customer_name: string;
  customer_email: string;
  instagram_handle?: string;
  completed: boolean;
  created_at: string;
  items: {
    product_name: string;
    price: number;
    quantity: number;
  }[];
};

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    field: 'date' | 'total' | 'name';
    order: 'asc' | 'desc';
  }>({ field: 'date', order: 'desc' });

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5555/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        setIsLoading(false);
      });
  }, []);

  const toggleComplete = (orderId: number, currentStatus: boolean) => {
    const endpoint = currentStatus ? "uncomplete" : "complete";
    fetch(`http://localhost:5555/orders/${orderId}/${endpoint}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? { ...order, completed: !currentStatus }
              : order
          )
        );
      })
      .catch((err) => console.error("Failed to update order status:", err));
  };

  const handleDelete = (orderId: number) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    fetch(`http://localhost:5555/orders/${orderId}`, {
      method: "DELETE",
    })
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.order_id !== orderId)
        );
      })
      .catch((err) => console.error("Failed to delete order:", err));
  };
  
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      String(order.order_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && order.completed) ||
      (statusFilter === "pending" && !order.completed);

    return matchSearch && matchStatus;
  });

const sortedOrders = [...filteredOrders].sort((a, b) => {
  if (sortConfig.field === 'date') {
    return sortConfig.order === 'asc' ? a.order_id - b.order_id : b.order_id - a.order_id;
  } else if (sortConfig.field === 'total') {
    const totalA = a.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalB = b.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return sortConfig.order === 'asc' ? totalA - totalB : totalB - totalA;
  } else if (sortConfig.field === 'name') {
    return sortConfig.order === 'asc'
      ? a.customer_name.localeCompare(b.customer_name)
      : b.customer_name.localeCompare(a.customer_name);
  }
  return 0;
});
  const handleSort = (field: 'date' | 'total' | 'name') => {
    if (sortConfig.field === field) {
      setSortConfig({
        field,
        order: sortConfig.order === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({
        field,
        order: 'desc'
      });
    }
  };

  const getSortIcon = (field: 'date' | 'total' | 'name') => {
    if (sortConfig.field !== field) return <ChevronDown className="h-4 w-4 opacity-50" />;
    return sortConfig.order === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getStatusBadge = (completed: boolean) => {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        completed 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800"
      }`}>
        {completed ? (
          <>
            <CheckCircle className="h-3 w-3" />
            Completed
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3" />
            Pending
          </>
        )}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <RotateCw className="h-5 w-5 text-red-600" />
          Orders Manager
        </h1>
        <p className="text-gray-500">Track and manage customer orders</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-red-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders by ID, name or email..."
            className="block text-gray-700 w-full pl-10 pr-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-red-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none text-gray-700 pl-10 pr-8 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSort('date')}
            className={`flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
              sortConfig.field === 'date'
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">Date</span>
            {getSortIcon('date')}
          </button>
          
          <button
            onClick={() => handleSort('total')}
            className={`flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
              sortConfig.field === 'total'
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">Total</span>
            {getSortIcon('total')}
          </button>
          
          <button
            onClick={() => handleSort('name')}
            className={`flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
              sortConfig.field === 'name'
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">Name</span>
            {getSortIcon('name')}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold underline decoration-red-600 underline-offset-6 text-gray-900">
            Orders <span className="text-red-500">({filteredOrders.length})</span>
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <RotateCw className="h-6 w-6 animate-spin mx-auto text-red-600" />
            <p className="mt-2">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No orders found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.map((order) => {
                  const total = order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  );
                  return (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">{order.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i}>{item.quantity}x {item.product_name}</div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-gray-500">+{order.items.length - 2} more</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Ksh {total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.completed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleComplete(order.order_id, order.completed)}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                            order.completed
                              ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {order.completed ? "Undo" : "Complete"}
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.order_id)}
                          className="inline-flex items-center p-1.5 border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
                  Order #{selectedOrder.order_id}
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
                    <p className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="flex items-center space-x-2 text-red-600"><span className="font-medium text-gray-700">Instagram:</span> {selectedOrder.instagram_handle || "N/A"}</span>
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
                      <span className="flex items-center space-x-2 text-red-600"><span className="font-medium text-gray-700">Total:</span> Ksh {selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
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
                    Ksh {selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
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
              <button
                onClick={() => {
                  toggleComplete(selectedOrder.order_id, selectedOrder.completed);
                  setSelectedOrder(null);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white flex items-center ${
                  selectedOrder.completed
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {selectedOrder.completed ? (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mark as Pending
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Completed
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;