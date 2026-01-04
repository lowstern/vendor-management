import { useState } from 'react';
import { firmService } from '../services/firmService';
import { useAuth } from '../contexts/AuthContext';

interface FirmSettingsProps {
  onBack?: () => void;
}

export default function FirmSettings({ onBack }: FirmSettingsProps) {
  const { firm, user } = useAuth();
  const [duoEnabled, setDuoEnabled] = useState(firm?.duoEnabled || false);
  const [duoIntegrationKey, setDuoIntegrationKey] = useState(firm?.duoIntegrationKey || '');
  const [duoSecretKey, setDuoSecretKey] = useState(firm?.duoSecretKey || '');
  const [duoApiHostname, setDuoApiHostname] = useState(firm?.duoApiHostname || '');
  const [vcpEnabled, setVcpEnabled] = useState(firm?.vcpEnabled || false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!firm || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access settings.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      if (duoEnabled) {
        if (!duoIntegrationKey || !duoSecretKey || !duoApiHostname) {
          setError('Please provide all Duo credentials when enabling 2FA');
          setIsSaving(false);
          return;
        }
        firmService.enableDuo(firm.id, duoIntegrationKey, duoSecretKey, duoApiHostname);
      } else {
        firmService.disableDuo(firm.id);
      }

      firmService.updateFirm(firm.id, {
        vcpEnabled,
      });

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Firm Settings</h1>
              <p className="text-gray-600">{firm.name}</p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
              >
                ← Back
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* VCP Settings */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vendor Cost Portal (VCP)</h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="vcpEnabled"
                checked={vcpEnabled}
                onChange={(e) => setVcpEnabled(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="vcpEnabled" className="text-gray-700 font-semibold">
                Enable Vendor Cost Portal
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-2 ml-8">
              Allow vendors to submit cost information through the portal
            </p>
          </div>

          {/* Duo Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Two-Factor Authentication (2FA)</h2>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  id="duoEnabled"
                  checked={duoEnabled}
                  onChange={(e) => {
                    setDuoEnabled(e.target.checked);
                    if (!e.target.checked) {
                      // Clear Duo fields when disabling
                      setDuoIntegrationKey('');
                      setDuoSecretKey('');
                      setDuoApiHostname('');
                    }
                  }}
                  className="w-5 h-5"
                />
                <label htmlFor="duoEnabled" className="text-gray-800 font-semibold">
                  Enable Duo Security 2FA
                </label>
              </div>
              <p className="text-sm text-gray-600 ml-8">
                {duoEnabled 
                  ? 'Users will be required to complete Duo authentication after login'
                  : 'Platform can be used without 2FA - login with email and password only'
                }
              </p>
            </div>

            {duoEnabled && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Duo Security Credentials (Required when 2FA is enabled)
                </p>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Integration Key *
                  </label>
                  <input
                    type="text"
                    value={duoIntegrationKey}
                    onChange={(e) => setDuoIntegrationKey(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="DIXXXXXXXXXXXXXXXXXX"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get this from your Duo Admin Panel → Applications → Web SDK
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Secret Key *
                  </label>
                  <input
                    type="password"
                    value={duoSecretKey}
                    onChange={(e) => setDuoSecretKey(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter secret key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    API Hostname *
                  </label>
                  <input
                    type="text"
                    value={duoApiHostname}
                    onChange={(e) => setDuoApiHostname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="api-xxxxx.duosecurity.com"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> See <code className="bg-yellow-100 px-1 rounded">DUO_SETUP.md</code> for detailed 
                    instructions on setting up Duo Security.
                  </p>
                </div>
              </div>
            )}

            {!duoEnabled && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-800">
                  ✓ <strong>2FA is currently disabled.</strong> Your platform works with standard email/password authentication only.
                  You can enable Duo 2FA anytime for enhanced security.
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-6 border-t">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

