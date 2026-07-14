import { useState, useEffect } from 'react';
import { 
  Views 
} from './components/Views';
import { useState, useEffect } from 'react';
import { 
  Views 
} from './components/Views';
import { 
  LayoutDashboard, ShoppingBag, Calendar, FileText, Layers, Cpu, 
  Coins, Hammer, Wrench, CheckSquare, PackageCheck, Truck, 
  BarChart3, Database, Settings, RefreshCw, X, Shield, Layers2,
  ChevronRight
} from 'lucide-react';
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto disappear toast logic
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
  };

  // Human-readable breadcrumbs mapping corresponding structure
  const getBreadcrumbs = () => {
    switch (currentView) {
      case 'dashboard': return ['Dashboard'];
      case 'sales-orders': return ['Sales', 'Sales Orders'];
      case 'scheduling': return ['Sales', 'Scheduling'];
      case 'work-orders': return ['Sales', 'Work Orders'];
      case 'wip': return ['Production', 'Work In Progress'];
      case 'material-issue': return ['Production', 'Material Issue'];
      case 'core-winding': return ['Production', 'Core Winding'];
      case 'stacking': return ['Production', 'Stacking'];
      case 'assembly': return ['Production', 'Assembly'];
      case 'qc': return ['Production', 'Internal QC'];
      case 'ready-dispatch': return ['Production', 'Ready for Dispatch'];
      case 'dispatch': return ['Production', 'Dispatch'];
      case 'reports': return ['Reports'];
      case 'masters': return ['Masters'];
      case 'settings': return ['Settings'];
      default: return ['Home'];
    }
  };

  // Human-readable detailed page title mapping
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Factory Overview Dashboard';
      case 'sales-orders': return 'HT Transformer Sales Orders';
      case 'scheduling': return 'Assembly Line Scheduler';
      case 'work-orders': return 'Staged Shopfloor Work Orders';
      case 'wip': return 'WIP (Work In Progress) Staging';
      case 'material-issue': return 'BOM Material Store Allocation';
      case 'core-winding': return 'Copper Coil Winding Control';
      case 'stacking': return 'CRGO Lamination Core Stacking';
      case 'assembly': return 'Core-Coil Assembly Tanking Bench';
      case 'qc': return 'HT Insulation Routine QC Check';
      case 'ready-dispatch': return 'Final Yard Shipping Approvals';
      case 'dispatch': return 'Transporter Outward Releases';
      case 'reports': return 'Production Analytics Reports';
      case 'masters': return 'BOM Routing Master Files';
      case 'settings': return 'Factory Settings & Rules';
      default: return 'Manufacturing execution system';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* 1. Dark Industrial Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-900 shrink-0">
        <div className="p-4 border-b border-slate-900 bg-slate-950 flex items-center gap-2">
          <Layers2 className="h-6 w-6 text-indigo-500" />
          <div>
            <h1 className="text-sm font-extrabold tracking-wider text-white">PROCESSWALLAH</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">HT Mfg Suite v1</p>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Main Top-Level Route */}
          <div>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'dashboard' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Section: Sales */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Sales & Scheduling</p>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setCurrentView('sales-orders')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'sales-orders' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <ShoppingBag size={14} />
                  Sales Orders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('scheduling')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'scheduling' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Calendar size={14} />
                  Scheduling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('work-orders')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'work-orders' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <FileText size={14} />
                  Work Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Section: Production Floor Stages */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Production Floor</p>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setCurrentView('wip')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'wip' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Layers size={14} />
                  Work In Progress (WIP)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('material-issue')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'material-issue' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Coins size={14} />
                  Material Issue
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('core-winding')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'core-winding' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Cpu size={14} />
                  Core Winding
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('stacking')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'stacking' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Hammer size={14} />
                  Stacking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('assembly')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'assembly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Wrench size={14} />
                  Assembly
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('qc')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'qc' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <CheckSquare size={14} />
                  Internal QC
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('ready-dispatch')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'ready-dispatch' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <PackageCheck size={14} />
                  Ready for Dispatch
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('dispatch')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'dispatch' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Truck size={14} />
                  Dispatch
                </button>
              </li>
            </ul>
          </div>

          {/* Core Analytics, Masters & System Configurations */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Reports & Masters</p>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setCurrentView('reports')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'reports' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <BarChart3 size={14} />
                  Reports
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('masters')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'masters' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Database size={14} />
                  Masters
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all ${
                    currentView === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Settings size={14} />
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Corporate branding footer */}
        <div className="p-3 border-t border-slate-900 text-[10px] text-slate-500 bg-slate-950 font-semibold tracking-wide">
          SYSTEM IP: 192.168.1.144
        </div>
      </aside>

      {/* 2. Light Workspace (Main Canvas) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Professional Header Section */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 border px-2 py-0.5 rounded font-mono">
              HT ASSEMBLY LINE STATUS
            </span>
          </div>

          {/* Development Mode Badging Information */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Shield size={12} className="text-amber-600" />
              Development Mode
            </div>
            
            <div className="h-4 w-px bg-slate-200"></div>

            <div className="text-xs text-slate-500 font-semibold">
              User: <span className="text-slate-800 font-bold">Super Admin</span>
            </div>

            <div className="h-4 w-px bg-slate-200"></div>

            <div className="text-xs text-slate-500 font-semibold">
              Unit: <span className="text-indigo-600 font-bold">HT</span>
            </div>
          </div>
        </header>

        {/* Main Working Panel Scrollbar */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Breadcrumb Structure Map */}
          <nav className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
            <span>ProcessWallah</span>
            <ChevronRight size={12} />
            {getBreadcrumbs().map((b, i, arr) => (
              <span key={b} className="flex items-center gap-1">
                <span className={i === arr.length - 1 ? 'text-indigo-600 font-bold' : ''}>{b}</span>
                {i < arr.length - 1 && <ChevronRight size={12} />}
              </span>
            ))}
          </nav>

          {/* Active Title Header & Sync Trigger Indicator */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-800">{getPageTitle()}</h2>
            <button 
              onClick={() => triggerToast('Staging and production state databases synced globally')}
              className="p-1.5 hover:bg-slate-200 text-slate-500 rounded border border-slate-200 transition-all bg-white"
              title="Sync Terminal Database"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Primary View Routing Core */}
          <Views currentView={currentView} triggerToast={triggerToast} />
        </main>
      </div>

      {/* Dynamic Overlay Toast Alerts */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-800 text-white text-xs py-3 px-4 rounded shadow-md flex items-center justify-between gap-4 max-w-sm transition-all animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span className="font-semibold tracking-wide">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
