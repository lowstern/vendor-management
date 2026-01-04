import { Firm } from '../types';

// Mock firms database - in production, use a real database/API
const MOCK_FIRMS: Firm[] = [
  {
    id: 'firm-1',
    name: 'TechCorp Inc.',
    domain: 'techcorp.com',
    subdomain: 'techcorp',
    industry: 'Technology',
    vcpEnabled: true,
    duoEnabled: false, // Duo is OPTIONAL - set to false to use without 2FA
    createdAt: new Date().toISOString(),
    settings: {
      allowPublicVCP: false,
      requireApproval: true,
      autoSync: false,
    },
  },
  {
    id: 'firm-2',
    name: 'Global Finance Group',
    domain: 'globalfinance.com',
    subdomain: 'globalfinance',
    industry: 'Financial Services',
    vcpEnabled: true,
    duoEnabled: false,
    createdAt: new Date().toISOString(),
    settings: {
      allowPublicVCP: true,
      requireApproval: false,
      autoSync: true,
    },
  },
];

export const firmService = {
  getFirm(firmId: string): Firm | null {
    return MOCK_FIRMS.find((f) => f.id === firmId) || null;
  },

  getFirmBySubdomain(subdomain: string): Firm | null {
    return MOCK_FIRMS.find((f) => f.subdomain === subdomain) || null;
  },

  getAllFirms(): Firm[] {
    return MOCK_FIRMS;
  },

  createFirm(firm: Omit<Firm, 'id' | 'createdAt'>): Firm {
    const newFirm: Firm = {
      ...firm,
      id: `firm-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    MOCK_FIRMS.push(newFirm);
    return newFirm;
  },

  updateFirm(firmId: string, updates: Partial<Firm>): Firm | null {
    const index = MOCK_FIRMS.findIndex((f) => f.id === firmId);
    if (index === -1) return null;

    MOCK_FIRMS[index] = { ...MOCK_FIRMS[index], ...updates };
    return MOCK_FIRMS[index];
  },

  enableDuo(firmId: string, integrationKey: string, secretKey: string, apiHostname: string): boolean {
    const firm = this.updateFirm(firmId, {
      duoEnabled: true,
      duoIntegrationKey: integrationKey,
      duoSecretKey: secretKey,
      duoApiHostname: apiHostname,
    });
    return firm !== null;
  },

  disableDuo(firmId: string): boolean {
    const firm = this.updateFirm(firmId, {
      duoEnabled: false,
      duoIntegrationKey: undefined,
      duoSecretKey: undefined,
      duoApiHostname: undefined,
    });
    return firm !== null;
  },
};

