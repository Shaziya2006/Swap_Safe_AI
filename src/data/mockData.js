// Demo / illustrative data for the SWAPSAFE AI prototype.
// Replace with real backend data when you connect an API.

export const suppliers = [
  { id: 'S-101', name: 'Bengaluru Semiconductor Works', city: 'Bengaluru', state: 'Karnataka', region: 'South India', category: 'Semiconductors', price: 340, leadTime: 9, reliability: 96, quality: 98, risk: 18, capacity: 88, certs: ['ISO 9001', 'IATF 16949', 'RoHS'], contact: 'sales@blrsemi.example.in', status: 'Preferred', otd: [94, 95, 96, 95, 97, 96] },
  { id: 'S-102', name: 'Hyderabad Core Electronics', city: 'Hyderabad', state: 'Telangana', region: 'South India', category: 'Semiconductors', price: 260, leadTime: 14, reliability: 84, quality: 90, risk: 52, capacity: 95, certs: ['ISO 9001', 'RoHS'], contact: 'bd@hydcore.example.in', status: 'Approved', otd: [88, 86, 85, 83, 82, 84] },
  { id: 'S-103', name: 'Pune PrecisionTech', city: 'Pune', state: 'Maharashtra', region: 'West India', category: 'Passive components', price: 210, leadTime: 7, reliability: 91, quality: 93, risk: 29, capacity: 80, certs: ['ISO 9001', 'ISO 14001'], contact: 'orders@punept.example.in', status: 'Preferred', otd: [89, 90, 91, 92, 91, 92] },
  { id: 'S-104', name: 'Chennai Silicon Systems', city: 'Chennai', state: 'Tamil Nadu', region: 'South India', category: 'Semiconductors', price: 420, leadTime: 6, reliability: 97, quality: 99, risk: 14, capacity: 72, certs: ['ISO 9001', 'AS9100', 'RoHS'], contact: 'quotes@chennaisilicon.example.in', status: 'Preferred', otd: [97, 97, 98, 97, 98, 97] },
  { id: 'S-105', name: 'Noida Interconnect', city: 'Noida', state: 'Uttar Pradesh', region: 'North India', category: 'Connectors', price: 280, leadTime: 12, reliability: 88, quality: 92, risk: 41, capacity: 85, certs: ['ISO 9001', 'IATF 16949'], contact: 'sales@noidaic.example.in', status: 'Approved', otd: [90, 89, 88, 88, 87, 88] },
  { id: 'S-106', name: 'Ahmedabad Power Systems', city: 'Ahmedabad', state: 'Gujarat', region: 'West India', category: 'Power modules', price: 510, leadTime: 11, reliability: 95, quality: 97, risk: 22, capacity: 78, certs: ['ISO 9001', 'ISO 45001', 'RoHS'], contact: 'sales@amdpower.example.in', status: 'Approved', otd: [93, 94, 94, 95, 95, 95] },
  { id: 'S-107', name: 'Kolkata Circuit Assembly', city: 'Kolkata', state: 'West Bengal', region: 'East India', category: 'PCB assembly', price: 180, leadTime: 15, reliability: 79, quality: 85, risk: 63, capacity: 92, certs: ['ISO 9001'], contact: 'info@kolcircuit.example.in', status: 'Under review', otd: [84, 82, 80, 78, 77, 79] },
  { id: 'S-108', name: 'Gurugram Components', city: 'Gurugram', state: 'Haryana', region: 'North India', category: 'Passive components', price: 240, leadTime: 8, reliability: 90, quality: 91, risk: 33, capacity: 76, certs: ['ISO 9001', 'RoHS'], contact: 'sales@ggncomp.example.in', status: 'Approved', otd: [88, 89, 90, 91, 90, 90] },
]

export const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

// Spend and savings are in ₹ lakh per month
export const spendTrend = [
  { month: 'May', spend: 420, savings: 18 },
  { month: 'Jun', spend: 455, savings: 24 },
  { month: 'Jul', spend: 438, savings: 31 },
  { month: 'Aug', spend: 492, savings: 29 },
  { month: 'Sep', spend: 470, savings: 42 },
  { month: 'Oct', spend: 505, savings: 51 },
]

export const riskTrend = [
  { month: 'May', supply: 38, financial: 24, geopolitical: 45, quality: 20 },
  { month: 'Jun', supply: 41, financial: 25, geopolitical: 47, quality: 21 },
  { month: 'Jul', supply: 46, financial: 27, geopolitical: 52, quality: 22 },
  { month: 'Aug', supply: 52, financial: 26, geopolitical: 58, quality: 24 },
  { month: 'Sep', supply: 49, financial: 28, geopolitical: 55, quality: 23 },
  { month: 'Oct', supply: 44, financial: 27, geopolitical: 50, quality: 21 },
]

export const categorySpend = [
  { name: 'Semiconductors', value: 46 },
  { name: 'Passive components', value: 18 },
  { name: 'Connectors', value: 12 },
  { name: 'Power modules', value: 14 },
  { name: 'PCB assembly', value: 10 },
]

export const referenceComponent = {
  id: 'REF-1',
  name: 'STM32F407VGT6',
  type: 'ARM Cortex-M4 microcontroller',
  supplier: 'Chennai Silicon Systems',
  price: 720,
  leadTime: 6,
  stock: 1200,
  tempRange: '-40 to 85 °C',
  package: 'LQFP-100',
  flash: '1 MB',
  compliance: 'RoHS, REACH',
}

export const candidates = [
  { id: 'C-1', name: 'GD32F407VGT6', supplier: 'Hyderabad Core Electronics', price: 510, leadTime: 14, stock: 9800, tempRange: '-40 to 85 °C', package: 'LQFP-100', flash: '1 MB', compliance: 'RoHS', pinMatch: 96, perfMatch: 92, availability: 90, costScore: 88, riskScore: 52, notes: 'Pin-compatible alternative; peripheral timing and USB behaviour differ slightly.' },
  { id: 'C-2', name: 'STM32F405VGT6', supplier: 'Bengaluru Semiconductor Works', price: 650, leadTime: 9, stock: 3400, tempRange: '-40 to 85 °C', package: 'LQFP-100', flash: '1 MB', compliance: 'RoHS, REACH', pinMatch: 99, perfMatch: 97, availability: 78, costScore: 72, riskScore: 24, notes: 'Same family; no Ethernet MAC or camera interface.' },
  { id: 'C-3', name: 'MM32F4070', supplier: 'Noida Interconnect', price: 540, leadTime: 12, stock: 2100, tempRange: '-40 to 105 °C', package: 'LQFP-100', flash: '512 KB', compliance: 'RoHS', pinMatch: 84, perfMatch: 80, availability: 82, costScore: 82, riskScore: 41, notes: 'Smaller flash; firmware may need to be re-partitioned.' },
]

export const initialRisks = [
  { id: 'R-01', title: 'Port congestion at Chennai and Nhava Sheva', category: 'Logistics', supplier: 'Hyderabad Core Electronics', likelihood: 4, impact: 4, score: 78, severity: 'High', evidence: 'Container dwell time at key ports is up 31% over four weeks; imported wafer lots are arriving late.', actions: ['Pre-book air freight for the next two critical lots', 'Route part of the volume through another port', 'Raise safety stock from 3 to 5 weeks'], status: 'Open' },
  { id: 'R-02', title: 'Single-source dependency for MCU family', category: 'Supply', supplier: 'Chennai Silicon Systems', likelihood: 3, impact: 5, score: 72, severity: 'High', evidence: '82% of microcontroller volume comes from one supplier; no qualified alternate on file.', actions: ['Qualify STM32F405VGT6 as a second source', 'Negotiate a capacity reservation clause'], status: 'Open' },
  { id: 'R-03', title: 'Quality drift in recent PCB lots', category: 'Quality', supplier: 'Kolkata Circuit Assembly', likelihood: 3, impact: 3, score: 56, severity: 'Medium', evidence: 'Defect rate increased from 0.8% to 1.9% across the last three lots.', actions: ['Request a corrective action report', 'Increase incoming inspection sampling'], status: 'Open' },
  { id: 'R-04', title: 'Rupee volatility on imported components', category: 'Financial', supplier: 'Noida Interconnect', likelihood: 3, impact: 2, score: 38, severity: 'Medium', evidence: 'The rupee moved 2.8% against the US dollar in 60 days, raising landed cost of imported parts.', actions: ['Add a price-adjustment clause', 'Hedge 50% of the quarterly import exposure'], status: 'Open' },
  { id: 'R-05', title: 'Customs and import duty changes on electronics', category: 'Regulatory', supplier: 'Hyderabad Core Electronics', likelihood: 2, impact: 4, score: 61, severity: 'Medium', evidence: 'A proposed duty revision may raise costs on selected semiconductor imports and add documentation steps.', actions: ['Review HS codes with the compliance team', 'Shift volume to domestically manufactured alternates'], status: 'Open' },
  { id: 'R-06', title: 'Supplier ISO certificate renewal pending', category: 'Compliance', supplier: 'Pune PrecisionTech', likelihood: 2, impact: 2, score: 22, severity: 'Low', evidence: 'ISO 14001 certificate expires in 45 days; renewal audit is scheduled.', actions: ['Request updated certificate by month end'], status: 'Open' },
  { id: 'R-07', title: 'Rising lead times for power modules', category: 'Supply', supplier: 'Ahmedabad Power Systems', likelihood: 2, impact: 3, score: 34, severity: 'Low', evidence: 'Quoted lead time grew from 8 to 11 days in two months.', actions: ['Place blanket order for Q1', 'Monitor weekly'], status: 'Open' },
]

export const initialApprovals = [
  { id: 'A-2041', title: 'Switch MCU source to GD32F407VGT6', requester: 'Engineering – Hardware', supplier: 'Hyderabad Core Electronics', value: 6120000, savings: 2520000, risk: 'Medium', status: 'Pending', submitted: '2026-10-28', summary: 'Lower unit price, longer lead time. Requires engineering validation of USB and timer peripherals.' },
  { id: 'A-2040', title: 'Qualify second source for power modules', requester: 'Procurement', supplier: 'Ahmedabad Power Systems', value: 10400000, savings: 650000, risk: 'Low', status: 'Pending', submitted: '2026-10-26', summary: 'Adds redundancy for the 48 V module family. Includes a six-month blanket order.' },
  { id: 'A-2039', title: 'Expedite air freight for connector lot', requester: 'Operations', supplier: 'Noida Interconnect', value: 1550000, savings: 0, risk: 'High', status: 'Pending', submitted: '2026-10-24', summary: 'Port delays may hold production by 6 days; air freight adds 12% to landed cost.' },
]

export const initialHistory = [
  { id: 'H-1', request: 'A-2036 · Renew Pune PrecisionTech annual contract', decision: 'Approved', by: 'Procurement Manager', comment: 'Strong delivery record. Renew for 12 months.', date: '2026-10-19' },
  { id: 'H-2', request: 'A-2033 · Onboard Kolkata Circuit Assembly (pilot)', decision: 'More information requested', by: 'Procurement Manager', comment: 'Share the last three audit reports before pilot approval.', date: '2026-10-15' },
  { id: 'H-3', request: 'A-2030 · Bulk buy of tantalum capacitors', decision: 'Rejected', by: 'Procurement Manager', comment: 'Price spike expected to ease next quarter.', date: '2026-10-09' },
]

export const initialOrders = [
  { id: 'PO-7781', item: 'STM32F407VGT6 × 12,000', supplier: 'Chennai Silicon Systems', eta: '2026-11-14', stage: 2, delayDays: 0, planned: [0, 2, 5, 9], actual: [0, 2, 6, null] },
  { id: 'PO-7782', item: 'GD32F407VGT6 × 20,000 (pilot)', supplier: 'Hyderabad Core Electronics', eta: '2026-12-03', stage: 1, delayDays: 6, planned: [0, 3, 8, 14], actual: [0, 5, null, null] },
  { id: 'PO-7783', item: 'MLCC capacitor kit × 500k', supplier: 'Pune PrecisionTech', eta: '2026-11-08', stage: 3, delayDays: 0, planned: [0, 2, 4, 7], actual: [0, 2, 4, 7] },
  { id: 'PO-7784', item: 'Board connectors × 80,000', supplier: 'Noida Interconnect', eta: '2026-11-27', stage: 1, delayDays: 4, planned: [0, 2, 6, 12], actual: [0, 4, null, null] },
]

export const milestones = ['Order placed', 'Supplier confirmed', 'In production / transit', 'Delivered & inspected']
