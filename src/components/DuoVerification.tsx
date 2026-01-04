import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DuoVerificationProps {
  username: string; // Used for Duo auth request
  onVerified: () => void;
  onCancel: () => void;
}

export default function DuoVerification({ username: _username, onVerified, onCancel }: DuoVerificationProps) {
  const { verifyDuo, requestDuoAuth } = useAuth();
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [sigResponse, setSigResponse] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Request Duo authentication
    const initDuo = async () => {
      const url = await requestDuoAuth();
      if (url) {
        setAuthUrl(url);
      } else {
        setError('Failed to initialize Duo authentication');
      }
    };
    initDuo();
  }, [requestDuoAuth]);

  const handleVerify = async () => {
    if (!sigResponse) {
      setError('Please complete Duo authentication');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const verified = await verifyDuo(sigResponse);
      if (verified) {
        onVerified();
      } else {
        setError('Duo verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Duo callback would be handled by Duo widget in production
  // handleDuoCallback is reserved for future Duo SDK integration

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Duo Security Verification</h2>
      <p className="text-gray-600 mb-6">
        Complete two-factor authentication to continue
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {authUrl && (
        <div className="mb-6">
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-4">Complete Duo Authentication</h3>
            
            {/* Duo iframe - in production, load actual Duo widget */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <p className="text-gray-600 mb-4">
                  Duo authentication widget will appear here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  In production, this loads the Duo Web SDK iframe
                </p>
                <div className="bg-white rounded-lg p-4 border">
                  <p className="text-xs text-gray-600 mb-2">
                    Mock Verification - Enter any response to test:
                  </p>
                  <input
                    type="text"
                    value={sigResponse}
                    onChange={(e) => setSigResponse(e.target.value)}
                    placeholder="Enter mock sig_response"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
              <p className="font-semibold mb-2">How to authenticate:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click the "Send Me a Push" button in the widget above</li>
                <li>Approve the request on your Duo mobile app</li>
                <li>Or enter a passcode from your device</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleVerify}
          disabled={!sigResponse || isVerifying}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Having trouble? Contact your administrator
        </p>
      </div>
    </div>
  );
}

