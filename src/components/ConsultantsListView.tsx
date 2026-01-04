import { Company, Consultant } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import ConsultantDetailView from './ConsultantDetailView';
import ConsultantQuestionsForm from './ConsultantQuestionsForm';
import OutcomeServiceView from './OutcomeServiceView';
import { useState } from 'react';

interface ConsultantsListViewProps {
  company: Company;
  onBack: () => void;
}

export default function ConsultantsListView({ company, onBack }: ConsultantsListViewProps) {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);
  const [showOutcomeService, setShowOutcomeService] = useState(false);
  const [consultants, setConsultants] = useState<Consultant[]>(company.consultants);

  const handleSaveConsultant = (updatedConsultant: Consultant) => {
    setConsultants(consultants.map(c => c.id === updatedConsultant.id ? updatedConsultant : c));
    setShowQuestionsForm(false);
    setSelectedConsultant(updatedConsultant);
  };

  if (showQuestionsForm && selectedConsultant) {
    return (
      <ConsultantQuestionsForm
        company={company}
        consultant={selectedConsultant}
        onSave={handleSaveConsultant}
        onCancel={() => setShowQuestionsForm(false)}
      />
    );
  }

  if (showOutcomeService && selectedConsultant) {
    return (
      <OutcomeServiceView
        company={company}
        consultant={selectedConsultant}
        onBack={() => setShowOutcomeService(false)}
      />
    );
  }

  if (selectedConsultant) {
    return (
      <ConsultantDetailView
        company={company}
        consultant={selectedConsultant}
        onBack={() => setSelectedConsultant(null)}
        onAskQuestions={() => {
          setShowQuestionsForm(true);
        }}
        onViewOutcomeService={() => {
          if (selectedConsultant.overallOutputSummary) {
            setShowOutcomeService(true);
          }
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-800">
            Consultants - {company.name}
          </h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back
          </button>
        </div>
        <p className="text-gray-600">
          {company.consultants.length} active consultant{company.consultants.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Consultants List */}
      <div className="space-y-4">
        {consultants.map((consultant) => (
          <div
            key={consultant.id}
            onClick={() => setSelectedConsultant(consultant)}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-5 border-l-4 border-emerald-500 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{consultant.name}</h3>
                <p className="text-gray-600 text-sm">{consultant.firm} • {consultant.role}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(consultant.monthlyCost)}</p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{consultant.workDescription}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    consultant.status === 'active' ? 'bg-green-100 text-green-800' :
                    consultant.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {consultant.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {consultant.deliverables.length} deliverables
                  </span>
                  {consultant.overallOutputSummary && (
                    <span className="text-xs text-blue-600 font-semibold">✓ Questions answered</span>
                  )}
                </div>
                <span className="text-emerald-600 text-sm font-semibold">View Details →</span>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}

