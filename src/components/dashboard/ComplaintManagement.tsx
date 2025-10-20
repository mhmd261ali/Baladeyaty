import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  Phone,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Complaint {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  submittedBy: string;
  phone: string;
  date: string;
  assignee?: string;
  notes?: string;
}

const ComplaintManagement = () => {
  const [complaints] = useState<Complaint[]>([
    {
      id: 'COMP-001',
      title: 'انقطاع في الإضاءة العامة',
      type: 'الإضاءة العامة',
      location: 'حي النخيل، شارع الملك فهد',
      description: 'انقطاع في الإضاءة العامة في عدة أعمدة على طول الشارع منذ أسبوع',
      status: 'pending',
      priority: 'high',
      submittedBy: 'محمد أحمد علي',
      phone: '0501234567',
      date: '2025-01-15',
    },
    {
      id: 'COMP-002',
      title: 'تجمع مياه في الطريق',
      type: 'إمدادات المياه',
      location: 'حي الورود، شارع العليا',
      description: 'تجمع مياه كبير في وسط الطريق يسبب صعوبة في المرور',
      status: 'in_progress',
      priority: 'medium',
      submittedBy: 'فاطمة سعد',
      phone: '0507654321',
      date: '2025-01-14',
      assignee: 'أحمد المهندس',
      notes: 'تم البدء في الإصلاح'
    },
    {
      id: 'COMP-003',
      title: 'تراكم النفايات',
      type: 'إزالة النفايات',
      location: 'حي الياسمين، طريق الدائري',
      description: 'تراكم النفايات بالقرب من المجمع التجاري',
      status: 'completed',
      priority: 'low',
      submittedBy: 'عبدالله محمد',
      phone: '0559876543',
      date: '2025-01-13',
      assignee: 'سارة المنسقة',
      notes: 'تم حل المشكلة بالكامل'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'in_progress':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتملة';
      case 'rejected':
        return 'مرفوضة';
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
      case 'rejected':
        return 'bg-red-100 text-red-800';
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

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    // In a real app, this would make an API call
    toast.success(`تم تحديث حالة الشكوى ${complaintId} إلى ${getStatusLabel(newStatus)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الشكاوى</h1>
          <p className="text-gray-600 mt-1">
            إجمالي الشكاوى: {complaints.length} | المعلقة: {complaints.filter(c => c.status === 'pending').length}
          </p>
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
              placeholder="البحث في الشكاوى..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in_progress">قيد المعالجة</option>
            <option value="completed">مكتملة</option>
            <option value="rejected">مرفوضة</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الأولويات</option>
            <option value="high">عاجل</option>
            <option value="medium">متوسط</option>
            <option value="low">عادي</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="divide-y divide-gray-200">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                    <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {complaint.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                      {getPriorityLabel(complaint.priority)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      <span>{getStatusLabel(complaint.status)}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {complaint.title}
                  </h3>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                      {complaint.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {complaint.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 ml-1" />
                      {complaint.location}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 ml-1" />
                      {complaint.submittedBy}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 ml-1" />
                      {complaint.date}
                    </div>
                  </div>

                  {complaint.assignee && (
                    <div className="mt-2 text-xs text-blue-600">
                      المسؤول: {complaint.assignee}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setIsDetailModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title="عرض التفاصيل"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <div className="relative">
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="in_progress">قيد المعالجة</option>
                      <option value="completed">مكتملة</option>
                      <option value="rejected">مرفوضة</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد شكاوى</h3>
            <p className="text-gray-600">
              لا توجد شكاوى تطابق معايير البحث الحالية
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    تفاصيل الشكوى {selectedComplaint.id}
                  </h2>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                      {getPriorityLabel(selectedComplaint.priority)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusLabel(selectedComplaint.status)}
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
                  {selectedComplaint.title}
                </h3>
                <p className="text-gray-600">
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">معلومات الشكوى</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">النوع:</span>
                      <span>{selectedComplaint.type}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">الموقع:</span>
                      <span>{selectedComplaint.location}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">التاريخ:</span>
                      <span>{selectedComplaint.date}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">معلومات المشتكي</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">الاسم:</span>
                      <span>{selectedComplaint.submittedBy}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">الهاتف:</span>
                      <span>{selectedComplaint.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedComplaint.assignee && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">معلومات المعالجة</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">المسؤول:</span>
                      <span>{selectedComplaint.assignee}</span>
                    </div>
                    {selectedComplaint.notes && (
                      <div>
                        <span className="font-medium text-gray-600">الملاحظات:</span>
                        <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">
                          {selectedComplaint.notes}
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
                <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  إضافة ملاحظة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;