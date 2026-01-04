import { Fund, Company } from '../types';
import { calculateFundRollup } from '../utils/rollupCalculations';
import { formatCurrency } from '../utils/formatCurrency';

interface FundsListViewProps {
  funds: Fund[];
  companies: Company[];
  onBack: () => void;
  onViewFund: (fund: Fund) => void;
}

export default function FundsListView({ funds, companies, onBack, onViewFund }: FundsListViewProps) {
  const fundsWithRollup = funds.map(fund => calculateFundRollup(fund, companies));

  return (
    <div className="bg-white rounded-institutional-lg border border-slate-200 shadow-sm p-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">
              Fund Portfolio Overview
            </h2>
            <p className="text-sm text-slate-600">
              Vendor spending rolled up by fund and portfolio company
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Funds List */}
      <div className="space-y-4">
        {fundsWithRollup.map((fund) => (
          <div
            key={fund.id}
            onClick={() => onViewFund(fund)}
            className="bg-slate-50 border border-slate-200 rounded-institutional p-5 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {fund.name}
                  </h3>
                  {fund.vintageYear && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-institutional text-xs font-medium">
                      Vintage {fund.vintageYear}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-institutional text-xs font-medium ${
                    fund.status === 'active' ? 'bg-green-50 text-green-700 border border-green-300' :
                    fund.status === 'closed' ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                    'bg-amber-50 text-amber-700 border border-amber-300'
                  }`}>
                    {fund.status.toUpperCase()}
                  </span>
                </div>
                {fund.description && (
                  <p className="text-sm text-slate-600 mb-3">{fund.description}</p>
                )}
                {fund.totalCommitment && (
                  <p className="text-xs text-slate-500">
                    Total Commitment: {formatCurrency(fund.totalCommitment)}
                  </p>
                )}
              </div>
            </div>

            {/* Fund Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-900 rounded-institutional p-4">
                <div className="text-xs text-slate-300 uppercase tracking-wide mb-1">
                  Annual Run-Rate
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(fund.totalSpending || 0)}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-institutional p-4">
                <div className="text-xs text-slate-600 uppercase tracking-wide mb-1">
                  Portfolio Companies
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {fund.companyCount || 0}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-institutional p-4">
                <div className="text-xs text-slate-600 uppercase tracking-wide mb-1">
                  Total Vendors
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {fund.vendorCount || 0}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-institutional p-4">
                <div className="text-xs text-slate-600 uppercase tracking-wide mb-1">
                  Avg per Company
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {fund.companyCount && fund.companyCount > 0
                    ? formatCurrency((fund.totalSpending || 0) / fund.companyCount)
                    : formatCurrency(0)}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600 hover:text-slate-900 font-medium">
                View Fund Details →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="bg-slate-900 rounded-institutional p-5">
          <div className="text-xs text-slate-300 uppercase tracking-wide mb-2">
            Total Portfolio Run-Rate
          </div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(
              fundsWithRollup.reduce((sum, fund) => sum + (fund.totalSpending || 0), 0)
            )}
          </div>
          <div className="text-sm text-slate-300 mt-2">
            Across {fundsWithRollup.length} funds • {fundsWithRollup.reduce((sum, fund) => sum + (fund.companyCount || 0), 0)} portfolio companies
          </div>
        </div>
      </div>
    </div>
  );
}

