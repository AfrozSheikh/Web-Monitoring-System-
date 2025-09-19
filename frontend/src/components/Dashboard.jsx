import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import ApiKey from './ApiKey';
import PerformanceChart from './PerformanceChart';
import ErrorChart from './ErrorChart';
import LogTable from './LogTable';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    pageUrl: '',
    browser: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getData(filters);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Web Monitoring Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
              <input
                type="text"
                placeholder="Filter by URL"
                value={filters.pageUrl}
                onChange={(e) => handleFilterChange('pageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Browser</label>
              <select
                value={filters.browser}
                onChange={(e) => handleFilterChange('browser', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Browsers</option>
                <option value="Chrome">Chrome</option>
                <option value="Firefox">Firefox</option>
                <option value="Safari">Safari</option>
                <option value="Edge">Edge</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Key Section */}
        <div className="mb-6">
          <ApiKey />
        </div>

        {/* Stats Overview */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Logs</h3>
              <p className="text-3xl font-bold text-indigo-600">{dashboardData.totalLogs}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Errors</h3>
              <p className="text-3xl font-bold text-red-600">{dashboardData.totalErrors}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Avg Load Time</h3>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData.performanceData.loadTime 
                  ? dashboardData.performanceData.loadTime.toFixed(2) + ' ms' 
                  : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {dashboardData && (
            <>
              <PerformanceChart data={dashboardData.performanceData} />
              <ErrorChart errorCounts={dashboardData.errorCounts} />
            </>
          )}
        </div>

        {/* Error Logs Table */}
        {dashboardData && (
          <LogTable logs={dashboardData.recentErrors} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;