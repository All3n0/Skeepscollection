'use client';

import { useEffect, useState } from "react";
import { Search, Filter, Trash2, RotateCw, ChevronDown, ChevronUp, Mail, Phone, MessageSquare, Type } from "lucide-react";

type CustomOrder = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  project_type: string;
  message: string;
  created_at: string;
};

const CustomOrdersManager = () => {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recent: 0 });
  const [sortConfig, setSortConfig] = useState<{
    field: 'date' | 'name' | 'type';
    order: 'asc' | 'desc';
  }>({ field: 'date', order: 'desc' });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = () => {
    setIsLoading(true);
    fetch("https://skeepsserver-production.up.railway.app/custom-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch custom orders:", err);
        setIsLoading(false);
      });
  };

  const fetchStats = () => {
    fetch("https://skeepsserver-production.up.railway.app/custom-orders/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
  };

  const handleDelete = (orderId: number) => {
    if (!window.confirm("Are you sure you want to delete this custom order?")) return;

    fetch(`https://skeepsserver-production.up.railway.app/custom-orders/${orderId}`, {
      method: "DELETE",
    })
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        fetchStats(); // Refresh stats after deletion
      })
      .catch((err) => console.error("Failed to delete custom order:", err));
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(order.id).includes(searchLower) ||
      order.name.toLowerCase().includes(searchLower) ||
      order.email.toLowerCase().includes(searchLower) ||
      (order.phone && order.phone.toLowerCase().includes(searchLower)) ||
      order.project_type.toLowerCase().includes(searchLower) ||
      order.message.toLowerCase().includes(searchLower));
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortConfig.field === 'date') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortConfig.order === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.field === 'name') {
      return sortConfig.order === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.field === 'type') {
      return sortConfig.order === 'asc'
        ? a.project_type.localeCompare(b.project_type)
        : b.project_type.localeCompare(a.project_type);
    }
    return 0;
  });

  const handleSort = (field: 'date' | 'name' | 'type') => {
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

  const getSortIcon = (field: 'date' | 'name' | 'type') => {
    if (sortConfig.field !== field) return <ChevronDown className="h-4 w-4 opacity-50" />;
    return sortConfig.order === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <RotateCw className="h-5 w-5 text-red-600" />
          Custom Orders Manager
        </h1>
        <p className="text-gray-500">Manage custom project inquiries from clients</p>
        <div className="flex gap-4 pt-2">
          <div className="bg-white p-3 rounded-lg shadow border border-gray-200 flex-1 max-w-xs">
            <h3 className="text-sm font-medium text-gray-500">Total Inquiries</h3>
            <p className="text-2xl font-bold text-red-600">{stats.total}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow border border-gray-200 flex-1 max-w-xs">
            <h3 className="text-sm font-medium text-gray-500">Recent (7 days)</h3>
            <p className="text-2xl font-bold text-red-600">{stats.recent}</p>
          </div>
        </div>
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
            placeholder="Search custom orders..."
            className="block text-gray-700 w-full pl-10 pr-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          />
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
          
          <button
            onClick={() => handleSort('type')}
            className={`flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
              sortConfig.field === 'type'
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">Type</span>
            {getSortIcon('type')}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold underline decoration-red-600 underline-offset-6 text-gray-900">
            Custom Orders <span className="text-red-500">({filteredOrders.length})</span>
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <RotateCw className="h-6 w-6 animate-spin mx-auto text-red-600" />
            <p className="mt-2">Loading custom orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No custom orders found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {order.email}
                      </div>
                      {order.phone && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {order.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Type className="h-4 w-4 text-red-500" />
                        {order.project_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="inline-flex items-center p-1.5 border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
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
                <MessageSquare className="h-5 w-5 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Custom Order #{selectedOrder.id}
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
                {/* Client Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-2">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Client Information</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-5 w-5 text-red-600">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Name</p>
                        <p className="text-gray-900">{selectedOrder.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-5 w-5 text-red-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Email</p>
                        <p className="text-gray-900">{selectedOrder.email}</p>
                      </div>
                    </div>
                    {selectedOrder.phone && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-5 w-5 text-red-600">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Phone</p>
                          <p className="text-gray-900">{selectedOrder.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-2">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Project Details</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-5 w-5 text-red-600">
                        <Type className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Project Type</p>
                        <p className="text-gray-900">{selectedOrder.project_type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-5 w-5 text-red-600">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Submitted</p>
                        <p className="text-gray-900">{formatDate(selectedOrder.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Message */}
              <div>
                <div className="flex items-center space-x-2 border-b pb-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-gray-900">Client's Message</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{selectedOrder.message}</p>
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
              <a
                href={`mailto:${selectedOrder.email}?subject=Regarding your ${selectedOrder.project_type} inquiry`}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrdersManager;