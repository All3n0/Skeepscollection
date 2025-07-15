'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Home,
  MailQuestionMark
} from "lucide-react";
import { title } from "process";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Dummy auth check
  const isAuthenticated = true;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const navigationItems = [
    { title: "Dashboard", href: "/adminkiprop123456/dashboard", icon: LayoutDashboard, exact: true },
    { title: "Products", href: "/adminkiprop123456/products", icon: Package, badge: "100+" },
    { title: "Orders", href: "/adminkiprop123456/orders", icon: ShoppingCart, badge: "12" },
    {title: "Custom Orders", href: "/adminkiprop123456/customorders", icon: MailQuestionMark, badge: "5" },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const NavItems = () => (
    <div className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              active
                ? "bg-black text-white"
                : "hover:bg-gray-100 text-gray-800"
            }`}
          >
            <Icon className="h-5 w-5 text-red-600" />
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs bg-red-200 text-gray-800 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white lg:hidden">
        <div className="flex h-14 items-center px-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mr-2 p-2 rounded hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-red-600" />
          </button>
          <h1 className="text-xl font-semibold text-black">Admin Panel</h1>
        </div>

        {/* Mobile Sidebar */}
        {isOpen && (
          <div className="absolute top-14 left-0 w-72 h-[calc(100vh-56px)] bg-white border-r shadow-md z-50 p-6 flex flex-col">
            {/* <div className="border-b pb-4 mb-4">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-sm text-gray-500">Manage your store</p>
            </div> */}

            <nav className="flex-1">
              <NavItems />
            </nav>

            <div className="border-t pt-4 space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Back to Store</span>
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-left">
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 h-screen sticky top-0 border-r bg-gray-50">
          <div className="flex flex-col h-full p-6">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-gray-500">Manage your store</p>
            </div>

            <nav className="flex-1">
              <NavItems />
            </nav>

            <div className="border-t pt-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Back to Store</span>
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-left">
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
