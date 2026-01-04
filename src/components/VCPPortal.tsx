import { useState } from 'react';
import { Firm, VCPSubmission } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import VCPSubmissionForm from './VCPSubmissionForm';

interface VCPPortalProps {
  firm: Firm;
  onBack?: () => void;
}

export default function VCPPortal({ firm, onBack }: VCPPortalProps) {
  const [submissions, setSubmissions] = useState<VCPSubmission[]>([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleSubmission = (submission: VCPSubmission) => {
    setSubmissions([...submissions, submission]);
    setShowSubmitForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Vendor Cost Portal (VCP)
              </h1>
              <p className="text-gray-600">{firm.name}</p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setShowSubmitForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>+</span>
              Submit Vendor Data
            </button>

            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    filter === status
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submission Form Modal */}
        {showSubmitForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <VCPSubmissionForm
                firmId={firm.id}
                onSubmit={handleSubmission}
                onCancel={() => setShowSubmitForm(false)}
              />
            </div>
          </div>
        )}

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {submission.vendorName}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {submission.vendorType}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : submission.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(submission.monthlyCost)}
                    </p>
                    <p className="text-xs text-gray-500">per month</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{submission.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
                  <div>
                    <p>
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                    <p>
                      Contract: {new Date(submission.contractStartDate).toLocaleDateString()}
                      {submission.contractEndDate &&
                        ` - ${new Date(submission.contractEndDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  {submission.documents && submission.documents.length > 0 && (
                    <span className="text-blue-600">
                      {submission.documents.length} document(s)
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No submissions yet
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Start by submitting vendor data using the button above'
                  : `No ${filter} submissions found`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View all submissions
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

