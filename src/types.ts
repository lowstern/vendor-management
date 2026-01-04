export interface Consultant {
  id: string;
  name: string;
  firm: string;
  role: string;
  contractStartDate: string;
  contractEndDate: string;
  monthlyCost: number;
  workDescription: string;
  deliverables: string[];
  results: string[];
  status: 'active' | 'completed' | 'pending';
}

export interface SaaSProduct {
  id: string;
  name: string;
  vendor: string;
  category: string;
  contractStartDate: string;
  contractEndDate: string;
  monthlyCost: number;
  seats: number;
  usageQuestions: {
    question: string;
    answer: 'yes' | 'no' | 'partial' | 'unknown';
    notes?: string;
  }[];
  status: 'active' | 'inactive' | 'evaluating';
}

export interface LegalCase {
  id: string;
  caseName: string;
  lawFirm: string;
  caseType: 'litigation' | 'regulatory' | 'contract' | 'employment' | 'intellectual-property' | 'other';
  description: string;
  startDate: string;
  status: 'active' | 'closed' | 'pending';
  monthlyCost: number;
  totalSpent: number;
  documents: ContractDocument[];
}

export interface ContractDocument {
  id: string;
  name: string;
  type: 'contract' | 'sow' | 'sla' | 'amendment' | 'other';
  uploadedDate: string;
  fileUrl?: string;
  fileSize?: number;
  uploadedBy?: string;
}

export interface VendorSpending {
  saas: number;
  lawyers: number;
  consultants: number;
  total: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  description: string;
  spending: VendorSpending;
  employees: number;
  headquarters: string;
  consultants: Consultant[];
  saasProducts: SaaSProduct[];
  legalCases: LegalCase[];
}

export interface Firm {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  industry?: string;
  logo?: string;
  primaryColor?: string;
  vcpEnabled: boolean;
  duoEnabled: boolean;
  duoIntegrationKey?: string;
  duoSecretKey?: string;
  duoApiHostname?: string;
  createdAt: string;
  settings: {
    allowPublicVCP: boolean;
    requireApproval: boolean;
    autoSync: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  companyId?: string;
  firmId?: string;
  duoEnabled: boolean;
  duoRegistered: boolean;
  createdAt: string;
}

export interface VCPSubmission {
  id: string;
  firmId: string;
  submittedBy?: string;
  vendorName: string;
  vendorType: 'saas' | 'consultant' | 'legal' | 'other';
  monthlyCost: number;
  contractStartDate: string;
  contractEndDate?: string;
  description: string;
  documents?: ContractDocument[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  firm: Firm | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, firmId?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsDuoVerification: boolean;
  verifyDuo: (sigResponse: string) => Promise<boolean>;
  requestDuoAuth: () => Promise<string | null>;
}

export type SwipeDirection = 'left' | 'right' | null;
export type ViewMode = 'swipe' | 'consultant-detail' | 'saas-detail' | 'legal-detail' | 'contracts' | 'contract-upload' | 'login' | 'signup' | 'duo-verify' | 'vcp' | 'dashboard' | 'firm-setup' | 'vcp-submit' | 'firm-settings';
