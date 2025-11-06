import React, { useMemo, useState } from "react";
import {
  Lightbulb,
  User,
  Phone,
  Send,
  FileText,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import toast from "react-hot-toast";
import { client } from "../lib/sanityClient";

interface SuggestionData {
  title: string; // maps to Sanity: suggestion
  category: string; // maps to Sanity: suggestion_category
  description: string; // maps to Sanity: suggestion_description
  name: string; // maps to Sanity: suggestion_person_name
  phone: string; // maps to Sanity: suggestion_person_nbr
  email: string; // maps to Sanity: suggestion_person_email
}

// Optional: type the API response
type SuggestionApiResponse = { id: string; status: "created" };

// Configure your API base if you're not on Netlify (leave as default otherwise)
const SUGGESTION_API =
  import.meta.env.VITE_SUGGESTION_API_ENDPOINT ||
  "/.netlify/functions/suggestions";

// Motion variants (typed + tween-based for TS safety)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const groupIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1, duration: 0.25 },
  },
};

const SuggestionForm: React.FC = () => {
  const [formData, setFormData] = useState<SuggestionData>({
    title: "",
    category: "",
    description: "",
    name: "",
    phone: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useMemo(
    () => [
      "تحسين الخدمات العامة",
      "تطوير البنية التحتية",
      "البيئة والنظافة",
      "النقل والمواصلات",
      "الترفيه والثقافة",
      "الخدمات الإلكترونية",
      "الأمن والسلامة",
      "أخرى",
    ],
    []
  );

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validPhone = (v: string) =>
    /^(\+?\d{7,15})$/.test(v.replace(/\s|-/g, ""));
  const validEmail = (v: string) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required fields
    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.name ||
      !formData.phone
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Basic validations
    const validPhone = (v: string) =>
      /^(\+?\d{7,15})$/.test(v.replace(/\s|-/g, ""));
    const validEmail = (v: string) =>
      !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

    if (!validPhone(formData.phone)) {
      toast.error("صيغة رقم الهاتف غير صحيحة");
      return;
    }
    if (!validEmail(formData.email)) {
      toast.error("صيغة البريد الإلكتروني غير صحيحة");
      return;
    }

    setIsSubmitting(true);

    try {
      // Map to Sanity fields
      const payload = {
        _type: "Suggestion", // so your serverless function can create the right doc type
        suggestion: formData.title,
        suggestion_date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        suggestion_category: formData.category,
        suggestion_description: formData.description,
        suggestion_person_name: formData.name,
        suggestion_person_nbr: formData.phone,
        suggestion_person_email: formData.email,
      };

      const created = await client.create(payload);
      console.log("Created complaint:", created); // should contain _id, _type, _rev

      toast.success(
        `تم تقديم الشكوى بنجاح. رقم الشكوى: ${formData.title} (ID: ${created._id})`
      );

      // reset
      setFormData({
        title: "",
        category: "",
        description: "",
        name: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إرسال المقترح. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-slate-100 py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-sm mb-4 shadow/50">
            <Sparkles className="h-4 w-4" /> شاركنا أفكارك – نطوّر معًا
          </div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100">
            <Lightbulb className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            تقديم مقترح
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            شاركنا أفكارك ومقترحاتك لتحسين الخدمات وتطوير المجتمع.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-200/30 via-white to-sky-200/20 p-[1px] shadow-xl"
        >
          <div className="rounded-3xl bg-white/95 backdrop-blur p-6 md:p-8 ring-1 ring-slate-200">
            <motion.form
              variants={groupIn}
              initial="hidden"
              animate="show"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Suggestion Title */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  <FileText className="inline h-4 w-4 ml-1" /> عنوان المقترح *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="اكتب عنوانًا مختصرًا للمقترح"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </motion.div>

              {/* Category */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  التصنيف *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">اختر تصنيف المقترح</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Description */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  تفاصيل المقترح *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="اكتب تفاصيل المقترح والفوائد المتوقعة منه..."
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
                <div className="mt-1 text-xs text-slate-500">
                  اذكر الأثر المتوقع والفئة المستهدفة إن أمكن.
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div variants={fadeInUp} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  معلومات التواصل
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      <User className="inline h-4 w-4 ml-1" /> الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      <Phone className="inline h-4 w-4 ml-1" /> رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="05xxxxxxxx"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </motion.div>

              {/* Note */}
              <motion.div
                variants={fadeInUp}
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong>شكرًا لك!</strong> كل مقترح يساهم في تحسين خدماتنا.
                  سنقوم بدراسة المقترح والرد خلال 7 أيام عمل.
                </p>
              </motion.div>

              {/* Submit */}
              <motion.div variants={fadeInUp} className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-emerald-600 to-sky-600 px-8 py-3 font-semibold text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>إرسال المقترح</span>
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuggestionForm;
