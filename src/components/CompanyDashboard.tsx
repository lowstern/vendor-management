import { Company } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

interface CompanyDashboardProps {
  company: Company;
  onBack?: () => void;
}

export default function CompanyDashboard({ company, onBack }: CompanyDashboardProps) {
  const spending = company.spending;

  // Calculate statistics
  const avgMonthlySpending = spending.total / 12;
  const saasPercentage = (spending.saas / spending.total) * 100;
  const consultantPercentage = (spending.consultants / spending.total) * 100;
  const legalPercentage = (spending.lawyers / spending.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{company.name}</h1>
              <p className="text-gray-600">{company.industry} • {company.headquarters}</p>
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
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total Annual Spending</p>
            <p className="text-3xl font-bold text-gray-800">{formatCurrency(spending.total)}</p>
            <p className="text-xs text-gray-500 mt-1">~{formatCurrency(avgMonthlySpending)}/month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-600 mb-1">SaaS Products</p>
            <p className="text-3xl font-bold text-indigo-700">{company.saasProducts.length}</p>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(spending.saas)} total</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
            <p className="text-sm text-gray-600 mb-1">Consultants</p>
            <p className="text-3xl font-bold text-emerald-700">{company.consultants.length}</p>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(spending.consultants)} total</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <p className="text-sm text-gray-600 mb-1">Legal Cases</p>
            <p className="text-3xl font-bold text-amber-700">{company.legalCases.length}</p>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(spending.lawyers)} total</p>
          </div>
        </div>

        {/* Spending Breakdown Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Spending Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">SaaS Software</span>
                <span className="text-gray-600">{saasPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-indigo-600 h-4 rounded-full"
                  style={{ width: `${saasPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(spending.saas)}</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Consultants</span>
                <span className="text-gray-600">{consultantPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-emerald-600 h-4 rounded-full"
                  style={{ width: `${consultantPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(spending.consultants)}</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Legal Services</span>
                <span className="text-gray-600">{legalPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-amber-600 h-4 rounded-full"
                  style={{ width: `${legalPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(spending.lawyers)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
                📊 View Analytics
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
                📄 Manage Contracts
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
                📈 Generate Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Last contract uploaded 2 days ago</p>
              <p>• 3 new vendors added this month</p>
              <p>• Spending review completed</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Alerts</h3>
            <div className="space-y-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-yellow-800">
                  2 contracts expiring soon
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-800">
                  Review pending submissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

