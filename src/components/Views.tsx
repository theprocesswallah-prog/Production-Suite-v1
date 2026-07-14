import React, { useState } from 'react';
import { 
  initialSalesOrders, 
  initialWorkOrders, 
  initialMaterialIssues, 
  initialQCInspections, 
  initialDispatches, 
  initialProductionStages,
  SalesOrder,
  WorkOrder,
  MaterialIssue,
  QCInspection,
  DispatchStatus
} from '../data/dummyData';
import { 
  Search, Filter, Plus, FileText, Database, Factory, 
  AlertTriangle, Hammer, CheckCircle2, FileSpreadsheet
} from 'lucide-react';

interface ViewProps {
  currentView: string;
  triggerToast: (msg: string) => void;
}

export const Views: React.FC<ViewProps> = ({ currentView, triggerToast }) => {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialSalesOrders);
  const [workOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [materials, setMaterials] = useState<MaterialIssue[]>(initialMaterialIssues);
  const [inspections, setInspections] = useState<QCInspection[]>(initialQCInspections);
  const [dispatches] = useState<DispatchStatus[]>(initialDispatches);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [showAddOrder, setShowAddOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    product: '1000kVA Copper Core Power Transformer',
    capacity: '1000kVA',
    quantity: 1,
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customerName) return;
    
    const newSO: SalesOrder = {
      id: `SO-00${salesOrders.length + 1}`,
      orderNo: `SO-2026-0${salesOrders.length + 1}`,
      customerName: newOrder.customerName,
      product: newOrder.product,
      capacity: newOrder.capacity,
      quantity: Number(newOrder.quantity),
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      priority: newOrder.priority
    };

    setSalesOrders([newSO, ...salesOrders]);
    setShowAddOrder(false);
    setNewOrder({ customerName: '', product: '1000kVA Copper Core Power Transformer', capacity: '1000kVA', quantity: 1, priority: 'Medium' });
    triggerToast('Sales Order logged successfully and released for Scheduling');
  };

  const updateMaterialStatus = (id: string, action: 'issue' | 'revert') => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        const updatedQty = action === 'issue' ? m.reqQty : 0;
        const updatedStatus = action === 'issue' ? 'Fully Issued' : 'Pending';
        return { ...m, issuedQty: updatedQty, issueStatus: updatedStatus };
      }
      return m;
    }));
    triggerToast(`Material Ledger updated: ${action === 'issue' ? 'Issued material items' : 'Reverted'}`);
  };

  const handleQCStatusChange = (id: string, test: 'turns' | 'voltage', status: 'Pass' | 'Fail') => {
    setInspections(inspections.map(ins => {
      if (ins.id === id) {
        return {
          ...ins,
          turnsRatioResult: test === 'turns' ? status : ins.turnsRatioResult,
          voltageTestResult: test === 'voltage' ? status : ins.voltageTestResult,
          testedAt: new Date().toLocaleString()
        };
      }
      return ins;
    }));
    triggerToast(`Quality clearance step checked for ID: ${id}`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
  };

  switch (currentView) {
    case 'dashboard': {
      const activeWIPCount = workOrders.filter(w => w.status === 'In-Progress').length;
      const criticalBOMIssues = materials.filter(m => m.issueStatus === 'Pending').length;
      const totalUnitsOrdered = salesOrders.reduce((acc, current) => acc + current.quantity, 0);

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Units Ordered</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalUnitsOrdered} Nos</h3>
                </div>
                <div className="p-3 bg-slate-100 text-slate-700 rounded">
                  <FileText size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Work In Progress</p>
                  <h3 className="text-2xl font-bold text-blue-600 mt-1">{activeWIPCount} Active</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded">
                  <Factory size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical BOM Items Alert</p>
                  <h3 className="text-2xl font-bold text-rose-600 mt-1">{criticalBOMIssues} Items</h3>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded">
                  <AlertTriangle size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">HT Unit Efficiency</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">94.2%</h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Transformer Stage Load Distribution</h4>
                <span className="text-xs text-slate-400">Live Stage Map</span>
              </div>
              <div className="space-y-4">
                {initialProductionStages.map(stage => (
                  <div key={stage.id} className="border-b border-slate-100 last:border-none pb-3 last:pb-0">
                    <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1">
                      <span>{stage.stageName} <span className="text-slate-400">({stage.machineId})</span></span>
                      <span>{stage.activeWorkOrders} Active WO(s)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stage.activeWorkOrders > 0 ? 'bg-indigo-600' : 'bg-slate-300'}`} 
                        style={{ width: stage.activeWorkOrders > 0 ? '80%' : '15%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Urgent Dispatch Pipelines</h4>
              <div className="space-y-3">
                {dispatches.map(d => (
                  <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                    <p className="font-semibold text-slate-800">{d.woNo}</p>
                    <p className="text-slate-500 font-medium">To: {d.destination}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'sales-orders': {
      const filteredSO = salesOrders.filter(so => {
        const matchesSearch = so.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || so.orderNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' ? true : so.status === filterStatus;
        return matchesSearch && matchesStatus;
      });

      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by Order No or Customer..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-full bg-white border border-slate-200 rounded text-sm focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <select 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-200 py-1.5 px-3 rounded text-xs focus:outline-none text-slate-600 font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Production">In Production</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              {(searchQuery || filterStatus !== 'All') && (
                <button onClick={handleResetFilters} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline">
                  Clear
                </button>
              )}
            </div>
            <button 
              onClick={() => setShowAddOrder(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-950 text-white rounded text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus size={14} /> Create Sales Order
            </button>
          </div>

          {showAddOrder && (
            <form onSubmit={handleAddOrderSubmit} className="bg-slate-50 border-b border-slate-200 p-5 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Siemens Grid" 
                  value={newOrder.customerName}
                  onChange={e => setNewOrder({...newOrder, customerName: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Spec</label>
                <select 
                  value={newOrder.product}
                  onChange={e => setNewOrder({...newOrder, product: e.target.value, capacity: e.target.value.split(' ')[0]})}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none"
                >
                  <option value="1000kVA Copper Core Power Transformer">1000kVA Copper Core</option>
                  <option value="500kVA Aluminum Core Distribution Transformer">500kVA Aluminum Core</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Qty</label>
                <input 
                  type="number" 
                  min="1" 
                  value={newOrder.quantity}
                  onChange={e => setNewOrder({...newOrder, quantity: Number(e.target.value)})}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs"
                />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white text-xs py-2 px-3 font-semibold rounded hover:bg-indigo-700">
                  Save
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Order No</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Specifications</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3">Order State</th>
                  <th className="p-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredSO.map(so => (
                  <tr key={so.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold text-slate-900">{so.orderNo}</td>
                    <td className="p-3 font-medium">{so.customerName}</td>
                    <td className="p-3">{so.product}</td>
                    <td className="p-3 text-center font-semibold">{so.quantity}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-700">{so.status}</span>
                    </td>
                    <td className="p-3 font-medium">{so.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    case 'scheduling': {
      return (
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b">Staging & Scheduling Lines</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border rounded p-3 bg-indigo-50/50">
              <p className="font-bold text-indigo-950">Active Slots (HT-Line 1)</p>
              <p className="text-slate-500 mt-1">SO-2026-01 (Apex Power Grid) - 1000kVA Transformer Line</p>
            </div>
            <div className="border rounded p-3 bg-slate-50">
              <p className="font-bold text-slate-700">Next Scheduled Slot</p>
              <p className="text-slate-500 mt-1">SO-2026-02 (Indo Electrics) - Scheduled on 2026-07-22</p>
            </div>
          </div>
        </div>
      );
    }

    case 'work-orders': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Work Orders Released</h4>
          </div>
          <table className="w-full text-left border-collapse text-xs text-slate-700">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3">WO No</th>
                <th className="p-3">SO No Ref</th>
                <th className="p-3">Product Description</th>
                <th className="p-3">Current Routing Stage</th>
                <th className="p-3">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workOrders.map(wo => (
                <tr key={wo.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold">{wo.woNo}</td>
                  <td className="p-3 font-mono">{wo.soNo}</td>
                  <td className="p-3">{wo.productName}</td>
                  <td className="p-3 font-semibold text-indigo-700">{wo.currentStage}</td>
                  <td className="p-3">{wo.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'material-issue': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Raw Material Store Ledger</h4>
          </div>
          <table className="w-full text-left border-collapse text-xs text-slate-700">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3">WO No</th>
                <th className="p-3">Item Details</th>
                <th className="p-3 text-right">Required</th>
                <th className="p-3 text-right">Issued</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono">{m.woNo}</td>
                  <td className="p-3 font-medium">{m.itemName}</td>
                  <td className="p-3 text-right">{m.reqQty} {m.uom}</td>
                  <td className="p-3 text-right">{m.issuedQty} {m.uom}</td>
                  <td className="p-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">{m.issueStatus}</span>
                  </td>
                  <td className="p-3 text-center">
                    {m.issueStatus !== 'Fully Issued' ? (
                      <button onClick={() => updateMaterialStatus(m.id, 'issue')} className="px-2 py-0.5 bg-slate-800 text-white rounded text-[10px]">
                        Issue
                      </button>
                    ) : (
                      <button onClick={() => updateMaterialStatus(m.id, 'revert')} className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]">
                        Revert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'core-winding': {
      return (
        <div className="space-y-4">
          <div className="bg-slate-800 text-white p-5 rounded-md">
            <h3 className="text-base font-bold">Stage 02: Copper Core Coil Winding</h3>
            <p className="text-xs text-slate-300 mt-1">Conductor spindle operations active at M-WIND-04 machine</p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-md">
            <p className="text-xs text-slate-600">All spindle parameters are set automatically according to active master design parameters.</p>
          </div>
        </div>
      );
    }

    case 'stacking': {
      return (
        <div className="space-y-4">
          <div className="bg-slate-800 text-white p-5 rounded-md">
            <h3 className="text-base font-bold">Stage 03: Silicon Steel Core Stacking</h3>
            <p className="text-xs text-slate-300 mt-1">Manual and pneumatic alignment lamination stacks (0.27mm)</p>
          </div>
          <button 
            onClick={() => triggerToast('Torque parameters calibrated at 45 Nm')}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-700"
          >
            Calibrate Stack Clamps
          </button>
        </div>
      );
    }

    case 'assembly': {
      return (
        <div className="bg-white border border-slate-200 p-8 rounded-md text-center space-y-2">
          <Hammer size={24} className="mx-auto text-slate-400" />
          <h4 className="text-xs font-bold text-slate-700">Assembly bay line idle</h4>
          <p className="text-xs text-slate-400">CCA assembly tanking parameters are pending completion of core stacking checks.</p>
        </div>
      );
    }

    case 'qc': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">Routine QC Dielectric Logs</h4>
          </div>
          <table className="w-full text-left border-collapse text-xs text-slate-700">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3">Reference WO</th>
                <th className="p-3">Serial No</th>
                <th className="p-3">Megger Insulation</th>
                <th className="p-3">Turns Ratio Check</th>
                <th className="p-3">Voltage Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspections.map(ins => (
                <tr key={ins.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono">{ins.woNo}</td>
                  <td className="p-3 font-mono font-medium text-slate-800">{ins.transformerSerial}</td>
                  <td className="p-3">{ins.insulationResistance}</td>
                  <td className="p-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="font-semibold">{ins.turnsRatioResult}</span>
                      {ins.turnsRatioResult === 'Pending' && (
                        <button onClick={() => handleQCStatusChange(ins.id, 'turns', 'Pass')} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border text-[9px] font-bold rounded">
                          Pass
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="font-semibold">{ins.voltageTestResult}</span>
                      {ins.voltageTestResult === 'Pending' && (
                        <button onClick={() => handleQCStatusChange(ins.id, 'voltage', 'Pass')} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border text-[9px] font-bold rounded">
                          Pass
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'ready-dispatch': {
      return (
        <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Clearance Yard (Stage 06)</h4>
          <p className="text-xs text-slate-500">1x 2000kVA High Voltage Substation Core Transformer cleared and waiting for truck assignment.</p>
          <button onClick={() => triggerToast('Carrier assigned to clearance yard')} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs">
            Assign Truck & Gate Pass
          </button>
        </div>
      );
    }

    case 'dispatch': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Logistics & Shipping Releases</h4>
          </div>
          <table className="w-full text-left border-collapse text-xs text-slate-700">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3">SO No</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Carrier</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dispatches.map(d => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold">{d.soNo}</td>
                  <td className="p-3">{d.destination}</td>
                  <td className="p-3">{d.carrierName}</td>
                  <td className="p-3">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'wip': {
      return (
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Active Work In Progress Overview</h4>
            <button 
              onClick={() => triggerToast('WIP layout exported')}
              className="px-3 py-1 bg-slate-100 border text-slate-700 text-xs rounded font-semibold flex items-center gap-1.5"
            >
              <FileSpreadsheet size={12} /> Export Excel
            </button>
          </div>
          <table className="w-full text-left border-collapse text-xs text-slate-700">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3">Work Order No</th>
                <th className="p-3">Routing Stage</th>
                <th className="p-3 text-center">Batch Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workOrders.filter(w => w.status === 'In-Progress').map(wo => (
                <tr key={wo.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold">{wo.woNo}</td>
                  <td className="p-3 font-semibold text-indigo-700">{wo.currentStage}</td>
                  <td className="p-3 text-center font-bold">{wo.targetQty} Nos</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'reports': {
      return (
        <div className="bg-white border border-slate-200 rounded-md p-8 shadow-sm space-y-3 text-center">
          <FileText size={32} className="mx-auto text-slate-400" />
          <h4 className="text-xs font-bold text-slate-700">Analytical Reports Dashboard</h4>
          <button 
            onClick={() => triggerToast('Performance report generated')}
            className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold"
          >
            Export Operational Metrics
          </button>
        </div>
      );
    }

    case 'masters': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm p-5 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Industrial BOM Master Directory</h4>
          <div className="p-4 border rounded text-xs space-y-1.5 bg-slate-50">
            <p className="font-bold text-slate-700 flex items-center gap-1.5"><Database size={14} /> Copper Core Spec Master (BOM-HT-C01)</p>
            <p className="text-slate-500">BOM mapping standards for copper winding density and high tension insulation clearances.</p>
          </div>
        </div>
      );
    }

    case 'settings': {
      return (
        <div className="bg-white border border-slate-200 rounded-md p-6 space-y-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Factory Terminal Settings</h4>
          <div className="flex justify-between items-center text-xs pb-3 border-b">
            <div>
              <p className="font-bold text-slate-700">Strict QA Insulation Clearances Lockout</p>
              <p className="text-slate-400 text-[10px]">Do not release work order if Turns Ratio check returns FAIL</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
          </div>
        </div>
      );
    }

    default:
      return <div className="p-6 text-xs text-slate-400">Selected workspace screen under construction.</div>;
  }
};
