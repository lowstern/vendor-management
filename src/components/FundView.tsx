import { useState } from 'react';
import { Fund, Company } from '../types';
import { calculateFundRollup, calculateFundVendorBreakdown, getFundCompanies } from '../utils/rollupCalculations';
import { formatCurrency } from '../utils/formatCurrency';

interface FundViewProps {
  fund: Fund;
  companies: Company[];
  onBack: () => void;
  onViewCompany?: (company: Company) => void;
}

export default function FundView({ fund, companies, onBack, onViewCompany }: FundViewProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  const fundRollup = calculateFundRollup(fund, companies);
  const vendorBreakdown = calculateFundVendorBreakdown(fund, companies);
  const fundCompanies = getFundCompanies(fund.id, companies);

  return (
    <div className="bg-white rounded-institutional-lg border border-slate-200 shadow-sm p-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">
              {fund.name}
            </h2>
            <div className="flex items-center gap-3 mt-2">
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
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Fund Summary */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-900 rounded-institutional p-4">
            <div className="text-xs text-slate-300 uppercase tracking-wide mb-1">
              Annual Run-Rate
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(fundRollup.totalSpending || 0)}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-institutional p-4">
            <div className="text-xs text-slate-600 uppercase tracking-wide mb-1">
              Portfolio Companies
            </div>
            <div className="text-2xl font-semibold text-slate-900">
              {fundRollup.companyCount || 0}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-institutional p-4">
            <div className="text-xs text-slate-600 uppercase tracking-wide mb-1">
              Total Vendors
            </div>
            <div className="text-2xl font-semibold text-slate-900">
              {fundRollup.vendorCount || 0}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-institutional p-4">
            <div className="text-xs text-slate-600 uppercase tracking-wide mb-1">
              Avg per Company
            </div>
            <div className="text-2xl font-semibold text-slate-900">
              {fundRollup.companyCount && fundRollup.companyCount > 0
                ? formatCurrency((fundRollup.totalSpending || 0) / fundRollup.companyCount)
                : formatCurrency(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Breakdown by Type */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
          Vendor Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-institutional p-4">
            <div className="text-xs text-slate-600 mb-1">Consultants</div>
            <div className="text-xl font-semibold text-slate-900">{vendorBreakdown.totalConsultants}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-institutional p-4">
            <div className="text-xs text-slate-600 mb-1">SaaS Products</div>
            <div className="text-xl font-semibold text-slate-900">{vendorBreakdown.totalSaaS}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-institutional p-4">
            <div className="text-xs text-slate-600 mb-1">Legal Services</div>
            <div className="text-xl font-semibold text-slate-900">{vendorBreakdown.totalLegal}</div>
          </div>
        </div>
      </div>

      {/* Portfolio Companies */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Portfolio Companies ({fundCompanies.length})
        </h3>
        
        <div className="space-y-3">
          {vendorBreakdown.vendorBreakdown.map((companyData) => {
            const isExpanded = selectedCompany === companyData.companyId;
            const company = fundCompanies.find(c => c.id === companyData.companyId);
            
            return (
              <div
                key={companyData.companyId}
                className="bg-slate-50 border border-slate-200 rounded-institutional p-4 hover:border-slate-300 transition-colors"
              >
                {/* Company Header */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedCompany(isExpanded ? null : companyData.companyId)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-slate-400 font-semibold">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">
                        {companyData.companyName}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {companyData.vendorCount} vendors • {formatCurrency(companyData.spending)} annual
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(companyData.spending)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Annual Run-Rate
                    </div>
                  </div>
                  {onViewCompany && company && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCompany(company);
                      }}
                      className="ml-4 px-3 py-1.5 bg-slate-900 text-white rounded-institutional text-xs font-medium hover:bg-slate-800"
                    >
                      View →
                    </button>
                  )}
                </div>

                {/* Expanded Vendor List */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                    {companyData.vendors.map((vendor, index) => (
                      <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-institutional p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-institutional text-xs font-medium ${
                            vendor.type === 'consultant' ? 'bg-blue-50 text-blue-700 border border-blue-300' :
                            vendor.type === 'saas' ? 'bg-purple-50 text-purple-700 border border-purple-300' :
                            'bg-amber-50 text-amber-700 border border-amber-300'
                          }`}>
                            {vendor.type.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-slate-900">
                            {vendor.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-900">
                            {formatCurrency(vendor.annualCost)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatCurrency(vendor.monthlyCost)}/mo
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fund Description */}
      {fund.description && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Fund Description</h3>
          <p className="text-sm text-slate-600">{fund.description}</p>
        </div>
      )}
    </div>
  );
}

