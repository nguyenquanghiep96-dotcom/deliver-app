import { AlertTriangle, ChevronDown, ChevronRight, Check, Flag, LockKeyhole, Phone } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDriver } from '../DriverContext';
import type { WorkOrder } from '../mockData';
import { ACTION_COLORS, TYPE_COLORS } from '../lib/workOrderStyles';
import { getProofRequirements } from '../lib/proofRequirements';

const IconCamera = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.5C13.25 17.5 14.3125 17.0625 15.1875 16.1875C16.0625 15.3125 16.5 14.25 16.5 13C16.5 11.75 16.0625 10.6875 15.1875 9.8125C14.3125 8.9375 13.25 8.5 12 8.5C10.75 8.5 9.6875 8.9375 8.8125 9.8125C7.9375 10.6875 7.5 11.75 7.5 13C7.5 14.25 7.9375 15.3125 8.8125 16.1875C9.6875 17.0625 10.75 17.5 12 17.5ZM12 15.5C11.3 15.5 10.7083 15.2583 10.225 14.775C9.74167 14.2917 9.5 13.7 9.5 13C9.5 12.3 9.74167 11.7083 10.225 11.225C10.7083 10.7417 11.3 10.5 12 10.5C12.7 10.5 13.2917 10.7417 13.775 11.225C14.2583 11.7083 14.5 12.3 14.5 13C14.5 13.7 14.2583 14.2917 13.775 14.775C13.2917 15.2583 12.7 15.5 12 15.5ZM4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V7C2 6.45 2.19583 5.97917 2.5875 5.5875C2.97917 5.19583 3.45 5 4 5H7.15L8.4 3.65C8.58333 3.45 8.80417 3.29167 9.0625 3.175C9.32083 3.05833 9.59167 3 9.875 3H14.125C14.4083 3 14.6792 3.05833 14.9375 3.175C15.1958 3.29167 15.4167 3.45 15.6 3.65L16.85 5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4Z" fill="#FF7048"/></svg>;
const IconSignature = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 15.275C3 15.7583 3.16667 16.1333 3.5 16.4C3.83333 16.6667 4.38333 16.8417 5.15 16.925C5.41667 16.9583 5.62917 17.0792 5.7875 17.2875C5.94583 17.4958 6.01667 17.7333 6 18C5.98333 18.2833 5.88333 18.5167 5.7 18.7C5.51667 18.8833 5.29167 18.9583 5.025 18.925C3.675 18.7583 2.66667 18.3708 2 17.7625C1.33333 17.1542 1 16.325 1 15.275C1 14.1917 1.44583 13.3125 2.3375 12.6375C3.22917 11.9625 4.46667 11.5583 6.05 11.425C6.7 11.375 7.1875 11.2708 7.5125 11.1125C7.8375 10.9542 8 10.7333 8 10.45C8 10.0833 7.825 9.79583 7.475 9.5875C7.125 9.37917 6.55 9.21667 5.75 9.1C5.48333 9.06667 5.27083 8.94167 5.1125 8.725C4.95417 8.50833 4.89167 8.26667 4.925 8C4.95833 7.71667 5.075 7.4875 5.275 7.3125C5.475 7.1375 5.70833 7.06667 5.975 7.1C7.35833 7.3 8.375 7.67083 9.025 8.2125C9.675 8.75417 10 9.5 10 10.45C10 11.3333 9.67917 12.025 9.0375 12.525C8.39583 13.025 7.45 13.325 6.2 13.425C5.13333 13.5083 4.33333 13.7042 3.8 14.0125C3.26667 14.3208 3 14.7417 3 15.275ZM13.875 18.25L9.75 14.125L18.375 5.5C18.7083 5.16667 19.1042 5 19.5625 5C20.0208 5 20.4167 5.16667 20.75 5.5L22.5 7.25C22.8333 7.58333 23 7.97917 23 8.4375C23 8.89583 22.8333 9.29167 22.5 9.625L13.875 18.25ZM8.975 20C8.69167 20.0667 8.44167 19.9917 8.225 19.775C8.00833 19.5583 7.93333 19.3083 8 19.025L8.775 15.25L12.725 19.2L8.975 20Z" fill="#FF7048"/></svg>;
const IconStopNotes = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18H15C15.2833 18 15.5208 17.9042 15.7125 17.7125C15.9042 17.5208 16 17.2833 16 17C16 16.7167 15.9042 16.4792 15.7125 16.2875C15.5208 16.0958 15.2833 16 15 16H9C8.71667 16 8.47917 16.0958 8.2875 16.2875C8.09583 16.4792 8 16.7167 8 17C8 17.2833 8.09583 17.5208 8.2875 17.7125C8.47917 17.9042 8.71667 18 9 18ZM9 14H15C15.2833 14 15.5208 13.9042 15.7125 13.7125C15.9042 13.5208 16 13.2833 16 13C16 12.7167 15.9042 12.4792 15.7125 12.2875C15.5208 12.0958 15.2833 12 15 12H9C8.71667 12 8.47917 12.0958 8.2875 12.2875C8.09583 12.4792 8 12.7167 8 13C8 13.2833 8.09583 13.5208 8.2875 13.7125C8.47917 13.9042 8.71667 14 9 14ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H13.175C13.4417 2 13.6958 2.05 13.9375 2.15C14.1792 2.25 14.3917 2.39167 14.575 2.575L19.425 7.425C19.6083 7.60833 19.75 7.82083 19.85 8.0625C19.95 8.30417 20 8.55833 20 8.825V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM13 8C13 8.28333 13.0958 8.52083 13.2875 8.7125C13.4792 8.90417 13.7167 9 14 9H18L13 4V8Z" fill="#FF7048"/></svg>;

interface Props {
  workOrder: WorkOrder;
  routeId: string;
  stopId: string;
  onComplete: (woId: string) => void;
  onReport: (woId: string) => void;
  stopStatus: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function WorkOrderCard({ workOrder, routeId, stopId, onComplete, onReport, stopStatus, isExpanded, onToggle }: Props) {
  const navigate = useNavigate();
  const { routes } = useDriver();
  const currentRoute = routes.find(r => r.id === routeId);
  const isDone = workOrder.status === 'Completed' || workOrder.status === 'Failed';
  const isStopPending = stopStatus === 'Pending';
  const proofRequirements = getProofRequirements(workOrder);
  const relatedTasks = currentRoute?.stops
    .flatMap(routeStop => routeStop.workOrders.map(task => ({ ...task, stopId: routeStop.id })))
    .filter(task => task.id === workOrder.id && task.action !== 'Start' && task.action !== 'End') || [];
  const lifecycleTasks = ['Pickup', 'Dropoff', 'Visit']
    .map(action => relatedTasks.find(task => task.action === action))
    .filter(Boolean) as Array<WorkOrder & { stopId: string }>;
  
  return (
    <div id={`work-order-${workOrder.id}`} className="bg-white rounded-[18px] overflow-hidden flex flex-col mb-2 font-['Google_Sans_Flex'] border border-[#DFE2E7]">
      {/* Full-width task status header keeps status separate from card controls. */}
      <div className={`min-h-[32px] px-4 flex items-center text-[10px] font-bold uppercase tracking-wider ${
        workOrder.status === 'Completed'
          ? 'bg-[#2FA3011A] text-[#278900]'
          : workOrder.status === 'Failed'
            ? 'bg-[#FEECEC] text-[#DC2626]'
            : 'bg-[#F09A1133] text-[#C67A00]'
      }`}>
        {workOrder.status === 'Completed' && (
          <span className="mr-1.5 size-4 rounded-full bg-[#2FA301] text-white flex items-center justify-center shrink-0" aria-hidden="true">
            <Check size={10} strokeWidth={3} />
          </span>
        )}
        {workOrder.status === 'Completed' ? 'Done' : workOrder.status === 'Failed' ? 'Action Failed' : 'To Do'}
      </div>

      {/* WO Header */}
      <div className={`p-[16px] ${isExpanded ? 'border-b border-[#E8E9F1]' : ''}`}>
        <div className={`flex justify-between items-start ${isExpanded ? 'mb-3' : ''}`}>
          <div className="flex items-center gap-2 text-[14px]">
            <div className="flex items-center gap-1.5 bg-[#F8F9FA] border border-[#E5E7EB] pl-1.5 pr-2 py-[2px] rounded-full">
              <div className="size-[6px] rounded-full shrink-0" style={{ backgroundColor: ACTION_COLORS[workOrder.action] || '#6B7280' }} />
              <span className="uppercase tracking-wider font-bold text-[11px] text-[#2B3B63]">
                {workOrder.action}
              </span>
            </div>
            <span 
              className="text-white text-[11px] font-bold px-2 py-[2px] rounded-[6px] shrink-0"
              style={{ backgroundColor: TYPE_COLORS[workOrder.type] || '#2B3B63' }}
            >
              {workOrder.type}
            </span>
            <span className="text-[11px] font-semibold text-[#8A909D] shrink-0">{workOrder.id}</span>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${workOrder.id}`}
            className="size-10 rounded-full border-none bg-[#F2F4F7] text-[#71727A] flex items-center justify-center shrink-0 cursor-pointer active:bg-[#E6E8ED]"
          >
            <ChevronDown size={18} className={`text-[#71727A] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {!isExpanded && (
          <button
            type="button"
            onClick={onToggle}
            className="w-full mt-3 p-0 bg-transparent border-none flex items-center justify-between gap-3 text-left cursor-pointer"
          >
            <span className="min-w-0">
              <span className="block text-[14px] font-bold text-[#2B3B63] truncate">{workOrder.customerName}</span>
              <span className="block mt-0.5 text-[12px] font-medium text-[#71727A] truncate">
                {workOrder.unitInfo?.modelName || 'Building'}{workOrder.unitInfo?.size ? ` · ${workOrder.unitInfo.size}` : ''}
              </span>
            </span>
          </button>
        )}

        {isExpanded && lifecycleTasks.length > 1 && (
          <div className="mb-3 px-3 py-2.5 rounded-[12px] bg-[#F7F8FA] border border-[#ECEEF2]">
            <p className="m-0 mb-1.5 text-[10px] uppercase tracking-wider font-bold text-[#8A909D]">Work Order progress</p>
            <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1">
              {lifecycleTasks.map((task, index) => {
                const taskDone = task.status === 'Completed';
                const taskFailed = task.status === 'Failed';
                return (
                  <span key={`${task.action}-${task.stopId}`} className="contents">
                    {index > 0 && <span className="text-[#C4C7CE]">·</span>}
                    <span className={`text-[12px] font-semibold ${taskDone ? 'text-[#278900]' : taskFailed ? 'text-[#DC2626]' : 'text-[#71727A]'}`}>
                      {task.action} {taskDone ? 'completed' : taskFailed ? 'exception' : 'pending'}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {isExpanded && workOrder.exception && (
          <div className="mb-3 rounded-[12px] border border-[#DC2626]/15 bg-[#FEECEC] px-3 py-2.5 flex gap-2.5">
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#DC2626]" aria-hidden="true" />
            <span>
              <span className="block text-[12px] font-bold text-[#9F1D1D]">{workOrder.exception.reason}</span>
              {workOrder.exception.details && <span className="block mt-1 text-[11px] leading-relaxed text-[#6B3A3A]">{workOrder.exception.details}</span>}
            </span>
          </div>
        )}

        {/* Customer */}
        {isExpanded && <div className="mb-3">
          <p className="text-[11px] uppercase tracking-wide font-bold text-[#8A909D] m-0 mb-1">Customer</p>
          <p className="text-[15px] font-bold text-[#2B3B63] m-0 truncate">{workOrder.customerName}</p>
          <a
            href={`tel:${workOrder.customerPhone}`}
            aria-label={`Call ${workOrder.customerName} at ${workOrder.customerPhone}`}
            className="w-fit min-h-[48px] mt-0.5 -ml-3 px-3 rounded-[12px] flex items-center gap-2 text-[#2563EB] text-[16px] font-bold no-underline active:bg-[#2563EB]/10 transition-colors"
          >
            <Phone size={18} /> {workOrder.customerPhone}
          </a>
        </div>}
        
        {/* Model summary */}
        {isExpanded && workOrder.unitInfo && (
          <div
            onClick={() => navigate(`/route/${routeId}/stop/${stopId}/model?woId=${workOrder.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                navigate(`/route/${routeId}/stop/${stopId}/model?woId=${workOrder.id}`);
              }
            }}
            className="flex items-center gap-[12px] p-[12px] bg-[#F1F2F6] rounded-[14px] cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex flex-col flex-1 gap-1">
              <span className="text-[#8A909D] text-[10px] font-bold uppercase tracking-wider">Model</span>
              <span className="text-[#2B3B63] text-[14px] font-bold leading-[18px] line-clamp-2">{workOrder.unitInfo.modelName || 'Building'} · {workOrder.unitInfo.size || 'Size N/A'}</span>
              <span className="text-[#71727A] text-[12px] font-semibold">Serial # {workOrder.unitInfo.serial || 'N/A'}</span>
            </div>
            <ChevronRight size={18} className="text-[#71727A] shrink-0" />
          </div>
        )}
      </div>

      {/* Execution actions unlock after arrival. */}
      {isExpanded && (isStopPending ? (
        <div className="min-h-[52px] px-4 flex items-center gap-2.5 bg-[#F8F9FB] border-t border-[#E8E9F1] text-[#71727A]">
          <LockKeyhole size={16} className="shrink-0" />
          <span className="text-[12px] font-semibold">Stop actions unlock after you arrive.</span>
        </div>
      ) : (
      <div className="flex flex-col px-[16px] pb-[16px]">
        <p className="text-[11px] uppercase tracking-wide font-bold text-[#8A909D] m-0 py-3">Proof & Notes</p>
        {/* Add Photo */}
        <div
          onClick={() => navigate(`/route/${routeId}/stop/${stopId}/photos?woId=${workOrder.id}`)}
          className="min-h-[48px] flex items-center justify-between cursor-pointer"
          style={{ borderBottom: '1px solid #E8E9F1' }}
        >
          <div className="flex items-center gap-[10px]">
            <IconCamera />
            <span style={{ color: '#2B3B63', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Photos</span>
          </div>
          <div className="flex items-center gap-[8px]">
            {workOrder.photos && workOrder.photos.length > 0 && (
              <span className="text-white px-2 py-0.5 rounded-full" style={{ background: '#FF7048', fontSize: 12, fontWeight: 600 }}>
                {workOrder.photos.length}
              </span>
            )}
            {(!workOrder.photos || workOrder.photos.length === 0) && (
              <span className={`text-[11px] font-medium ${proofRequirements.photos ? 'text-[#DC2626]' : 'text-[#8A909D]'}`}>
                {proofRequirements.photos ? 'Required' : 'Optional'}
              </span>
            )}
            <ChevronRight size={16} className="text-[#71727A]" />
          </div>
        </div>

        {/* Signature */}
        <div
          onClick={() => navigate(`/route/${routeId}/stop/${stopId}/signature?woId=${workOrder.id}`)}
          className="min-h-[48px] flex items-center justify-between cursor-pointer"
          style={{ borderBottom: '1px solid #E8E9F1' }}
        >
          <div className="flex items-center gap-[10px]">
            <IconSignature />
            <span style={{ color: '#2B3B63', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Signature</span>
          </div>
          <div className="flex items-center gap-[8px]">
            {workOrder.signature ? (
              <span className="flex items-center gap-1" style={{ color: '#2FA301', fontSize: 12, fontWeight: 500 }}>
                <Check size={14} /> Signed
              </span>
            ) : (
              <>
                <span className={`text-[11px] font-medium ${proofRequirements.signature ? 'text-[#DC2626]' : 'text-[#8A909D]'}`}>
                  {proofRequirements.signature ? 'Required' : 'Optional'}
                </span>
                <ChevronRight size={16} className="text-[#71727A]" />
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        <div
          onClick={() => navigate(`/route/${routeId}/stop/${stopId}/notes?woId=${workOrder.id}`)}
          className="min-h-[48px] flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-[10px]">
            <IconStopNotes />
            <span style={{ color: '#2B3B63', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Notes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-medium ${proofRequirements.notes && !workOrder.notes ? 'text-[#DC2626]' : 'text-[#8A909D]'}`}>
              {workOrder.notes ? 'Added' : proofRequirements.notes ? 'Required' : 'Optional'}
            </span>
            <ChevronRight size={16} className="text-[#71727A]" />
          </div>
        </div>
        
        {/* Complete Action */}
        {!isDone && (
          <div className="mt-2 flex flex-col gap-2">
            <button 
              onClick={() => onComplete(workOrder.id)}
              disabled={isStopPending}
              className="w-full min-h-[54px] bg-[#FF7048] text-white px-3 rounded-[14px] font-semibold text-[15px] active:scale-[0.98] transition-transform border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Check size={18} />
              Review & Complete {workOrder.action}
            </button>
            <button
              type="button"
              onClick={() => onReport(workOrder.id)}
              disabled={isStopPending}
              className="w-full min-h-[52px] rounded-[14px] border border-[#D9DDE4] bg-white text-[#2B3B63] text-[14px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flag size={16} aria-hidden="true" />
              Report
            </button>
          </div>
        )}
      </div>
      ))}
    </div>
  );
}
