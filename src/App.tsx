import { useState } from 'react';
import { mockCompanies } from './data/mockCompanies';
import { Company, ViewMode, Firm } from './types';
import { useAuth } from './contexts/AuthContext';
import SwipeableCard from './components/SwipeableCard';
import CompanyCard from './components/CompanyCard';
import ConsultantsListView from './components/ConsultantsListView';
import SaaSListView from './components/SaaSListView';
import LegalServicesListView from './components/LegalServicesListView';
import ContractManagementView from './components/ContractManagementView';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import DuoVerification from './components/DuoVerification';
import VCPPortal from './components/VCPPortal';
import CompanyDashboard from './components/CompanyDashboard';
import FirmSetup from './components/FirmSetup';
import FirmSettings from './components/FirmSettings';
import OrgBreakdownView from './components/OrgBreakdownView';

function App() {
  const { isAuthenticated, user, firm, logout, needsDuoVerification } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'firm-setup'>('login');
  const [showFirmSetup, setShowFirmSetup] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [swipedCompanies, setSwipedCompanies] = useState<{
    accepted: Company[];
    rejected: Company[];
  }>({ accepted: [], rejected: [] });
  const [currentView, setCurrentView] = useState<ViewMode>('swipe');
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [icView, setIcView] = useState(false); // Investment Committee View toggle

  const handleSwipe = (direction: 'left' | 'right') => {
    if (companies.length === 0) return;

    const currentCompany = companies[0];
    const updatedCompanies = companies.slice(1);

    setCompanies(updatedCompanies);
    
    if (direction === 'right') {
      setSwipedCompanies((prev) => ({
        ...prev,
        accepted: [...prev.accepted, currentCompany],
      }));
    } else {
      setSwipedCompanies((prev) => ({
        ...prev,
        rejected: [...prev.rejected, currentCompany],
      }));
    }
  };

  const handleButtonClick = (direction: 'left' | 'right') => {
    handleSwipe(direction);
  };

  const handleReset = () => {
    setCompanies(mockCompanies);
    setSwipedCompanies({ accepted: [], rejected: [] });
    setCurrentView('swipe');
    setCurrentCompany(null);
  };

  const handleViewConsultants = (company: Company) => {
    setCurrentCompany(company);
    setCurrentView('consultant-detail');
  };

  const handleViewSaaS = (company: Company) => {
    setCurrentCompany(company);
    setCurrentView('saas-detail');
  };

  const handleViewLegal = (company: Company) => {
    setCurrentCompany(company);
    setCurrentView('legal-detail');
  };

  const handleViewContracts = (company: Company) => {
    setCurrentCompany(company);
    setCurrentView('contracts');
  };

  const handleBackToSwipe = () => {
    setCurrentView('swipe');
    setCurrentCompany(null);
  };

  const handleContractSaved = (companyId: string, contract: any) => {
    // In a real app, this would update the backend
    // For now, just show a success message
    console.log('Contract saved for company:', companyId, contract);
  };

  // Show firm setup if needed
  if (showFirmSetup) {
    return (
      <FirmSetup
        onComplete={(_newFirm: Firm) => {
          setShowFirmSetup(false);
          setAuthView('login');
        }}
      />
    );
  }

  // Show Duo verification if required
  if (needsDuoVerification && user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <DuoVerification
          username={user.email}
          onVerified={() => {
            // Reload to show authenticated view
            window.location.reload();
          }}
          onCancel={() => {
            logout();
            setAuthView('login');
          }}
        />
      </div>
    );
  }

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        {authView === 'login' ? (
          <LoginForm onSwitchToSignup={() => setAuthView('signup')} />
        ) : authView === 'signup' ? (
          <SignupForm onSwitchToLogin={() => setAuthView('login')} />
        ) : null}
        <div className="absolute bottom-8 text-center">
          <button
            onClick={() => setShowFirmSetup(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
          >
            Set up your firm →
          </button>
        </div>
      </div>
    );
  }

  // Render detail views with protection
  if (currentView === 'consultant-detail' && currentCompany) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <ConsultantsListView company={currentCompany} onBack={handleBackToSwipe} />
        </div>
      </ProtectedRoute>
    );
  }

  if (currentView === 'saas-detail' && currentCompany) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <SaaSListView company={currentCompany} onBack={handleBackToSwipe} />
        </div>
      </ProtectedRoute>
    );
  }

  if (currentView === 'legal-detail' && currentCompany) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <LegalServicesListView company={currentCompany} onBack={handleBackToSwipe} />
        </div>
      </ProtectedRoute>
    );
  }

  if ((currentView === 'contracts' || currentView === 'contract-upload') && currentCompany) {
    return (
      <ProtectedRoute requiredRole="user">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <ContractManagementView 
            company={currentCompany} 
            onBack={handleBackToSwipe}
            onContractSaved={handleContractSaved}
          />
        </div>
      </ProtectedRoute>
    );
  }

  if (currentView === 'vcp' && firm) {
    return (
      <ProtectedRoute>
        <VCPPortal firm={firm} onBack={handleBackToSwipe} />
      </ProtectedRoute>
    );
  }

  if (currentView === 'dashboard' && currentCompany) {
    return (
      <ProtectedRoute>
        <CompanyDashboard company={currentCompany} onBack={handleBackToSwipe} />
      </ProtectedRoute>
    );
  }

  if (currentView === 'firm-settings') {
    return (
      <ProtectedRoute requiredRole="admin">
        <FirmSettings onBack={handleBackToSwipe} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* Header with User Info */}
        <div className="mb-8 text-center w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 border border-slate-300 rounded-institutional px-3 py-1.5">
                <span className="text-xs font-medium text-slate-700">
                  {user?.name || 'User'}
                </span>
              </div>
              {firm && (
                <span className="text-xs text-slate-600">
                  {firm.name}
                </span>
              )}
              {user && (
                <span className="text-xs text-slate-500 uppercase tracking-wide">
                  {user.role}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* IC View Toggle */}
              {currentView === 'swipe' && (
                <button
                  onClick={() => setIcView(!icView)}
                  className={`px-3 py-1.5 rounded-institutional text-xs font-medium transition-colors border ${
                    icView 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {icView ? 'IC View' : 'Standard View'}
                </button>
              )}
              
              {/* Org Breakdown */}
              <button
                onClick={() => setCurrentView('org-breakdown')}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-institutional text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                Org Breakdown
              </button>
              
              {firm && firm.vcpEnabled && (
                <button
                  onClick={() => setCurrentView('vcp')}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-institutional text-xs font-medium hover:bg-slate-200 transition-colors"
                >
                  VCP Portal
                </button>
              )}
              
              {user && user.role === 'admin' && (
                <button
                  onClick={() => setCurrentView('firm-settings')}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-institutional text-xs font-medium hover:bg-slate-200 transition-colors"
                >
                  ⚙️ Settings
                </button>
              )}
              
              <button
                onClick={logout}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium"
              >
                Logout
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-1">
            Vendor Portfolio Management
          </h1>
          <p className="text-sm text-slate-600">
            {icView ? 'Investment Committee Review' : 'Manage vendor exposure and relationships'}
          </p>
        </div>

      {/* Stats */}
      {!icView && (
        <div className="mb-8 flex gap-4">
          <div className="bg-white border border-slate-200 rounded-institutional px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Remaining</p>
            <p className="text-xl font-semibold text-slate-900">{companies.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-institutional px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Accepted</p>
            <p className="text-xl font-semibold text-slate-900">{swipedCompanies.accepted.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-institutional px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Rejected</p>
            <p className="text-xl font-semibold text-slate-900">{swipedCompanies.rejected.length}</p>
          </div>
        </div>
      )}

      {/* Card Stack or IC View List */}
      {icView ? (
        <div className="w-full max-w-4xl mb-8">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
              Investment Committee Review
            </h3>
            <p className="text-xs text-slate-500">
              Executive summary view: vendor, run-rate, risk flags, recommended action
            </p>
          </div>
          <div className="space-y-0">
            {companies.map((company) => (
              <div key={company.id} className="mb-0">
                <CompanyCard
                  company={company}
                  onViewConsultants={() => handleViewConsultants(company)}
                  onViewSaaS={() => handleViewSaaS(company)}
                  onViewLegal={() => handleViewLegal(company)}
                  onViewContracts={() => handleViewContracts(company)}
                  icView={true}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-md h-[600px] flex items-center justify-center mb-8">
          {companies.length > 0 ? (
            companies.map((company, index) => (
              <SwipeableCard
                key={company.id}
                company={company}
                onSwipe={handleSwipe}
                index={index}
                totalCards={companies.length}
                onViewConsultants={() => handleViewConsultants(company)}
                onViewSaaS={() => handleViewSaaS(company)}
                onViewLegal={() => handleViewLegal(company)}
                onViewContracts={() => handleViewContracts(company)}
              />
            ))
          ) : (
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              All done! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You've reviewed all companies.
            </p>
            <button
              onClick={handleReset}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {companies.length > 0 && (
        <div className="flex gap-6">
          <button
            onClick={() => handleButtonClick('left')}
            className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors w-16 h-16 flex items-center justify-center text-2xl"
            aria-label="Reject"
          >
            ✗
          </button>
          <button
            onClick={() => handleButtonClick('right')}
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors w-16 h-16 flex items-center justify-center text-2xl"
            aria-label="Accept"
          >
            ✓
          </button>
        </div>
      )}

      {/* Instructions */}
      {companies.length > 0 && (
        <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
          Swipe left to reject, right to accept. Or use the buttons below.
        </p>
      )}
      </div>
    </ProtectedRoute>
  );
}

export default App;


