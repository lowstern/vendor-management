import { useState } from 'react';
import { Consultant, Company } from '../types';

interface ConsultantQuestionsFormProps {
  company: Company;
  consultant: Consultant;
  onSave: (consultant: Consultant) => void;
  onCancel: () => void;
}

export default function ConsultantQuestionsForm({ company, consultant, onSave, onCancel }: ConsultantQuestionsFormProps) {
  const [overallOutputSummary, setOverallOutputSummary] = useState(consultant.overallOutputSummary || '');
  const [decisionMaker, setDecisionMaker] = useState(consultant.decisionMaker || '');
  const [decisionMakerEmail, setDecisionMakerEmail] = useState(consultant.decisionMakerEmail || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedConsultant: Consultant = {
      ...consultant,
      overallOutputSummary,
      decisionMaker,
      decisionMakerEmail,
    };

    onSave(updatedConsultant);
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Consulting Firm Questions
        </h2>
        <p className="text-gray-600">
          {consultant.name} from {consultant.firm} - {company.name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Output Summary */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What is the overall output summarized simply? *
          </label>
          <textarea
            value={overallOutputSummary}
            onChange={(e) => setOverallOutputSummary(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            placeholder="Provide a clear, simple summary of what this consultant is delivering. What are the key outputs and outcomes?"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Summarize the main deliverables and expected outcomes in simple terms
          </p>
        </div>

        {/* Decision Maker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Who will be making the decision? *
          </label>
          <input
            type="text"
            value={decisionMaker}
            onChange={(e) => setDecisionMaker(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., John Smith, VP of Operations"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Name and title of the person responsible for decisions on this engagement
          </p>
        </div>

        {/* Decision Maker Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Decision Maker Email (Optional)
          </label>
          <input
            type="email"
            value={decisionMakerEmail}
            onChange={(e) => setDecisionMakerEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="decision.maker@company.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Contact email for the decision maker
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Why this matters:</strong> Understanding the overall output and decision maker helps track outcomes and ensures proper accountability for consulting engagements.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Answers'}
          </button>
        </div>
      </form>
    </div>
  );
}

