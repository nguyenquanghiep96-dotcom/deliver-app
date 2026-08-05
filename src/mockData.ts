export interface WorkOrder {
  id: string;
  type: 'Delivery' | 'Repo' | 'Repair' | 'Lot Transfer' | 'Welfare Check' | 'Private Move' | 'Payment Collection';
  category: 'Move' | 'Service';
  action: 'Pickup' | 'Dropoff' | 'Visit' | 'Start' | 'End';
  status: 'Pending' | 'Completed' | 'Failed';
  customerName: string;
  customerPhone: string;
  unitInfo: {
    size: string;
    modelName?: string;
    base: string;
    trim: string;
    roof: string;
    serial: string;
    amount?: string;
    material?: string;
    dimensions?: string;
  };
  signature?: string;
  driverSignature?: string;
  photos?: string[];
  notes?: string;
}

export interface Stop {
  id: string;
  num: number;
  address: string;
  status: 'Done' | 'Servicing' | 'Pending';
  deliveryInstruction?: string;
  buildingOrientation?: string;
  gpsMarked?: boolean;
  gpsCoords?: { lat: number; lng: number };
  workOrders: WorkOrder[];
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
    id: 'RT-1001',
    name: 'Harrisonburg Route',
    startTime: '07:00 AM',
    endTime: '05:00 PM',
    date: 'Jul 27',
    dayOfMonth: '27',
    monthName: 'Jul',
    stopsCount: 5,
    dealerName: 'Rose MNF (Demo Dev)',
    status: 'En Route',
    stripeColor: '#FF7048',
    startDate: 'Jul 27',
    endDate: 'Jul 27',
    startingAddress: '3210 S Main St, Harrisonburg, VA 22801',
    routeNote: '--',
    dispatcherPhone: '540-555-0110',
    stops: [
      {
        id: '1',
        num: 1,
        address: '3210 S Main St, Harrisonburg, VA 22801',
        status: 'Done',
        workOrders: [
          {
            id: 'WO-1000',
            type: 'Lot Transfer',
            category: 'Move',
            action: 'Start',
            status: 'Completed',
            customerName: 'Start address',
            customerPhone: '555-0000',
            unitInfo: { size: '', base: '', trim: '', roof: '', serial: '' }
          }
        ]
      },
      {
        id: '2',
        num: 2,
        address: '3210 S Main St, Harrisonburg, VA 22801',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-1042',
            type: 'Delivery',
            category: 'Move',
            action: 'Pickup',
            status: 'Pending',
            customerName: 'Dennis Sartain',
            customerPhone: '555-1111',
            unitInfo: { size: '10x12', modelName: 'Utility shed', base: 'Grey', trim: 'White', roof: 'Metal', serial: 'SN-927711' }
          },
          {
            id: 'WO-1043',
            type: 'Delivery',
            category: 'Move',
            action: 'Pickup',
            status: 'Pending',
            customerName: 'Marisol Reyes',
            customerPhone: '555-2222',
            unitInfo: { size: '12x16', modelName: 'Garden shed', base: 'Brown', trim: 'White', roof: 'Metal', serial: 'SN-927718' }
          },
          {
            id: 'WO-1051',
            type: 'Delivery',
            category: 'Move',
            action: 'Pickup',
            status: 'Pending',
            customerName: 'Grant Whitfield',
            customerPhone: '555-3333',
            unitInfo: { size: '8x10', modelName: 'Lean-to shed', base: 'White', trim: 'White', roof: 'Shingle', serial: 'SN-927774' }
          }
        ]
      },
      {
        id: '3',
        num: 3,
        address: '212 N Main St, Bridgewater, VA 22812',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-1042',
            type: 'Delivery',
            category: 'Move',
            action: 'Dropoff',
            status: 'Pending',
            customerName: 'Dennis Sartain',
            customerPhone: '555-1111',
            unitInfo: { size: '10x12', modelName: 'Utility shed', base: 'Grey', trim: 'White', roof: 'Metal', serial: 'SN-927711' }
          },
          {
            id: 'WO-1043',
            type: 'Delivery',
            category: 'Move',
            action: 'Dropoff',
            status: 'Pending',
            customerName: 'Marisol Reyes',
            customerPhone: '555-2222',
            unitInfo: { size: '12x16', modelName: 'Garden shed', base: 'Brown', trim: 'White', roof: 'Metal', serial: 'SN-927718' }
          }
        ]
      },
      {
        id: '4',
        num: 4,
        address: '116 W Beverley St, Staunton, VA 24401',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-1051',
            type: 'Delivery',
            category: 'Move',
            action: 'Dropoff',
            status: 'Pending',
            customerName: 'Grant Whitfield',
            customerPhone: '555-3333',
            unitInfo: { size: '8x10', modelName: 'Lean-to shed', base: 'White', trim: 'White', roof: 'Shingle', serial: 'SN-927774' }
          }
        ]
      },
      {
        id: '5',
        num: 5,
        address: '3210 S Main St, Harrisonburg, VA 22801',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-1001',
            type: 'Lot Transfer',
            category: 'Move',
            action: 'End',
            status: 'Pending',
            customerName: 'Back to start address',
            customerPhone: '555-0000',
            unitInfo: { size: '', base: '', trim: '', roof: '', serial: '' }
          }
        ]
      }
    ]
  },
  {
    id: 'R-002',
    name: 'Dallas North',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    date: 'Jul 10 - Jul 11',
    dayOfMonth: '10-11',
    monthName: 'Jul',
    stopsCount: 2,
    dealerName: 'Store A',
    status: 'Planned',
    stripeColor: '#8E94F2',
    startDate: 'Jul 10',
    endDate: 'Jul 11',
    startingAddress: '990 Preston Rd, Plano, TX 75093',
    routeNote: 'Gate code at Stop 2 is 1234.',
    dispatcherPhone: '+18005550200',
    stops: [
      {
        id: '1',
        num: 1,
        address: '990 Preston Rd, Plano, TX',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-007',
            type: 'Lot Transfer',
            category: 'Move',
            action: 'Pickup',
            status: 'Pending',
            customerName: 'Store A',
            customerPhone: '555-9999',
            unitInfo: { size: '10 x 20', base: 'Tan', trim: 'White', roof: 'Metal', serial: 'S-AAAA' }
          }
        ]
      },
      {
        id: '2',
        num: 2,
        address: '1111 Duff Ave, Ames, IA',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-007',
            type: 'Lot Transfer',
            category: 'Move',
            action: 'Dropoff',
            status: 'Pending',
            customerName: 'Store B',
            customerPhone: '555-8888',
            unitInfo: { size: '10 x 20', base: 'Tan', trim: 'White', roof: 'Metal', serial: 'S-AAAA' }
          }
        ]
      }
    ]
  },
  {
    id: 'R-003',
    name: 'Houston South',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    date: 'Jul 14 - Jul 15',
    dayOfMonth: '14-15',
    monthName: 'Jul',
    stopsCount: 0,
    dealerName: 'MFR A',
    status: 'Planned',
    stripeColor: '#F582A8',
    startDate: 'Jul 14',
    endDate: 'Jul 15',
    startingAddress: '123 Main St, Houston, TX',
    routeNote: '',
    dispatcherPhone: '+18005550300',
    stops: []
  },
  {
    id: 'R-004',
    name: 'Austin West',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    date: 'Jun 22',
    dayOfMonth: '22',
    monthName: 'Jun',
    stopsCount: 3,
    dealerName: 'Store B',
    status: 'Completed',
    stripeColor: '#34A853',
    stops: [
      {
        id: '1',
        num: 1,
        address: '100 Congress Ave, Austin, TX',
        status: 'Done',
        workOrders: [
          {
            id: 'WO-008',
            type: 'Repair',
            category: 'Service',
            action: 'Visit',
            status: 'Completed',
            customerName: 'Charlie Brown',
            customerPhone: '555-7777',
            unitInfo: { size: '12 x 12', base: 'Blue', trim: 'White', roof: 'Shingle', serial: 'S-BBBB' }
          }
        ]
      },
      {
        id: '2',
        num: 2,
        address: '200 Lamar Blvd, Austin, TX',
        status: 'Done',
        workOrders: [
          {
            id: 'WO-009',
            type: 'Delivery',
            category: 'Move',
            action: 'Dropoff',
            status: 'Completed',
            customerName: 'Lucy Van Pelt',
            customerPhone: '555-6666',
            unitInfo: { size: '10 x 12', base: 'Yellow', trim: 'White', roof: 'Metal', serial: 'S-CCCC' }
          }
        ]
      },
      {
        id: '3',
        num: 3,
        address: '300 Guadalupe St, Austin, TX',
        status: 'Done',
        workOrders: [
          {
            id: 'WO-010',
            type: 'Welfare Check',
            category: 'Service',
            action: 'Visit',
            status: 'Completed',
            customerName: 'Linus Van Pelt',
            customerPhone: '555-5555',
            unitInfo: { size: '8 x 10', base: 'White', trim: 'Blue', roof: 'Metal', serial: 'S-DDDD' }
          }
        ]
      }
    ]
  }
];
