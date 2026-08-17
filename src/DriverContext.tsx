import { createContext, useContext, useState, useEffect } from 'react';
import { mockDrivers, initialRoutes } from './mockData';
import type { RouteData, Driver, Stop, WorkOrder } from './mockData';

interface DriverContextType {
  drivers: Driver[];
  activeDriver: Driver;
  routes: RouteData[];
  isDriverActive: boolean;
  setDriverActive: (active: boolean) => void;
  switchDriver: (driverId: string) => void;
  updateStopStatus: (routeId: string, stopId: string, status: Stop['status']) => void;
  updateWorkOrderStatus: (routeId: string, stopId: string, workOrderId: string, status: WorkOrder['status']) => void;
  reportWorkOrderIssue: (routeId: string, stopId: string, workOrderId: string, reason: string, details?: string) => void;
  addPhoto: (routeId: string, stopId: string, workOrderId: string, photoDataUrl: string) => void;
  removePhoto: (routeId: string, stopId: string, workOrderId: string, photoIndex: number) => void;
  saveSignature: (routeId: string, stopId: string, workOrderId: string, signatureDataUrl: string) => void;
  saveDriverSignature: (routeId: string, stopId: string, workOrderId: string, signatureDataUrl: string) => void;
  addComment: (routeId: string, stopId: string, workOrderId: string, comment: string) => void;
  markGPS: (routeId: string, stopId: string) => void;
  skipStop: (routeId: string, stopId: string, reason: string) => void;
  reportIssue: (routeId: string, stopId: string, issue: string) => void;
  startRoute: (routeId: string) => void;
  finishRoute: (routeId: string, actualMileage: string) => void;
  isDrivingMode: boolean;
  drivingTarget: { routeId: string; stopId: string } | null;
  startDrivingMode: (routeId: string, stopId: string) => void;
  endDrivingMode: () => void;
  isOnline: boolean;
  pendingSyncCount: number;
  isSyncing: boolean;
  lastSyncedAt: number | null;
  routeUpdates: DispatcherRouteUpdate[];
  acknowledgeRouteUpdate: (updateId: string) => void;
  resetData: () => void;
  prototypeStage: 1 | 2 | 3 | 4;
  setPrototypeStage: (stage: 1 | 2 | 3 | 4) => void;
}

export interface RouteChange {
  label: string;
  previous?: string;
  current: string;
}

export interface DispatcherRouteUpdate {
  id: string;
  routeId: string;
  receivedAt: string;
  title: string;
  summary: string;
  changes: RouteChange[];
  acknowledged: boolean;
}

const INITIAL_ROUTE_UPDATES: Omit<DispatcherRouteUpdate, 'acknowledged'>[] = [
  {
    id: 'update-rt006-1',
    routeId: 'RT-006',
    receivedAt: '10:32 AM',
    title: 'Route updated by Dispatcher',
    summary: '2 changes to Route 1',
    changes: [
      {
        label: 'Route note',
        previous: 'Call customers before arrival.',
        current: 'Call customers 30 minutes before arrival. Heavy traffic is expected on the US-340 detour.',
      },
      {
        label: 'Stop sequence',
        previous: 'Stop 3 before Stop 2',
        current: 'Stop 2 moved before Stop 3',
      },
    ],
  },
];

const DriverContext = createContext<DriverContextType | undefined>(undefined);

const createPrototypeRoutes = (stage: 1 | 2 | 3): RouteData[] => initialRoutes.map(route => {
  const clonedRoute = {
    ...route,
    stops: route.stops.map(stop => ({
      ...stop,
      workOrders: stop.workOrders.map(wo => ({ ...wo })),
    })),
  };

  if (route.id !== 'RT-006' || stage === 1) return clonedRoute;
  if (stage === 2) {
    return {
      ...clonedRoute,
      status: 'Planned' as const,
      date: 'Aug 18',
      startDate: 'Aug 18',
      stops: clonedRoute.stops.map(stop => ({
        ...stop,
        status: 'Pending' as const,
        workOrders: stop.workOrders.map(wo => ({ ...wo, status: 'Pending' as const })),
      })),
    };
  }
  return {
    ...clonedRoute,
    status: 'Planned' as const,
    date: 'Today',
    stops: clonedRoute.stops.map(stop => ({
      ...stop,
      status: 'Pending' as const,
      workOrders: stop.workOrders.map(wo => ({ ...wo, status: 'Pending' as const })),
    })),
  };
});

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prototypeStage, setPrototypeStageState] = useState<1 | 2 | 3 | 4>(() => {
    const saved = Number(localStorage.getItem('opshub_prototype_stage'));
    return saved === 2 || saved === 3 || saved === 4 ? saved : 1;
  });
  const [activeDriver, setActiveDriver] = useState<Driver>(() => {
    const saved = localStorage.getItem('opshub_driver_active');
    if (saved) {
      const found = mockDrivers.find(d => d.id === saved);
      if (found) return found;
    }
    return mockDrivers[0];
  });

  const [isDriverActive, setIsDriverActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('opshub_driver_status');
    return saved ? saved === 'active' : true;
  });

  const [routes, setRoutes] = useState<RouteData[]>(() => {
    const savedStage = Number(localStorage.getItem('opshub_driver_routes_stage'));
    const savedRoutes = localStorage.getItem('opshub_driver_routes');
    if (savedRoutes && savedStage === prototypeStage) {
      try {
        return JSON.parse(savedRoutes) as RouteData[];
      } catch {
        localStorage.removeItem('opshub_driver_routes');
      }
    }
    return createPrototypeRoutes(prototypeStage);
  });
  const [isOnlineBase, setIsOnline] = useState(() => navigator.onLine);
  const isOnline = prototypeStage === 4 ? false : isOnlineBase;
  const [pendingSyncCount, setPendingSyncCount] = useState(() => Number(localStorage.getItem('opshub_pending_sync_count')) || 0);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() => {
    const saved = Number(localStorage.getItem('opshub_last_synced_at'));
    return saved || null;
  });
  const [acknowledgedUpdateIds, setAcknowledgedUpdateIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('opshub_acknowledged_route_updates') || '[]') as string[];
    } catch {
      return [];
    }
  });
  const [drivingTarget, setDrivingTarget] = useState<{ routeId: string; stopId: string } | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('opshub_driving_target') || 'null') as { routeId: string; stopId: string } | null;
    } catch {
      return null;
    }
  });

  const routeUpdates: DispatcherRouteUpdate[] = INITIAL_ROUTE_UPDATES.map(update => ({
    ...update,
    acknowledged: acknowledgedUpdateIds.includes(update.id),
  }));
  const isSyncing = isOnline && pendingSyncCount > 0;
  const isDrivingMode = Boolean(drivingTarget);

  useEffect(() => {
    localStorage.setItem('opshub_driver_active', activeDriver.id);
  }, [activeDriver]);

  useEffect(() => {
    localStorage.setItem('opshub_driver_status', isDriverActive ? 'active' : 'offline');
  }, [isDriverActive]);

  useEffect(() => {
    localStorage.setItem('opshub_driver_routes', JSON.stringify(routes));
    localStorage.setItem('opshub_driver_routes_stage', String(prototypeStage));
  }, [routes, prototypeStage]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('opshub_pending_sync_count', String(pendingSyncCount));
  }, [pendingSyncCount]);

  useEffect(() => {
    if (!isOnline || pendingSyncCount === 0) return;
    const timeout = window.setTimeout(() => {
      const syncedAt = Date.now();
      setPendingSyncCount(0);
      setLastSyncedAt(syncedAt);
      localStorage.setItem('opshub_last_synced_at', String(syncedAt));
    }, 1400);
    return () => window.clearTimeout(timeout);
  }, [isOnline, pendingSyncCount]);

  useEffect(() => {
    localStorage.setItem('opshub_acknowledged_route_updates', JSON.stringify(acknowledgedUpdateIds));
  }, [acknowledgedUpdateIds]);

  useEffect(() => {
    if (drivingTarget) localStorage.setItem('opshub_driving_target', JSON.stringify(drivingTarget));
    else localStorage.removeItem('opshub_driving_target');
  }, [drivingTarget]);

  const recordMutation = () => {
    if (!isOnline) setPendingSyncCount(count => count + 1);
  };

  const switchDriver = (driverId: string) => {
    const found = mockDrivers.find(d => d.id === driverId);
    if (found) {
      setActiveDriver(found);
    }
  };

  const setDriverActive = (active: boolean) => {
    setIsDriverActive(active);
  };

  const updateStopStatus = (routeId: string, stopId: string, status: Stop['status']) => {
    recordMutation();
    setRoutes(prev => prev.map(r => {
      if (r.id !== routeId) return r;
      const newStops = r.stops.map(s => {
        if (s.id === stopId) {
          return { ...s, status };
        }
        return s;
      });
      const operationalStops = newStops.filter(stop => stop.workOrders.some(wo => wo.action !== 'Start' && wo.action !== 'End'));
      const allStopsDone = operationalStops.length > 0 && operationalStops.every(stop => stop.status === 'Done');
      return {
        ...r,
        stops: newStops,
        status: allStopsDone ? 'Completed' : (r.status === 'Planned' && status === 'Servicing' ? 'En Route' : r.status),
        closeoutCompleted: allStopsDone ? false : r.closeoutCompleted,
      };
    }));
  };

  const updateWorkOrderStatus = (routeId: string, stopId: string, workOrderId: string, status: WorkOrder['status']) => {
    recordMutation();
    setRoutes(prev => prev.map(r => {
      if (r.id !== routeId) return r;
      return {
        ...r,
        stops: r.stops.map(s => {
          if (s.id !== stopId) return s;
          return {
            ...s,
            workOrders: s.workOrders.map(wo => wo.id === workOrderId ? { ...wo, status } : wo)
          };
        })
      };
    }));
  };

  const reportWorkOrderIssue = (routeId: string, stopId: string, workOrderId: string, reason: string, details?: string) => {
    recordMutation();
    setRoutes(prev => prev.map(route => route.id !== routeId ? route : {
      ...route,
      stops: route.stops.map(stop => stop.id !== stopId ? stop : {
        ...stop,
        workOrders: stop.workOrders.map(workOrder => workOrder.id !== workOrderId ? workOrder : {
          ...workOrder,
          status: 'Failed',
          exception: {
            reason,
            details: details?.trim() || undefined,
            reportedAt: new Date().toISOString(),
          },
        }),
      }),
    }));
  };

  const addPhoto = (routeId: string, stopId: string, workOrderId: string, photoDataUrl: string) => {
    recordMutation();
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        workOrders: s.workOrders.map(wo => wo.id !== workOrderId ? wo : {
          ...wo,
          photos: [...(wo.photos || []), photoDataUrl]
        })
      })
    }));
  };

  const removePhoto = (routeId: string, stopId: string, workOrderId: string, photoIndex: number) => {
    recordMutation();
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        workOrders: s.workOrders.map(wo => wo.id !== workOrderId ? wo : {
          ...wo,
          photos: (wo.photos || []).filter((_, i) => i !== photoIndex)
        })
      })
    }));
  };

  const saveSignature = (routeId: string, stopId: string, workOrderId: string, signatureDataUrl: string) => {
    recordMutation();
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        workOrders: s.workOrders.map(wo => wo.id !== workOrderId ? wo : {
          ...wo,
          signature: signatureDataUrl
        })
      })
    }));
  };

  const saveDriverSignature = (routeId: string, stopId: string, workOrderId: string, signatureDataUrl: string) => {
    recordMutation();
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        workOrders: s.workOrders.map(wo => wo.id !== workOrderId ? wo : {
          ...wo,
          driverSignature: signatureDataUrl
        })
      })
    }));
  };

  const addComment = (routeId: string, stopId: string, workOrderId: string, comment: string) => {
    recordMutation();
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        workOrders: s.workOrders.map(wo => wo.id !== workOrderId ? wo : {
          ...wo,
          notes: wo.notes ? wo.notes + '\n\n' + comment : comment
        })
      })
    }));
  };

  const markGPS = (routeId: string, stopId: string) => {
    recordMutation();
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        gpsMarked: true,
        gpsCoords: { lat: 32.7767, lng: -96.7970 } // Mock coordinates for Dallas
      })
    }));
  };

  const skipStop = (routeId: string, stopId: string, reason: string) => {
    recordMutation();
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        status: 'Done',
        workOrders: s.workOrders.map(wo => ({ ...wo, status: 'Failed', notes: reason }))
      })
    }));
  };

  const reportIssue = (routeId: string, stopId: string, issue: string) => {
    recordMutation();
    // In a real app this would call an API
    console.log(`Issue reported on route ${routeId}, stop ${stopId}: ${issue}`);
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        issues: [...(s.issues || []), { reason: issue, reportedAt: new Date().toISOString() }]
      })
    }));
  };

  const startRoute = (routeId: string) => {
    recordMutation();
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, status: 'En Route' } : r));
  };

  const finishRoute = (routeId: string, actualMileage: string) => {
    recordMutation();
    setRoutes(prev => prev.map(route => route.id === routeId ? {
      ...route,
      status: 'Completed',
      closeoutCompleted: true,
      actualMileage,
      finishedAt: new Date().toISOString(),
    } : route));
  };

  const startDrivingMode = (routeId: string, stopId: string) => {
    setDrivingTarget({ routeId, stopId });
  };

  const endDrivingMode = () => {
    setDrivingTarget(null);
  };

  const acknowledgeRouteUpdate = (updateId: string) => {
    recordMutation();
    setAcknowledgedUpdateIds(ids => ids.includes(updateId) ? ids : [...ids, updateId]);
  };

  const resetData = () => {
    localStorage.removeItem('opshub_driver_routes');
    setRoutes(createPrototypeRoutes(prototypeStage));
  };

  const setPrototypeStage = (stage: 1 | 2 | 3) => {
    const nextRoutes = createPrototypeRoutes(stage);
    setPrototypeStageState(stage);
    setRoutes(nextRoutes);
    setDrivingTarget(null);
    localStorage.setItem('opshub_prototype_stage', String(stage));
    localStorage.setItem('opshub_driver_routes_stage', String(stage));
    localStorage.setItem('opshub_driver_routes', JSON.stringify(nextRoutes));
  };

  return (
    <DriverContext.Provider value={{
      drivers: mockDrivers,
      activeDriver,
      routes,
      isDriverActive,
      setDriverActive,
      switchDriver,
      updateStopStatus,
      updateWorkOrderStatus,
      reportWorkOrderIssue,
      addPhoto,
      removePhoto,
      saveSignature,
      saveDriverSignature,
      addComment,
      markGPS,
      skipStop,
      reportIssue,
      startRoute,
      finishRoute,
      isDrivingMode,
      drivingTarget,
      startDrivingMode,
      endDrivingMode,
      isOnline,
      pendingSyncCount,
      isSyncing,
      lastSyncedAt,
      routeUpdates,
      acknowledgeRouteUpdate,
      resetData,
      prototypeStage,
      setPrototypeStage
    }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (context === undefined) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
};
