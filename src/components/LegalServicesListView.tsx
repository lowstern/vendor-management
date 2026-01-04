import { Company, LegalCase } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import LegalCaseDetailView from './LegalCaseDetailView';
import { useState } from 'react';

interface LegalServicesListViewProps {
  company: Company;
  onBack: () => void;
}

export default function LegalServicesListView({ company, onBack }: LegalServicesListViewProps) {
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);

  if (selectedCase) {
    return (
      <LegalCaseDetailView
        company={company}
        legalCase={selectedCase}
        onBack={() => setSelectedCase(null)}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-800">
            Legal Services - {company.name}
          </h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back
          </button>
        </div>
        <p className="text-gray-600">
          {company.legalCases.length} legal case{company.legalCases.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Legal Cases List */}
      <div className="space-y-4">
        {company.legalCases.map((legalCase) => {
          const caseTypeColors: Record<string, string> = {
            litigation: 'bg-red-100 text-red-800',
            regulatory: 'bg-blue-100 text-blue-800',
            contract: 'bg-green-100 text-green-800',
            employment: 'bg-purple-100 text-purple-800',
            'intellectual-property': 'bg-yellow-100 text-yellow-800',
            other: 'bg-gray-100 text-gray-800',
          };

          return (
            <div
              key={legalCase.id}
              onClick={() => setSelectedCase(legalCase)}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 border-l-4 border-amber-500 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{legalCase.caseName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{legalCase.lawFirm}</p>
                  <p className="text-gray-700 text-sm line-clamp-2">{legalCase.description}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-amber-700">{formatCurrency(legalCase.monthlyCost)}</p>
                  <p className="text-xs text-gray-500">per month</p>
                  <p className="text-sm text-gray-600 mt-1">Total: {formatCurrency(legalCase.totalSpent)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${caseTypeColors[legalCase.caseType]}`}>
                    {legalCase.caseType.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    legalCase.status === 'active' ? 'bg-green-100 text-green-800' :
                    legalCase.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {legalCase.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {legalCase.documents.length} document{legalCase.documents.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="text-amber-600 text-sm font-semibold">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

