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
  Search, Filter, Plus, FileText, Settings, Database, Factory, 
  AlertTriangle, Hammer, CheckCircle2, FileSpreadsheet
} from 'lucide-react';

interface ViewProps {
  currentView: string;
  triggerToast: (msg: string) => void;
}

export const Views: React.FC<ViewProps> = ({ currentView, triggerToast }) => {
  // Master state management for simulation
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialSalesOrders);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [materials, setMaterials] = useState<MaterialIssue[]>(initialMaterialIssues);
  const [inspections, setInspections] = useState<QCInspection[]>(initialQCInspections);
  const [dispatches, setDispatches] = useState<DispatchStatus[]>(initialDispatches);
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Interactive Form Modals State
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
    triggerToast(`Material Ledger updated: ${action === 'issue' ? 'Issued material items' : 'Reverted issue task'}`);
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

  // Safe reset routine
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
  };

  // View Routing rendering logic
  switch (currentView) {
    case 'dashboard': {
      const activeWIPCount = workOrders.filter(w => w.status === 'In-Progress').length;
      const criticalBOMIssues = materials.filter(m => m.issueStatus === 'Pending').length;
      const totalUnitsOrdered = salesOrders.reduce((acc, current) => acc + current.quantity, 0);

      return (
        <div className="space-y-6">
          {/* Executive Quick Stats */}
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
              <div className="mt-4 flex items-center text-xs text-emerald-600">
                <span className="font-semibold">+12%</span>
                <span className="text-slate-400 ml-1">v/s last monthly layout</span>
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
              <div className="mt-4 flex items-center text-xs text-blue-500">
                <span className="font-semibold">3 stages</span>
                <span className="text-slate-400 ml-1">currently active on shopfloor</span>
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
              <div className="mt-4 flex items-center text-xs text-rose-500">
                <span className="font-semibold">Action needed</span>
                <span className="text-slate-400 ml-1">to prevent staging delays</span>
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
              <div className="mt-4 flex items-center text-xs text-emerald-600">
                <span className="font-semibold">Optimal</span>
                <span className="text-slate-400 ml-1">within benchmark limits</span>
              </div>
            </div>
          </div>

          {/* Plant Floor Layout Status */}
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
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>Operator: {stage.operatorName}</span>
                      <span>Utilization Rate: {stage.utilizationRate}</span>
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
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-semibold text-slate-700">{d.woNo}</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium text-[10px]">{d.status}</span>
                    </div>
                    <p className="text-slate-500 font-medium">To: {d.destination}</p>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Carrier: {d.carrierName}</span>
                      <span>Est Date: {d.dispatchDate}</span>
                    </div>
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
          {/* Header Controls */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by Order No or Customer..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-full bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <select 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-200 py-1.5 px-3 rounded text-xs focus:outline-none focus:border-slate-400 text-slate-600 font-medium"
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
                  Clear Filters
                </button>
              )}
            </div>
            <button 
              onClick={() => setShowAddOrder(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-950 text-white rounded text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus size={14} /> Create Sales Order
            </button>
          </div>

          {/* Inline Addition Panel */}
          {showAddOrder && (
            <form onSubmit={handleAddOrderSubmit} className="bg-slate-50 border-b border-slate-200 p-5 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Customer / Client Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Siemens Grid Systems" 
                  value={newOrder.customerName}
                  onChange={e => setNewOrder({...newOrder, customerName: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Transformer Spec</label>
                <select 
                  value={newOrder.product}
                  onChange={e => setNewOrder({...newOrder, product: e.target.value, capacity: e.target.value.split(' ')[0]})}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="1000kVA Copper Core Power Transformer">1000kVA Copper Core</option>
                  <option value="500kVA Aluminum Core Distribution Transformer">500kVA Aluminum Core</option>
                  <option value="2500kVA Hermetically Sealed Transformer">2500kVA Sealed</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  value={newOrder.quantity}
                  onChange={e => setNewOrder({...newOrder, quantity: Number(e.target.value)})}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none"
                />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white text-xs py-2 px-3 font-semibold rounded hover:bg-indigo-700">
                  Save
                </button>
                <button type="button" onClick={() => setShowAddOrder(false)} className="bg-slate-200 text-slate-700 text-xs py-2 px-3 font-semibold rounded hover:bg-slate-300">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Data Presentation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Order No</th>
                  <th className="p-3">Client details</th>
                  <th className="p-3">Component product specifications</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3">Logged Date</th>
                  <th className="p-3">Delivery Deadline</th>
                  <th className="p-3">Order State</th>
                  <th className="p-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSO.length > 0 ? (
                  filteredSO.map(so => (
                    <tr key={so.id} className="hover:bg-slate-50 text-slate-700">
                      <td className="p-3 font-mono font-semibold text-slate-900">{so.orderNo}</td>
                      <td className="p-3 font-medium">{so.customerName}</td>
                      <td className="p-3">{so.product} <span className="text-slate-400 text-[10px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded ml-1">{so.capacity}</span></td>
                      <td className="p-3 text-center font-semibold">{so.quantity}</td>
                      <td className="p-3 text-slate-500">{so.orderDate}</td>
                      <td className="p-3 text-slate-500 font-semibold">{so.deliveryDate}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] inline-block ${
                          so.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          so.status === 'In Production' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          so.status === 'Scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {so.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-medium ${
                          so.priority === 'High' ? 'text-rose-600' : 
                          so.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                        }`}>{so.priority}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No matching sales orders mapped for execution.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    case 'scheduling': {
      return (
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Plant Scheduler & Allocations</h4>
              <p className="text-xs text-slate-400 mt-0.5">Staging master workflow dispatch schedule mapping</p>
            </div>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Shift Matrix: Day - Night</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded p-4 text-xs space-y-2">
              <h5 className="font-bold text-slate-700 border-b pb-1.5">Unscheduled Backlogs</h5>
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <p className="font-semibold text-slate-800">SO-2026-03 (Standard Alloys)</p>
                  <p className="text-slate-500 mt-0.5">2500kVA Hermetically Sealed Transformer</p>
                  <p className="text-[10px] text-rose-500 font-bold mt-1.5">Target: 2026-09-10</p>
                </div>
                <div className="text-center py-4 text-slate-400 italic">No further backlogs reported</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded p-4 text-xs space-y-2 md:col-span-2">
              <h5 className="font-bold text-slate-700 border-b pb-1.5">Scheduled Work Slots (HT Assembly-Line 1)</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-indigo-50 border-l-4 border-indigo-600 rounded text-slate-700">
                  <div>
                    <p className="font-semibold">SO-2026-02 (Indo Electrics)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">500kVA Aluminum Core Distribution unit</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Slot: 2026-07-22</p>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-white border px-1.5 py-0.5 rounded mt-1 inline-block">Weekly Load Block</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded text-slate-700">
                  <div>
                    <p className="font-semibold">SO-2026-01 (Apex Power Grid)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">1000kVA Copper Core Power transformer line</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Slot: 2026-07-18</p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-white border px-1.5 py-0.5 rounded mt-1 inline-block">Active Block</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'work-orders': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Released Shopfloor Work Orders</h4>
            <span className="text-xs text-slate-400">Total Workloads Released: {workOrders.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Work Order No</th>
                  <th className="p-3">Reference Sales Order</th>
                  <th className="p-3">Transformer Spec details</th>
                  <th className="p-3 text-center">Target Qty</th>
                  <th className="p-3">Release Date</th>
                  <th className="p-3">Active Routing Stage</th>
                  <th className="p-3">Work Order State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {workOrders.map(wo => (
                  <tr key={wo.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold text-slate-900">{wo.woNo}</td>
                    <td className="p-3 font-medium text-indigo-600 font-mono">{wo.soNo}</td>
                    <td className="p-3">{wo.productName}</td>
                    <td className="p-3 text-center font-semibold">{wo.targetQty}</td>
                    <td className="p-3 text-slate-500">{wo.startedDate}</td>
                    <td className="p-3">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{wo.currentStage}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        wo.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        wo.status === 'In-Progress' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>{wo.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Material Issue Screen
    case 'material-issue': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Raw Material Issue Log (MIGS Verification)</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-3">WO No Ref</th>
                  <th className="p-3">Item Code</th>
                  <th className="p-3">Item Specifications</th>
                  <th className="p-3 text-right">Required</th>
                  <th className="p-3 text-right">Issued</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Warehouse Bin Location</th>
                  <th className="p-3">Ledger Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {materials.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold">{m.woNo}</td>
                    <td className="p-3 font-mono text-slate-500">{m.itemCode}</td>
                    <td className="p-3 font-medium">{m.itemName}</td>
                    <td className="p-3 text-right">{m.reqQty}</td>
                    <td className="p-3 text-right font-semibold">{m.issuedQty}</td>
                    <td className="p-3 text-slate-400 font-medium">{m.uom}</td>
                    <td className="p-3 text-slate-500 font-semibold">{m.binLocation}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] inline-block ${
                        m.issueStatus === 'Fully Issued' ? 'bg-emerald-50 text-emerald-700' :
                        m.issueStatus === 'Partially Issued' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>{m.issueStatus}</span>
                    </td>
                    <td className="p-3 text-right">
                      {m.issueStatus !== 'Fully Issued' ? (
                        <button 
                          onClick={() => updateMaterialStatus(m.id, 'issue')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-950 text-white rounded text-[10px] font-bold transition-all"
                        >
                          Issue items
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateMaterialStatus(m.id, 'revert')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-medium"
                        >
                          Revert
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Core Winding Stage View
    case 'core-winding': {
      return (
        <div className="space-y-6">
          <div className="bg-slate-800 text-white p-5 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] tracking-wider uppercase bg-indigo-600 px-2 py-0.5 rounded font-bold">Stage 02</span>
              <h3 className="text-lg font-bold mt-1">Core & Coil Winding Section</h3>
              <p className="text-xs text-slate-300 mt-1">Spindle copper conduction wire winding for transformers</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="bg-slate-700/50 p-2.5 rounded">
                <p className="text-slate-400 text-[10px]">Tension Control</p>
                <p className="font-bold text-emerald-400 mt-0.5">Automated (Calibrated)</p>
              </div>
              <div className="bg-slate-700/50 p-2.5 rounded">
                <p className="text-slate-400 text-[10px]">Active Feedstock</p>
                <p className="font-bold text-indigo-300 mt-0.5">Copper Stripping</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Winding Machine Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">Machine M-WIND-04</p>
                    <p className="text-slate-400 text-[10px]">Operator: Satish Kumar</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold text-[10px]">Active</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded text-xs bg-slate-50 text-slate-400">
                  <div>
                    <p className="font-medium">Machine M-WIND-05</p>
                    <p className="text-[10px]">Standby Mode</p>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium text-[10px]">Standby</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Quality Tolerances Check</h4>
                <p className="text-xs text-slate-600">Ensure the core wire insulation layout passes standard testing protocols prior to winding lamination core stack steps.</p>
              </div>
              <button 
                onClick={() => triggerToast('Tolerances confirmed according to DIN standard')}
                className="mt-4 w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
              >
                Confirm Calibrations
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Stacking Stage View
    case 'stacking': {
      return (
        <div className="space-y-6">
          <div className="bg-slate-800 text-white p-5 rounded-md">
            <span className="text-[10px] tracking-wider uppercase bg-indigo-600 px-2 py-0.5 rounded font-bold">Stage 03</span>
            <h3 className="text-lg font-bold mt-1">Core Lamination Stacking</h3>
            <p className="text-xs text-slate-300 mt-1">Laying down of CRGO Silicon Steel Sheets to build a low resistance transformer core structure</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Active Stacking Workloads</h4>
            <div className="flex justify-between items-center text-xs p-3 border rounded">
              <div>
                <p className="font-semibold">Work Order: WO-HT-102</p>
                <p className="text-[10px] text-slate-400">Lamination Core size: 0.27mm Silicon Steel</p>
              </div>
              <button 
                onClick={() => triggerToast('Lamination tightness confirmed via torque wrench check')}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded"
              >
                Log Torque Tightness (45 Nm)
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Assembly Stage View
    case 'assembly': {
      return (
        <div className="space-y-6">
          <div className="bg-slate-800 text-white p-5 rounded-md">
            <span className="text-[10px] tracking-wider uppercase bg-indigo-600 px-2 py-0.5 rounded font-bold">Stage 04</span>
            <h3 className="text-lg font-bold mt-1">Core-Coil Assembly (CCA)</h3>
            <p className="text-xs text-slate-300 mt-1">Final frame tanking, bushing fittings, core-clamping, and insulation testing phases</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm text-center py-10 space-y-3">
            <Hammer size={40} className="mx-auto text-slate-400" />
            <h4 className="text-sm font-bold text-slate-700">No active Core-Coil Assembly jobs on tanking beds</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Complete preceding Winding and Stacking stages to route assemblies directly onto assembly bay line stations.</p>
          </div>
        </div>
      );
    }

    // QC Testing View
    case 'qc': {
      return (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">Routine QC Test Bench & Dielectric Logging</h4>
                <p className="text-xs text-slate-400 mt-0.5">Megger Insulation checks and Turns ratio verification on testing lines</p>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border px-2 py-0.5 rounded font-mono">STANDARDS: IEC 60076</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="p-3">Reference WO</th>
                    <th className="p-3">Serial No</th>
                    <th className="p-3">Test Protocol Spec</th>
                    <th className="p-3">Megger Insulation (MΩ)</th>
                    <th className="p-3">Turns Ratio Check</th>
                    <th className="p-3">High Voltage Dielectric</th>
                    <th className="p-3">Inspector</th>
                    <th className="p-3">Checked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {inspections.map(ins => (
                    <tr key={ins.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-semibold">{ins.woNo}</td>
                      <td className="p-3 font-mono text-indigo-600 font-medium">{ins.transformerSerial}</td>
                      <td className="p-3 font-medium">{ins.testType}</td>
                      <td className="p-3 font-semibold text-slate-700">{ins.insulationResistance}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ins.turnsRatioResult === 'Pass' ? 'bg-emerald-50 text-emerald-700' :
                            ins.turnsRatioResult === 'Fail' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}>{ins.turnsRatioResult}</span>
                          {ins.turnsRatioResult === 'Pending' && (
                            <div className="flex gap-1">
                              <button onClick={() => handleQCStatusChange(ins.id, 'turns', 'Pass')} className="p-1 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-600 rounded">
                                <Check size={10} />
                              </button>
                              <button onClick={() => handleQCStatusChange(ins.id, 'turns', 'Fail')} className="p-1 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 rounded">
                                <X size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ins.voltageTestResult === 'Pass' ? 'bg-emerald-50 text-emerald-700' :
                            ins.voltageTestResult === 'Fail' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}>{ins.voltageTestResult}</span>
                          {ins.voltageTestResult === 'Pending' && (
                            <div className="flex gap-1">
                              <button onClick={() => handleQCStatusChange(ins.id, 'voltage', 'Pass')} className="p-1 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-600 rounded">
                                <Check size={10} />
                              </button>
                              <button onClick={() => handleQCStatusChange(ins.id, 'voltage', 'Fail')} className="p-1 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 rounded">
                                <X size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-600">{ins.testedBy}</td>
                      <td className="p-3 text-slate-400 font-mono text-[10px]">{ins.testedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // Ready for Dispatch View
    case 'ready-dispatch': {
      return (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">Clearance Yard (Stage 06)</h4>
            <p className="text-xs text-slate-500 mb-4">Transformers having cleared final routine testing checks and cleared bay staging area coordinates:</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">1x 2000kVA High Voltage Substation Core (Serial: HT-TX-2026-9041)</p>
                <p className="text-slate-400 text-[10px] mt-0.5">QC Inspected, routine test passed successfully.</p>
              </div>
              <button 
                onClick={() => triggerToast('Released clearance yard and added to carrier transport slip')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
              >
                Approve Dispatch Gate Release
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Dispatch Logistics View
    case 'dispatch': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Outward Logistics & Shipping Releases</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Reference Sales No</th>
                  <th className="p-3">Destination Delivery Address</th>
                  <th className="p-3">Consignment Note No</th>
                  <th className="p-3">Logistics Transporter</th>
                  <th className="p-3">Dispatch Clearance Status</th>
                  <th className="p-3">Shipped Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {dispatches.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold">{d.soNo}</td>
                    <td className="p-3 font-medium">{d.destination}</td>
                    <td className="p-3 font-mono text-slate-500">{d.consignmentNo}</td>
                    <td className="p-3 text-slate-500">{d.carrierName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-semibold text-[10px]">{d.status}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-600">{d.dispatchDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Work In Progress (WIP) Screen
    case 'wip': {
      return (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Active Work In Progress (WIP) Overview</h4>
              <button 
                onClick={() => triggerToast('WIP summary excel layout generated successfully')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border text-slate-700 text-xs rounded font-semibold flex items-center gap-1.5"
              >
                <FileSpreadsheet size={12} /> Export WIP Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="p-3">Work Order No</th>
                    <th className="p-3">Connected Order</th>
                    <th className="p-3">Routing Step Stage</th>
                    <th className="p-3">Target Date</th>
                    <th className="p-3 text-center">Batch Target</th>
                    <th className="p-3">Work Center Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {workOrders.filter(w => w.status === 'In-Progress').map(wo => (
                    <tr key={wo.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-semibold">{wo.woNo}</td>
                      <td className="p-3 font-mono font-semibold text-indigo-600">{wo.soNo}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                          {wo.currentStage}
                        </div>
                      </td>
                      <td className="p-3 text-slate-500 font-semibold">{wo.estimatedCompletion}</td>
                      <td className="p-3 text-center font-bold">{wo.targetQty} Nos</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[10px]">Processing</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    case 'reports': {
      return (
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-4 text-center py-12">
          <FileText size={36} className="mx-auto text-slate-400" />
          <h4 className="text-base font-bold text-slate-700">Electrical Plant Operations Reports Dashboard</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Export operational performance, station load factors, cycle timings, and line efficiency logs directly into analytical Excel reporting metrics.</p>
          <button 
            onClick={() => triggerToast('Generated complete operational system reports')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
          >
            Download Comprehensive Monthly Report
          </button>
        </div>
      );
    }

    case 'masters': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Industrial BOM Master Records</h4>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded p-4 text-xs space-y-2">
                <h5 className="font-bold text-slate-700 flex items-center gap-1.5"><Database size={14} /> Copper Core Spec (BOM-HT-C01)</h5>
                <p className="text-slate-500">Master template definition mapping copper winding density, insulation tolerances, and tanking clearance standards.</p>
              </div>
              <div className="border border-slate-200 rounded p-4 text-xs space-y-2">
                <h5 className="font-bold text-slate-700 flex items-center gap-1.5"><Database size={14} /> Aluminum Core Spec (BOM-HT-A02)</h5>
                <p className="text-slate-500">Master template defining distribution grids, high-efficiency core paper sheets, and oil insulation tolerances.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'settings': {
      return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"><Settings size={16} /> HT System Configurations</h4>
            <p className="text-xs text-slate-400 mt-1">Configure shopfloor terminal routing and sensor threshold rules</p>
          </div>
          
          <div className="space-y-4 max-w-xl text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-bold text-slate-700">Auto-Release Scheduled Work Orders</p>
                <p className="text-slate-400 text-[10px]">Automatically update status to production WIP once scheduled slot arrival matches</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-bold text-slate-700">Strict Quality Assurance Lockout</p>
                <p className="text-slate-400 text-[10px]">Prevent outward routing if turns ratio or Megger insulation check returns FAIL status</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="bg-white border border-slate-200 rounded-md p-6 text-center text-slate-500">
          Selected stage workspace screen under construction.
        </div>
      );
  }
};
