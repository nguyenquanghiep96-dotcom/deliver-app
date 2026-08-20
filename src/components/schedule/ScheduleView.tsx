import { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Rows3 } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useDriver } from '../../DriverContext';
import type { RouteData } from '../../mockData';

type StatusFilter = 'Assigned' | 'Completed';
type ViewMode = 'agenda' | 'calendar';
type CalendarView = 'week' | 'month';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const sameDay = (a: Date, b: Date) => dateKey(a) === dateKey(b);

function parseRouteDate(route: RouteData, year: number, today: Date) {
  const source = route.startDate || route.date;
  if (!source || source === 'Today') return source === 'Today' ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : null;
  const [monthText, dayText] = source.split(' ');
  const month = MONTHS.indexOf(monthText);
  const day = Number.parseInt(dayText, 10);
  return month >= 0 && Number.isFinite(day) ? new Date(year, month, day) : null;
}

function getBusinessStops(route: RouteData) {
  return route.stops.filter(stop => !stop.workOrders.some(wo => wo.action === 'Start' || wo.action === 'End'));
}

function RouteRow({ route, scheduledDate }: { route: RouteData; scheduledDate: Date | null }) {
  const location = useLocation();
  const stops = getBusinessStops(route);
  const stopsCount = stops.length || route.stopsCount || 0;
  return (
    <Link
      to={`/route/${route.id}`}
      state={{ from: location.pathname + location.search }}
      className={`min-h-[76px] p-3 rounded-[18px] border flex items-center gap-3 no-underline active:scale-[0.99] transition-transform ${route.status === 'Completed' ? 'bg-[#F1FAEF] border-[#2FA301]/20' : route.status === 'En Route' ? 'bg-[#EFF6FF] border-[#BFDBFE]' : 'bg-white border-[#E1E4E9]'}`}
    >
      <div className={`size-[52px] rounded-[13px] flex flex-col items-center justify-center shrink-0 text-white ${route.status === 'Completed' ? 'bg-[#2FA301]' : 'bg-[#2B3B63]'}`}>
        <span className="text-[17px] leading-5 font-bold">{scheduledDate?.getDate() || '—'}</span>
        <span className="text-[11px] font-semibold text-white/80">{scheduledDate ? MONTHS[scheduledDate.getMonth()] : ''}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-[16px] font-bold text-[#2B3B63] truncate">{route.name}</h3>
          {route.status === 'En Route' && (
            <span className="h-6 px-2.5 rounded-full bg-[#2563EB] text-white text-[11px] font-semibold shrink-0 flex items-center">
              In Progress
            </span>
          )}
          {route.status === 'Completed' && <Check size={16} className="text-[#2FA301] shrink-0" />}
        </div>
        <p className="m-0 mt-1 text-[13px] font-normal text-[#5E6578]">{route.startTime || 'Time TBD'} · {stopsCount} {stopsCount === 1 ? 'Stop' : 'Stops'}</p>
      </div>
      <ChevronRight size={20} className="text-[#9CA3AF] shrink-0" />
    </Link>
  );
}

export function ScheduleView() {
  const { routes } = useDriver();
  const today = useMemo(() => new Date(), []);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Assigned');
  const [viewMode, setViewMode] = useState<ViewMode>('agenda');
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const activeRouteId = routes.find(route => route.status === 'En Route')?.id;
  const agendaRoutes = routes.filter(route => {
    if (statusFilter === 'Completed') return route.status === 'Completed';
    if (route.status === 'En Route') return route.id === activeRouteId;
    if (route.status !== 'Planned') return false;
    return route.status === 'Planned';
  });
  const filteredRoutes = viewMode === 'calendar' ? routes : agendaRoutes;
  const routeDates = new Map(filteredRoutes.map(route => [route.id, parseRouteDate(route, visibleMonth.getFullYear(), today)]));

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    if (viewMode === 'agenda' && statusFilter === 'Assigned' && a.status !== b.status) {
      if (a.status === 'En Route') return -1;
      if (b.status === 'En Route') return 1;
    }
    const aTime = routeDates.get(a.id)?.getTime() || 0;
    const bTime = routeDates.get(b.id)?.getTime() || 0;
    return viewMode === 'agenda' && statusFilter === 'Completed' ? bTime - aTime : aTime - bTime;
  });

  const startOfWeek = new Date(selectedDate);
  const mondayOffset = (startOfWeek.getDay() + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - mondayOffset);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date;
  });
  const routeCountForDate = (date: Date) => sortedRoutes.filter(route => {
    const routeDate = routeDates.get(route.id);
    return routeDate ? sameDay(routeDate, date) : false;
  }).length;

  const goToToday = () => {
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    setSelectedDate(current);
    setVisibleMonth(new Date(current.getFullYear(), current.getMonth(), 1));
  };

  const shiftPeriod = (direction: -1 | 1) => {
    if (calendarView === 'week') {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() + direction * 7);
      setSelectedDate(next);
      setVisibleMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    } else {
      const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + direction, 1);
      setVisibleMonth(nextMonth);
      setSelectedDate(nextMonth);
    }
  };

  const monthCells = useMemo(() => {
    const days = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    const mondayFirstOffset = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7;
    const cells: Array<number | null> = [...Array(mondayFirstOffset).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
    while (cells.length % 7) cells.push(null);
    return cells;
  }, [visibleMonth]);

  const listRoutes = sortedRoutes.filter(route => {
    const date = routeDates.get(route.id);
    if (!date) return false;
    return date.getMonth() === visibleMonth.getMonth() && date.getFullYear() === visibleMonth.getFullYear();
  });

  const statusCounts = routes.reduce((counts, route) => {
    const routeDate = parseRouteDate(route, visibleMonth.getFullYear(), today);
    if (!routeDate || routeDate.getMonth() !== visibleMonth.getMonth() || routeDate.getFullYear() !== visibleMonth.getFullYear()) return counts;
    if (route.status === 'Completed') counts.Completed += 1;
    else if (route.status === 'En Route' && route.id === activeRouteId) counts.Assigned += 1;
    else if (route.status === 'Planned') counts.Assigned += 1;
    return counts;
  }, { Assigned: 0, Completed: 0 });

  const calendarSelectedRoutes = sortedRoutes.filter(route => {
    const routeDate = routeDates.get(route.id);
    return routeDate ? sameDay(routeDate, selectedDate) : false;
  });

  const agendaGroups = listRoutes.reduce<Array<{ key: string; label: string; routes: RouteData[] }>>((groups, route) => {
    const routeDate = routeDates.get(route.id);
    const key = route.status === 'En Route' ? 'in-progress' : statusFilter === 'Assigned' ? 'upcoming' : routeDate ? dateKey(routeDate) : 'unscheduled';
    let label = 'Date not set';
    if (route.status === 'En Route') label = 'In Progress';
    else if (statusFilter === 'Assigned') label = 'Assigned Routes';
    else if (routeDate) label = routeDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const existing = groups.find(group => group.key === key);
    if (existing) existing.routes.push(route);
    else groups.push({ key, label, routes: [route] });
    return groups;
  }, []);

  const selectCalendarDate = (date: Date) => {
    setSelectedDate(date);
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <div className="px-4 pb-28">
      <div className="grid grid-cols-2 gap-1 bg-[#E8E9F1] rounded-[14px] p-1" aria-label="Schedule view">
        <button onClick={() => setViewMode('agenda')} className={`min-h-[44px] rounded-[11px] border-none flex items-center justify-center gap-2 cursor-pointer text-[14px] font-bold ${viewMode === 'agenda' ? 'bg-white text-[#2B3B63]' : 'bg-transparent text-[#71727A]'}`}>
          <Rows3 size={17} /> Agenda
        </button>
        <button onClick={() => setViewMode('calendar')} className={`min-h-[44px] rounded-[11px] border-none flex items-center justify-center gap-2 cursor-pointer text-[14px] font-bold ${viewMode === 'calendar' ? 'bg-white text-[#2B3B63]' : 'bg-transparent text-[#71727A]'}`}>
          <CalendarDays size={17} /> Calendar
        </button>
      </div>

      {viewMode === 'agenda' ? (
        <div className="pt-4">
          <div className="flex items-center justify-center mb-2">
            <label className="relative min-h-[44px] flex items-center gap-1.5 cursor-pointer">
              <select
                aria-label="Select month"
                value={visibleMonth.getMonth()}
                onChange={(event) => {
                  const next = new Date(visibleMonth.getFullYear(), Number(event.target.value), 1);
                  setVisibleMonth(next);
                  setSelectedDate(next);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                {MONTH_NAMES.map((month, index) => <option key={month} value={index}>{month} {visibleMonth.getFullYear()}</option>)}
              </select>
              <span className="text-[20px] font-bold text-[#2B3B63]">{MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</span>
              <ChevronDown size={18} className="text-[#71727A]" />
            </label>
          </div>
          <div className="flex justify-center mb-4">
            <div className="flex gap-0.5 rounded-full bg-[#E8E9F1] p-0.5" role="tablist" aria-label="Agenda Route status">
            {(['Assigned', 'Completed'] as const).map(filter => (
              <button
                key={filter}
                role="tab"
                aria-selected={statusFilter === filter}
                onClick={() => {
                  setStatusFilter(filter);
                }}
                className={`h-8 rounded-full border-none px-2.5 flex items-center justify-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors ${statusFilter === filter ? 'bg-white text-[#2B3B63]' : 'bg-transparent text-[#71727A]'}`}
              >
                <span>{filter}</span>
                <span className={`min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold ${statusFilter === filter ? 'bg-[#E9EBF1] text-[#2B3B63]' : 'bg-transparent text-[#9CA3AF]'}`}>
                  {statusCounts[filter]}
                </span>
              </button>
            ))}
            </div>
          </div>
          <div className="space-y-3">
            {agendaGroups.length ? agendaGroups.map(group => {
              const showSupportLabel = false;
              return (
              <section key={group.key} aria-label={showSupportLabel ? group.label : 'Scheduled Routes'}>
                {showSupportLabel && <div className="flex items-center justify-between mb-2 mt-2">
                  <h2 className="m-0 text-[16px] font-bold text-[#2B3B63]">{group.label}</h2>
                  <span className="text-[11px] font-semibold text-[#8A909D]">{group.routes.length} {group.routes.length === 1 ? 'Route' : 'Routes'}</span>
                </div>}
                <div className="space-y-2">
                  {group.routes.map(route => <RouteRow key={route.id} route={route} scheduledDate={routeDates.get(route.id) || null} />)}
                </div>
              </section>
            )}) : <EmptySchedule statusFilter={statusFilter} />}
          </div>
        </div>
      ) : (
        <div className="pt-4">
          <div className="w-fit mx-auto mb-3 bg-[#E8E9F1] rounded-full p-1 flex gap-1" aria-label="Calendar view">
            {(['week', 'month'] as const).map(mode => (
              <button key={mode} onClick={() => setCalendarView(mode)} className={`min-h-[38px] px-5 rounded-full border-none text-[12px] font-bold capitalize cursor-pointer ${calendarView === mode ? 'bg-white text-[#2B3B63]' : 'bg-transparent text-[#71727A]'}`}>
                {mode}
              </button>
            ))}
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => shiftPeriod(-1)} aria-label={`Previous ${calendarView}`} className="size-[44px] bg-transparent border-none text-[#2B3B63] flex items-center justify-center cursor-pointer"><ChevronLeft size={21} /></button>
              <h2 className="min-w-[170px] text-center m-0 text-[20px] font-bold text-[#2B3B63]">
                {MONTH_NAMES[(calendarView === 'week' ? selectedDate : visibleMonth).getMonth()]} {(calendarView === 'week' ? selectedDate : visibleMonth).getFullYear()}
              </h2>
              <button onClick={() => shiftPeriod(1)} aria-label={`Next ${calendarView}`} className="size-[44px] bg-transparent border-none text-[#2B3B63] flex items-center justify-center cursor-pointer"><ChevronRight size={21} /></button>
            </div>
            <div className="flex justify-center -mt-1">
              <button onClick={goToToday} className="min-h-[40px] px-4 bg-transparent border-none text-[12px] font-bold text-[#E85D35] cursor-pointer">Today</button>
            </div>
          </div>

          {calendarView === 'week' ? (
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((date, index) => {
                const selected = sameDay(date, selectedDate);
                const isToday = sameDay(date, today);
                const count = routeCountForDate(date);
                return (
                  <button key={dateKey(date)} onClick={() => selectCalendarDate(date)} className={`min-h-[72px] px-0 rounded-[12px] border flex flex-col items-center justify-center cursor-pointer ${selected ? 'bg-[#2B3B63] border-[#2B3B63] text-white' : 'bg-white border-[#E1E4E9] text-[#2B3B63]'}`} aria-label={`${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, ${count} ${count === 1 ? 'route' : 'routes'}`}>
                    <span className={`text-[10px] font-bold uppercase ${selected ? 'text-white/65' : 'text-[#8A909D]'}`}>{WEEKDAYS[index]}</span>
                    <span className="text-[15px] font-bold mt-1">{date.getDate()}</span>
                    <span className={`mt-1 size-1.5 rounded-full ${count ? 'bg-[#FF7048]' : isToday ? 'border border-[#FF7048]' : 'bg-transparent'}`} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[18px] bg-white border border-[#E1E4E9] p-3">
              <div className="grid grid-cols-7 mb-1">{WEEKDAYS.map(day => <span key={day} className="h-8 flex items-center justify-center text-[10px] font-bold text-[#8A909D]">{day}</span>)}</div>
              <div className="grid grid-cols-7 gap-y-1">
                {monthCells.map((day, index) => day ? (() => {
                  const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
                  const selected = sameDay(date, selectedDate);
                  const isToday = sameDay(date, today);
                  const count = routeCountForDate(date);
                  return (
                    <button key={dateKey(date)} onClick={() => selectCalendarDate(date)} className={`relative min-h-[44px] rounded-[12px] border-none flex flex-col items-center justify-center cursor-pointer ${selected ? 'bg-[#2B3B63] text-white' : 'bg-transparent text-[#2B3B63]'}`} aria-label={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${count} ${count === 1 ? 'route' : 'routes'}`}>
                      <span className={`text-[13px] font-bold ${isToday && !selected ? 'text-[#E85D35]' : ''}`}>{day}</span>
                      {count === 1 && <span className="absolute bottom-1 size-1.5 rounded-full bg-[#FF7048]" />}
                      {count > 1 && <span className="absolute bottom-0.5 min-w-3 h-3 px-0.5 rounded-full bg-[#FF7048] text-white text-[8px] font-bold flex items-center justify-center">{count}</span>}
                    </button>
                  );
                })() : <div key={`empty-${index}`} />)}
              </div>
            </div>
          )}

          <section className="mt-4" aria-labelledby="selected-calendar-date">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 id="selected-calendar-date" className="m-0 text-[14px] font-bold text-[#2B3B63]">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </h3>
              <span className="text-[11px] font-semibold text-[#8A909D]">{calendarSelectedRoutes.length} {calendarSelectedRoutes.length === 1 ? 'Route' : 'Routes'}</span>
            </div>
            {calendarSelectedRoutes.length ? (
              <div className="space-y-2">
                {calendarSelectedRoutes.map(route => <RouteRow key={route.id} route={route} scheduledDate={routeDates.get(route.id) || null} />)}
              </div>
            ) : (
              <div className="min-h-[72px] rounded-[15px] border border-dashed border-[#C9CDD5] flex items-center justify-center px-4 text-center text-[12px] font-medium text-[#8A909D]">
                No Routes on this date.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function EmptySchedule({ statusFilter, compact = false }: { statusFilter: StatusFilter; compact?: boolean }) {
  return (
    <div className={`rounded-[18px] border border-dashed border-[#C9CDD5] flex flex-col items-center justify-center text-center px-5 ${compact ? 'min-h-[132px]' : 'min-h-[180px]'}`}>
      <CalendarDays size={24} className="text-[#9CA3AF]" />
      <p className="m-0 mt-2 text-[15px] font-bold text-[#2B3B63]">No {statusFilter.toLowerCase()} routes</p>
      <p className="m-0 mt-1 text-[12px] text-[#71727A]">Routes will appear here when available.</p>
    </div>
  );
}
