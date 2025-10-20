import React, { useMemo, useState } from "react";
import {
  FileText,
  Calendar,
  Download,
  Eye,
  Search,
  Filter,
  ListFilter,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

// --- Types
interface DocumentItem {
  id: string;
  title: string;
  type: "circular" | "project" | "announcement";
  date: string; // ISO
  summary: string;
  downloadUrl?: string;
  status?: "active" | "completed" | "planning";
}

type TabKey = "all" | "circular" | "project" | "announcement";

// --- Motion variants (typed, tween-based to avoid TS mismatches)
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

const PublicInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const documents: DocumentItem[] = [
    {
      id: "1",
      title: "تعميم بشأن تنظيم مواقف السيارات في المناطق التجارية",
      type: "circular",
      date: "2025-01-15",
      summary:
        "تعميم جديد لتنظيم استخدام مواقف السيارات في المناطق التجارية وتحديد الرسوم والأوقات المسموحة",
      downloadUrl: "#",
    },
    {
      id: "2",
      title: "مشروع تطوير الحديقة المركزية",
      type: "project",
      date: "2025-01-10",
      summary:
        "مشروع شامل لتطوير وتجديد الحديقة المركزية يشمل إضافة ألعاب أطفال وممرات مشي ومناطق جلوس",
      status: "active",
    },
    {
      id: "3",
      title: "إعلان عن مناقصة صيانة الطرق الداخلية",
      type: "announcement",
      date: "2025-01-08",
      summary:
        "إعلان عن طرح مناقصة عامة لصيانة وإصلاح الطرق الداخلية في الأحياء السكنية",
      downloadUrl: "#",
    },
    {
      id: "4",
      title: "تعميم بشأن تنظيف الشوارع والأرصفة",
      type: "circular",
      date: "2025-01-05",
      summary:
        "تعميم يوضح الجدولة الجديدة لتنظيف الشوارع والأرصفة والتزامات المواطنين",
      downloadUrl: "#",
    },
    {
      id: "5",
      title: "مشروع تحسين شبكة الإضاءة العامة",
      type: "project",
      date: "2025-01-01",
      summary:
        "مشروع لاستبدال وتحديث شبكة الإضاءة العامة بتقنية LED الموفرة للطاقة",
      status: "planning",
    },
    {
      id: "6",
      title: "إعلان عن المهرجان البلدي السنوي",
      type: "announcement",
      date: "2024-12-28",
      summary:
        "إعلان عن تنظيم المهرجان البلدي السنوي وفعالياته المتنوعة للمجتمع",
      downloadUrl: "#",
    },
  ];

  const getTypeLabel = (type: DocumentItem["type"]) => {
    switch (type) {
      case "circular":
        return "تعميم";
      case "project":
        return "مشروع";
      case "announcement":
        return "إعلان";
    }
  };

  const getTypeColor = (type: DocumentItem["type"]) => {
    switch (type) {
      case "circular":
        return "bg-sky-100 text-sky-800";
      case "project":
        return "bg-emerald-100 text-emerald-800";
      case "announcement":
        return "bg-violet-100 text-violet-800";
    }
  };

  const getStatusLabel = (status?: DocumentItem["status"]) => {
    switch (status) {
      case "active":
        return "جاري التنفيذ";
      case "completed":
        return "مكتمل";
      case "planning":
        return "قيد التخطيط";
      default:
        return "";
    }
  };

  const getStatusColor = (status?: DocumentItem["status"]) => {
    switch (status) {
      case "active":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "planning":
        return "bg-sky-100 text-sky-800";
      default:
        return "";
    }
  };

  const tabs: { id: TabKey; label: string; count: number }[] = useMemo(
    () => [
      { id: "all", label: "الكل", count: documents.length },
      {
        id: "circular",
        label: "التعاميم",
        count: documents.filter((d) => d.type === "circular").length,
      },
      {
        id: "project",
        label: "المشاريع",
        count: documents.filter((d) => d.type === "project").length,
      },
      {
        id: "announcement",
        label: "الإعلانات",
        count: documents.filter((d) => d.type === "announcement").length,
      },
    ],
    [documents]
  );

  const filteredDocuments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesTab = activeTab === "all" || doc.type === activeTab;
      const inTitle = doc.title.toLowerCase().includes(term);
      const inSummary = doc.summary.toLowerCase().includes(term);
      return matchesTab && (!term || inTitle || inSummary);
    });
  }, [activeTab, searchTerm, documents]);

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
            <Sparkles className="h-4 w-4" /> أحدث التعاميم والمشاريع
          </div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-fuchsia-100">
            <FileText className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            التعاميم والمشاريع
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            تابع آخر التعاميم والمشاريع والإعلانات الخاصة بالبلدية
          </p>
        </motion.div>

        {/* Search & quick filters */}
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
                placeholder="البحث في التعاميم والمشاريع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <ListFilter className="h-4 w-4" />
              <span>
                <span className="font-semibold">النتائج:</span>{" "}
                {filteredDocuments.length}
              </span>
            </div>
          </div>
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
          {filteredDocuments.map((doc) => (
            <motion.article key={doc.id} variants={fadeInUp}>
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <h3 className="text-lg font-bold leading-tight text-slate-900">
                          {doc.title}
                        </h3>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              doc.type
                            )}`}
                          >
                            {getTypeLabel(doc.type)}
                          </span>
                          {doc.status && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                doc.status
                              )}`}
                            >
                              {getStatusLabel(doc.status)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {doc.summary}
                      </p>

                      <div className="flex items-center text-sm text-slate-500 mb-4">
                        <Calendar className="h-4 w-4 ml-2" />
                        {new Date(doc.date).toLocaleDateString("ar-SA")}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-medium hover:brightness-110">
                          <Eye className="h-4 w-4" />
                          عرض التفاصيل
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        {doc.downloadUrl && (
                          <a
                            href={doc.downloadUrl}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                          >
                            <Download className="h-4 w-4" />
                            تحميل الملف
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}

          {filteredDocuments.length === 0 && (
            <motion.div variants={fadeInUp} className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-slate-600">
                لم يتم العثور على أي تعاميم أو مشاريع تطابق البحث الخاص بك
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PublicInfo;
