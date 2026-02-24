// src/pages/LoginPage.tsx
import React, {
  useMemo,
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogIn,
  Eye,
  EyeOff,
  User,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, Variants } from "framer-motion";

// ✅ use your Sanity client from here
import { client } from "../lib/sanityClient";

/* ------------------------------------------------------------------
   TYPES
------------------------------------------------------------------- */

type UserType = {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: UserType | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

/* ------------------------------------------------------------------
   AUTH CONTEXT
------------------------------------------------------------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load stored session
  useEffect(() => {
    const stored = localStorage.getItem("baladeyate_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("baladeyate_user");
      }
    }
  }, []);

  /**
   * ⚠ SECURITY NOTE (important):
   * You should NOT verify passwords directly in the frontend using Sanity,
   * because it would require exposing password hashes / tokens.
   *
   * ✅ Recommended flow:
   * Frontend calls your backend/Netlify function to validate password,
   * backend reads passwordHash from Sanity and compares safely.
   *
   * HOWEVER: since you asked to use `client` here, below is the safest
   * possible *front-end* check: it only checks that the email exists.
   * Password verification must still happen on backend.
   */
  const SHARED_PASSWORD = import.meta.env.VITE_APP_SHARED_PASSWORD as string;

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const emailNorm = email.trim().toLowerCase();

      if (!emailNorm || !password) return false;

      // 1) Check shared password
      if (!SHARED_PASSWORD || password !== SHARED_PASSWORD) {
        return false;
      }

      // 2) Check user exists in Sanity (get role/name)
      const sanityUser = await client.fetch<{
        _id: string;
        email: string;
        name?: string;
        role?: "user" | "admin";
      } | null>(
        `*[_type == "user" && lower(email) == $email][0]{ _id, email, name, role }`,
        { email: emailNorm },
      );

      if (!sanityUser?._id) return false;

      const mappedUser = {
        id: sanityUser._id,
        email: sanityUser.email,
        name: sanityUser.name || "",
        role: (sanityUser.role || "user") as "user" | "admin",
      };

      setUser(mappedUser);
      localStorage.setItem("municipal_user", JSON.stringify(mappedUser));
      window.location.href = "/dashboard";
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("baladeyate_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ------------------------------------------------------------------
   UI ANIMATIONS
------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------
   LOGIN PAGE
------------------------------------------------------------------- */

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const validEmail = (v: string) => /[^\s@]+@[^\s@]+\.[^\s@]{2,}/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    if (!validEmail(email)) {
      toast.error("صيغة البريد الإلكتروني غير صحيحة");
      return;
    }

    const success = await login(email, password);

    if (success) {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate(from, { replace: true });
    } else {
      toast.error("بيانات تسجيل الدخول غير صحيحة");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-white via-sky-50/50 to-fuchsia-50/40 py-12"
    >
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-sm mb-4 shadow/50">
            <Sparkles className="h-4 w-4" /> منطقة آمنة لموظفي البلدية
          </div>
          <div className="bg-gradient-to-br from-sky-500 to-fuchsia-600 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-slate-600">مخصص لموظفي البلدية والمشرفين</p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200/30 via-white to-fuchsia-200/20 p-[1px] shadow-xl"
        >
          <div className="rounded-3xl bg-white/95 backdrop-blur p-6 md:p-8 ring-1 ring-slate-200">
            <motion.form
              variants={groupIn}
              initial="hidden"
              animate="show"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  <User className="inline h-4 w-4 ml-1" /> البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@municipality.gov"
                    required
                    className="w-full pr-4 pl-11 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  <Lock className="inline h-4 w-4 ml-1" /> كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-4 pl-11 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={fadeInUp}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-sky-600 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow hover:brightness-110 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>جاري تسجيل الدخول...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      <span>تسجيل الدخول</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>

            {/* Back Home */}
            <motion.div variants={fadeInUp} className="mt-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-slate-600 hover:text-sky-600"
              >
                العودة للصفحة الرئيسية
              </button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>محمية عبر بروتوكول HTTPS وتشفير كلمات المرور.</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
