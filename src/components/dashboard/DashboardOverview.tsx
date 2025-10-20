import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare,
  Lightbulb,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const DashboardOverview = () => {
  const recentComplaints = [
    {
      id: 'COMP-001',
      title: 'انقطاع في الإضاءة العامة',
      location: 'حي النخيل، شارع الملك فهد',
      status: 'pending',
      priority: 'high',
      date: '2025-01-15',
      assignee: 'فاطمة الموظفة'
    },
    {
      id: 'COMP-002',
      title: 'تجمع مياه في الطريق',
      location: 'حي الورود، شارع العليا',
      status: 'in_progress',
      priority: 'medium',
      date: '2025-01-14',
      assignee: 'أحمد المهندس'
    },
    {
      id: 'COMP-003',
      title: 'تراكم النفايات',
      location: 'حي الياسمين، طريق الدائري',
      status: 'completed',
      priority: 'low',
      date: '2025-01-13',
      assignee: 'سارة المنسقة'
    }
  ];

  const recentSuggestions = [
    {
      id: 'SUGG-001',
      title: 'إنشاء حديقة للأطفال في حي النخيل',
      category: 'البنية التحتية',
      status: 'under_review',
      date: '2025-01-14',
      votes: 45
    },
    {
      id: 'SUGG-002',
      title: 'تطبيق للتبليغ عن المشاكل',
      category: 'الخدمات الرقمية',
      status: 'approved',
      date: '2025-01-12',
      votes: 23
    }
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'in_progress':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتملة';
      case 'under_review':
        return 'قيد المراجعة';
      case 'approved':
        return 'موافق عليها';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'under_review':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عاجل';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'عادي';
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
        <p className="text-blue-100">
          إليك نظرة سريعة على أحدث الأنشطة والإحصائيات
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-red-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">الشكاوى الجديدة</h3>
              <p className="text-sm text-gray-600">تحتاج لمراجعة فورية</p>
              <p className="text-2xl font-bold text-red-600 mt-2">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-green-100 p-3 rounded-lg">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">المقترحات المعلقة</h3>
              <p className="text-sm text-gray-600">تحتاج لمراجعة</p>
              <p className="text-2xl font-bold text-green-600 mt-2">7</p>
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
              <p className="text-sm text-gray-600">هذا الشهر</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">89%</p>
            </div>
          </div>
        </div>
      </div>

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
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <span className="text-sm font-mono text-gray-500">
                        {complaint.id}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {getPriorityLabel(complaint.priority)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {complaint.location}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4 rtl:space-x-reverse">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        {complaint.date}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 ml-1" />
                        {complaint.assignee}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {getStatusLabel(complaint.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              عرض جميع الشكاوى ←
            </button>
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
            {recentSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <span className="text-sm font-mono text-gray-500">
                        {suggestion.id}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {suggestion.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {suggestion.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-4 rtl:space-x-reverse">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        {suggestion.date}
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 ml-1" />
                        {suggestion.votes} تصويت
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                    {getStatusLabel(suggestion.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
              عرض جميع المقترحات ←
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;