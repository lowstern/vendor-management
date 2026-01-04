import { useState } from 'react';
import { Firm } from '../types';
import { firmService } from '../services/firmService';
import { useAuth } from '../contexts/AuthContext';

interface FirmSetupProps {
  onComplete: (firm: Firm) => void;
}

export default function FirmSetup({ onComplete }: FirmSetupProps) {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [firmName, setFirmName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [industry, setIndustry] = useState('');
  const [enableDuo, setEnableDuo] = useState(false);
  const [enableVCP, setEnableVCP] = useState(true);
  const [duoIntegrationKey, setDuoIntegrationKey] = useState('');
  const [duoSecretKey, setDuoSecretKey] = useState('');
  const [duoApiHostname, setDuoApiHostname] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateFirm = async () => {
    try {
      // Create firm
      const firm = firmService.createFirm({
        name: firmName,
        domain: `${subdomain}.vendormgmt.com`,
        subdomain,
        industry,
        vcpEnabled: enableVCP,
        duoEnabled: enableDuo,
        duoIntegrationKey: enableDuo ? duoIntegrationKey : undefined,
        duoSecretKey: enableDuo ? duoSecretKey : undefined,
        duoApiHostname: enableDuo ? duoApiHostname : undefined,
        settings: {
          allowPublicVCP: false,
          requireApproval: true,
          autoSync: false,
        },
      });

      // Create admin user
      if (adminEmail && adminName && adminPassword) {
        await signup(adminEmail, adminPassword, adminName, firm.id);
      }

      onComplete(firm);
    } catch (err: any) {
      setError(err.message || 'Setup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Firm Setup</h1>
        <p className="text-gray-600 mb-6">Get your firm set up in minutes</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Firm Name *
              </label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Corporation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subdomain *
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="acme"
                  required
                />
                <span className="ml-2 text-gray-600">.vendormgmt.com</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your portal will be available at: {subdomain || 'yourname'}.vendormgmt.com
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Technology, Finance, Healthcare, etc."
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="enableVCP"
                checked={enableVCP}
                onChange={(e) => setEnableVCP(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="enableVCP" className="text-sm text-gray-700">
                Enable Vendor Cost Portal (VCP)
              </label>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!firmName || !subdomain}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Next: Security Setup
            </button>
          </div>
        )}

        {/* Step 2: Duo Security Setup */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="enableDuo"
                checked={enableDuo}
                onChange={(e) => setEnableDuo(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="enableDuo" className="text-sm font-semibold text-gray-700">
                Enable Duo Two-Factor Authentication
              </label>
            </div>

            {enableDuo && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-4 border border-blue-200">
                <p className="text-sm text-gray-700">
                  Enter your Duo Security credentials. Get these from your Duo Admin Panel.
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
                    required={enableDuo}
                  />
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
                    required={enableDuo}
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
                    required={enableDuo}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={enableDuo && (!duoIntegrationKey || !duoSecretKey || !duoApiHostname)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Next: Admin Account
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Admin Account */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email *
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Name *
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password *
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="At least 8 characters"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must contain uppercase, lowercase, number, and special character
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleCreateFirm}
                disabled={!adminEmail || !adminName || !adminPassword}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

