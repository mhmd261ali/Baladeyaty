import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Calendar,
  Users,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

// ✅ real data hooks
import useGetAllComplaints from "../../api-hooks/useGetAllComplaints";
import useGetAllSuggestions from "../../api-hooks/useGetAllSuggestions";

const DashboardOverview = () => {
  // ✅ fetch real data (no filters)
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

  const loading = complaintsLoading || suggestionsLoading;
  const error = complaintsError || suggestionsError;

  // ✅ derive "recent" lists (latest 5)
  const recentComplaints = useMemo(
    () => complaintList.slice(0, 5),
    [complaintList],
  );
  const recentSuggestions = useMemo(
    () => suggestionList.slice(0, 5),
    [suggestionList],
  );

  // ✅ helpers to map your schema to UI fields
  const formatDate = (iso?: string) => (iso ? iso : "-");

  const normalize = (v?: string) => (v || "").trim().toLowerCase();

  // ⚠️ You didn't define exact allowed values for complaint_status.
  // These helpers try to handle Arabic + English variants.
  const isResolved = (status?: string) => {
    const s = normalize(status);
    return (
      s.includes("resolved") ||
      s.includes("completed") ||
      s.includes("closed") ||
      s.includes("done") ||
      s.includes("مكتمل") ||
      s.includes("مكتملة") ||
      s.includes("منجز") ||
      s.includes("تم") ||
      s.includes("مغلق") ||
      s.includes("محلول") ||
      s.includes("محلولة")
    );
  };

  const isPending = (status?: string) => {
    const s = normalize(status);
    return (
      s === "" ||
      s.includes("pending") ||
      s.includes("open") ||
      s.includes("new") ||
      s.includes("in_progress") ||
      s.includes("progress") ||
      s.includes("قيد") ||
      s.includes("معلق") ||
      s.includes("معلّق") ||
      s.includes("جديد")
    );
  };

  const totalComplaints = complaintList.length;
  const resolvedComplaints = complaintList.filter((c) =>
    isResolved(c.complaint_status),
  ).length;
  const pendingComplaints = complaintList.filter(
    (c) => isPending(c.complaint_status) && !isResolved(c.complaint_status),
  ).length;

  const totalSuggestions = suggestionList.length;

  const resolutionRate =
    totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 0;

  const getStatusLabel = (status: string) => {
    const s = normalize(status);
    if (isResolved(s)) return "مكتملة";
    if (
      s.includes("in_progress") ||
      s.includes("progress") ||
      s.includes("قيد المعالجة")
    )
      return "قيد المعالجة";
    if (
      s.includes("pending") ||
      s.includes("open") ||
      s.includes("معلق") ||
      s.includes("قيد الانتظار")
    )
      return "قيد الانتظار";
    return status || "غير محدد";
  };

  const getStatusColor = (status: string) => {
    const s = normalize(status);
    if (isResolved(s)) return "bg-green-100 text-green-800";
    if (
      s.includes("in_progress") ||
      s.includes("progress") ||
      s.includes("قيد")
    )
      return "bg-blue-100 text-blue-800";
    if (s.includes("pending") || s.includes("open") || s.includes("معلق"))
      return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority?: string) => {
    const p = normalize(priority);
    if (p === "high" || p.includes("عاجل") || p.includes("مرتفع"))
      return "bg-red-100 text-red-800";
    if (p === "medium" || p.includes("متوسط"))
      return "bg-yellow-100 text-yellow-800";
    if (p === "low" || p.includes("عادي") || p.includes("منخفض"))
      return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPriorityLabel = (priority?: string) => {
    const p = normalize(priority);
    if (p === "high") return "عاجل";
    if (p === "medium") return "متوسط";
    if (p === "low") return "عادي";
    // if they already store Arabic labels, show as-is
    return priority || "غير محدد";
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
        <p className="text-blue-100">
          إليك نظرة سريعة على أحدث الأنشطة والإحصائيات
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div>
            <div className="font-semibold">تعذر تحميل البيانات</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}

      {/* Quick Actions / KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                الشكاوى المعلقة
              </h3>
              <p className="text-sm text-gray-600">تحتاج لمراجعة</p>
              <p className="text-2xl font-bold text-yellow-700 mt-2">
                {complaintsLoading ? "..." : pendingComplaints}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-green-100 p-3 rounded-lg">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                إجمالي المقترحات
              </h3>
              <p className="text-sm text-gray-600">المسجلة في النظام</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {suggestionsLoading ? "..." : totalSuggestions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">معدل الحل</h3>
              <p className="text-sm text-gray-600">إجمالي الشكاوى</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {complaintsLoading ? "..." : `${resolutionRate}%`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 ml-2 text-red-600" />
              أحدث الشكاوى
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {loading && recentComplaints.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                جاري تحميل الشكاوى...
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                لا توجد شكاوى حالياً.
              </div>
            ) : (
              recentComplaints.map((c) => (
                <div
                  key={c._id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <span className="text-sm font-mono text-gray-500 truncate">
                          {c._id.slice(0, 8)}
                        </span>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            c.priority,
                          )}`}
                        >
                          {getPriorityLabel(c.priority)}
                        </span>
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1 truncate">
                        {c.complaint || "—"}
                      </h3>

                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {c.complaint_place || c.complaint_category || "—"}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 space-x-4 rtl:space-x-reverse">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 ml-1" />
                          {formatDate(c.complaint_date)}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 ml-1" />
                          {c.complaint_name || "—"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                        c.complaint_status || "",
                      )}`}
                    >
                      {getStatusLabel(c.complaint_status || "")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Link
              to="/dashboard/complaints"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              عرض جميع الشكاوى ←
            </Link>
          </div>
        </div>

        {/* Recent Suggestions */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Lightbulb className="h-5 w-5 ml-2 text-green-600" />
              أحدث المقترحات
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {loading && recentSuggestions.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                جاري تحميل المقترحات...
              </div>
            ) : recentSuggestions.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                لا توجد مقترحات حالياً.
              </div>
            ) : (
              recentSuggestions.map((s) => (
                <div
                  key={s._id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <span className="text-sm font-mono text-gray-500 truncate">
                          {s._id.slice(0, 8)}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {s.suggestion_category || "—"}
                        </span>
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1 truncate">
                        {s.suggestion || "—"}
                      </h3>

                      <div className="flex items-center text-xs text-gray-500 space-x-4 rtl:space-x-reverse">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 ml-1" />
                          {formatDate(s.suggestion_date)}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 ml-1" />
                          {s.suggestion_person_name || "—"}
                        </span>
                      </div>
                    </div>

                    {/* You don't have suggestion_status in schema, so we show a fixed badge */}
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 whitespace-nowrap">
                      جديد
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Link
              to="/dashboard/suggestions"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              عرض جميع المقترحات ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
