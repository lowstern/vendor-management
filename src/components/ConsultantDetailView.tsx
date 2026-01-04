import { Consultant, Company } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatCurrency';

interface ConsultantDetailViewProps {
  company: Company;
  consultant: Consultant;
  onBack: () => void;
}

export default function ConsultantDetailView({ company, consultant, onBack }: ConsultantDetailViewProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    completed: 'bg-gray-100 text-gray-800 border-gray-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">{consultant.name}</h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back to {company.name}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {consultant.firm}
          </span>
          <span className={`border px-3 py-1 rounded-full text-sm font-semibold ${statusColors[consultant.status]}`}>
            {consultant.status.toUpperCase()}
          </span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            {consultant.role}
          </span>
        </div>
      </div>

      {/* Contract Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Monthly Cost</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(consultant.monthlyCost)}</p>
          <p className="text-xs text-gray-500 mt-1">{formatFullCurrency(consultant.monthlyCost)}/month</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Contract Period</p>
          <p className="text-sm font-semibold text-gray-800">
            {new Date(consultant.contractStartDate).toLocaleDateString()} - {new Date(consultant.contractEndDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Work Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Work Description</h3>
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-700 leading-relaxed">{consultant.workDescription}</p>
        </div>
      </div>

      {/* Deliverables */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Deliverables & Outputs</h3>
        <div className="space-y-2">
          {consultant.deliverables.map((deliverable, index) => (
            <div key={index} className="bg-emerald-50 rounded-lg p-3 border-l-4 border-emerald-500">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <p className="text-gray-700">{deliverable}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results & Impact */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Results & Impact</h3>
        <div className="space-y-2">
          {consultant.results.map((result, index) => (
            <div key={index} className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">★</span>
                <p className="text-gray-700">{result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={onBack}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Company View
        </button>
      </div>
    </div>
  );
}

