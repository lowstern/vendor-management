import { Company } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatCurrency';

interface CompanyCardProps {
  company: Company;
  onViewConsultants?: () => void;
  onViewSaaS?: () => void;
  onViewLegal?: () => void;
  onViewContracts?: () => void;
  icView?: boolean; // Investment Committee View
}

interface VendorExposure {
  category: string;
  amount: number;
  percentage: number;
  vendorCount: number;
  avgMonthly: number;
  riskFlags: {
    contractTerm: string;
    terminationFlexibility: 'flexible' | 'moderate' | 'locked';
    regulatoryRisk: 'low' | 'medium' | 'high';
  };
}

export default function CompanyCard({ 
  company, 
  onViewConsultants, 
  onViewSaaS, 
  onViewLegal, 
  onViewContracts,
  icView = false 
}: CompanyCardProps) {
  const spending = company.spending;
  
  // Calculate exposure ladder (sorted by amount, descending)
  const exposureLadder: VendorExposure[] = [
    {
      category: 'Consultants',
      amount: spending.consultants,
      percentage: (spending.consultants / spending.total) * 100,
      vendorCount: company.consultants?.length || 0,
      avgMonthly: spending.consultants / (company.consultants?.length || 1),
      riskFlags: {
        contractTerm: '12-24mo',
        terminationFlexibility: 'moderate' as const,
        regulatoryRisk: 'low' as const,
      },
    },
    {
      category: 'SaaS Software',
      amount: spending.saas,
      percentage: (spending.saas / spending.total) * 100,
      vendorCount: company.saasProducts?.length || 0,
      avgMonthly: spending.saas / (company.saasProducts?.length || 1),
      riskFlags: {
        contractTerm: 'Annual',
        terminationFlexibility: 'locked' as const,
        regulatoryRisk: 'medium' as const,
      },
    },
    {
      category: 'Legal Services',
      amount: spending.lawyers,
      percentage: (spending.lawyers / spending.total) * 100,
      vendorCount: company.legalCases?.length || 0,
      avgMonthly: spending.lawyers / (company.legalCases?.length || 1),
      riskFlags: {
        contractTerm: 'Project-based',
        terminationFlexibility: 'flexible' as const,
        regulatoryRisk: 'high' as const,
      },
    },
  ].sort((a, b) => b.amount - a.amount); // Sort by exposure amount

  // Portfolio average (mock - would come from API)
  const portfolioAverage = spending.total * 1.15; // 15% above as benchmark

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'high': return 'bg-red-50 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getTerminationColor = (flex: string) => {
    switch (flex) {
      case 'flexible': return 'bg-green-50 text-green-700 border-green-300';
      case 'moderate': return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'locked': return 'bg-red-50 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  // IC View - Executive Summary
  if (icView) {
    return (
      <div className="bg-white rounded border border-slate-200 p-4 mb-6 shadow-sm hover:shadow transition-shadow">
        <div className="grid grid-cols-5 gap-4 items-center">
          <div className="col-span-2">
            <div className="font-semibold text-slate-900 text-sm">{company.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{company.industry}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900">
              {formatCurrency(spending.total)}
            </div>
            <div className="text-xs text-slate-500">Annual Run-Rate</div>
          </div>
          <div>
            <div className="flex gap-1 flex-wrap">
              {exposureLadder[0]?.riskFlags.regulatoryRisk === 'high' && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded text-xs font-medium">
                  High Risk
                </span>
              )}
              {exposureLadder[0]?.riskFlags.terminationFlexibility === 'locked' && (
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded text-xs font-medium">
                  Locked
                </span>
              )}
            </div>
          </div>
          <div>
            <button className="text-xs text-slate-600 hover:text-slate-900 font-medium">
              Review →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full View
  return (
    <div className="bg-white rounded-institutional-lg border border-slate-200 shadow-sm p-4 mb-6 hover:shadow transition-all">
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">{company.name}</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium">
                {company.industry}
              </span>
              <span className="text-xs text-slate-500">
                {company.employees.toLocaleString()} employees
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Annualized Run-Rate Exposure */}
      <div className="bg-slate-900 rounded-institutional p-4 mb-4">
        <p className="text-xs text-slate-300 mb-1 uppercase tracking-wide font-medium">
          Annualized Run-Rate Exposure
        </p>
        <p className="text-3xl font-bold text-white mb-1">{formatCurrency(spending.total)}</p>
        <p className="text-xs text-slate-400">{formatFullCurrency(spending.total)}</p>
      </div>

      {/* Exposure Ladder (Monochrome) */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
          Portfolio Opex Exposure
        </h3>
        
        {/* Benchmark line */}
        <div className="relative mb-4" style={{ height: '8px' }}>
          <div className="absolute top-0 left-0 right-0 h-full bg-slate-100 rounded-institutional">
            <div 
              className="absolute top-0 h-full bg-slate-300 rounded-institutional"
              style={{ 
                width: `${(spending.total / portfolioAverage) * 100}%`,
                maxWidth: '100%'
              }}
            />
          </div>
          {/* Benchmark indicator */}
          <div 
            className="absolute top-0 w-0.5 h-full bg-slate-500"
            style={{ left: '100%' }}
          >
            <span className="absolute -top-4 left-0 text-xs text-slate-500 whitespace-nowrap">
              Benchmark
            </span>
          </div>
        </div>

        {/* Exposure items (sorted by amount) */}
        <div className="space-y-3">
          {exposureLadder.map((exposure) => (
            <div 
              key={exposure.category}
              className="cursor-pointer hover:bg-slate-50 rounded-institutional p-2 transition-colors"
              onClick={
                exposure.category === 'Consultants' ? onViewConsultants :
                exposure.category === 'SaaS Software' ? onViewSaaS :
                onViewLegal
              }
            >
              {/* Primary row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">
                    {exposure.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {exposure.vendorCount} vendors
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {formatCurrency(exposure.amount)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {exposure.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Monochrome exposure bar */}
              <div className="mb-2">
                <div className="w-full h-1.5 bg-slate-100 rounded-institutional relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-slate-700 rounded-institutional"
                    style={{
                      width: `${exposure.percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Secondary row - Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <span className="px-1.5 py-0.5 bg-slate-50 text-slate-700 border border-slate-300 rounded-institutional text-xs font-medium">
                  Term: {exposure.riskFlags.contractTerm}
                </span>
                <span className={`px-1.5 py-0.5 border rounded-institutional text-xs font-medium ${getTerminationColor(exposure.riskFlags.terminationFlexibility)}`}>
                  {exposure.riskFlags.terminationFlexibility === 'flexible' ? 'Flexible Exit' :
                   exposure.riskFlags.terminationFlexibility === 'moderate' ? 'Moderate Lock' :
                   'Locked In'}
                </span>
                <span className={`px-1.5 py-0.5 border rounded-institutional text-xs font-medium ${getRiskColor(exposure.riskFlags.regulatoryRisk)}`}>
                  {exposure.riskFlags.regulatoryRisk === 'high' ? 'Regulatory Risk' :
                   exposure.riskFlags.regulatoryRisk === 'medium' ? 'Moderate Risk' :
                   'Low Risk'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {onViewContracts && (
        <div className="pt-3 border-t border-slate-200">
          <button
            onClick={onViewContracts}
            className="w-full bg-slate-900 text-white py-2 rounded-institutional text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Manage Contracts
          </button>
        </div>
      )}
    </div>
  );
}
