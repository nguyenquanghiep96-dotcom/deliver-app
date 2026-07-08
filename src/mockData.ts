export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export interface Stop {
  id: string;
  num: number;
  type: string;
  address: string;
  status: 'Done' | 'Servicing' | 'Pending';
  notes: string;
  deliveryInstruction?: string;
  buildingOrientation?: string;
  tasks: Task[];
  customerName: string;
  customerPhone: string;
  unitInfo: {
    size: string;      // e.g. "10 x 16"
    modelName?: string; // e.g. "SilverCreek – 2 Story Gable"
    base: string;
    trim: string;
    roof: string;
    serial: string;
    amount?: string;
    material?: string;  // e.g. "LP Smart"
    dimensions?: string; // e.g. "10' W x 16' L x 7' H"
  };
  comments?: string[];
  signature?: string; // Data URL of drawn signature
  driverSignature?: string; // Data URL of drawn driver signature
  photos?: string[]; // Data URLs or file names of uploaded check photos
  gpsMarked?: boolean;
  gpsCoords?: { lat: number; lng: number };
}

export interface RouteData {
  id: string;
  name: string;
  startTime: string;
  date: string;
  dayOfMonth?: string;
  monthName?: string;
  stopsCount: number;
  dealerName: string;
  status: 'En Route' | 'Planned' | 'Completed';
  stripeColor: string;
  stops: Stop[];
  endTime?: string;
  startDate?: string;
  endDate?: string;
  startingAddress?: string;
  routeNote?: string;
  dispatcherPhone?: string;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  totalJobs: number;
  miles: number;
}

export const mockDrivers: Driver[] = [
  {
    id: 'hiep-nguyen',
    name: 'Hiep Nguyen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    phone: '714-345-4909',
    vehicle: 'Ford F-550 Flatbed',
    plate: 'TX-DRV99',
    rating: 4.92,
    totalJobs: 148,
    miles: 12450
  },
  {
    id: 'ngan-le',
    name: 'Ngan Le',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    phone: '714-555-0199',
    vehicle: 'Dodge Ram 3500',
    plate: 'TX-SHED01',
    rating: 4.85,
    totalJobs: 92,
    miles: 7820
  }
];

export const initialRoutes: RouteData[] = [
  {
    id: 'R-001',
    name: 'Fort Worth',
    startTime: '09:00 AM',
    endTime: '07:00 PM',
    date: 'Today',
    startDate: 'Jul 8',
    endDate: 'Jul 9',
    stopsCount: 5,
    dealerName: 'Store A',
    status: 'En Route',
    stripeColor: '#FF7048', // orange
    startingAddress: '123 Main St, Dallas, TX 75201',
    routeNote: 'Take I-35 detour due to heavy construction on Main St. Ensure you have the heavy-duty jack for Stop #3.',
    dispatcherPhone: '+18005550100',
    stops: [
      {
        id: 'S-101',
        num: 1,
        type: 'Delivery Items',
        address: '123 Oak Street, Fort Worth TX',
        status: 'Done',
        notes: 'Delivery of standard gable shed. Customer wants it aligned with the fence line.',
        tasks: [
          { id: 'T-101-1', text: 'Inspect exterior condition', done: true },
          { id: 'T-101-2', text: 'Photo documentation', done: true },
          { id: 'T-101-3', text: 'Obtain customer signature', done: true }
        ],
        customerName: 'Jason Smith',
        customerPhone: '714-345-4909',
        unitInfo: { size: '14 x 20', modelName: 'SilverCreek – Classic Gable', base: 'Redwood', trim: 'Blue', roof: 'Black', serial: 'SH-4420', amount: '$6,482.80', material: 'LP Smart', dimensions: "14' W x 20' L x 7' H" },
        comments: ['Delivery completed successfully.'],
        gpsMarked: true,
        gpsCoords: { lat: 32.7555, lng: -97.3308 }
      },
      {
        id: 'S-102',
        num: 2,
        type: 'Welfare Check',
        address: '456 Elm Ave, Fort Worth TX',
        status: 'Done',
        notes: 'Check condition of unit #SH-4421.',
        tasks: [
          { id: 'T-102-1', text: 'Inspect exterior condition', done: true },
          { id: 'T-102-2', text: 'Photo documentation', done: true },
          { id: 'T-102-3', text: 'Verify doors alignment', done: true }
        ],
        customerName: 'Jason Smith',
        customerPhone: '714-345-4909',
        unitInfo: { size: '14 x 20', modelName: 'SilverCreek – Classic Gable', base: 'Redwood', trim: 'Blue', roof: 'Black', serial: 'SH-4421', amount: '$0.00 (Warranty)', material: 'LP Smart', dimensions: "14' W x 20' L x 7' H" }
      },
      {
        id: 'SM-3456',
        num: 3,
        type: 'Repo',
        address: '1234 Maple Street, Springfield, IL 62704',
        status: 'Pending',
        notes: 'Call before arrival. Use south gate. Place shed on gravel pad behind barn. Watch for power lines. Customer must be present during delivery.',
        deliveryInstruction: 'Repossession of unit #INV-0091. Owner is aware of repossession. If gates are locked, call dispatcher immediately.',
        buildingOrientation: 'Door toward rear of trailer',
        tasks: [
          { id: 'T-103-1', text: 'Confirm unit serial number', done: false },
          { id: 'T-103-2', text: 'Inspect unit structure', done: false },
          { id: 'T-103-3', text: 'Secure load on flatbed', done: false }
        ],
        customerName: 'James Carter Athour',
        customerPhone: '020 2888 4943',
        unitInfo: { size: '10 x 16', modelName: 'SilverCreek – 2 Story Gable', base: 'Burnished Slate', trim: 'White', roof: 'White', serial: '73-112025', amount: '$4,200.00', material: 'LP Smart', dimensions: "10' W x 16' L x 7' H" }
      },
      {
        id: 'S-104',
        num: 4,
        type: 'Repair',
        address: '4567 Oak Avenue, Rivertown, CA 90210',
        status: 'Pending',
        notes: '',
        tasks: [{ id: 'T-104-1', text: 'Inspect and repair', done: false }],
        customerName: 'Hiep Nguyen',
        customerPhone: '020 2888 4943',
        unitInfo: { size: '10 x 16 SilverCreek – 2 Story Gable', base: 'White', trim: 'Gray', roof: 'Charcoal', serial: 'WD-8122', amount: '$0.00' }
      },
      {
        id: 'S-105',
        num: 5,
        type: 'Lot Transfer',
        address: '7890 Pine Lane, Lakeview, TX 75001',
        status: 'Pending',
        notes: '',
        tasks: [{ id: 'T-105-1', text: 'Transfer verification', done: false }],
        customerName: 'Khiet Vo',
        customerPhone: '(415) 763-8291',
        unitInfo: { size: '12 x 16 x 8', base: 'Gray', trim: 'White', roof: 'Silver', serial: 'SH-4433', amount: '$5,150.00' }
      }
    ]
  },
  {
    id: 'R-002',
    name: 'Dallas North',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    date: 'Tomorrow',
    startDate: 'Jul 10',
    endDate: 'Jul 11',
    stopsCount: 2,
    dealerName: 'Store A',
    status: 'Planned',
    stripeColor: '#3B82F6', // blue
    startingAddress: '456 Commerce St, Dallas, TX 75202',
    dispatcherPhone: '+18005550100',
    stops: [
      {
        id: 'S-201',
        num: 1,
        type: 'Delivery Items',
        address: '990 Preston Rd, Plano TX',
        status: 'Pending',
        notes: 'Verify clearance of trees before backup.',
        tasks: [
          { id: 'T-201-1', text: 'Verify side width clearance', done: false },
          { id: 'T-201-2', text: 'Structural inspection post-placement', done: false }
        ],
        customerName: 'David Miller',
        customerPhone: '972-555-0144',
        unitInfo: { size: '10 x 12 x 7', base: 'Redwood', trim: 'White', roof: 'Green', serial: 'SH-4450', amount: '$3,800.00' }
      },
      {
        id: 'S-202',
        num: 2,
        type: 'Repo',
        address: '1432 Coit Rd, Richardson TX',
        status: 'Pending',
        notes: 'Verify serial number carefully.',
        tasks: [
          { id: 'T-202-1', text: 'Verify serial number', done: false },
          { id: 'T-202-2', text: 'Repossession checklist', done: false }
        ],
        customerName: 'Emily Davis',
        customerPhone: '972-555-0188',
        unitInfo: { size: '8.5 x 10 x 7', base: 'Gray', trim: 'White', roof: 'Gray', serial: 'INV-0095', amount: '$2,900.00' }
      }
    ]
  },
  {
    id: 'R-003',
    name: 'Houston South',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    date: 'Jul 14',
    startDate: 'Jul 14',
    endDate: 'Jul 15',
    dayOfMonth: '14',
    monthName: 'JUL',
    stopsCount: 4,
    dealerName: 'MFR A',
    status: 'Planned',
    stripeColor: '#2FA301', // green
    startingAddress: '3635 Almeda Genoa Rd, Houston, TX, 77047',
    stops: []
  },
  {
    id: 'R-004',
    name: 'Austin West',
    startTime: '08:30 AM',
    endTime: '05:30 PM',
    date: 'Jul 17',
    startDate: 'Jul 17',
    endDate: 'Jul 17',
    dayOfMonth: '17',
    monthName: 'JUL',
    stopsCount: 3,
    dealerName: 'Store B',
    status: 'Planned',
    stripeColor: '#8B5CF6', // purple
    stops: []
  },
  {
    id: 'R-005',
    name: 'Irving Lot',
    startTime: '06:00 AM',
    endTime: '03:00 PM',
    date: 'Jul 5',
    startDate: 'Jul 5',
    endDate: 'Jul 6',
    dayOfMonth: '5',
    monthName: 'JUL',
    stopsCount: 3,
    dealerName: 'Company B',
    status: 'Completed',
    stripeColor: '#F09A11', // amber
    stops: [
      {
        id: 'S-501',
        num: 1,
        type: 'Delivery Items',
        address: '555 Belt Line Rd, Irving TX',
        status: 'Done',
        notes: 'Completed early morning.',
        tasks: [{ id: 'T-501-1', text: 'Delivery verification', done: true }],
        customerName: 'Robert Vance',
        customerPhone: '469-555-3211',
        unitInfo: { size: '10 x 14 x 7', base: 'Blue', trim: 'White', roof: 'Black', serial: 'SH-4210', amount: '$4,100.00' }
      },
      {
        id: 'S-502',
        num: 2,
        type: 'Delivery Items',
        address: '662 MacArthur Blvd, Irving TX',
        status: 'Done',
        notes: 'Level ground setup.',
        tasks: [{ id: 'T-502-1', text: 'Delivery verification', done: true }],
        customerName: 'Stanley Hudson',
        customerPhone: '469-555-8755',
        unitInfo: { size: '12 x 12 x 7', base: 'Green', trim: 'Beige', roof: 'Green', serial: 'SH-4211', amount: '$4,500.00' }
      },
      {
        id: 'S-503',
        num: 3,
        type: 'Lot Transfer',
        address: '1200 Airport Fwy, Irving TX',
        status: 'Done',
        notes: 'Lot transfer completed.',
        tasks: [{ id: 'T-503-1', text: 'Transfer verification', done: true }],
        customerName: 'Company B Dealer',
        customerPhone: '469-555-0900',
        unitInfo: { size: '14 x 24 x 8', base: 'Gray', trim: 'Gray', roof: 'Charcoal', serial: 'INV-0072', amount: '$8,200.00' }
      }
    ]
  }
];
