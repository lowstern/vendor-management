import { Company, SaaSProduct } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import SaaSDetailView from './SaaSDetailView';
import { useState } from 'react';

interface SaaSListViewProps {
  company: Company;
  onBack: () => void;
}

export default function SaaSListView({ company, onBack }: SaaSListViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<SaaSProduct | null>(null);

  if (selectedProduct) {
    return (
      <SaaSDetailView
        company={company}
        saasProduct={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-800">
            SaaS Products - {company.name}
          </h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back
          </button>
        </div>
        <p className="text-gray-600">
          {company.saasProducts.length} SaaS product{company.saasProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* SaaS Products List */}
      <div className="space-y-4">
        {company.saasProducts.map((product) => {
          const yesCount = product.usageQuestions.filter(q => q.answer === 'yes').length;
          const usagePercentage = (yesCount / product.usageQuestions.length) * 100;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border-l-4 border-indigo-500 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.vendor} • {product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-700">{formatCurrency(product.monthlyCost)}</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>
              
              {/* Usage Stats */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Usage Assessment</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {yesCount}/{product.usageQuestions.length} criteria met ({usagePercentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      usagePercentage >= 70 ? 'bg-green-500' :
                      usagePercentage >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' :
                    product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {product.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.seats} seats
                  </span>
                </div>
                <span className="text-indigo-600 text-sm font-semibold">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

