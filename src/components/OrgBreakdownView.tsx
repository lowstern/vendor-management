import { useState } from 'react';
import { OrgBreakdown, OrgMember } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

interface OrgBreakdownViewProps {
  onBack: () => void;
}

// Mock data - in production, fetch from API
const mockOrgBreakdown: OrgBreakdown = {
  id: 'org-1',
  firmId: 'firm-1',
  totalBudget: 100000000, // $100M
  fiscalYear: '2024',
  members: [
    {
      id: 'coo-1',
      name: 'Jane Smith',
      title: 'Chief Operating Officer',
      role: 'coo',
      budget: 100000000,
      directReports: [
        {
          id: 'vp-1',
          name: 'Michael Chen',
          title: 'VP Technology',
          role: 'vp',
          budget: 20000000, // $20M
          parentId: 'coo-1',
          directReports: [
            {
              id: 'dir-1',
              name: 'Sarah Johnson',
              title: 'Director Engineering',
              role: 'director',
              budget: 8000000,
              parentId: 'vp-1',
              directReports: [
                {
                  id: 'mgr-1',
                  name: 'David Lee',
                  title: 'Engineering Manager',
                  role: 'manager',
                  budget: 3000000,
                  parentId: 'dir-1',
                  directReports: [
                    {
                      id: 'op-1',
                      name: 'Alex Kim',
                      title: 'Senior Engineer',
                      role: 'operator',
                      budget: 500000,
                      parentId: 'mgr-1',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'vp-2',
          name: 'Emily Rodriguez',
          title: 'VP Operations',
          role: 'vp',
          budget: 20000000,
          parentId: 'coo-1',
          directReports: [
            {
              id: 'dir-2',
              name: 'Robert Taylor',
              title: 'Director Vendor Management',
              role: 'director',
              budget: 8000000,
              parentId: 'vp-2',
            },
          ],
        },
        {
          id: 'vp-3',
          name: 'James Wilson',
          title: 'VP Finance',
          role: 'vp',
          budget: 20000000,
          parentId: 'coo-1',
        },
        {
          id: 'vp-4',
          name: 'Lisa Anderson',
          title: 'VP Legal',
          role: 'vp',
          budget: 20000000,
          parentId: 'coo-1',
        },
        {
          id: 'vp-5',
          name: 'Thomas Brown',
          title: 'VP Security',
          role: 'vp',
          budget: 20000000,
          parentId: 'coo-1',
        },
      ],
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function OrgBreakdownView({ onBack }: OrgBreakdownViewProps) {
  const [orgBreakdown] = useState<OrgBreakdown>(mockOrgBreakdown);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set(['coo-1']));

  const toggleExpand = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const renderMember = (member: OrgMember, level: number = 0) => {
    const isExpanded = expandedMembers.has(member.id);
    const hasReports = member.directReports && member.directReports.length > 0;
    const budgetPercentage = (member.budget / orgBreakdown.totalBudget) * 100;

    const roleColors: Record<OrgMember['role'], string> = {
      coo: 'bg-slate-900 text-white',
      vp: 'bg-slate-800 text-slate-50',
      director: 'bg-slate-700 text-slate-100',
      manager: 'bg-slate-600 text-slate-100',
      operator: 'bg-slate-50 text-slate-900 border border-slate-300',
    };

    return (
      <div key={member.id} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all hover:shadow-sm ${
            level === 0 ? 'bg-slate-900 text-white' : 'bg-slate-50 border border-slate-200'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => hasReports && toggleExpand(member.id)}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasReports && (
              <span className="text-slate-400 font-semibold">
                {isExpanded ? '▼' : '▶'}
              </span>
            )}
            {!hasReports && <span className="w-4" />}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  level === 0 ? 'bg-white/20 text-white' : roleColors[member.role]
                }`}>
                  {member.role.toUpperCase()}
                </span>
                <span className={`font-semibold ${level === 0 ? 'text-white' : 'text-slate-900'}`}>
                  {member.name}
                </span>
              </div>
              <span className={`text-sm ${level === 0 ? 'text-slate-200' : 'text-slate-600'}`}>
                {member.title}
              </span>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${level === 0 ? 'text-white' : 'text-slate-900'}`}>
                {formatCurrency(member.budget)}
              </div>
              <div className={`text-xs ${level === 0 ? 'text-slate-300' : 'text-slate-500'}`}>
                {budgetPercentage.toFixed(1)}% of total
              </div>
            </div>
          </div>
        </div>

        {hasReports && isExpanded && (
          <div className="mt-1">
            {member.directReports!.map((report) => renderMember(report, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const totalBudget = orgBreakdown.totalBudget;
  const allocatedBudget = orgBreakdown.members.reduce(
    (sum, member) => sum + member.budget,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">
              Organizational Budget Breakdown
            </h2>
            <p className="text-sm text-slate-600">
              Fiscal Year {orgBreakdown.fiscalYear} • Hierarchy from COO to Operators
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-slate-50 rounded p-3 border border-slate-200">
            <div className="text-xs text-slate-600 mb-1">Total Portfolio Budget</div>
            <div className="text-xl font-bold text-slate-900">{formatCurrency(totalBudget)}</div>
          </div>
          <div className="bg-slate-50 rounded p-3 border border-slate-200">
            <div className="text-xs text-slate-600 mb-1">Allocated</div>
            <div className="text-xl font-bold text-slate-900">{formatCurrency(allocatedBudget)}</div>
          </div>
          <div className="bg-slate-50 rounded p-3 border border-slate-200">
            <div className="text-xs text-slate-600 mb-1">Remaining</div>
            <div className="text-xl font-bold text-slate-900">
              {formatCurrency(totalBudget - allocatedBudget)}
            </div>
          </div>
        </div>
      </div>

      {/* Org Hierarchy */}
      <div className="space-y-1">
        {orgBreakdown.members.map((member) => renderMember(member, 0))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-600 mb-2">Role Hierarchy:</div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-slate-900 text-white rounded text-xs font-semibold">COO</span>
          <span className="px-2 py-1 bg-slate-800 text-slate-50 rounded text-xs font-semibold">VP</span>
          <span className="px-2 py-1 bg-slate-700 text-slate-100 rounded text-xs font-semibold">DIRECTOR</span>
          <span className="px-2 py-1 bg-slate-600 text-slate-100 rounded text-xs font-semibold">MANAGER</span>
          <span className="px-2 py-1 bg-slate-50 text-slate-900 border border-slate-300 rounded text-xs font-semibold">OPERATOR</span>
        </div>
      </div>
    </div>
  );
}

