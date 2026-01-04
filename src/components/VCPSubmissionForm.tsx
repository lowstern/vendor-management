import { useState } from 'react';
import { VCPSubmission } from '../types';
import { sanitizeInput, validateFileSize, validateFileType, sanitizeFileName } from '../utils/validation';

interface VCPSubmissionFormProps {
  firmId: string;
  onSubmit: (submission: VCPSubmission) => void;
  onCancel: () => void;
}

export default function VCPSubmissionForm({ firmId, onSubmit, onCancel }: VCPSubmissionFormProps) {
  const [vendorName, setVendorName] = useState('');
  const [vendorType, setVendorType] = useState<'saas' | 'consultant' | 'legal' | 'other'>('saas');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');

    const sizeValidation = validateFileSize(file.size, 10);
    if (!sizeValidation.isValid) {
      setFileError(sizeValidation.error || 'File too large');
      return;
    }

    const typeValidation = validateFileType(file.name, ['.pdf', '.doc', '.docx', '.txt']);
    if (!typeValidation.isValid) {
      setFileError(typeValidation.error || 'Invalid file type');
      return;
    }

    setUploadedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submission: VCPSubmission = {
        id: `vcp-${Date.now()}`,
        firmId,
        vendorName: sanitizeInput(vendorName, 200),
        vendorType,
        monthlyCost: parseFloat(monthlyCost) || 0,
        contractStartDate,
        contractEndDate: contractEndDate || undefined,
        description: sanitizeInput(description, 1000),
        status: 'pending',
        submittedAt: new Date().toISOString(),
        documents: uploadedFile
          ? [
              {
                id: `doc-${Date.now()}`,
                name: sanitizeFileName(uploadedFile.name),
                type: 'contract',
                uploadedDate: new Date().toISOString(),
                fileUrl: URL.createObjectURL(uploadedFile),
                fileSize: uploadedFile.size,
              },
            ]
          : undefined,
      };

      onSubmit(submission);
    } catch (error: any) {
      setFileError(error.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Submit Vendor Data</h2>
        <p className="text-gray-600 mt-2">Share vendor cost information for review</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vendor Name *
            </label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vendor Type *
            </label>
            <select
              value={vendorType}
              onChange={(e) => setVendorType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="saas">SaaS Software</option>
              <option value="consultant">Consultant</option>
              <option value="legal">Legal Services</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monthly Cost *
          </label>
          <input
            type="number"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contract Start Date *
            </label>
            <input
              type="date"
              value={contractStartDate}
              onChange={(e) => setContractStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contract End Date
            </label>
            <input
              type="date"
              value={contractEndDate}
              onChange={(e) => setContractEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Contract Document (Optional)
          </label>
          {fileError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-2 text-sm">
              {fileError}
            </div>
          )}
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {uploadedFile && (
            <p className="text-sm text-green-600 mt-2">✓ {uploadedFile.name}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

