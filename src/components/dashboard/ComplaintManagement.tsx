import React, { useMemo, useState } from "react";
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

import useGetAllComplaints, {
  Complaint as SanityComplaint,
} from "../../api-hooks/useGetAllComplaints";
// If your hook doesn't export the type, you can:
// import useGetAllComplaints from "../../hooks/useGetAllComplaints";

const ComplaintManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const [selectedComplaint, setSelectedComplaint] =
    useState<SanityComplaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ✅ real data from Sanity
  // Hook supports: (search, selectedCategory). We use it for search only.
  const { complaintList, loading, error } = useGetAllComplaints(searchTerm, "");

  // ✅ If you want category filtering too later, you can pass selectedCategory in place of ""
  // and add a categoryFilter select UI.

  const normalize = (v?: string) => (v || "").trim().toLowerCase();

  const toUiStatus = (
    raw?: string,
  ): "pending" | "in_progress" | "completed" | "rejected" | "unknown" => {
    const s = normalize(raw);
    if (!s) return "pending";
    if (
      s.includes("completed") ||
      s.includes("resolved") ||
      s.includes("closed") ||
      s.includes("مكتمل") ||
      s.includes("مكتملة") ||
      s.includes("مغلق") ||
      s.includes("محلول") ||
      s.includes("محلولة")
    )
      return "completed";
    if (s.includes("rejected") || s.includes("مرفوض")) return "rejected";
    if (
      s.includes("in_progress") ||
      s.includes("progress") ||
      s.includes("قيد") ||
      s.includes("معالجة")
    )
      return "in_progress";
    if (
      s.includes("pending") ||
      s.includes("open") ||
      s.includes("new") ||
      s.includes("معلق") ||
      s.includes("قيد الانتظار")
    )
      return "pending";
    return "unknown";
  };

  const toUiPriority = (
    raw?: string,
  ): "low" | "medium" | "high" | "unknown" => {
    const p = normalize(raw);
    if (p === "high" || p.includes("عاجل") || p.includes("مرتفع"))
      return "high";
    if (p === "medium" || p.includes("متوسط")) return "medium";
    if (p === "low" || p.includes("عادي") || p.includes("منخفض")) return "low";
    return "unknown";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <AlertTriangle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "in_progress":
        return "قيد المعالجة";
      case "completed":
        return "مكتملة";
      case "rejected":
        return "مرفوضة";
      default:
        return "غير محدد";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "عاجل";
      case "medium":
        return "متوسط";
      case "low":
        return "عادي";
      default:
        return "غير محدد";
    }
  };

  const formatDate = (iso?: string) => (iso ? iso : "-");

  // ✅ map Sanity complaints into UI fields
  const uiComplaints = useMemo(() => {
    return complaintList.map((c) => {
      const uiStatus = toUiStatus(c.complaint_status);
      const uiPriority = toUiPriority(c.priority);

      return {
        _id: c._id,
        idShort: c._id.slice(0, 8),
        title: c.complaint || "—",
        type: c.complaint_category || "—",
        location: c.complaint_place || "—",
        description: c.complaint_description || "—",
        status: uiStatus,
        priority: uiPriority,
        submittedBy: c.complaint_name || "—",
        phone: c.complaint_person_nbr || "—",
        date: c.complaint_date || "",
        images: c.imageUrls || [],
        raw: c,
      };
    });
  }, [complaintList]);

  // ✅ apply status/priority filters on top of hook search
  const filteredComplaints = useMemo(() => {
    return uiComplaints.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || c.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [uiComplaints, statusFilter, priorityFilter]);

  const pendingCount = useMemo(
    () => uiComplaints.filter((c) => c.status === "pending").length,
    [uiComplaints],
  );

  const handleStatusChange = (_complaintId: string, _newStatus: string) => {
    // ⚠️ Without a backend token, you cannot safely patch Sanity from the browser.
    // Also: your current Sanity "Complaints" schema has no "assignee" or "notes".
    toast(
      "تغيير الحالة يحتاج حقل واضح في Sanity + تحديث آمن (يفضل عبر Backend).",
      {
        icon: "ℹ️",
      },
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الشكاوى</h1>
          <p className="text-gray-600 mt-1">
            {loading
              ? "جاري التحميل..."
              : `إجمالي الشكاوى: ${uiComplaints.length} | المعلقة: ${pendingCount}`}
          </p>
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الشكاوى..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in_progress">قيد المعالجة</option>
            <option value="completed">مكتملة</option>
            <option value="rejected">مرفوضة</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الأولويات</option>
            <option value="high">عاجل</option>
            <option value="medium">متوسط</option>
            <option value="low">عادي</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="divide-y divide-gray-200">
          {loading && filteredComplaints.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              جاري تحميل الشكاوى...
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <div
                key={c._id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                      <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {c.idShort}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          c.priority,
                        )}`}
                      >
                        {getPriorityLabel(c.priority)}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor(
                          c.status,
                        )}`}
                      >
                        {getStatusIcon(c.status)}
                        <span>{getStatusLabel(c.status)}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {c.title}
                    </h3>

                    <div className="text-sm text-gray-600 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                        {c.type}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {c.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 ml-1" />
                        {c.location}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 ml-1" />
                        {c.submittedBy}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        {formatDate(c.date)}
                      </div>
                    </div>

                    {/* show number of images if any */}
                    {c.images.length > 0 && (
                      <div className="mt-2 text-xs text-blue-600">
                        عدد الصور: {c.images.length}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => {
                        setSelectedComplaint(c.raw);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* Status select (UI only unless you add secure patching) */}
                    <div className="relative">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleStatusChange(c._id, e.target.value)
                        }
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="in_progress">قيد المعالجة</option>
                        <option value="completed">مكتملة</option>
                        <option value="rejected">مرفوضة</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredComplaints.length === 0 && (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد شكاوى
            </h3>
            <p className="text-gray-600">
              لا توجد شكاوى تطابق معايير البحث الحالية
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    تفاصيل الشكوى {selectedComplaint._id.slice(0, 8)}
                  </h2>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        toUiPriority(selectedComplaint.priority),
                      )}`}
                    >
                      {getPriorityLabel(
                        toUiPriority(selectedComplaint.priority),
                      )}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        toUiStatus(selectedComplaint.complaint_status),
                      )}`}
                    >
                      {getStatusLabel(
                        toUiStatus(selectedComplaint.complaint_status),
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="إغلاق"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedComplaint.complaint || "—"}
                </h3>
                <p className="text-gray-600">
                  {selectedComplaint.complaint_description || "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    معلومات الشكوى
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        النوع:
                      </span>
                      <span>{selectedComplaint.complaint_category || "—"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        الموقع:
                      </span>
                      <span>{selectedComplaint.complaint_place || "—"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        التاريخ:
                      </span>
                      <span>
                        {formatDate(selectedComplaint.complaint_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    معلومات المشتكي
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        الاسم:
                      </span>
                      <span>{selectedComplaint.complaint_name || "—"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        الهاتف:
                      </span>
                      <span>
                        {selectedComplaint.complaint_person_nbr || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              {selectedComplaint.imageUrls?.length ? (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">الصور</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedComplaint.imageUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                        title="فتح الصورة"
                      >
                        <img
                          src={url}
                          alt={`complaint-${idx}`}
                          className="h-28 w-full object-cover rounded-lg border"
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  إغلاق
                </button>

                {/* UI-only button */}
                <button
                  onClick={() =>
                    toast(
                      "إضافة ملاحظة تحتاج حقل notes في Sanity + تحديث آمن (Backend).",
                      {
                        icon: "ℹ️",
                      },
                    )
                  }
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  إضافة ملاحظة
                </button>
              </div>

              <div className="text-xs text-gray-500">
                ملاحظة: لتغيير الحالة/إضافة ملاحظة من الواجهة، الأفضل إضافة حقول
                مثل <span className="font-mono">assigned_to</span> و{" "}
                <span className="font-mono">notes</span> ثم تنفيذ تحديث (patch)
                بشكل آمن.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
