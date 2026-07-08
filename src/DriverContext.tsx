import { createContext, useContext, useState, useEffect } from 'react';
import { mockDrivers, initialRoutes } from './mockData';
import type { RouteData, Driver, Stop } from './mockData';

interface DriverContextType {
  drivers: Driver[];
  activeDriver: Driver;
  routes: RouteData[];
  isDriverActive: boolean;
  setDriverActive: (active: boolean) => void;
  switchDriver: (driverId: string) => void;
  toggleTask: (routeId: string, stopId: string, taskId: string) => void;
  updateStopStatus: (routeId: string, stopId: string, status: Stop['status']) => void;
  addPhoto: (routeId: string, stopId: string, photoDataUrl: string) => void;
  removePhoto: (routeId: string, stopId: string, photoIndex: number) => void;
  saveSignature: (routeId: string, stopId: string, signatureDataUrl: string) => void;
  saveDriverSignature: (routeId: string, stopId: string, signatureDataUrl: string) => void;
  addComment: (routeId: string, stopId: string, comment: string) => void;
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
        // Merge saved progress into initialRoutes so new updates to metadata load immediately
        return initialRoutes.map(initialRoute => {
          const savedRoute = savedRoutes.find(r => r.id === initialRoute.id);
          if (!savedRoute) return initialRoute;
          return {
            ...initialRoute,
            status: savedRoute.status,
            stops: initialRoute.stops.map(initialStop => {
              // Try to find by id first, fallback to stop number
              const savedStop = savedRoute.stops.find(s => s.id === initialStop.id) || 
                                savedRoute.stops.find(s => s.num === initialStop.num);
              if (!savedStop) return initialStop;
              return {
                ...initialStop,
                status: savedStop.status,
                comments: savedStop.comments || initialStop.comments,
                signature: savedStop.signature || initialStop.signature,
                driverSignature: savedStop.driverSignature || initialStop.driverSignature,
                photos: savedStop.photos || initialStop.photos,
                gpsMarked: savedStop.gpsMarked || initialStop.gpsMarked,
                gpsCoords: savedStop.gpsCoords || initialStop.gpsCoords,
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

  const toggleTask = (routeId: string, stopId: string, taskId: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;

        const updatedStops = route.stops.map(stop => {
          if (stop.id !== stopId) return stop;

          const updatedTasks = stop.tasks.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, done: !task.done };
          });

          return { ...stop, tasks: updatedTasks };
        });

        return { ...route, stops: updatedStops };
      })
    );
  };

  const updateStopStatus = (routeId: string, stopId: string, status: Stop['status']) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;

        let updatedStops = route.stops.map(stop => {
          if (stop.id !== stopId) return stop;
          
          // If marking Done, make sure all tasks are also set to done
          let tasks = stop.tasks;
          if (status === 'Done') {
            tasks = stop.tasks.map(t => ({ ...t, done: true }));
          }

          return { ...stop, status, tasks };
        });

        if (status === 'Done') {
          const finishedStopNum = updatedStops.find(s => s.id === stopId)?.num || 0;
          let nextStopToService = updatedStops.find(s => s.num === finishedStopNum + 1);
          if (nextStopToService && nextStopToService.status === 'Pending') {
            updatedStops = updatedStops.map(s => {
              if (s.id === nextStopToService!.id) {
                return { ...s, status: 'Servicing' as const };
              }
              return s;
            });
          }
        }

        // Check if all stops in this route are Done
        const allStopsDone = updatedStops.every(s => s.status === 'Done');
        const routeStatus = allStopsDone ? 'Completed' as const : 'En Route' as const;

        return {
          ...route,
          status: routeStatus,
          stops: updatedStops
        };
      })
    );
  };

  const addPhoto = (routeId: string, stopId: string, photoDataUrl: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        return {
          ...route,
          stops: route.stops.map(stop => {
            if (stop.id !== stopId) return stop;
            const photos = stop.photos ? [...stop.photos, photoDataUrl] : [photoDataUrl];
            return { ...stop, photos };
          })
        };
      })
    );
  };

  const removePhoto = (routeId: string, stopId: string, photoIndex: number) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        return {
          ...route,
          stops: route.stops.map(stop => {
            if (stop.id !== stopId) return stop;
            const photos = stop.photos ? stop.photos.filter((_: string, i: number) => i !== photoIndex) : [];
            return { ...stop, photos };
          })
        };
      })
    );
  };

  const saveSignature = (routeId: string, stopId: string, signatureDataUrl: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        return {
          ...route,
          stops: route.stops.map(stop => {
            if (stop.id !== stopId) return stop;
            return { ...stop, signature: signatureDataUrl };
          })
        };
      })
    );
  };

  const saveDriverSignature = (routeId: string, stopId: string, signatureDataUrl: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        return {
          ...route,
          stops: route.stops.map(stop => {
            if (stop.id !== stopId) return stop;
            return { ...stop, driverSignature: signatureDataUrl };
          })
        };
      })
    );
  };

  const addComment = (routeId: string, stopId: string, comment: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        return {
          ...route,
          stops: route.stops.map(stop => {
            if (stop.id !== stopId) return stop;
            const comments = stop.comments ? [...stop.comments, comment] : [comment];
            return { ...stop, comments };
          })
        };
      })
    );
  };

  const markGPS = (routeId: string, stopId: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        return {
          ...route,
          stops: route.stops.map(stop => {
            if (stop.id !== stopId) return stop;
            
            const lat = 32.7767 + (Math.random() - 0.5) * 0.1;
            const lng = -96.7970 + (Math.random() - 0.5) * 0.1;

            return {
              ...stop,
              gpsMarked: true,
              gpsCoords: { lat, lng }
            };
          })
        };
      })
    );
  };

  const skipStop = (routeId: string, stopId: string, reason: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        return {
          ...route,
          stops: route.stops.map(stop => {
            if (stop.id !== stopId) return stop;
            const skipComment = `[SKIPPED STOP] Reason: ${reason}`;
            const comments = stop.comments ? [...stop.comments, skipComment] : [skipComment];
            return {
              ...stop,
              status: 'Pending' as const,
              comments
            };
          })
        };
      })
    );
  };

  const reportIssue = (routeId: string, stopId: string, issue: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        return {
          ...route,
          stops: route.stops.map(stop => {
            if (stop.id !== stopId) return stop;
            const issueComment = `[REPORTED ISSUE] ${issue}`;
            const comments = stop.comments ? [...stop.comments, issueComment] : [issueComment];
            return {
              ...stop,
              comments
            };
          })
        };
      })
    );
  };

  const startRoute = (routeId: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route => {
        if (route.id !== routeId) return route;
        const updatedStops = route.stops.map((stop, idx) => {
          if (idx === 0 && stop.status === 'Pending') {
            return { ...stop, status: 'Servicing' as const };
          }
          return stop;
        });
        return {
          ...route,
          status: 'En Route' as const,
          stops: updatedStops
        };
      })
    );
  };

  const resetData = () => {
    setRoutes(initialRoutes);
    setIsDriverActive(true);
    setActiveDriver(mockDrivers[0]);
    localStorage.removeItem('opshub_driver_routes');
    localStorage.removeItem('opshub_driver_status');
    localStorage.removeItem('opshub_driver_active');
  };

  return (
    <DriverContext.Provider
      value={{
        drivers: mockDrivers,
        activeDriver,
        routes,
        isDriverActive,
        setDriverActive,
        switchDriver,
        toggleTask,
        updateStopStatus,
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
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
};
