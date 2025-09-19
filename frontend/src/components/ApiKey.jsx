import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ApiKey = () => {
  const { user, regenerateApiKey } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.apiKey);
    toast.success('API key copied to clipboard!');
  };

  const handleRegenerate = async () => {
    if (!window.confirm('Are you sure you want to regenerate your API key? This will invalidate the current key.')) {
      return;
    }

    setLoading(true);
    const result = await regenerateApiKey();
    
    if (result.success) {
      toast.success('API key regenerated successfully!');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">API Key</h2>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            readOnly
            value={user.apiKey}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
          />
        </div>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Copy
        </button>
      </div>
      
      <button
        onClick={handleRegenerate}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Regenerating...' : 'Regenerate API Key'}
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Include this API key in your website's code to start monitoring.</p>
        <p className="mt-2 font-medium">Example usage:</p>
        <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
{`<script src="https://your-domain.com/sdk.js"></script>
<script>
  MonitoringSDK.init({
    apiKey: '${user.apiKey}',
    trackErrors: true,
    trackPerformance: true
  });
</script>`}
        </pre>
      </div>
    </div>
  );
};

export default ApiKey;