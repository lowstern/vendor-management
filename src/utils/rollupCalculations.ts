import { Company, Fund } from '../types';

/**
 * Calculate vendor spending for a company
 */
export function calculateCompanyVendorSpending(company: Company): number {
  const consultantSpending = company.consultants.reduce(
    (sum, c) => sum + c.monthlyCost,
    0
  );
  const saasSpending = company.saasProducts.reduce(
    (sum, s) => sum + s.monthlyCost,
    0
  );
  const legalSpending = company.legalCases.reduce(
    (sum, l) => sum + l.monthlyCost,
    0
  );
  
  return consultantSpending + saasSpending + legalSpending;
}

/**
 * Count total vendors for a company
 */
export function countCompanyVendors(company: Company): number {
  return (
    company.consultants.length +
    company.saasProducts.length +
    company.legalCases.length
  );
}

/**
 * Calculate fund-level roll-up metrics
 */
export function calculateFundRollup(fund: Fund, companies: Company[]): Fund {
  const fundCompanies = companies.filter(c => c.fundId === fund.id);
  
  const totalSpending = fundCompanies.reduce((sum, company) => {
    const companySpending = calculateCompanyVendorSpending(company);
    return sum + companySpending;
  }, 0);
  
  const vendorCount = fundCompanies.reduce((sum, company) => {
    return sum + countCompanyVendors(company);
  }, 0);
  
  // Annualize (multiply by 12 for monthly costs)
  const annualizedSpending = totalSpending * 12;
  
  return {
    ...fund,
    totalSpending: annualizedSpending,
    companyCount: fundCompanies.length,
    vendorCount,
  };
}

/**
 * Calculate company-level roll-up metrics
 */
export function calculateCompanyRollup(company: Company): Company {
  const totalVendorSpending = calculateCompanyVendorSpending(company);
  const vendorCount = countCompanyVendors(company);
  
  // Annualize (multiply by 12 for monthly costs)
  const annualizedSpending = totalVendorSpending * 12;
  
  return {
    ...company,
    totalVendorSpending: annualizedSpending,
    vendorCount,
  };
}

/**
 * Get all vendors for a company (flat list)
 */
export function getAllCompanyVendors(company: Company): Array<{
  id: string;
  name: string;
  type: 'consultant' | 'saas' | 'legal';
  monthlyCost: number;
  annualCost: number;
  category: string;
}> {
  const vendors: Array<{
    id: string;
    name: string;
    type: 'consultant' | 'saas' | 'legal';
    monthlyCost: number;
    annualCost: number;
    category: string;
  }> = [];

  company.consultants.forEach(consultant => {
    vendors.push({
      id: consultant.id,
      name: consultant.name,
      type: 'consultant',
      monthlyCost: consultant.monthlyCost,
      annualCost: consultant.monthlyCost * 12,
      category: 'Consultants',
    });
  });

  company.saasProducts.forEach(saas => {
    vendors.push({
      id: saas.id,
      name: saas.name,
      type: 'saas',
      monthlyCost: saas.monthlyCost,
      annualCost: saas.monthlyCost * 12,
      category: 'SaaS Software',
    });
  });

  company.legalCases.forEach(legal => {
    vendors.push({
      id: legal.id,
      name: legal.caseName,
      type: 'legal',
      monthlyCost: legal.monthlyCost,
      annualCost: legal.monthlyCost * 12,
      category: 'Legal Services',
    });
  });

  return vendors.sort((a, b) => b.annualCost - a.annualCost); // Sort by annual cost descending
}

/**
 * Get all companies for a fund
 */
export function getFundCompanies(fundId: string, companies: Company[]): Company[] {
  return companies.filter(c => c.fundId === fundId);
}

/**
 * Calculate fund-level vendor breakdown
 */
export function calculateFundVendorBreakdown(
  fund: Fund,
  companies: Company[]
): {
  totalConsultants: number;
  totalSaaS: number;
  totalLegal: number;
  totalSpending: number;
  vendorBreakdown: Array<{
    companyName: string;
    companyId: string;
    vendorCount: number;
    spending: number;
    vendors: Array<{
      name: string;
      type: string;
      monthlyCost: number;
      annualCost: number;
    }>;
  }>;
} {
  const fundCompanies = getFundCompanies(fund.id, companies);
  
  let totalConsultants = 0;
  let totalSaaS = 0;
  let totalLegal = 0;
  
  const vendorBreakdown = fundCompanies.map(company => {
    const companyVendors = getAllCompanyVendors(company);
    
    const consultantCount = company.consultants.length;
    const saasCount = company.saasProducts.length;
    const legalCount = company.legalCases.length;
    
    totalConsultants += consultantCount;
    totalSaaS += saasCount;
    totalLegal += legalCount;
    
    const companySpending = calculateCompanyVendorSpending(company);
    
    return {
      companyName: company.name,
      companyId: company.id,
      vendorCount: companyVendors.length,
      spending: companySpending * 12, // Annualize
      vendors: companyVendors.map(v => ({
        name: v.name,
        type: v.type,
        monthlyCost: v.monthlyCost,
        annualCost: v.annualCost,
      })),
    };
  });
  
  const totalSpending = (totalConsultants + totalSaaS + totalLegal) > 0
    ? fundCompanies.reduce((sum, c) => {
        const spending = calculateCompanyVendorSpending(c);
        return sum + (spending * 12);
      }, 0)
    : 0;
  
  return {
    totalConsultants,
    totalSaaS,
    totalLegal,
    totalSpending,
    vendorBreakdown: vendorBreakdown.sort((a, b) => b.spending - a.spending),
  };
}

