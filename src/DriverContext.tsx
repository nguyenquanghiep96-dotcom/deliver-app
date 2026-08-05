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
  addPhoto: (routeId: string, stopId: string, workOrderId: string, photoDataUrl: string) => void;
  removePhoto: (routeId: string, stopId: string, workOrderId: string, photoIndex: number) => void;
  saveSignature: (routeId: string, stopId: string, workOrderId: string, signatureDataUrl: string) => void;
  saveDriverSignature: (routeId: string, stopId: string, workOrderId: string, signatureDataUrl: string) => void;
  addComment: (routeId: string, stopId: string, workOrderId: string, comment: string) => void;
  markGPS: (routeId: string, stopId: string) => void;
  skipStop: (routeId: string, stopId: string, reason: string) => void;
  reportIssue: (routeId: string, stopId: string, issue: string) => void;
  startRoute: (routeId: string) => void;
  resetData: () => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    const saved = localStorage.getItem('opshub_driver_routes');
    if (saved) {
      try {
        const savedRoutes = JSON.parse(saved) as RouteData[];
        return initialRoutes.map(initialRoute => {
          const savedRoute = savedRoutes.find(r => r.id === initialRoute.id);
          if (!savedRoute) return initialRoute;
          return {
            ...initialRoute,
            status: savedRoute.status,
            stops: initialRoute.stops.map(initialStop => {
              const savedStop = savedRoute.stops.find(s => s.id === initialStop.id) || 
                                savedRoute.stops.find(s => s.num === initialStop.num);
              if (!savedStop) return initialStop;
              return {
                ...initialStop,
                status: savedStop.status,
                gpsMarked: savedStop.gpsMarked || initialStop.gpsMarked,
                gpsCoords: savedStop.gpsCoords || initialStop.gpsCoords,
                workOrders: initialStop.workOrders.map(initialWo => {
                  const savedWo = savedStop.workOrders?.find((w: any) => w.id === initialWo.id);
                  if (!savedWo) return initialWo;
                  return {
                    ...initialWo,
                    status: savedWo.status,
                    notes: savedWo.notes || initialWo.notes,
                    signature: savedWo.signature || initialWo.signature,
                    driverSignature: savedWo.driverSignature || initialWo.driverSignature,
                    photos: savedWo.photos || initialWo.photos,
                  };
                })
              };
            })
          };
        });
      } catch (e) {
        console.error('Failed to parse routes', e);
      }
    }
    return initialRoutes;
  });

  useEffect(() => {
    localStorage.setItem('opshub_driver_active', activeDriver.id);
  }, [activeDriver]);

  useEffect(() => {
    localStorage.setItem('opshub_driver_status', isDriverActive ? 'active' : 'offline');
  }, [isDriverActive]);

  useEffect(() => {
    localStorage.setItem('opshub_driver_routes', JSON.stringify(routes));
  }, [routes]);

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
    setRoutes(prev => prev.map(r => {
      if (r.id !== routeId) return r;
      let allStopsDone = true;
      const newStops = r.stops.map(s => {
        if (s.id === stopId) {
          if (status !== 'Done') allStopsDone = false;
          return { ...s, status };
        }
        if (s.status !== 'Done') allStopsDone = false;
        return s;
      });
      return {
        ...r,
        stops: newStops,
        status: allStopsDone ? 'Completed' : (r.status === 'Planned' && status === 'Servicing' ? 'En Route' : r.status)
      };
    }));
  };

  const updateWorkOrderStatus = (routeId: string, stopId: string, workOrderId: string, status: WorkOrder['status']) => {
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

  const addPhoto = (routeId: string, stopId: string, workOrderId: string, photoDataUrl: string) => {
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
    // In a real app this would call an API
    console.log(`Issue reported on route ${routeId}, stop ${stopId}: ${issue}`);
    // Optional: add as a comment to the first work order
    setRoutes(prev => prev.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : {
        ...s,
        workOrders: s.workOrders.map((wo, index) => index === 0 ? {
          ...wo,
          notes: (wo.notes ? wo.notes + '\n' : '') + `ISSUE: ${issue}`
        } : wo)
      })
    }));
  };

  const startRoute = (routeId: string) => {
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, status: 'En Route' } : r));
  };

  const resetData = () => {
    localStorage.removeItem('opshub_driver_routes');
    setRoutes(initialRoutes);
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
      addPhoto,
      removePhoto,
      saveSignature,
      saveDriverSignature,
      addComment,
      markGPS,
      skipStop,
      reportIssue,
      startRoute,
      resetData
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
