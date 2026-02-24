import React, { useMemo, useState } from "react";
import {
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Lightbulb,
} from "lucide-react";
import toast from "react-hot-toast";

import useGetAllSuggestions, {
  Suggestion as SanitySuggestion,
} from "../../api-hooks/useGetAllSuggestions";
// If your hook doesn't export the type, you can:
// import useGetAllSuggestions from "../../hooks/useGetAllSuggestions";

const SuggestionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [selectedSuggestion, setSelectedSuggestion] =
    useState<SanitySuggestion | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ✅ fetch real data from Sanity (search + category)
  const selectedCategory = categoryFilter === "all" ? "" : categoryFilter;
  const {
    suggestionList: suggestions,
    loading,
    error,
  } = useGetAllSuggestions(searchTerm, selectedCategory);

  // ✅ categories from real data (fallback if empty)
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const s of suggestions) {
      if (s.suggestion_category) set.add(s.suggestion_category);
    }
    const arr = Array.from(set);
    return arr.length
      ? arr
      : [
          "البنية التحتية",
          "الخدمات الرقمية",
          "الأمن والسلامة",
          "الترفيه والثقافة",
          "البيئة والنظافة",
          "النقل والمواصلات",
        ];
  }, [suggestions]);

  // ⚠️ Your Suggestion schema currently has NO status, votes, reviewedBy, notes.
  // We'll show "جديد" as a default status.
  const getStatusIcon = () => <Clock className="h-4 w-4" />;
  const getStatusLabel = () => "جديد";
  const getStatusColor = () => "bg-purple-100 text-purple-800";

  // Since we don't have status in schema, these cards become:
  const total = suggestions.length;

  const handleStatusChange = (
    _suggestionId: string,
    _action: "approved" | "rejected",
  ) => {
    // No status field in schema => can't really update status in Sanity from here.
    toast("لا يمكن تغيير الحالة حالياً لأن حقل الحالة غير موجود في Sanity.", {
      icon: "ℹ️",
    });
  };

  const formatDate = (iso?: string) => (iso ? iso : "-");

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المقترحات</h1>
          <p className="text-gray-600 mt-1">
            {loading ? "جاري التحميل..." : `إجمالي المقترحات: ${total}`}
          </p>
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      </div>

      {/* Stats Cards (real but limited by schema) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">المقترحات</p>
              <p className="text-lg font-bold text-gray-900">
                {loading ? "..." : total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <Lightbulb className="h-5 w-5 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">الفئات</p>
              <p className="text-lg font-bold text-gray-900">
                {loading ? "..." : categories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">
                مرسلو المقترحات
              </p>
              <p className="text-lg font-bold text-gray-900">
                {loading
                  ? "..."
                  : new Set(
                      suggestions
                        .map((s) => s.suggestion_person_name || "")
                        .filter(Boolean),
                    ).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">الأحدث</p>
              <p className="text-lg font-bold text-gray-900">
                {loading ? "..." : formatDate(suggestions[0]?.suggestion_date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المقترحات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">جميع الفئات</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="divide-y divide-gray-200">
          {loading && suggestions.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              جاري تحميل المقترحات...
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div
                key={suggestion._id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                      <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {suggestion._id.slice(0, 8)}
                      </span>

                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        {suggestion.suggestion_category || "—"}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor()}`}
                      >
                        {getStatusIcon()}
                        <span>{getStatusLabel()}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {suggestion.suggestion || "—"}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {suggestion.suggestion_description || "—"}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="h-3 w-3 ml-1" />
                        {suggestion.suggestion_person_name || "—"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        {formatDate(suggestion.suggestion_date)}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 ml-1" />
                        {suggestion.suggestion_person_nbr || "—"}
                      </div>
                    </div>

                    {suggestion.suggestion_person_email && (
                      <div className="mt-2 text-xs text-gray-600">
                        البريد: {suggestion.suggestion_person_email}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => {
                        setSelectedSuggestion(suggestion);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* These buttons remain but won't actually update without a status field */}
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={() =>
                          handleStatusChange(suggestion._id, "approved")
                        }
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                        title="الموافقة"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(suggestion._id, "rejected")
                        }
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="الرفض"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && suggestions.length === 0 && (
          <div className="p-12 text-center">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد مقترحات
            </h3>
            <p className="text-gray-600">
              لا توجد مقترحات تطابق معايير البحث الحالية
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    تفاصيل المقترح {selectedSuggestion._id.slice(0, 8)}
                  </h2>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      {selectedSuggestion.suggestion_category || "—"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
                    >
                      {getStatusLabel()}
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
                  {selectedSuggestion.suggestion || "—"}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedSuggestion.suggestion_description || "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    معلومات المقترح
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        الفئة:
                      </span>
                      <span>
                        {selectedSuggestion.suggestion_category || "—"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        التاريخ:
                      </span>
                      <span>
                        {formatDate(selectedSuggestion.suggestion_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    معلومات المُرسل
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        الاسم:
                      </span>
                      <span>
                        {selectedSuggestion.suggestion_person_name || "—"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-28">
                        الهاتف:
                      </span>
                      <span>
                        {selectedSuggestion.suggestion_person_nbr || "—"}
                      </span>
                    </div>
                    {selectedSuggestion.suggestion_person_email && (
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-28">
                          البريد:
                        </span>
                        <span>
                          {selectedSuggestion.suggestion_person_email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  إغلاق
                </button>

                {/* Buttons stay as "UI only" until you add a status field */}
                <button
                  onClick={() =>
                    handleStatusChange(selectedSuggestion._id, "approved")
                  }
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  الموافقة
                </button>
                <button
                  onClick={() =>
                    handleStatusChange(selectedSuggestion._id, "rejected")
                  }
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  الرفض
                </button>
              </div>

              <div className="text-xs text-gray-500">
                ملاحظة: لتفعيل تغيير الحالة (موافق/مرفوض) يجب إضافة حقل{" "}
                <span className="font-mono">suggestion_status</span> في Sanity
                ثم تنفيذ تحديث (patch) للوثيقة.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionManagement;
