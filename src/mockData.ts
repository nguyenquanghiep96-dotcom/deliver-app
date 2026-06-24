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
  tasks: Task[];
  customerName: string;
  customerPhone: string;
  unitInfo: {
    size: string;
    base: string;
    trim: string;
    roof: string;
    serial: string;
    amount?: string;
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
    startTime: '08:00 AM',
    date: 'Today',
    stopsCount: 5,
    dealerName: 'Store A',
    status: 'En Route',
    stripeColor: '#3b82f6', // blue
    stops: [
      {
        id: 'S-101',
        num: 1,
        type: 'Delivery Items',
        address: '123 Oak Street, Fort Worth TX',
        status: 'Done',
        notes: 'Delivery of standard gable shed. Customer wants it aligned with the fence line. Inspect ground level before placing.',
        tasks: [
          { id: 'T-101-1', text: 'Inspect exterior condition', done: true },
          { id: 'T-101-2', text: 'Photo documentation', done: true },
          { id: 'T-101-3', text: 'Obtain customer signature', done: true }
        ],
        customerName: 'Jason Smith',
        customerPhone: '714-345-4909',
        unitInfo: {
          size: '14 x 20 x 7',
          base: 'Redwood',
          trim: 'Blue',
          roof: 'Black',
          serial: 'SH-4420',
          amount: '$6,482.80'
        },
        comments: ['Delivery completed successfully. Ground was slightly uneven but block leveling resolved it.'],
        gpsMarked: true,
        gpsCoords: { lat: 32.7555, lng: -97.3308 }
      },
      {
        id: 'S-102',
        num: 2,
        type: 'Welfare Check',
        address: '456 Elm Ave, Fort Worth TX',
        status: 'Servicing',
        notes: 'Check condition of unit #SH-4421. Report any exterior damage with photos. Verify double doors operate smoothly.',
        tasks: [
          { id: 'T-102-1', text: 'Inspect exterior condition', done: true },
          { id: 'T-102-2', text: 'Photo documentation', done: false },
          { id: 'T-102-3', text: 'Verify doors alignment', done: false }
        ],
        customerName: 'Jason Smith',
        customerPhone: '714-345-4909',
        unitInfo: {
          size: '14 x 20 x 7',
          base: 'Redwood',
          trim: 'Blue',
          roof: 'Black',
          serial: 'SH-4421',
          amount: '$0.00 (Warranty)'
        }
      },
      {
        id: 'S-103',
        num: 3,
        type: 'Repo',
        address: '789 Pine Rd, Arlington TX',
        status: 'Pending',
        notes: 'Repossession of unit #INV-0091. Owner is aware of repossession. If gates are locked, call dispatcher immediately.',
        tasks: [
          { id: 'T-103-1', text: 'Confirm unit serial number', done: false },
          { id: 'T-103-2', text: 'Inspect unit structure', done: false },
          { id: 'T-103-3', text: 'Secure load on flatbed', done: false }
        ],
        customerName: 'Roy Buchanan',
        customerPhone: '704-555-2938',
        unitInfo: {
          size: '10 x 16 x 7',
          base: 'White',
          trim: 'Gray',
          roof: 'Charcoal',
          serial: 'INV-0091',
          amount: '$4,200.00'
        }
      },
      {
        id: 'S-104',
        num: 4,
        type: 'Lot Transfer',
        address: '101 Cedar Blvd, Euless TX → Warehouse B',
        status: 'Pending',
        notes: 'Transfer minor damage unit to Warehouse B for refurbishing. Structural frame is sound.',
        tasks: [
          { id: 'T-104-1', text: 'Attach red flag to overhang', done: false },
          { id: 'T-104-2', text: 'Take photo of damages', done: false }
        ],
        customerName: 'ShedPro Warehouse B',
        customerPhone: '800-555-0122',
        unitInfo: {
          size: '8 x 12 x 7',
          base: 'Brown',
          trim: 'Beige',
          roof: 'Brown',
          serial: 'WD-8122',
          amount: '$0.00'
        }
      },
      {
        id: 'S-105',
        num: 5,
        type: 'Delivery Items',
        address: '222 Maple Dr, Garland TX',
        status: 'Pending',
        notes: 'Standard storage shed delivery. Site prep completed by customer. Place near patio.',
        tasks: [
          { id: 'T-105-1', text: 'Verify site foundation', done: false },
          { id: 'T-105-2', text: 'Install ramp accessories', done: false },
          { id: 'T-105-3', text: 'Obtain signature', done: false }
        ],
        customerName: 'Sarah Jenkins',
        customerPhone: '214-555-9011',
        unitInfo: {
          size: '12 x 16 x 8',
          base: 'Gray',
          trim: 'White',
          roof: 'Silver',
          serial: 'SH-4433',
          amount: '$5,150.00'
        }
      }
    ]
  },
  {
    id: 'R-002',
    name: 'Dallas North',
    startTime: '02:00 PM',
    date: 'Today',
    stopsCount: 2,
    dealerName: 'Store A',
    status: 'Planned',
    stripeColor: '#10b981', // green
    stops: [
      {
        id: 'S-201',
        num: 1,
        type: 'Delivery Items',
        address: '990 Preston Rd, Plano TX',
        status: 'Pending',
        notes: 'Verify clearance of trees before backup. Backyard access is tight.',
        tasks: [
          { id: 'T-201-1', text: 'Verify side width clearance', done: false },
          { id: 'T-201-2', text: 'Structural inspection post-placement', done: false }
        ],
        customerName: 'David Miller',
        customerPhone: '972-555-0144',
        unitInfo: {
          size: '10 x 12 x 7',
          base: 'Redwood',
          trim: 'White',
          roof: 'Green',
          serial: 'SH-4450',
          amount: '$3,800.00'
        }
      },
      {
        id: 'S-202',
        num: 2,
        type: 'Repo',
        address: '1432 Coit Rd, Richardson TX',
        status: 'Pending',
        notes: 'Verify serial number carefully. Ground is concrete.',
        tasks: [
          { id: 'T-202-1', text: 'Verify serial number', done: false },
          { id: 'T-202-2', text: 'Repossession checklist', done: false }
        ],
        customerName: 'Emily Davis',
        customerPhone: '972-555-0188',
        unitInfo: {
          size: '8.5 x 10 x 7',
          base: 'Gray',
          trim: 'White',
          roof: 'Gray',
          serial: 'INV-0095',
          amount: '$2,900.00'
        }
      }
    ]
  },
  {
    id: 'R-003',
    name: 'Houston South',
    startTime: '09:00 AM',
    date: 'Apr 22',
    dayOfMonth: '22',
    monthName: 'APR',
    stopsCount: 4,
    dealerName: 'MFR',
    status: 'Planned',
    stripeColor: '#f59e0b', // amber
    stops: []
  },
  {
    id: 'R-004',
    name: 'Austin West',
    startTime: '08:30 AM',
    date: 'Apr 23',
    dayOfMonth: '23',
    monthName: 'APR',
    stopsCount: 3,
    dealerName: 'Store B',
    status: 'Planned',
    stripeColor: '#8b5cf6', // purple
    stops: []
  },
  {
    id: 'R-005',
    name: 'Irving Lot',
    startTime: '06:00 AM',
    date: 'Today',
    stopsCount: 3,
    dealerName: 'Company B',
    status: 'Completed',
    stripeColor: '#6366f1', // indigo
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
        unitInfo: {
          size: '10 x 14 x 7',
          base: 'Blue',
          trim: 'White',
          roof: 'Black',
          serial: 'SH-4210',
          amount: '$4,100.00'
        }
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
        unitInfo: {
          size: '12 x 12 x 7',
          base: 'Green',
          trim: 'Beige',
          roof: 'Green',
          serial: 'SH-4211',
          amount: '$4,500.00'
        }
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
        unitInfo: {
          size: '14 x 24 x 8',
          base: 'Gray',
          trim: 'Gray',
          roof: 'Charcoal',
          serial: 'INV-0072',
          amount: '$8,200.00'
        }
      }
    ]
  }
];
