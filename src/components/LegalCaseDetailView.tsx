import { LegalCase, Company } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatCurrency';

interface LegalCaseDetailViewProps {
  company: Company;
  legalCase: LegalCase;
  onBack: () => void;
}

export default function LegalCaseDetailView({ company, legalCase, onBack }: LegalCaseDetailViewProps) {
  const caseTypeColors: Record<string, string> = {
    litigation: 'bg-red-100 text-red-800 border-red-300',
    regulatory: 'bg-blue-100 text-blue-800 border-blue-300',
    contract: 'bg-green-100 text-green-800 border-green-300',
    employment: 'bg-purple-100 text-purple-800 border-purple-300',
    'intellectual-property': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    other: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    closed: 'bg-gray-100 text-gray-800 border-gray-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">{legalCase.caseName}</h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back to {company.name}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
            {legalCase.lawFirm}
          </span>
          <span className={`border px-3 py-1 rounded-full text-sm font-semibold ${statusColors[legalCase.status]}`}>
            {legalCase.status.toUpperCase()}
          </span>
          <span className={`border px-3 py-1 rounded-full text-sm font-semibold ${caseTypeColors[legalCase.caseType]}`}>
            {legalCase.caseType.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Case Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Case Description</h3>
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-700 leading-relaxed">{legalCase.description}</p>
        </div>
      </div>

      {/* Financial Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Monthly Cost</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(legalCase.monthlyCost)}</p>
          <p className="text-xs text-gray-500 mt-1">{formatFullCurrency(legalCase.monthlyCost)}/month</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(legalCase.totalSpent)}</p>
          <p className="text-xs text-gray-500 mt-1">{formatFullCurrency(legalCase.totalSpent)} total</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">Case Start Date</p>
        <p className="text-sm font-semibold text-gray-800">
          {new Date(legalCase.startDate).toLocaleDateString()}
        </p>
      </div>

      {/* Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Case Documents</h3>
        <div className="space-y-2">
          {legalCase.documents.length > 0 ? (
            legalCase.documents.map((doc) => (
              <div key={doc.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-400 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {doc.type.toUpperCase()} • Uploaded {new Date(doc.uploadedDate).toLocaleDateString()}
                    {doc.fileSize && ` • ${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`}
                  </p>
                </div>
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    View →
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No documents uploaded yet</p>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={onBack}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          Back to Legal Cases
        </button>
      </div>
    </div>
  );
}

