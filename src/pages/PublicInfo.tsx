import React, { useMemo, useState } from "react";
import {
  FileText,
  Calendar,
  Download,
  Eye,
  Search,
  ListFilter,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import useGetAllInfo from "../api-hooks/useGetAllBlogs"; // <-- from previous step
import type { Info } from "../types";

// If your fetch adds "documentUrl": document.asset->url, extend the type locally:
type InfoWithUrl = Info & { documentUrl?: string };

// --- Motion variants (typed, tween-based)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const listContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1, duration: 0.25 },
  },
};

// Optional helpers to color/label by category & status
const getCategoryLabel = (cat?: string) => {
  // Map your categories to Arabic labels if needed
  switch ((cat || "").toLowerCase()) {
    case "circular":
    case "تعميم":
      return "تعميم";
    case "project":
    case "مشروع":
      return "مشروع";
    case "announcement":
    case "إعلان":
      return "إعلان";
    default:
      return cat || "غير مصنّف";
  }
};

const getCategoryColor = (cat?: string) => {
  switch ((cat || "").toLowerCase()) {
    case "circular":
    case "تعميم":
      return "bg-sky-100 text-sky-800";
    case "project":
    case "مشروع":
      return "bg-emerald-100 text-emerald-800";
    case "announcement":
    case "إعلان":
      return "bg-violet-100 text-violet-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const getStatusLabel = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "active":
    case "جاري":
    case "جاري التنفيذ":
      return "جاري التنفيذ";
    case "completed":
    case "مكتمل":
      return "مكتمل";
    case "planning":
    case "قيد التخطيط":
      return "قيد التخطيط";
    default:
      return status || "";
  }
};

const getStatusColor = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "active":
    case "جاري":
    case "جاري التنفيذ":
      return "bg-amber-100 text-amber-800";
    case "completed":
    case "مكتمل":
      return "bg-emerald-100 text-emerald-800";
    case "planning":
    case "قيد التخطيط":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const PublicInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Hook: fetch from Sanity with typing
  const { infoList, loading, error } = useGetAllInfo(
    searchTerm,
    activeTab === "all" ? "" : activeTab
  );

  // Build tabs dynamically from categories in data
  const tabs: { id: string; label: string; count: number }[] = useMemo(() => {
    const categories = new Map<string, number>();
    (infoList as InfoWithUrl[]).forEach((i) => {
      const key = i.info_category || "غير مصنّف";
      categories.set(key, (categories.get(key) || 0) + 1);
    });

    const catTabs = Array.from(categories.entries()).map(([id, count]) => ({
      id,
      label: getCategoryLabel(id),
      count,
    }));

    const total = (infoList as InfoWithUrl[]).length;
    return [{ id: "all", label: "الكل", count: total }, ...catTabs];
  }, [infoList]);

  // Local search (title/description) + tab filter already applied by hook’s query on category
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (infoList as InfoWithUrl[]).filter((i) => {
      const inTitle = i.title?.toLowerCase().includes(term);
      const inDesc = i.description?.toLowerCase().includes(term);
      return !term || inTitle || inDesc;
    });
  }, [infoList, searchTerm]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-sm mb-4 shadow/50">
            <Sparkles className="h-4 w-4" /> أحدث المعلومات والوثائق
          </div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-fuchsia-100">
            <FileText className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            المعلومات والوثائق
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            تابع آخر الوثائق، التعاميم، المشاريع والإعلانات
          </p>
        </motion.div>

        {/* Search & counts */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="البحث في العناوين والوصف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <ListFilter className="h-4 w-4" />
              <span>
                <span className="font-semibold">النتائج:</span>{" "}
                {filtered.length}
              </span>
            </div>
          </div>
          {loading && <p className="mt-3 text-slate-500">...جاري التحميل</p>}
          {error && (
            <p className="mt-3 text-red-600">حدث خطأ أثناء الجلب: {error}</p>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 mb-8"
        >
          <div className="border-b border-slate-200">
            <nav className="flex overflow-auto px-3 sm:px-6">
              <ul className="flex gap-2 sm:gap-4 py-1">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition ${
                        activeTab === tab.id
                          ? "bg-gradient-to-l from-sky-600 to-fuchsia-600 text-white shadow"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs ${
                          activeTab === tab.id
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </motion.div>

        {/* Documents */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {filtered.map((doc) => (
            <motion.article key={doc._id} variants={fadeInUp}>
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {(doc as any).imageUrl && (
                      <div className="w-full md:w-40 shrink-0">
                        <img
                          src={(doc as any).imageUrl}
                          alt={(doc as any).imageAlt || doc.title}
                          className="w-full h-28 object-cover rounded-xl ring-1 ring-slate-200"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <h3 className="text-lg font-bold leading-tight text-slate-900">
                          {doc.title}
                        </h3>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              doc.info_category
                            )}`}
                          >
                            {getCategoryLabel(doc.info_category)}
                          </span>
                          {doc.info_status && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                doc.info_status
                              )}`}
                            >
                              {getStatusLabel(doc.info_status)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {doc.description}
                      </p>

                      <div className="flex items-center text-sm text-slate-500 mb-4">
                        <Calendar className="h-4 w-4 ml-2" />
                        {doc.info_date}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {(doc as InfoWithUrl).documentUrl && (
                          <a
                            href={(doc as InfoWithUrl).documentUrl}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                            عرض الملف
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}

          {filtered.length === 0 && !loading && (
            <motion.div variants={fadeInUp} className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-slate-600">
                لم يتم العثور على أي عناصر تطابق البحث الخاص بك
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PublicInfo;
