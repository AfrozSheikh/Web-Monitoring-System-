import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ErrorChart = ({ errorCounts }) => {
  // Transform error data for the chart
  const chartData = Object.entries(errorCounts).map(([errorType, count]) => ({
    errorType,
    count
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Error Statistics</h2>
      
      {chartData.length > 0 ? (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="errorType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <p className="font-medium">Total Errors: {Object.values(errorCounts).reduce((sum, count) => sum + count, 0)}</p>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No errors recorded in the selected time period.</p>
      )}
    </div>
  );
};

export default ErrorChart;