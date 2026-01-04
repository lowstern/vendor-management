import { Company } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatCurrency';

interface CompanyCardProps {
  company: Company;
  onViewConsultants?: () => void;
  onViewSaaS?: () => void;
  onViewLegal?: () => void;
  onViewContracts?: () => void;
}

export default function CompanyCard({ company, onViewConsultants, onViewSaaS, onViewLegal, onViewContracts }: CompanyCardProps) {
  const spending = company.spending;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{company.name}</h2>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {company.industry}
          </span>
          <span className="text-gray-500 text-sm">
            {company.employees.toLocaleString()} employees
          </span>
        </div>
        <p className="text-gray-600 text-sm">{company.description}</p>
        <p className="text-gray-500 text-xs mt-1">📍 {company.headquarters}</p>
      </div>

      {/* Total Spending */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 mb-6 text-white">
        <p className="text-sm opacity-90 mb-1">Total Vendor Spending</p>
        <p className="text-4xl font-bold">{formatCurrency(spending.total)}</p>
        <p className="text-xs opacity-75 mt-1">{formatFullCurrency(spending.total)}</p>
      </div>

      {/* Spending Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Spending Breakdown</h3>
        
        {/* SaaS */}
        <div 
          className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500 cursor-pointer hover:bg-indigo-100 transition-colors"
          onClick={onViewSaaS}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">💻 SaaS Software</span>
            <span className="text-xl font-bold text-indigo-700">
              {formatCurrency(spending.saas)}
            </span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{
                width: `${(spending.saas / spending.total) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-600">
              {((spending.saas / spending.total) * 100).toFixed(1)}% of total
            </p>
            <p className="text-xs text-indigo-600 font-semibold">
              {company.saasProducts?.length || 0} products • Click to view →
            </p>
          </div>
        </div>

        {/* Lawyers */}
        <div 
          className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500 cursor-pointer hover:bg-amber-100 transition-colors"
          onClick={onViewLegal}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">⚖️ Legal Services</span>
            <span className="text-xl font-bold text-amber-700">
              {formatCurrency(spending.lawyers)}
            </span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div
              className="bg-amber-600 h-2 rounded-full"
              style={{
                width: `${(spending.lawyers / spending.total) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-600">
              {((spending.lawyers / spending.total) * 100).toFixed(1)}% of total
            </p>
            <p className="text-xs text-amber-600 font-semibold">
              {company.legalCases?.length || 0} cases • Click to view →
            </p>
          </div>
        </div>

        {/* Consultants */}
        <div 
          className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500 cursor-pointer hover:bg-emerald-100 transition-colors"
          onClick={onViewConsultants}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">📊 Consultants</span>
            <span className="text-xl font-bold text-emerald-700">
              {formatCurrency(spending.consultants)}
            </span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{
                width: `${(spending.consultants / spending.total) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-600">
              {((spending.consultants / spending.total) * 100).toFixed(1)}% of total
            </p>
            <p className="text-xs text-emerald-600 font-semibold">
              {company.consultants?.length || 0} consultants • Click to view →
            </p>
          </div>
        </div>
      </div>

      {/* Contract Management Button */}
      {onViewContracts && (
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onViewContracts}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>📄</span>
            Manage Contracts
          </button>
        </div>
      )}
    </div>
  );
}


