import React, { useState } from 'react';
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
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Suggestion {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  submittedBy: string;
  phone: string;
  email?: string;
  date: string;
  votes: number;
  notes?: string;
  reviewedBy?: string;
}

const SuggestionManagement = () => {
  const [suggestions] = useState<Suggestion[]>([
    {
      id: 'SUGG-001',
      title: 'إنشاء حديقة للأطفال في حي النخيل',
      category: 'البنية التحتية',
      description: 'اقتراح إنشاء حديقة مخصصة للأطفال مع ألعاب آمنة ومناطق جلوس للعائلات',
      status: 'under_review',
      submittedBy: 'سارة أحمد',
      phone: '0501234567',
      email: 'sara@email.com',
      date: '2025-01-14',
      votes: 45,
    },
    {
      id: 'SUGG-002',
      title: 'تطبيق للتبليغ عن المشاكل',
      category: 'الخدمات الرقمية',
      description: 'تطوير تطبيق محمول لتسهيل التبليغ عن المشاكل وتتبع حالة الشكاوى',
      status: 'approved',
      submittedBy: 'محمد عبدالله',
      phone: '0507654321',
      date: '2025-01-12',
      votes: 23,
      reviewedBy: 'أحمد المدير',
      notes: 'مقترح ممتاز، سيتم البدء في التنفيذ'
    },
    {
      id: 'SUGG-003',
      title: 'تحسين الإضاءة في الشوارع الفرعية',
      category: 'الأمن والسلامة',
      description: 'زيادة عدد أعمدة الإضاءة في الشوارع الفرعية لتحسين الأمان',
      status: 'implemented',
      submittedBy: 'فاطمة سعد',
      phone: '0559876543',
      date: '2025-01-10',
      votes: 67,
      reviewedBy: 'أحمد المدير',
      notes: 'تم التنفيذ بنجاح'
    },
    {
      id: 'SUGG-004',
      title: 'إقامة فعاليات ترفيهية شهرية',
      category: 'الترفيه والثقافة',
      description: 'تنظيم فعاليات ترفيهية وثقافية شهرية لجميع أفراد المجتمع',
      status: 'pending',
      submittedBy: 'عبدالرحمن محمد',
      phone: '0512345678',
      date: '2025-01-08',
      votes: 12,
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const categories = [
    'البنية التحتية',
    'الخدمات الرقمية',
    'الأمن والسلامة',
    'الترفيه والثقافة',
    'البيئة والنظافة',
    'النقل والمواصلات'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'under_review':
        return <Eye className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'implemented':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'under_review':
        return 'قيد المراجعة';
      case 'approved':
        return 'موافق عليه';
      case 'rejected':
        return 'مرفوض';
      case 'implemented':
        return 'منفذ';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'implemented':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || suggestion.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || suggestion.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (suggestionId: string, newStatus: string) => {
    // In a real app, this would make an API call
    toast.success(`تم تحديث حالة المقترح ${suggestionId} إلى ${getStatusLabel(newStatus)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المقترحات</h1>
          <p className="text-gray-600 mt-1">
            إجمالي المقترحات: {suggestions.length} | المعلقة: {suggestions.filter(s => s.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
              <p className="text-lg font-bold text-gray-900">
                {suggestions.filter(s => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
              <p className="text-lg font-bold text-gray-900">
                {suggestions.filter(s => s.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">موافق عليها</p>
              <p className="text-lg font-bold text-gray-900">
                {suggestions.filter(s => s.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">منفذة</p>
              <p className="text-lg font-bold text-gray-900">
                {suggestions.filter(s => s.status === 'implemented').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="under_review">قيد المراجعة</option>
            <option value="approved">موافق عليها</option>
            <option value="rejected">مرفوضة</option>
            <option value="implemented">منفذة</option>
          </select>

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
          {filteredSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                    <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {suggestion.id}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      {suggestion.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor(suggestion.status)}`}>
                      {getStatusIcon(suggestion.status)}
                      <span>{getStatusLabel(suggestion.status)}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {suggestion.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {suggestion.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="h-3 w-3 ml-1" />
                      {suggestion.submittedBy}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 ml-1" />
                      {suggestion.date}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 ml-1" />
                      {suggestion.votes} تصويت
                    </div>
                  </div>

                  {suggestion.reviewedBy && (
                    <div className="mt-2 text-xs text-green-600">
                      تمت المراجعة بواسطة: {suggestion.reviewedBy}
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
                  
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <button
                      onClick={() => handleStatusChange(suggestion.id, 'approved')}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                      title="الموافقة"
                      disabled={suggestion.status === 'approved' || suggestion.status === 'implemented'}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(suggestion.id, 'rejected')}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      title="الرفض"
                      disabled={suggestion.status === 'rejected'}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSuggestions.length === 0 && (
          <div className="p-12 text-center">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مقترحات</h3>
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
                    تفاصيل المقترح {selectedSuggestion.id}
                  </h2>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      {selectedSuggestion.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSuggestion.status)}`}>
                      {getStatusLabel(selectedSuggestion.status)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedSuggestion.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedSuggestion.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">معلومات المقترح</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">الفئة:</span>
                      <span>{selectedSuggestion.category}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">التاريخ:</span>
                      <span>{selectedSuggestion.date}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">التصويت:</span>
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                        {selectedSuggestion.votes}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">معلومات المقترح</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">الاسم:</span>
                      <span>{selectedSuggestion.submittedBy}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">الهاتف:</span>
                      <span>{selectedSuggestion.phone}</span>
                    </div>
                    {selectedSuggestion.email && (
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-24">البريد:</span>
                        <span>{selectedSuggestion.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedSuggestion.reviewedBy && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">معلومات المراجعة</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">المراجع:</span>
                      <span>{selectedSuggestion.reviewedBy}</span>
                    </div>
                    {selectedSuggestion.notes && (
                      <div>
                        <span className="font-medium text-gray-600">الملاحظات:</span>
                        <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">
                          {selectedSuggestion.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => handleStatusChange(selectedSuggestion.id, 'approved')}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  disabled={selectedSuggestion.status === 'approved' || selectedSuggestion.status === 'implemented'}
                >
                  الموافقة
                </button>
                <button
                  onClick={() => handleStatusChange(selectedSuggestion.id, 'rejected')}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  disabled={selectedSuggestion.status === 'rejected'}
                >
                  الرفض
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionManagement;