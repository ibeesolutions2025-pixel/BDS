import React, { useState, useEffect } from 'react';

interface ApiKeySetupProps {
  onKeySet: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    
    // Validate API Key format
    if (!trimmedKey) {
      setError('Vui lòng nhập API Key!');
      return;
    }
    
    if (!trimmedKey.startsWith('AIza')) {
      setError('API Key không hợp lệ! API Key phải bắt đầu bằng "AIza"');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('user_gemini_api_key', trimmedKey);
    setError('');
    onKeySet();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔑</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Cấu hình API Key
          </h2>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key của bạn:
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setError('');
            }}
            placeholder="Dán API Key vào đây (VD: AIzaSy...)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">❌ {error}</p>
          )}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          💾 Lưu và Bắt đầu
        </button>
      </div>
    </div>
  );
};

interface ApiKeyManagerProps {
  onKeyRemoved: () => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeyRemoved }) => {
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('user_gemini_api_key');
    setCurrentKey(key);
  }, []);

  const handleChangeKey = () => {
    setShowPasswordModal(true);
    setPassword('');
    setError('');
  };

  const handleSubmitPassword = () => {
    if (!password) {
      setError('Vui lòng nhập mã bảo mật!');
      return;
    }
    
    if (password !== '332123') {
      setError('Mã bảo mật không đúng! Vui lòng liên hệ Admin.');
      return;
    }
    
    // Xóa key và thông báo cho App component
    localStorage.removeItem('user_gemini_api_key');
    onKeyRemoved();
  };

  const handleCancel = () => {
    setShowPasswordModal(false);
    setPassword('');
    setError('');
  };

  if (!currentKey) return null;

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔑</div>
          <div>
            <p className="text-sm text-gray-800 font-medium">Đã cấu hình Key</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleChangeKey}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors font-medium"
          >
            🔄 Đổi Key
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🔐 Xác thực mã bảo mật
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng liên hệ Admin để lấy mã bảo mật
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã bảo mật:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitPassword();
                  }
                }}
                placeholder="Nhập mã bảo mật"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">❌ {error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitPassword}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
