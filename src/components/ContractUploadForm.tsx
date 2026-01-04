import { useState } from 'react';
import { Company, ContractDocument } from '../types';
import { validateFileName, validateFileSize, validateFileType, sanitizeFileName, sanitizeInput } from '../utils/validation';

interface ContractUploadFormProps {
  company: Company;
  onBack: () => void;
  onSave: (contract: any) => void;
}

export default function ContractUploadForm({ company, onBack, onSave }: ContractUploadFormProps) {
  const [contractType, setContractType] = useState<'contract' | 'sow' | 'sla' | 'amendment' | 'other'>('contract');
  const [contractName, setContractName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [contractDate, setContractDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [fileError, setFileError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');

    // Validate file name
    const fileNameValidation = validateFileName(file.name);
    if (!fileNameValidation.isValid) {
      setFileError(fileNameValidation.error || 'Invalid file name');
      return;
    }

    // Validate file size (max 10MB)
    const fileSizeValidation = validateFileSize(file.size, 10);
    if (!fileSizeValidation.isValid) {
      setFileError(fileSizeValidation.error || 'File too large');
      return;
    }

    // Validate file type
    const fileTypeValidation = validateFileType(file.name, ['.pdf', '.doc', '.docx', '.txt']);
    if (!fileTypeValidation.isValid) {
      setFileError(fileTypeValidation.error || 'Invalid file type');
      return;
    }

    // Sanitize file name
    const sanitizedName = sanitizeFileName(file.name);
    if (sanitizedName !== file.name) {
      // File name was sanitized, show warning but allow
      console.warn('File name was sanitized for security');
    }

    setUploadedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      setFileError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setFileError('');

    try {
      // Sanitize all inputs
      const sanitizedContractName = sanitizeInput(contractName || 'Untitled Document', 200);
      const sanitizedVendorName = sanitizeInput(vendorName, 200);
      const sanitizedNotes = sanitizeInput(notes, 1000);
      sanitizeFileName(uploadedFile.name); // Validate file name

      // In production, upload to secure storage (S3, Azure Blob, etc.)
      // For now, simulate secure upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDocument: ContractDocument = {
        id: `doc-${Date.now()}`,
        name: sanitizedContractName,
        type: contractType,
        uploadedDate: new Date().toISOString(),
        fileUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
        fileSize: uploadedFile?.size,
        uploadedBy: 'Current User', // In production, get from auth context
      };

      onSave({
        document: newDocument,
        contractType,
        contractName: sanitizedContractName,
        vendorName: sanitizedVendorName,
        contractDate,
        expirationDate,
        monthlyCost: monthlyCost ? parseFloat(monthlyCost) : 0,
        notes: sanitizedNotes,
      });

      setIsUploading(false);
      alert('Contract uploaded successfully!');
      onBack();
    } catch (error: any) {
      setFileError(error.message || 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-800">
            Upload Contract - {company.name}
          </h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back
          </button>
        </div>
        <p className="text-gray-600">Add a new contract, SOW, or SLA agreement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contract Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contract Type *
          </label>
          <select
            value={contractType}
            onChange={(e) => setContractType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="contract">Contract</option>
            <option value="sow">Statement of Work (SOW)</option>
            <option value="sla">Service Level Agreement (SLA)</option>
            <option value="amendment">Amendment</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Contract Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contract Name *
          </label>
          <input
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., SaaS Agreement with Salesforce"
            required
          />
        </div>

        {/* Vendor Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vendor/Service Provider *
          </label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Salesforce, McKinsey & Company"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contract Date *
            </label>
            <input
              type="date"
              value={contractDate}
              onChange={(e) => setContractDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expiration Date
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Monthly Cost */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monthly Cost (if applicable)
          </label>
          <input
            type="number"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Document *
          </label>
          {fileError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-2 text-sm">
              {fileError}
            </div>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              required
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {uploadedFile ? (
                <div>
                  <p className="text-green-600 font-semibold mb-2">✓ {uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setUploadedFile(null);
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT (MAX. 10MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Additional notes about this contract..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Contract'}
          </button>
        </div>
      </form>
    </div>
  );
}

