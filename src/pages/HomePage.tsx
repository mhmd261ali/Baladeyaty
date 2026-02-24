import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Lightbulb,
  FileText,
  BarChart3,
  Users,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import useGetAllInfo from "../api-hooks/useGetAllBlogs";
import type { Info } from "../types";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
      // container-level can stay generic tween
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      // Use tween to avoid TS mismatch across different framer-motion versions
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const HomePage: React.FC = () => {
  const INFO_PREVIEW_LIMIT = 3; // 👈 change this number as you like

  // Simple fetch: no search, all categories
  const { infoList, loading, error } = useGetAllInfo("", "");

  // Take only the first N infos
  const latestInfos = useMemo(
    () => (infoList as Info[]).slice(0, INFO_PREVIEW_LIMIT),
    [infoList]
  );
  const services = [
    {
      icon: MessageSquare,
      title: "تقديم شكوى",
      description: "قدم شكواك بسهولة وتابع حالتها خطوة بخطوة.",
      link: "/complaint",
      badge: "خدمة سريعة",
      color: "from-rose-400 to-rose-600",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      icon: Lightbulb,
      title: "تقديم مقترح",
      description: "شارك أفكارك لتحسين الخدمات المحلية.",
      link: "/suggestion",
      badge: "نرحّب بالأفكار",
      color: "from-emerald-400 to-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: FileText,
      title: "التعاميم والمشاريع",
      description: "اطلع على آخر التعاميم والمشاريع الجارية.",
      link: "/info",
      badge: "مُحدّث باستمرار",
      color: "from-sky-400 to-sky-600",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    },
  ];

  const stats = [
    { label: "الشكاوى المُعالَجة", value: "1,245", icon: BarChart3 },
    { label: "المواطنون المستفيدون", value: "3,567", icon: Users },
    { label: "متوسط وقت الاستجابة", value: "2.5 يوم", icon: Clock },
  ];

  const steps = [
    {
      title: "قدّم الطلب",
      desc: "املأ النموذج ببضع نقرات وحدد الفئة المناسبة.",
    },
    {
      title: "تتبّع الحالة",
      desc: "استلم إشعارات فورية بكل تحديث جديد.",
    },
    {
      title: "احصل على الحل",
      desc: "يعمل فريقنا لمعالجة شكواك بأعلى كفاءة.",
    },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900"
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-300/30 to-sky-300/30 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-300/30 to-cyan-300/30 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-sm mb-6 shadow/50 shadow-slate-300">
              <Sparkles className="h-4 w-4" />
              <span>بلدية ذكية – خدمات رقمية بواجهة جديدة</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              مرحباً بك في{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-sky-600 to-fuchsia-600">
                منصّة بلديتك
              </span>
            </h1>
            <p className="mt-5 text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              نوفّر قناة موحّدة لتقديم الشكاوى والمقترحات والاطلاع على المشاريع
              مع تجربة استخدام سلسة وحديثة.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/complaint"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-rose-500 to-fuchsia-600 px-8 py-4 text-white font-semibold shadow-lg hover:brightness-105 transition"
              >
                ابدأ بتقديم شكوى
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/suggestion"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-slate-900 font-semibold shadow-lg hover:bg-slate-50 transition border border-slate-200"
              >
                قدّم مقترحًا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">الخدمات الأساسية</h2>
            <p className="mt-2 text-slate-600">
              اختر الخدمة المطلوبة للبدء فورًا
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((s, i) => (
              <motion.div key={i} variants={item}>
                <Link
                  to={s.link}
                  className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-xl"
                >
                  <div
                    className={`absolute inset-x-0 -top-1 h-1 bg-gradient-to-r ${s.color}`}
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div
                        className={`h-14 w-14 ${s.iconBg} rounded-xl flex items-center justify-center`}
                      >
                        <s.icon className={`h-7 w-7 ${s.iconColor}`} />
                      </div>
                      <span className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      {s.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      انتقل إلى الخدمة
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl font-bold mb-4">كيف تعمل المنصّة؟</h2>
              <p className="text-slate-600 mb-6">
                عملية مبسّطة وشفافة من بداية الطلب حتى الحل النهائي.
              </p>
              <ol className="space-y-4">
                {steps.map((st, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-l from-sky-500 to-cyan-600 text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{st.title}</h3>
                      <p className="text-slate-600">{st.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2"
            >
              <div className="relative rounded-3xl bg-gradient-to-br from-sky-50 to-cyan-50 p-1 shadow-lg">
                <div className="rounded-3xl bg-white p-6 lg:p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-600">دقّة البيانات</p>
                      <p className="text-2xl font-bold">99.9%</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-600">قنوات متاحة</p>
                      <p className="text-2xl font-bold">ويب / جوّال</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-600">دعم فني</p>
                      <p className="text-2xl font-bold">على مدار الساعة</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-600">الشفافية</p>
                      <p className="text-2xl font-bold">تتبّع مباشر</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 rounded-xl bg-emerald-500 text-white text-xs px-3 py-1 flex items-center gap-2 shadow-lg">
                  <ShieldCheck className="h-4 w-4" /> موثوق
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">أرقام تتحدث</h2>
            <p className="mt-2 text-slate-600">
              نفخر بالأثر الذي نُحدِثه في مجتمعنا
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={item} className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-fuchsia-100">
                  <stat.icon className="h-10 w-10 text-sky-600" />
                </div>
                <div className="text-3xl font-extrabold">{stat.value}</div>
                <div className="mt-1 text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials / Highlights */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50">
              <h3 className="font-bold text-lg mb-2">واجهة حديثة</h3>
              <p className="text-slate-700">
                تصميم جديد بألوان منعشة وحركة سلسة لسهولة التصفّح.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-emerald-50 to-cyan-50">
              <h3 className="font-bold text-lg mb-2">استجابة سريعة</h3>
              <p className="text-slate-700">
                أداء محسّن وزمن تحميل أقل عبر مختلف الأجهزة.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-amber-50 to-rose-50">
              <h3 className="font-bold text-lg mb-2">تجربة موحّدة</h3>
              <p className="text-slate-700">
                مسارات واضحة من تقديم الطلب حتى إغلاقه.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-sky-600 to-fuchsia-600 p-[1px] shadow-xl"
          >
            <div className="rounded-3xl bg-white/95 backdrop-blur p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-slate-900">
                هل لديك شكوى أو مقترح؟
              </h2>
              <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                نتعامل مع طلباتك بشفافية وسرعة. ساهم معنا في تحسين خدمات
                البلدية.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/complaint"
                  className="rounded-2xl px-8 py-3 font-semibold text-white bg-gradient-to-l from-rose-500 to-orange-500 shadow hover:brightness-105"
                >
                  تقديم شكوى
                </Link>
                <Link
                  to="/suggestion"
                  className="rounded-2xl px-8 py-3 font-semibold bg-white text-slate-900 border border-slate-200 shadow hover:bg-slate-50"
                >
                  تقديم مقترح
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold">آخر التعاميم والمشاريع</h2>
              <p className="mt-2 text-slate-600">
                نظرة سريعة على أحدث المعلومات المنشورة في المنصّة.
              </p>
            </div>

            <Link
              to="/info"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-sky-700 transition"
            >
              الانتقال إلى صفحة التعاميم والمشاريع
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(INFO_PREVIEW_LIMIT)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-slate-200 p-4 animate-pulse"
                >
                  <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
                  <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
                  <div className="h-4 w-full bg-slate-200 rounded mb-1" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-sm">
              حدث خطأ أثناء جلب المعلومات، يُرجى المحاولة لاحقًا.
            </div>
          )}

          {!loading && !error && latestInfos.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 text-sm">
              لا توجد تعاميم أو مشاريع منشورة حتى الآن.
            </div>
          )}

          {!loading && !error && latestInfos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestInfos.map((info) => (
                <div
                  key={info._id}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    {info.info_category && (
                      <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 text-xs font-medium px-3 py-1 mb-3">
                        {info.info_category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">
                      {info.title}
                    </h3>
                    {info.description && (
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {info.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      to="/info"
                      className="text-xs font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1"
                    >
                      عرض كل التفاصيل في صفحة التعاميم
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} بلديتك الذكية — جميع الحقوق محفوظة
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
