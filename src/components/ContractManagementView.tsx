import { Company } from '../types';
import ContractUploadForm from './ContractUploadForm';
import { useState } from 'react';

interface ContractManagementViewProps {
  company: Company;
  onBack: () => void;
  onContractSaved?: (companyId: string, contract: any) => void;
}

export default function ContractManagementView({ company, onBack, onContractSaved }: ContractManagementViewProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleContractSaved = (contract: any) => {
    if (onContractSaved) {
      onContractSaved(company.id, contract);
    }
    setShowUploadForm(false);
  };

  if (showUploadForm) {
    return (
      <ContractUploadForm
        company={company}
        onBack={() => setShowUploadForm(false)}
        onSave={handleContractSaved}
      />
    );
  }

  // Get all documents from all sources
  const allDocuments = [
    ...company.consultants.flatMap(c => c.contractStartDate ? [{
      id: `consultant-${c.id}`,
      name: `${c.name} - ${c.firm} Contract`,
      type: 'contract' as const,
      uploadedDate: c.contractStartDate,
      vendor: c.firm,
      category: 'Consultant',
    }] : []),
    ...company.saasProducts.flatMap(s => s.contractStartDate ? [{
      id: `saas-${s.id}`,
      name: `${s.name} - ${s.vendor} SLA`,
      type: 'sla' as const,
      uploadedDate: s.contractStartDate,
      vendor: s.vendor,
      category: 'SaaS',
    }] : []),
    ...company.legalCases.flatMap(l => l.documents),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-800">
            Contract Management - {company.name}
          </h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-600">
            {allDocuments.length} contract document{allDocuments.length !== 1 ? 's' : ''} on file
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Upload New Contract
          </button>
        </div>
      </div>

      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">📄</div>
          <h3 className="font-bold text-gray-800 mb-2">Upload Contract</h3>
          <p className="text-sm text-gray-600">Add a general contract document</p>
        </div>
        <div
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-bold text-gray-800 mb-2">Upload SOW</h3>
          <p className="text-sm text-gray-600">Statement of Work from consultants</p>
        </div>
        <div
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">⚖️</div>
          <h3 className="font-bold text-gray-800 mb-2">Upload SLA</h3>
          <p className="text-sm text-gray-600">Service Level Agreement with vendors</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">All Contracts & Documents</h3>
        {allDocuments.length > 0 ? (
          allDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">
                    {doc.type === 'sow' ? '📋' : doc.type === 'sla' ? '⚖️' : '📄'}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">{doc.name}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {doc.type.toUpperCase()} • {new Date(doc.uploadedDate).toLocaleDateString()}
                      {'fileSize' in doc && doc.fileSize && ` • ${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`}
                    </p>
                  </div>
                </div>
              </div>
              {'fileUrl' in doc && doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold ml-4"
                >
                  View →
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No contracts uploaded yet</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upload Your First Contract
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

