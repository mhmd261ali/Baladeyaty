import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  User, 
  Shield, 
  ShieldCheck,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'employee' | 'supervisor';
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin?: string;
}

const UserManagement = () => {
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'أحمد المدير',
      email: 'admin@municipality.gov',
      phone: '0501234567',
      role: 'supervisor',
      department: 'الإدارة العامة',
      status: 'active',
      joinDate: '2023-01-15',
      lastLogin: '2025-01-15'
    },
    {
      id: '2',
      name: 'فاطمة الموظفة',
      email: 'employee@municipality.gov',
      phone: '0507654321',
      role: 'employee',
      department: 'الشكاوى',
      status: 'active',
      joinDate: '2023-03-20',
      lastLogin: '2025-01-14'
    },
    {
      id: '3',
      name: 'محمد المهندس',
      email: 'engineer@municipality.gov',
      phone: '0559876543',
      role: 'employee',
      department: 'الصيانة',
      status: 'active',
      joinDate: '2023-06-10',
      lastLogin: '2025-01-13'
    },
    {
      id: '4',
      name: 'سارة المنسقة',
      email: 'sara@municipality.gov',
      phone: '0512345678',
      role: 'employee',
      department: 'النظافة',
      status: 'inactive',
      joinDate: '2023-09-05',
      lastLogin: '2024-12-20'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const departments = [
    'الإدارة العامة',
    'الشكاوى',
    'الصيانة',
    'النظافة',
    'التخطيط',
    'الموارد البشرية'
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'supervisor':
        return 'مشرف';
      case 'employee':
        return 'موظف';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'supervisor':
        return <ShieldCheck className="h-4 w-4" />;
      case 'employee':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'supervisor':
        return 'bg-purple-100 text-purple-800';
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      default:
        return status;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    if (window.confirm(`هل أنت متأكد من حذف الموظف ${employee.name}؟`)) {
      toast.success(`تم حذف الموظف ${employee.name} بنجاح`);
    }
  };

  const handleStatusToggle = (employee: Employee) => {
    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    toast.success(`تم تغيير حالة ${employee.name} إلى ${getStatusLabel(newStatus)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-600 mt-1">
            إجمالي الموظفين: {employees.length} | النشطون: {employees.filter(e => e.status === 'active').length}
          </p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة موظف</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">إجمالي الموظفين</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">المشرفون</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => e.role === 'supervisor').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">النشطون</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => e.status === 'active').length}
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
              placeholder="البحث في الموظفين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الأدوار</option>
            <option value="supervisor">المشرفون</option>
            <option value="employee">الموظفون</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">النشطون</option>
            <option value="inactive">غير النشطين</option>
          </select>
        </div>
      </div>

      {/* Employees List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="divide-y divide-gray-200">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {employee.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse ${getRoleColor(employee.role)}`}>
                        {getRoleIcon(employee.role)}
                        <span>{getRoleLabel(employee.role)}</span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {getStatusLabel(employee.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 ml-1 text-gray-400" />
                        {employee.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 ml-1 text-gray-400" />
                        {employee.phone}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 ml-1 text-gray-400" />
                        {employee.department}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        انضم في: {employee.joinDate}
                      </div>
                      {employee.lastLogin && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 ml-1" />
                          آخر دخول: {employee.lastLogin}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => handleStatusToggle(employee)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      employee.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {employee.status === 'active' ? 'تعطيل' : 'تفعيل'}
                  </button>
                  
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title="تعديل"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteEmployee(employee)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">
              لم يتم العثور على موظفين يطابقون معايير البحث
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'add' ? 'إضافة موظف جديد' : 'تعديل بيانات الموظف'}
              </h2>
            </div>

            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  defaultValue={selectedEmployee?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل الاسم الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  defaultValue={selectedEmployee?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@municipality.gov"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  defaultValue={selectedEmployee?.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="05xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الدور
                </label>
                <select
                  defaultValue={selectedEmployee?.role || 'employee'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="employee">موظف</option>
                  <option value="supervisor">مشرف</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  القسم
                </label>
                <select
                  defaultValue={selectedEmployee?.department || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر القسم</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success(
                      modalMode === 'add' 
                        ? 'تم إضافة الموظف بنجاح' 
                        : 'تم تحديث بيانات الموظف بنجاح'
                    );
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {modalMode === 'add' ? 'إضافة' : 'تحديث'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;