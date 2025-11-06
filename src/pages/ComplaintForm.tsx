import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  MapPin,
  Phone,
  FileText,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FaIdCard } from "react-icons/fa";
import { motion, Variants } from "framer-motion";
import toast from "react-hot-toast";
import { client } from "../lib/sanityClient";

interface ComplaintData {
  type: string;
  location: string;
  description: string;
  fullName: string; // بدّلنا idNumber -> fullName
  phone: string;
  priority: "low" | "medium" | "high";
}

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

const ComplaintForm: React.FC = () => {
  const [formData, setFormData] = useState<ComplaintData>({
    type: "",
    location: "",
    description: "",
    fullName: "", // جديد
    phone: "",
    priority: "medium",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const MAX_FILES = 6; // tweak as you like
  const MAX_SIZE_MB = 8; // per file

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const images = files.filter((f) => f.type.startsWith("image/"));

    if (!images.length) return;

    // size + count guards
    const tooBig = images.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig) {
      toast.error(`حجم الصورة أكبر من ${MAX_SIZE_MB}MB: ${tooBig.name}`);
      return;
    }
    const combined = [...photos, ...images].slice(0, MAX_FILES);
    setPhotos(combined);

    // previews
    const urls = combined.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  // optional: remove a single photo
  const removePhotoAt = (idx: number) => {
    const next = photos.filter((_, i) => i !== idx);
    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const complaintTypes = useMemo(
    () => [
      "النظافة العامة",
      "الإضاءة العامة",
      "الطرق والأرصفة",
      "إمدادات المياه",
      "الصرف الصحي",
      "الحدائق والمساحات الخضراء",
      "الضوضاء",
      "إزالة النفايات",
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
  const validId = (v: string) => /^\d{6,20}$/.test(v.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.type ||
      !formData.location ||
      !formData.description ||
      !formData.fullName ||
      !formData.phone
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.fullName.trim().length < 3) {
      toast.error("يرجى إدخال الاسم الكامل بشكل صحيح");
      return;
    }
    if (!validPhone(formData.phone)) {
      toast.error("صيغة رقم الهاتف غير صحيحة");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1) Upload photos (if any) to Sanity and get asset refs
      const uploadedAssets = await Promise.all(
        photos.map(async (file) => {
          // NOTE: uploads require write permissions; best done server-side with a token.
          const asset = await client.assets.upload("image", file, {
            filename: file.name,
            contentType: file.type,
          });
          return {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          };
        })
      );

      // 2) Create complaint doc with images array
      const complaintId = `COMP-${Date.now()}`;
      const complaintDoc = {
        _type: "Complaints",
        complaint: complaintId,
        priority: formData.priority,
        complaint_status: "new",
        complaint_date: new Date().toISOString().split("T")[0],
        complaint_category: formData.type,
        complaint_place: formData.location,
        complaint_description: formData.description,
        complaint_name: formData.fullName,
        complaint_person_nbr: formData.phone,
        complaint_images: uploadedAssets, // 👈 NEW
      };

      const created = await client.create(complaintDoc);

      toast.success(
        `تم تقديم الشكوى بنجاح. رقم الشكوى: ${complaintId} (ID: ${created._id})`
      );

      // reset
      setFormData({
        type: "",
        location: "",
        description: "",
        fullName: "",
        phone: "",
        priority: "medium",
      });
      setPhotos([]);
      setPreviews([]);
    } catch (err) {
      console.error("Error saving complaint to Sanity:", err);
      toast.error("حدث خطأ أثناء حفظ الشكوى. حاول مجددًا.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-white via-rose-50/40 to-slate-100 py-12"
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
            <Sparkles className="h-4 w-4" /> قناة مخصّصة لاستقبال الشكاوى
          </div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-fuchsia-100">
            <AlertCircle className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            تقديم شكوى
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            نحن نهتم بآرائكم وملاحظاتكم. قدّم شكواك وسنتابعها بعناية حتى
            المعالجة.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-200/30 via-white to-fuchsia-200/20 p-[1px] shadow-xl"
        >
          <div className="rounded-3xl bg-white/95 backdrop-blur p-6 md:p-8 ring-1 ring-slate-200">
            <motion.form
              variants={groupIn}
              initial="hidden"
              animate="show"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Complaint Type */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  <FileText className="inline h-4 w-4 ml-1" /> نوع الشكوى *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">اختر نوع الشكوى</option>
                  {complaintTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Location */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  <MapPin className="inline h-4 w-4 ml-1" /> الموقع *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="أدخل الموقع بالتفصيل (الحي، الشارع، رقم المبنى)"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </motion.div>

              {/* Priority */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  درجة الأولوية
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { key: "low", label: "عادية" },
                      { key: "medium", label: "متوسطة" },
                      { key: "high", label: "عاجلة" },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() =>
                        setFormData((s) => ({ ...s, priority: p.key }))
                      }
                      className={`rounded-xl px-3 py-2 text-sm font-medium ring-1 transition ${
                        formData.priority === p.key
                          ? "bg-gradient-to-l from-rose-600 to-fuchsia-600 text-white ring-transparent"
                          : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                      }`}
                      aria-pressed={formData.priority === p.key}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  وصف الشكوى *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="اكتب وصفًا مفصّلًا عن الشكوى..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
                />
                <div className="mt-1 text-xs text-slate-500">
                  يفضّل إرفاق تفاصيل واضحة تساعد الفريق في المعالجة.
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  صور داعمة (اختياري، حتى {MAX_FILES} صور)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosChange}
                  className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:px-4 file:py-2 file:bg-rose-600 file:text-white hover:file:brightness-110"
                />
                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={src}
                          alt={`preview-${i}`}
                          className="h-28 w-full object-cover rounded-xl ring-1 ring-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhotoAt(i)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition text-xs bg-black/60 text-white px-2 py-1 rounded"
                        >
                          إزالة
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  يُسمح بصيغ الصور فقط. الحد الأقصى {MAX_FILES} صور،{" "}
                  {MAX_SIZE_MB}MB لكل صورة.
                </p>
              </motion.div>

              {/* Personal Information */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    <FaIdCard className="inline h-4 w-4 ml-1" /> الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="الاسم الثلاثي"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </motion.div>

              {/* Privacy Notice */}
              <motion.div
                variants={fadeInUp}
                className="rounded-xl border border-sky-200 bg-sky-50 p-4 flex items-start gap-3"
              >
                <ShieldCheck className="h-5 w-5 text-sky-600 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong>ملاحظة:</strong> جميع المعلومات الشخصية محمية ولن
                  تُستخدم إلا لمتابعة الشكوى والتواصل معك.
                </p>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={fadeInUp} className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-rose-600 to-fuchsia-600 px-8 py-3 font-semibold text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>إرسال الشكوى</span>
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

export default ComplaintForm;
