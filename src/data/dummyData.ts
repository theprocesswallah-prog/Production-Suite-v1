export interface SalesOrder {
  id: string;
  orderNo: string;
  customerName: string;
  product: string;
  capacity: string;
  quantity: number;
  orderDate: string;
  deliveryDate: string;
  status: 'Pending' | 'Scheduled' | 'In Production' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

export interface ProductionStage {
  id: string;
  stageName: string;
  activeWorkOrders: number;
  operatorName: string;
  machineId: string;
  utilizationRate: string;
  targetToday: number;
  completedToday: number;
  efficiency: string;
}

export interface WorkOrder {
  id: string;
  woNo: string;
  soNo: string;
  productName: string;
  targetQty: number;
  startedDate: string;
  estimatedCompletion: string;
  currentStage: string;
  status: 'Draft' | 'Released' | 'In-Progress' | 'Hold' | 'Completed';
}

export interface MaterialIssue {
  id: string;
  woNo: string;
  itemCode: string;
  itemName: string;
  reqQty: number;
  issuedQty: number;
  uom: string;
  issueStatus: 'Fully Issued' | 'Partially Issued' | 'Pending';
  binLocation: string;
}

export interface QCInspection {
  id: string;
  woNo: string;
  transformerSerial: string;
  testType: string;
  insulationResistance: string;
  turnsRatioResult: 'Pass' | 'Fail' | 'Pending';
  voltageTestResult: 'Pass' | 'Fail' | 'Pending';
  testedBy: string;
  testedAt: string;
}

export interface DispatchStatus {
  id: string;
  soNo: string;
  woNo: string;
  destination: string;
  consignmentNo: string;
  carrierName: string;
  status: 'Packaging' | 'Gate Pass Generated' | 'Dispatched';
  dispatchDate: string;
}

export const initialSalesOrders: SalesOrder[] = [
  { id: 'SO-001', orderNo: 'SO-2026-01', customerName: 'Apex Power Grid Corporation', product: '1000kVA Copper Core Power Transformer', capacity: '1000kVA', quantity: 4, orderDate: '2026-07-01', deliveryDate: '2026-08-15', status: 'In Production', priority: 'High' },
  { id: 'SO-002', orderNo: 'SO-2026-02', customerName: 'Indo Electrics Pvt Ltd', product: '500kVA Aluminum Core Distribution Transformer', capacity: '500kVA', quantity: 8, orderDate: '2026-07-02', deliveryDate: '2026-08-20', status: 'Scheduled', priority: 'Medium' },
  { id: 'SO-003', orderNo: 'SO-2026-03', customerName: 'Standard Alloys Ltd', product: '2500kVA Hermetically Sealed Transformer', capacity: '2500kVA', quantity: 2, orderDate: '2026-07-05', deliveryDate: '2026-09-10', status: 'Pending', priority: 'Low' },
  { id: 'SO-004', orderNo: 'SO-2026-04', customerName: 'Reliance Energy Systems', product: '1600kVA Step Down HT Distribution Unit', capacity: '1600kVA', quantity: 6, orderDate: '2026-07-08', deliveryDate: '2026-08-30', status: 'In Production', priority: 'High' },
  { id: 'SO-005', orderNo: 'SO-2026-05', customerName: 'Siemens Infrastructure India', product: '2000kVA High Voltage Substation Core', capacity: '2000kVA', quantity: 3, orderDate: '2026-07-10', deliveryDate: '2026-09-15', status: 'Completed', priority: 'Medium' }
];

export const initialWorkOrders: WorkOrder[] = [
  { id: 'WO-101', woNo: 'WO-HT-101', soNo: 'SO-2026-01', productName: '1000kVA Copper Core Power Transformer', targetQty: 4, startedDate: '2026-07-03', estimatedCompletion: '2026-08-10', currentStage: 'Core Winding', status: 'In-Progress' },
  { id: 'WO-102', woNo: 'WO-HT-102', soNo: 'SO-2026-04', productName: '1600kVA Step Down HT Distribution Unit', targetQty: 6, startedDate: '2026-07-09', estimatedCompletion: '2026-08-25', currentStage: 'Stacking', status: 'In-Progress' },
  { id: 'WO-103', woNo: 'WO-HT-103', soNo: 'SO-2026-02', productName: '500kVA Aluminum Core Distribution Transformer', targetQty: 8, startedDate: '2026-07-12', estimatedCompletion: '2026-08-18', currentStage: 'Material Issue', status: 'Released' },
  { id: 'WO-104', woNo: 'WO-HT-104', soNo: 'SO-2026-05', productName: '2000kVA High Voltage Substation Core', targetQty: 3, startedDate: '2026-07-10', estimatedCompletion: '2026-07-13', currentStage: 'Internal QC', status: 'Completed' }
];

export const initialMaterialIssues: MaterialIssue[] = [
  { id: 'MAT-001', woNo: 'WO-HT-101', itemCode: 'CU-STRIP-12', itemName: 'Oxygen-Free Copper Strip (12mm)', reqQty: 1800, issuedQty: 1800, uom: 'Kgs', issueStatus: 'Fully Issued', binLocation: 'BIN-A3-LEVEL1' },
  { id: 'MAT-002', woNo: 'WO-HT-101', itemCode: 'LAM-SIL-0.27', itemName: 'CRGO Silicon Steel Lamination Sheet (0.27mm)', reqQty: 4500, issuedQty: 4000, uom: 'Kgs', issueStatus: 'Partially Issued', binLocation: 'BIN-B1-LEVEL1' },
  { id: 'MAT-003', woNo: 'WO-HT-102', itemCode: 'INS-PAP-0.12', itemName: 'Nomex Insulation Paper 0.12mm', reqQty: 250, issuedQty: 120, uom: 'Mtrs', issueStatus: 'Partially Issued', binLocation: 'BIN-C5-LEVEL2' },
  { id: 'MAT-004', woNo: 'WO-HT-103', itemCode: 'AL-WIRE-08', itemName: 'Paper Insulated Aluminum Wire (8mm)', reqQty: 2200, issuedQty: 0, uom: 'Kgs', issueStatus: 'Pending', binLocation: 'BIN-A5-LEVEL2' }
];

export const initialQCInspections: QCInspection[] = [
  { id: 'QC-001', woNo: 'WO-HT-104', transformerSerial: 'HT-TX-2026-9041', testType: 'Routine HT Dielectric & Ratio Test', insulationResistance: '2000 MΩ', turnsRatioResult: 'Pass', voltageTestResult: 'Pass', testedBy: 'P. K. Sharma (QA Lead)', testedAt: '2026-07-13 11:30 AM' },
  { id: 'QC-002', woNo: 'WO-HT-101', transformerSerial: 'HT-TX-2026-1011', testType: 'Winding Resistance & Vector Group Check', insulationResistance: 'Pending', turnsRatioResult: 'Pending', voltageTestResult: 'Pending', testedBy: 'Not Assigned', testedAt: 'TBD' }
];

export const initialDispatches: DispatchStatus[] = [
  { id: 'DIS-001', soNo: 'SO-2026-05', woNo: 'WO-HT-104', destination: 'Northern Grid Substation Depot, Panipat', consignmentNo: 'LR-DEL-984311', carrierName: 'VRL Logistics Logistics', status: 'Gate Pass Generated', dispatchDate: '2026-07-14' },
  { id: 'DIS-002', soNo: 'SO-2026-03', woNo: 'WO-HT-103', destination: 'Standard Alloys, Jamshedpur Plant', consignmentNo: 'TBD', carrierName: 'Safe Express Trucking', status: 'Packaging', dispatchDate: 'TBD' }
];

export const initialProductionStages: ProductionStage[] = [
  { id: 'STG-01', stageName: 'Material Issue', activeWorkOrders: 1, operatorName: 'Ramesh Patel', machineId: 'M-STORE-01', utilizationRate: '92%', targetToday: 10, completedToday: 8, efficiency: '95%' },
  { id: 'STG-02', stageName: 'Core Winding', activeWorkOrders: 1, operatorName: 'Satish Kumar', machineId: 'M-WIND-04', utilizationRate: '88%', targetToday: 5, completedToday: 3, efficiency: '85%' },
  { id: 'STG-03', stageName: 'Stacking', activeWorkOrders: 1, operatorName: 'Harpreet Singh', machineId: 'M-STACK-02', utilizationRate: '94%', targetToday: 4, completedToday: 3, efficiency: '98%' },
  { id: 'STG-04', stageName: 'Assembly', activeWorkOrders: 0, operatorName: 'Girish Chandra', machineId: 'M-ASSY-01', utilizationRate: '0%', targetToday: 3, completedToday: 0, efficiency: '0%' },
  { id: 'STG-05', stageName: 'Internal QC', activeWorkOrders: 1, operatorName: 'Sanjay Deshmukh', machineId: 'M-TEST-BENCH', utilizationRate: '90%', targetToday: 6, completedToday: 5, efficiency: '94%' },
  { id: 'STG-06', stageName: 'Dispatch Ready', activeWorkOrders: 1, operatorName: 'Vijay Yadav', machineId: 'M-DISPATCH-BAY', utilizationRate: '75%', targetToday: 8, completedToday: 6, efficiency: '90%' }
];
