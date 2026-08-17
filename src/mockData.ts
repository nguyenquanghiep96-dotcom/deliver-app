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
    orientation?: string;
    description?: string;
    images?: string[];
  };
  signature?: string;
  driverSignature?: string;
  photos?: string[];
  notes?: string;
  exception?: {
    reason: string;
    details?: string;
    reportedAt: string;
  };
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
  distance?: string;
  issues?: Array<{
    reason: string;
    reportedAt: string;
  }>;
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
  ownerEntity?: string;
  ownerEntities?: string[];
  endAddress?: string;
  totalDistance?: string;
  closeoutCompleted?: boolean;
  actualMileage?: string;
  finishedAt?: string;
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
    id: 'RT-006',
    name: 'Route 1',
    startTime: '07:00 AM',
    endTime: '05:00 PM',
    date: 'Aug 11',
    dayOfMonth: '11',
    monthName: 'Aug',
    stopsCount: 6,
    dealerName: 'NganLe Store A',
    status: 'En Route',
    stripeColor: '#FF7048',
    startDate: 'Aug 11',
    endDate: 'Aug 11',
    startingAddress: 'Newton St, Seattle, WA 98109',
    endAddress: 'Newton St, Seattle, WA 98109',
    totalDistance: '5539.8 mi',
    ownerEntity: 'NganLe Store A',
    ownerEntities: ['NganLe Store A', 'ShedPro Manufacturing', 'Rose Store - Harrisonburg'],
    routeNote: 'Please ensure to call the customer 30 minutes prior to arrival. Heavy traffic expected on US-340 detour.',
    dispatcherPhone: '540-555-0110',
    stops: [
      {
        id: '1',
        num: 1,
        address: 'Newton St, Seattle, WA 98109',
        status: 'Done',
        workOrders: [
          {
            id: 'WO-11',
            type: 'Delivery',
            category: 'Move',
            action: 'Dropoff',
            status: 'Completed',
            customerName: 'Alice Johnson',
            customerPhone: '555-0001',
            unitInfo: { size: '10x10', modelName: 'Shed', base: 'Grey', trim: 'White', roof: 'Metal', serial: 'SN-0001' }
          },
          {
            id: 'WO-12',
            type: 'Repair',
            category: 'Service',
            action: 'Visit',
            status: 'Completed',
            customerName: 'Bob Smith',
            customerPhone: '555-0002',
            unitInfo: { size: '', base: '', trim: '', roof: '', serial: '' }
          }
        ]
      },
      {
        id: '2',
        num: 2,
        address: '1102 US-340, Shenandoah, VA 22849',
        status: 'Servicing',
        distance: '0.2 mi away',
        workOrders: [
          {
            id: 'WO-27',
            type: 'Delivery',
            category: 'Move',
            action: 'Pickup',
            status: 'Pending',
            customerName: 'David Copperfield',
            customerPhone: '555-2222',
            unitInfo: {
              size: '10x12',
              modelName: 'Premium Storage Utility Shed with Double Doors',
              base: 'Grey',
              trim: 'White',
              roof: 'Metal',
              serial: 'SN-927711',
              material: 'LP SmartSide',
              dimensions: "10' W × 12' L × 8' H",
              orientation: 'Doors face the driveway. Keep 3 ft clearance on the left side.',
              description: 'Utility shed with centered double doors, two front vents, and a metal roof. Confirm the grey siding and white trim before unloading.',
              images: ['/Building Image 1.jpg', '/Building Image 2.jpg', '/Building Image 3.jpg']
            }
          },
          {
            id: 'WO-28',
            type: 'Repo',
            category: 'Move',
            action: 'Dropoff',
            status: 'Pending',
            customerName: 'Jane Smith',
            customerPhone: '555-3333',
            unitInfo: { size: '12x16', modelName: 'Garden shed', base: 'Brown', trim: 'White', roof: 'Metal', serial: 'SN-927718' }
          },
          {
            id: 'WO-29',
            type: 'Repair',
            category: 'Service',
            action: 'Visit',
            status: 'Pending',
            customerName: 'Khiet (Site Inspection)',
            customerPhone: '555-4444',
            unitInfo: { size: '', base: '', trim: '', roof: '', serial: '' }
          },
          {
            id: 'WO-30',
            type: 'Delivery',
            category: 'Move',
            action: 'Dropoff',
            status: 'Pending',
            customerName: 'Long Name Customer Limited Liability Company',
            customerPhone: '555-5555',
            unitInfo: { size: '14x20', modelName: 'Garage shed', base: 'Red', trim: 'White', roof: 'Shingle', serial: 'SN-999999' }
          }
        ]
      },
      {
        id: '3',
        num: 3,
        address: '1102 US-340, Shenandoah, VA 22849',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-22',
            type: 'Delivery',
            category: 'Move',
            action: 'Visit',
            status: 'Pending',
            customerName: 'Ngan Le',
            customerPhone: '555-1111',
            unitInfo: { size: '', base: '', trim: '', roof: '', serial: '' }
          }
        ]
      },
      {
        id: '4',
        num: 4,
        address: 'Staten Island Ferry, Staten Island, NY',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-31',
            type: 'Delivery',
            category: 'Move',
            action: 'Dropoff',
            status: 'Pending',
            customerName: 'Khiet',
            customerPhone: '555-3333',
            unitInfo: { size: '12x16', modelName: 'Garden shed', base: 'Brown', trim: 'White', roof: 'Metal', serial: 'SN-927718' }
          }
        ]
      },
      {
        id: '5',
        num: 5,
        address: 'Vesta Dr, PA 17745',
        status: 'Pending',
        workOrders: [
          {
            id: 'WO-27',
            type: 'Delivery',
            category: 'Move',
            action: 'Dropoff',
            status: 'Pending',
            customerName: 'David Copperfield',
            customerPhone: '555-2222',
            unitInfo: {
              size: '10x12',
              modelName: 'Premium Storage Utility Shed with Double Doors',
              base: 'Grey',
              trim: 'White',
              roof: 'Metal',
              serial: 'SN-927711',
              material: 'LP SmartSide',
              dimensions: "10' W × 12' L × 8' H",
              orientation: 'Doors face the driveway. Keep 3 ft clearance on the left side.',
              description: 'Utility shed with centered double doors, two front vents, and a metal roof. Confirm the grey siding and white trim before unloading.',
              images: ['/Building Image 1.jpg', '/Building Image 2.jpg', '/Building Image 3.jpg']
            }
          }
        ]
      },
      {
        id: '6',
        num: 6,
        address: 'Newton St, Seattle, WA 98109',
        status: 'Pending',
        distance: '100 mi away',
        workOrders: [
          {
            id: 'WO-END',
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
    name: 'Route 2',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    date: 'Aug 15',
    dayOfMonth: '15',
    monthName: 'Aug',
    stopsCount: 2,
    dealerName: 'Store A',
    ownerEntities: ['Store A', 'Store B'],
    status: 'Planned',
    stripeColor: '#8E94F2',
    startDate: 'Aug 15',
    endDate: 'Aug 15',
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
            customerName: 'ShedPro Inventory',
            customerPhone: '555-9999',
            unitInfo: { size: '10 x 20', modelName: 'Utility Shed', base: 'Tan', trim: 'White', roof: 'Metal', serial: 'S-AAAA' }
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
            customerName: 'ShedPro Inventory',
            customerPhone: '555-9999',
            unitInfo: { size: '10 x 20', modelName: 'Utility Shed', base: 'Tan', trim: 'White', roof: 'Metal', serial: 'S-AAAA' }
          }
        ]
      }
    ]
  },
  {
    id: 'R-003',
    name: 'Route 3',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    date: 'Aug 16',
    dayOfMonth: '16',
    monthName: 'Aug',
    stopsCount: 3,
    dealerName: 'MFR A',
    status: 'Planned',
    stripeColor: '#F582A8',
    startDate: 'Aug 16',
    endDate: 'Aug 16',
    startingAddress: '123 Main St, Houston, TX',
    routeNote: '',
    dispatcherPhone: '+18005550300',
    endAddress: '123 Main St, Houston, TX',
    stops: [
      {
        id: '1',
        num: 1,
        address: '1200 McKinney St, Houston, TX 77010',
        status: 'Pending',
        distance: '6.2 mi away',
        workOrders: [{
          id: 'WO-013', type: 'Delivery', category: 'Move', action: 'Pickup', status: 'Pending',
          customerName: 'Maria Gonzalez', customerPhone: '713-555-0130',
          unitInfo: { size: '12 x 16', modelName: 'Garden Shed', base: 'Clay', trim: 'White', roof: 'Shingle', serial: 'HS-1216-013' }
        }]
      },
      {
        id: '2',
        num: 2,
        address: '789 W Alabama St, Houston, TX 77006',
        status: 'Pending',
        distance: '4.8 mi away',
        workOrders: [{
          id: 'WO-014', type: 'Repair', category: 'Service', action: 'Visit', status: 'Pending',
          customerName: 'James Wilson', customerPhone: '713-555-0140',
          unitInfo: { size: '10 x 12', modelName: 'Utility Shed', base: 'Blue', trim: 'White', roof: 'Metal', serial: 'HS-1012-014' }
        }]
      },
      {
        id: '3',
        num: 3,
        address: '4502 Yale St, Houston, TX 77018',
        status: 'Pending',
        distance: '9.1 mi away',
        workOrders: [{
          id: 'WO-013', type: 'Delivery', category: 'Move', action: 'Dropoff', status: 'Pending',
          customerName: 'Maria Gonzalez', customerPhone: '713-555-0130',
          unitInfo: { size: '12 x 16', modelName: 'Garden Shed', base: 'Clay', trim: 'White', roof: 'Shingle', serial: 'HS-1216-013' }
        }]
      }
    ]
  },
  {
    id: 'R-004',
    name: 'Route 4',
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

  ,
  {
    id: 'R-005',
    name: 'Route 5',
    startTime: '08:00 AM',
    endTime: '03:30 PM',
    date: 'Aug 18',
    dayOfMonth: '18',
    monthName: 'Aug',
    stopsCount: 3,
    dealerName: 'Store B',
    status: 'Planned',
    stripeColor: '#3B82F6',
    startDate: 'Aug 18',
    endDate: 'Aug 18',
    stops: []
  },
  {
    id: 'R-007',
    name: 'Route 6',
    startTime: '09:00 AM',
    endTime: '01:15 PM',
    date: 'Aug 20',
    dayOfMonth: '20',
    monthName: 'Aug',
    stopsCount: 2,
    dealerName: 'Store C',
    status: 'Planned',
    stripeColor: '#3B82F6',
    startDate: 'Aug 20',
    endDate: 'Aug 20',
    stops: []
  },
  {
    id: 'R-008',
    name: 'Route 7',
    startTime: '07:30 AM',
    endTime: '04:00 PM',
    date: 'Sep 05',
    dayOfMonth: '05',
    monthName: 'Sep',
    stopsCount: 5,
    dealerName: 'Store D',
    status: 'Planned',
    stripeColor: '#3B82F6',
    startDate: 'Sep 05',
    endDate: 'Sep 05',
    stops: []
  },
  {
    id: 'R-009',
    name: 'Route 8',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    date: 'Sep 12',
    dayOfMonth: '12',
    monthName: 'Sep',
    stopsCount: 4,
    dealerName: 'Store E',
    status: 'Planned',
    stripeColor: '#3B82F6',
    startDate: 'Sep 12',
    endDate: 'Sep 12',
    stops: []
  },
  {
    id: 'R-010',
    name: 'Route 9',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    date: 'Aug 02',
    dayOfMonth: '02',
    monthName: 'Aug',
    stopsCount: 3,
    dealerName: 'Store A',
    status: 'Completed',
    stripeColor: '#2FA301',
    startDate: 'Aug 02',
    endDate: 'Aug 02',
    stops: []
  },
  {
    id: 'R-011',
    name: 'Route 10',
    startTime: '07:00 AM',
    endTime: '02:00 PM',
    date: 'Jul 28',
    dayOfMonth: '28',
    monthName: 'Jul',
    stopsCount: 2,
    dealerName: 'Store B',
    status: 'Completed',
    stripeColor: '#2FA301',
    startDate: 'Jul 28',
    endDate: 'Jul 28',
    stops: []
  },
  {
    id: 'R-012',
    name: 'Route 11',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    date: 'Jul 10',
    dayOfMonth: '10',
    monthName: 'Jul',
    stopsCount: 4,
    dealerName: 'Store C',
    status: 'Completed',
    stripeColor: '#2FA301',
    startDate: 'Jul 10',
    endDate: 'Jul 10',
    stops: []
  }
];
