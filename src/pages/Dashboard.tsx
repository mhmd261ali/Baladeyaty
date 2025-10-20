import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  MessageSquare, 
  Lightbulb, 
  Users, 
  Settings, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import ComplaintManagement from '../components/dashboard/ComplaintManagement';
import SuggestionManagement from '../components/dashboard/SuggestionManagement';
import UserManagement from '../components/dashboard/UserManagement';
import SystemSettings from '../components/dashboard/SystemSettings';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: BarChart3,
      label: 'نظرة عامة',
      exact: true
    },
    {
      path: '/dashboard/complaints',
      icon: MessageSquare,
      label: 'إدارة الشكاوى',
    },
    {
      path: '/dashboard/suggestions',
      icon: Lightbulb,
      label: 'إدارة المقترحات',
    },
    ...(user?.role === 'supervisor' ? [
      {
        path: '/dashboard/users',
        icon: Users,
        label: 'إدارة المستخدمين',
      },
      {
        path: '/dashboard/settings',
        icon: Settings,
        label: 'إعدادات النظام',
      }
    ] : [])
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const stats = [
    {
      label: 'إجمالي الشكاوى',
      value: '1,245',
      change: '+12%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      label: 'الشكاوى المحلولة',
      value: '987',
      change: '+8%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      label: 'الشكاوى المعلقة',
      value: '258',
      change: '-3%',
      changeType: 'decrease',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      label: 'المقترحات الجديدة',
      value: '89',
      change: '+15%',
      changeType: 'increase',
      icon: Lightbulb,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">لوحة التحكم</h2>
            <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
          </div>

          <nav className="mt-6 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium mb-1 transition-colors duration-200 ${
                  isActive(item.path, item.exact)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5 ml-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 mr-64">
          {/* Header Stats (only on overview page) */}
          {location.pathname === '/dashboard' && (
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`h-4 w-4 ml-1 ${
                        stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 mr-2">من الشهر الماضي</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className="p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/complaints/*" element={<ComplaintManagement />} />
              <Route path="/suggestions/*" element={<SuggestionManagement />} />
              {user?.role === 'supervisor' && (
                <>
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/settings" element={<SystemSettings />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;