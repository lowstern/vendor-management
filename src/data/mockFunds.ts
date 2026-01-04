import { Fund } from '../types';

export const mockFunds: Fund[] = [
  {
    id: 'fund-1',
    name: 'TechVenture Fund III',
    firmId: 'firm-1',
    description: 'Early-stage technology investments focused on enterprise software and SaaS',
    vintageYear: 2021,
    totalCommitment: 250000000, // $250M
    status: 'active',
    createdAt: '2021-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'fund-2',
    name: 'Growth Partners Fund II',
    firmId: 'firm-2',
    description: 'Growth-stage investments in fintech and healthcare technology',
    vintageYear: 2022,
    totalCommitment: 500000000, // $500M
    status: 'active',
    createdAt: '2022-03-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

