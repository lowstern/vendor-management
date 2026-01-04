import { SaaSProduct, Company } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatCurrency';

interface SaaSDetailViewProps {
  company: Company;
  saasProduct: SaaSProduct;
  onBack: () => void;
}

export default function SaaSDetailView({ company, saasProduct, onBack }: SaaSDetailViewProps) {
  const answerColors = {
    yes: 'bg-green-100 text-green-800 border-green-300',
    no: 'bg-red-100 text-red-800 border-red-300',
    partial: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    unknown: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-gray-100 text-gray-800 border-gray-300',
    evaluating: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">{saasProduct.name}</h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back to {company.name}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
            {saasProduct.vendor}
          </span>
          <span className={`border px-3 py-1 rounded-full text-sm font-semibold ${statusColors[saasProduct.status]}`}>
            {saasProduct.status.toUpperCase()}
          </span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            {saasProduct.category}
          </span>
        </div>
      </div>

      {/* Contract Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Monthly Cost</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(saasProduct.monthlyCost)}</p>
          <p className="text-xs text-gray-500 mt-1">{formatFullCurrency(saasProduct.monthlyCost)}/month</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Licenses/Seats</p>
          <p className="text-2xl font-bold text-gray-800">{saasProduct.seats}</p>
          <p className="text-xs text-gray-500 mt-1">
            ${(saasProduct.monthlyCost / saasProduct.seats).toFixed(0)} per seat
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">Contract Period</p>
        <p className="text-sm font-semibold text-gray-800">
          {new Date(saasProduct.contractStartDate).toLocaleDateString()} - {new Date(saasProduct.contractEndDate).toLocaleDateString()}
        </p>
      </div>

      {/* Internal Usage Questions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Internal Usage Assessment</h3>
        <div className="space-y-4">
          {saasProduct.usageQuestions.map((qa, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-gray-800 flex-1">{qa.question}</p>
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold border ${answerColors[qa.answer]}`}>
                  {qa.answer.toUpperCase()}
                </span>
              </div>
              {qa.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">{qa.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={onBack}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Back to SaaS Products
        </button>
      </div>
    </div>
  );
}

