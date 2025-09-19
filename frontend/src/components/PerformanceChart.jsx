import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ data }) => {
  // Transform performance data for the chart
  const chartData = Object.entries(data).map(([key, value]) => ({
    metric: key,
    value: value ? parseFloat(value.toFixed(2)) : 0
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} ms`, 'Value']} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4f46e5" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">Load Time: {data.loadTime ? data.loadTime.toFixed(2) : 0} ms</p>
          <p className="text-gray-600">Time to fully load the page</p>
        </div>
        <div>
          <p className="font-medium">FCP: {data.firstContentfulPaint ? data.firstContentfulPaint.toFixed(2) : 0} ms</p>
          <p className="text-gray-600">First Contentful Paint</p>
        </div>
        <div>
          <p className="font-medium">LCP: {data.largestContentfulPaint ? data.largestContentfulPaint.toFixed(2) : 0} ms</p>
          <p className="text-gray-600">Largest Contentful Paint</p>
        </div>
        <div>
          <p className="font-medium">TTFB: {data.timeToFirstByte ? data.timeToFirstByte.toFixed(2) : 0} ms</p>
          <p className="text-gray-600">Time To First Byte</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;