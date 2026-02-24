import React, { useMemo, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  MessageSquare,
  Lightbulb,
  Users,
  Settings,
  Clock,
  CheckCircle,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

import DashboardOverview from "../components/dashboard/DashboardOverview";
import ComplaintManagement from "../components/dashboard/ComplaintManagement";
import SuggestionManagement from "../components/dashboard/SuggestionManagement";
import UserManagement from "../components/dashboard/UserManagement";
import SystemSettings from "../components/dashboard/SystemSettings";

// ✅ your new hooks
import useGetAllComplaints from "../api-hooks/useGetAllComplaints";
import useGetAllSuggestions from "../api-hooks/useGetAllSuggestions";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  // ✅ sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ real data (no filters for the top stats)
  const {
    complaintList,
    loading: complaintsLoading,
    error: complaintsError,
  } = useGetAllComplaints("", "");

  const {
    suggestionList,
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useGetAllSuggestions("", "");

  const menuItems = useMemo(
    () => [
      { path: "/dashboard", icon: BarChart3, label: "نظرة عامة", exact: true },
      {
        path: "/dashboard/complaints",
        icon: MessageSquare,
        label: "إدارة الشكاوى",
      },
      {
        path: "/dashboard/suggestions",
        icon: Lightbulb,
        label: "إدارة المقترحات",
      },
      ...(user?.role === "supervisor"
        ? [
            {
              path: "/dashboard/users",
              icon: Users,
              label: "إدارة المستخدمين",
            },
            {
              path: "/dashboard/settings",
              icon: Settings,
              label: "إعدادات النظام",
            },
          ]
        : []),
    ],
    [user?.role],
  );

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  // ✅ derive real stats
  const totalComplaints = complaintList.length;

  const resolvedComplaints = complaintList.filter(
    (c) =>
      (c.complaint_status || "").toLowerCase().includes("حل") || // Arabic "حل"
      (c.complaint_status || "").toLowerCase().includes("resolved") ||
      (c.complaint_status || "").toLowerCase().includes("closed"),
  ).length;

  const pendingComplaints = complaintList.filter((c) => {
    const s = (c.complaint_status || "").toLowerCase();
    return (
      s.includes("معلق") || // Arabic "pending"
      s.includes("pending") ||
      s.includes("open") ||
      s.includes("new") ||
      s === ""
    );
  }).length;

  const totalSuggestions = suggestionList.length;

  // Optional: show loading/error state in stats
  const stats = [
    {
      label: "إجمالي الشكاوى",
      value: complaintsLoading ? "..." : String(totalComplaints),
      change: "",
      changeType: "increase" as const,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      label: "الشكاوى المحلولة",
      value: complaintsLoading ? "..." : String(resolvedComplaints),
      change: "",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "الشكاوى المعلقة",
      value: complaintsLoading ? "..." : String(pendingComplaints),
      change: "",
      changeType: "decrease" as const,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "إجمالي المقترحات",
      value: suggestionsLoading ? "..." : String(totalSuggestions),
      change: "",
      changeType: "increase" as const,
      icon: Lightbulb,
      color: "bg-purple-500",
    },
  ];

  // ✅ if you want to show a small warning banner when data fails
  const anyError = complaintsError || suggestionsError;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex">
        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity lg:hidden ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed z-50 h-full bg-white shadow-lg overflow-y-auto transition-all duration-300
            ${sidebarOpen ? "w-64" : "w-0 lg:w-16"}
          `}
          style={{ right: 0 }}
        >
          {/* Sidebar header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div
              className={`overflow-hidden transition-all ${sidebarOpen ? "w-auto" : "w-0 lg:w-auto"}`}
            >
              <h2
                className={`text-lg font-bold text-gray-900 whitespace-nowrap ${
                  sidebarOpen
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 lg:opacity-0 lg:w-0"
                }`}
              >
                لوحة التحكم
              </h2>
              <p
                className={`text-xs text-gray-600 mt-1 whitespace-nowrap ${
                  sidebarOpen
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 lg:opacity-0 lg:w-0"
                }`}
              >
                {user?.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen((s) => !s)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 text-gray-700"
              aria-label={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="mt-4 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium mb-1 transition-colors duration-200
                  ${
                    isActive(item.path, item.exact)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span
                  className={`transition-all overflow-hidden whitespace-nowrap ${
                    sidebarOpen
                      ? "opacity-100 w-auto"
                      : "opacity-0 w-0 lg:opacity-0 lg:w-0"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content wrapper */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "lg:mr-64" : "lg:mr-16"
          }`}
        >
          {/* Top bar (mobile) */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 text-gray-700"
            >
              <Menu className="h-5 w-5" />
              <span className="text-sm font-medium">القائمة</span>
            </button>
            <div className="text-sm font-semibold text-gray-900">
              لوحة التحكم
            </div>
          </div>

          {/* Error banner (optional) */}
          {anyError && location.pathname === "/dashboard" && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              تعذر تحميل الإحصائيات حالياً. {anyError}
            </div>
          )}

          {/* Header Stats (only on overview page) */}
          {location.pathname === "/dashboard" && (
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* removed "change" because we don't have previous-month data yet */}
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <TrendingUp className="h-4 w-4 ml-1 text-gray-400" />
                      <span>إحصائيات مباشرة من Sanity</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className="p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/complaints/*" element={<ComplaintManagement />} />
              <Route path="/suggestions/*" element={<SuggestionManagement />} />
              {user?.role === "supervisor" && (
                <>
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/settings" element={<SystemSettings />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
