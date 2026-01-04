-- Vendor Management Platform Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Firms (Multi-tenant organizations)
CREATE TABLE firms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  subdomain VARCHAR(100) UNIQUE,
  industry VARCHAR(100),
  vcp_enabled BOOLEAN DEFAULT false,
  duo_enabled BOOLEAN DEFAULT false,
  duo_integration_key VARCHAR(255),
  duo_secret_key VARCHAR(255),
  duo_api_hostname VARCHAR(255),
  settings JSONB DEFAULT '{
    "allowPublicVCP": false,
    "requireApproval": true,
    "autoSync": false
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  duo_enabled BOOLEAN DEFAULT false,
  duo_registered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  description TEXT,
  logo_url VARCHAR(500),
  employees INTEGER,
  headquarters VARCHAR(255),
  spending_saas DECIMAL(12, 2) DEFAULT 0,
  spending_lawyers DECIMAL(12, 2) DEFAULT 0,
  spending_consultants DECIMAL(12, 2) DEFAULT 0,
  spending_total DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultants
CREATE TABLE consultants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  firm VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  contract_start_date DATE,
  contract_end_date DATE,
  monthly_cost DECIMAL(12, 2) NOT NULL,
  work_description TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'pending')),
  -- Outcome as a Service fields
  overall_output_summary TEXT,
  decision_maker VARCHAR(255),
  decision_maker_email VARCHAR(255),
  outcome_metrics JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SaaS Products
CREATE TABLE saas_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  contract_start_date DATE,
  contract_end_date DATE,
  monthly_cost DECIMAL(12, 2) NOT NULL,
  seats INTEGER,
  usage_questions JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'evaluating')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal Cases
CREATE TABLE legal_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  case_name VARCHAR(255) NOT NULL,
  law_firm VARCHAR(255) NOT NULL,
  case_type VARCHAR(50) CHECK (case_type IN ('litigation', 'regulatory', 'contract', 'employment', 'intellectual-property', 'other')),
  description TEXT,
  start_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'pending')),
  monthly_cost DECIMAL(12, 2) NOT NULL,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract Documents
CREATE TABLE contract_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES consultants(id) ON DELETE CASCADE,
  legal_case_id UUID REFERENCES legal_cases(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('contract', 'sow', 'sla', 'amendment', 'other')),
  file_url VARCHAR(500),
  file_size BIGINT,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vendor_name VARCHAR(255),
  contract_date DATE,
  expiration_date DATE,
  monthly_cost DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VCP Submissions
CREATE TABLE vcp_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE NOT NULL,
  submitted_by UUID REFERENCES users(id),
  vendor_name VARCHAR(255) NOT NULL,
  vendor_type VARCHAR(20) CHECK (vendor_type IN ('saas', 'consultant', 'legal', 'other')),
  monthly_cost DECIMAL(12, 2) NOT NULL,
  contract_start_date DATE,
  contract_end_date DATE,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firm_id ON users(firm_id);
CREATE INDEX idx_companies_firm_id ON companies(firm_id);
CREATE INDEX idx_consultants_company_id ON consultants(company_id);
CREATE INDEX idx_saas_products_company_id ON saas_products(company_id);
CREATE INDEX idx_legal_cases_company_id ON legal_cases(company_id);
CREATE INDEX idx_contract_documents_company_id ON contract_documents(company_id);
CREATE INDEX idx_vcp_submissions_firm_id ON vcp_submissions(firm_id);
CREATE INDEX idx_vcp_submissions_status ON vcp_submissions(status);

-- Row Level Security (RLS) Policies
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vcp_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - users can only access their firm's data)
CREATE POLICY "Users can view their own firm" ON firms
  FOR SELECT USING (id IN (SELECT firm_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their firm's companies" ON companies
  FOR SELECT USING (firm_id IN (SELECT firm_id FROM users WHERE id = auth.uid()));

-- Add more RLS policies as needed for your security model

