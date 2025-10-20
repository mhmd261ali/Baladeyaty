import React from 'react';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Municipality Info */}
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">بلديتك الذكية</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              منصة إلكترونية ذكية لتنظيم العلاقة بين المواطنين والبلدية، 
              تهدف إلى تحسين الخدمات المحلية وزيادة الشفافية.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات الاتصال</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+966 11 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">info@municipality.gov.sa</span>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                <span className="text-gray-300">
                  شارع الملك فهد، الرياض<br />
                  المملكة العربية السعودية
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <div className="space-y-2">
              <a href="/complaint" className="block text-gray-300 hover:text-blue-400 transition-colors duration-200">
                تقديم شكوى
              </a>
              <a href="/suggestion" className="block text-gray-300 hover:text-blue-400 transition-colors duration-200">
                تقديم مقترح
              </a>
              <a href="/info" className="block text-gray-300 hover:text-blue-400 transition-colors duration-200">
                التعاميم والمشاريع
              </a>
              <a href="/login" className="block text-gray-300 hover:text-blue-400 transition-colors duration-200">
                تسجيل الدخول
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 بلديتك الذكية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;