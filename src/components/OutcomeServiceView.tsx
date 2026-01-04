import { useState } from 'react';
import { Company, Consultant, OutcomeService, OutcomeMetric } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

interface OutcomeServiceViewProps {
  company: Company;
  consultant: Consultant;
  onBack: () => void;
}

export default function OutcomeServiceView({ company, consultant, onBack }: OutcomeServiceViewProps) {
  const [outcomeService, setOutcomeService] = useState<OutcomeService | null>(
    consultant.overallOutputSummary ? {
      id: `outcome-${consultant.id}`,
      consultantId: consultant.id,
      companyId: company.id,
      serviceName: `${consultant.name} - ${consultant.firm}`,
      description: consultant.workDescription,
      overallOutputSummary: consultant.overallOutputSummary || '',
      decisionMaker: consultant.decisionMaker || 'Not specified',
      decisionMakerEmail: consultant.decisionMakerEmail || '',
      outcomeMetrics: consultant.outcomeMetrics || [],
      status: consultant.status === 'active' ? 'active' : consultant.status === 'completed' ? 'completed' : 'paused',
      createdAt: consultant.contractStartDate,
      updatedAt: new Date().toISOString(),
    } : null
  );

  const [newMetric, setNewMetric] = useState({ name: '', target: '' });
  const [isAddingMetric, setIsAddingMetric] = useState(false);

  const handleAddMetric = () => {
    if (!newMetric.name || !newMetric.target) return;

    const metric: OutcomeMetric = {
      id: `metric-${Date.now()}`,
      metricName: newMetric.name,
      targetValue: newMetric.target,
      status: 'not-started',
    };

    if (outcomeService) {
      setOutcomeService({
        ...outcomeService,
        outcomeMetrics: [...outcomeService.outcomeMetrics, metric],
      });
    }

    setNewMetric({ name: '', target: '' });
    setIsAddingMetric(false);
  };

  if (!outcomeService) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Outcome as a Service Not Set Up
        </h2>
        <p className="text-gray-600 mb-6">
          Please answer the consulting firm questions first to enable Outcome as a Service tracking.
        </p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Outcome as a Service (OaaS)
            </h2>
            <p className="text-gray-600">{consultant.name} - {consultant.firm}</p>
            <p className="text-sm text-gray-500 mt-1">{company.name}</p>
          </div>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            ← Back
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            outcomeService.status === 'active' ? 'bg-green-100 text-green-800' :
            outcomeService.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {outcomeService.status.toUpperCase()}
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
            OaaS Active
          </span>
        </div>
      </div>

      {/* Overall Output Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Overall Output Summary</h3>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border-l-4 border-indigo-500">
          <p className="text-gray-700 leading-relaxed text-lg">{outcomeService.overallOutputSummary}</p>
        </div>
      </div>

      {/* Decision Maker */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <h4 className="font-semibold text-gray-800 mb-2">Decision Maker</h4>
          <p className="text-gray-700 font-semibold">{outcomeService.decisionMaker}</p>
          {outcomeService.decisionMakerEmail && (
            <p className="text-sm text-gray-600 mt-1">{outcomeService.decisionMakerEmail}</p>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Monthly Investment</h4>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(consultant.monthlyCost)}</p>
        </div>
      </div>

      {/* Outcome Metrics */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Outcome Metrics</h3>
          <button
            onClick={() => setIsAddingMetric(!isAddingMetric)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
          >
            + Add Metric
          </button>
        </div>

        {/* Add Metric Form */}
        {isAddingMetric && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-300">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Metric Name</label>
                <input
                  type="text"
                  value={newMetric.name}
                  onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., Cost Reduction"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Target Value</label>
                <input
                  type="text"
                  value={newMetric.target}
                  onChange={(e) => setNewMetric({ ...newMetric, target: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., 20% reduction"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddMetric}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Add Metric
              </button>
              <button
                onClick={() => {
                  setIsAddingMetric(false);
                  setNewMetric({ name: '', target: '' });
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Metrics List */}
        <div className="space-y-3">
          {outcomeService.outcomeMetrics.length > 0 ? (
            outcomeService.outcomeMetrics.map((metric) => {
              const statusColors = {
                'on-track': 'bg-green-100 text-green-800 border-green-300',
                'at-risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                'completed': 'bg-blue-100 text-blue-800 border-blue-300',
                'not-started': 'bg-gray-100 text-gray-800 border-gray-300',
              };
              return (
                <div key={metric.id} className={`bg-white rounded-lg p-4 border-2 ${statusColors[metric.status]}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{metric.metricName}</h4>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Target: <strong>{metric.targetValue}</strong></span>
                        {metric.currentValue && (
                          <span>Current: <strong>{metric.currentValue}</strong></span>
                        )}
                      </div>
                    </div>
                    <select
                      value={metric.status}
                      onChange={(e) => {
                        const updated = outcomeService.outcomeMetrics.map(m =>
                          m.id === metric.id ? { ...m, status: e.target.value as any } : m
                        );
                        setOutcomeService({ ...outcomeService, outcomeMetrics: updated });
                      }}
                      className={`px-3 py-1 rounded text-xs font-semibold border ${statusColors[metric.status]}`}
                    >
                      <option value="not-started">Not Started</option>
                      <option value="on-track">On Track</option>
                      <option value="at-risk">At Risk</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  {metric.lastUpdated && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(metric.lastUpdated).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No outcome metrics defined yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Metric" to start tracking outcomes</p>
            </div>
          )}
        </div>
      </div>

      {/* Service Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Service Description</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{outcomeService.description}</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={onBack}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Consultant Details
        </button>
      </div>
    </div>
  );
}

