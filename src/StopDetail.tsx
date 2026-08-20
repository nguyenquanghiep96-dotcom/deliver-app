import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Navigation, Camera, PenLine, FileText, AlertTriangle, Flag, X, MapPin } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router';
import { useDriver } from './DriverContext';
import { WorkOrderCard } from './components/WorkOrderCard';
import { cleanStopType } from './lib/utils';
import { getProofRequirements } from './lib/proofRequirements';

// ─── Custom SVG Icons (Figma-aligned) ────────────────────────────────────────

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.22101 11.045C9.35869 11.1082 9.51381 11.1227 9.6608 11.086C9.8078 11.0493 9.9379 10.9636 10.0297 10.843L10.2663 10.533C10.3905 10.3674 10.5516 10.233 10.7367 10.1404C10.9219 10.0479 11.126 9.99967 11.333 9.99967H13.333C13.6866 9.99967 14.0258 10.1402 14.2758 10.3902C14.5259 10.6402 14.6663 10.9794 14.6663 11.333V13.333C14.6663 13.6866 14.5259 14.0258 14.2758 14.2758C14.0258 14.5259 13.6866 14.6663 13.333 14.6663C10.1504 14.6663 7.09816 13.4021 4.84773 11.1516C2.59729 8.90119 1.33301 5.84894 1.33301 2.66634C1.33301 2.31272 1.47348 1.97358 1.72353 1.72353C1.97358 1.47348 2.31272 1.33301 2.66634 1.33301H4.66634C5.01996 1.33301 5.3591 1.47348 5.60915 1.72353C5.8592 1.97358 5.99967 2.31272 5.99967 2.66634V4.66634C5.99967 4.87333 5.95148 5.07749 5.85891 5.26263C5.76634 5.44777 5.63194 5.60881 5.46634 5.73301L5.15434 5.96701C5.03195 6.06046 4.94569 6.1934 4.9102 6.34324C4.87472 6.49308 4.8922 6.65059 4.95967 6.78901C5.8708 8.63959 7.36929 10.1362 9.22101 11.045Z" fill="#2B3B63"/>
  </svg>
);

const IconArrived = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.9998 21.9498V20.9498C8.91647 20.7165 7.12897 19.854 5.6373 18.3623C4.14564 16.8706 3.28314 15.0831 3.0498 12.9998H2.0498C1.76647 12.9998 1.52897 12.904 1.3373 12.7123C1.14564 12.5206 1.0498 12.2831 1.0498 11.9998C1.0498 11.7165 1.14564 11.479 1.3373 11.2873C1.52897 11.0956 1.76647 10.9998 2.0498 10.9998H3.0498C3.28314 8.91647 4.14564 7.12897 5.6373 5.6373C7.12897 4.14564 8.91647 3.28314 10.9998 3.0498V2.0498C10.9998 1.76647 11.0956 1.52897 11.2873 1.3373C11.479 1.14564 11.7165 1.0498 11.9998 1.0498C12.2831 1.0498 12.5206 1.14564 12.7123 1.3373C12.904 1.52897 12.9998 1.76647 12.9998 2.0498V3.0498C15.0831 3.28314 16.8706 4.14564 18.3623 5.6373C19.854 7.12897 20.7165 8.91647 20.9498 10.9998H21.9498C22.2331 10.9998 22.4706 11.0956 22.6623 11.2873C22.854 11.479 22.9498 11.7165 22.9498 11.9998C22.9498 12.2831 22.854 12.5206 22.6623 12.7123C22.4706 12.904 22.2331 12.9998 21.9498 12.9998H20.9498C20.7165 15.0831 19.854 16.8706 18.3623 18.3623C16.8706 19.854 15.0831 20.7165 12.9998 20.9498V21.9498C12.9998 22.2331 12.904 22.4706 12.7123 22.6623C12.5206 22.854 12.2831 22.9498 11.9998 22.9498C11.7165 22.9498 11.479 22.854 11.2873 22.6623C11.0956 22.4706 10.9998 22.2331 10.9998 21.9498ZM16.9498 16.9498C18.3165 15.5831 18.9998 13.9331 18.9998 11.9998C18.9998 10.0665 18.3165 8.41647 16.9498 7.0498C15.5831 5.68314 13.9331 4.9998 11.9998 4.9998C10.0665 4.9998 8.41647 5.68314 7.0498 7.0498C5.68314 8.41647 4.9998 10.0665 4.9998 11.9998C4.9998 13.9331 5.68314 15.5831 7.0498 16.9498C8.41647 18.3165 10.0665 18.9998 11.9998 18.9998C13.9331 18.9998 15.5831 18.3165 16.9498 16.9498ZM9.1748 14.8248C8.39147 14.0415 7.9998 13.0998 7.9998 11.9998C7.9998 10.8998 8.39147 9.95814 9.1748 9.1748C9.95814 8.39147 10.8998 7.9998 11.9998 7.9998C13.0998 7.9998 14.0415 8.39147 14.8248 9.1748C15.6081 9.95814 15.9998 10.8998 15.9998 11.9998C15.9998 13.0998 15.6081 14.0415 14.8248 14.8248C14.0415 15.6081 13.0998 15.9998 11.9998 15.9998C10.8998 15.9998 9.95814 15.6081 9.1748 14.8248ZM13.4123 13.4123C13.804 13.0206 13.9998 12.5498 13.9998 11.9998C13.9998 11.4498 13.804 10.979 13.4123 10.5873C13.0206 10.1956 12.5498 9.9998 11.9998 9.9998C11.4498 9.9998 10.979 10.1956 10.5873 10.5873C10.1956 10.979 9.9998 11.4498 9.9998 11.9998C9.9998 12.5498 10.1956 13.0206 10.5873 13.4123C10.979 13.804 11.4498 13.9998 11.9998 13.9998C12.5498 13.9998 13.0206 13.804 13.4123 13.4123Z" fill="white"/>
  </svg>
);

const WORK_ORDER_EXCEPTION_REASONS = [
  'Customer unavailable',
  'Cannot access site',
  'Site not ready',
  'Wrong unit',
  'Damaged building',
  'Unable to complete',
] as const;

const IconBuildingOrientation = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.84973 14.2484C2.49983 13.0616 1.0157 10.6537 1.00012 8.04281C0.984921 5.41595 2.45034 2.99597 4.78037 1.78657C7.7268 0.257285 11.3165 1.01784 13.4026 3.54807C15.5071 6.10091 15.5355 9.786 13.4681 12.3712C11.419 14.9334 7.8285 15.7531 4.85011 14.2484H4.84973ZM4.83297 11.6344L9.10767 9.86977C9.45834 9.72483 9.72602 9.45755 9.87058 9.10649L11.6497 4.798C11.6894 4.65189 11.6555 4.52058 11.5561 4.42824C11.4751 4.35304 11.3321 4.30044 11.2043 4.35304L6.89493 6.13169C6.54464 6.27624 6.27657 6.54353 6.13163 6.89419L4.35333 11.2035C4.29683 11.3402 4.35839 11.4898 4.4445 11.5701C4.54269 11.6617 4.67712 11.6991 4.83258 11.6348L4.83297 11.6344Z" fill="#FF7048"/>
    <path d="M7.81185 7.01869C8.3782 6.91046 8.88061 7.28487 8.98259 7.81514C9.08458 8.34541 8.72805 8.87945 8.18427 8.98266C7.65636 9.08253 7.13599 8.74113 7.0223 8.21253C6.90861 7.68393 7.23839 7.12901 7.81185 7.01911V7.01869Z" fill="#FF7048"/>
  </svg>
);

const IconDeliveryInstruction = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.00033 11.9997H10.0003C10.1892 11.9997 10.3475 11.9358 10.4753 11.808C10.6031 11.6802 10.667 11.5219 10.667 11.333C10.667 11.1441 10.6031 10.9858 10.4753 10.858C10.3475 10.7302 10.1892 10.6663 10.0003 10.6663H6.00033C5.81144 10.6663 5.6531 10.7302 5.52533 10.858C5.39755 10.9858 5.33366 11.1441 5.33366 11.333C5.33366 11.5219 5.39755 11.6802 5.52533 11.808C5.6531 11.9358 5.81144 11.9997 6.00033 11.9997ZM6.00033 9.33301H10.0003C10.1892 9.33301 10.3475 9.26912 10.4753 9.14134C10.6031 9.01356 10.667 8.85523 10.667 8.66634C10.667 8.47745 10.6031 8.31912 10.4753 8.19134C10.3475 8.06356 10.1892 7.99967 10.0003 7.99967H6.00033C5.81144 7.99967 5.6531 8.06356 5.52533 8.19134C5.39755 8.31912 5.33366 8.47745 5.33366 8.66634C5.33366 8.85523 5.39755 9.01356 5.52533 9.14134C5.6531 9.26912 5.81144 9.33301 6.00033 9.33301ZM4.00033 14.6663C3.63366 14.6663 3.31977 14.5358 3.05866 14.2747C2.79755 14.0136 2.66699 13.6997 2.66699 13.333V2.66634C2.66699 2.29967 2.79755 1.98579 3.05866 1.72467C3.31977 1.46356 3.63366 1.33301 4.00033 1.33301H8.78366C8.96144 1.33301 9.13088 1.36634 9.29199 1.43301C9.4531 1.49967 9.59477 1.59412 9.71699 1.71634L12.9503 4.94967C13.0725 5.0719 13.167 5.21356 13.2337 5.37467C13.3003 5.53579 13.3337 5.70523 13.3337 5.88301V13.333C13.3337 13.6997 13.2031 14.0136 12.942 14.2747C12.6809 14.5358 12.367 14.6663 12.0003 14.6663H4.00033ZM8.66699 5.33301C8.66699 5.5219 8.73088 5.68023 8.85866 5.80801C8.98644 5.93579 9.14477 5.99967 9.33366 5.99967H12.0003L8.66699 2.66634V5.33301Z" fill="#FF7048"/>
  </svg>
);

const IconNote = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.47467 11.1413C8.60245 11.0136 8.66634 10.8552 8.66634 10.6663V7.99967C8.66634 7.81079 8.60245 7.65245 8.47467 7.52467C8.3469 7.3969 8.18856 7.33301 7.99967 7.33301C7.81079 7.33301 7.65245 7.3969 7.52467 7.52467C7.3969 7.65245 7.33301 7.81079 7.33301 7.99967V10.6663C7.33301 10.8552 7.3969 11.0136 7.52467 11.1413C7.65245 11.2691 7.81079 11.333 7.99967 11.333C8.18856 11.333 8.3469 11.2691 8.47467 11.1413ZM8.47467 5.80801C8.60245 5.68023 8.66634 5.5219 8.66634 5.33301C8.66634 5.14412 8.60245 4.98579 8.47467 4.85801C8.3469 4.73023 8.18856 4.66634 7.99967 4.66634C7.81079 4.66634 7.65245 4.73023 7.52467 4.85801C7.3969 4.98579 7.33301 5.14412 7.33301 5.33301C7.33301 5.5219 7.3969 5.68023 7.52467 5.80801C7.65245 5.93579 7.81079 5.99967 7.99967 5.99967C8.18856 5.99967 8.3469 5.93579 8.47467 5.80801ZM7.99967 14.6663C7.07745 14.6663 6.21079 14.4913 5.39967 14.1413C4.58856 13.7913 3.88301 13.3163 3.28301 12.7163C2.68301 12.1163 2.20801 11.4108 1.85801 10.5997C1.50801 9.78856 1.33301 8.9219 1.33301 7.99967C1.33301 7.07745 1.50801 6.21079 1.85801 5.39967C2.20801 4.58856 2.68301 3.88301 3.28301 3.28301C3.88301 2.68301 4.58856 2.20801 5.39967 1.85801C6.21079 1.50801 7.07745 1.33301 7.99967 1.33301C8.9219 1.33301 9.78856 1.50801 10.5997 1.85801C11.4108 2.20801 12.1163 2.68301 12.7163 3.28301C13.3163 3.88301 13.7913 4.58856 14.1413 5.39967C14.4913 6.21079 14.6663 7.07745 14.6663 7.99967C14.6663 8.9219 14.4913 9.78856 14.1413 10.5997C13.7913 11.4108 13.3163 12.1163 12.7163 12.7163C12.1163 13.3163 11.4108 13.7913 10.5997 14.1413C9.78856 14.4913 8.9219 14.6663 7.99967 14.6663ZM7.99967 13.333C9.48856 13.333 10.7497 12.8163 11.783 11.783C12.8163 10.7497 13.333 9.48856 13.333 7.99967C13.333 6.51079 12.8163 5.24967 11.783 4.21634C10.7497 3.18301 9.48856 2.66634 7.99967 2.66634C6.51079 2.66634 5.24967 3.18301 4.21634 4.21634C3.18301 5.24967 2.66634 6.51079 2.66634 7.99967C2.66634 9.48856 3.18301 10.7497 4.21634 11.783C5.24967 12.8163 6.51079 13.333 7.99967 13.333Z" fill="#FF7048"/>
  </svg>
);

const IconCamera = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.5C13.25 17.5 14.3125 17.0625 15.1875 16.1875C16.0625 15.3125 16.5 14.25 16.5 13C16.5 11.75 16.0625 10.6875 15.1875 9.8125C14.3125 8.9375 13.25 8.5 12 8.5C10.75 8.5 9.6875 8.9375 8.8125 9.8125C7.9375 10.6875 7.5 11.75 7.5 13C7.5 14.25 7.9375 15.3125 8.8125 16.1875C9.6875 17.0625 10.75 17.5 12 17.5ZM12 15.5C11.3 15.5 10.7083 15.2583 10.225 14.775C9.74167 14.2917 9.5 13.7 9.5 13C9.5 12.3 9.74167 11.7083 10.225 11.225C10.7083 10.7417 11.3 10.5 12 10.5C12.7 10.5 13.2917 10.7417 13.775 11.225C14.2583 11.7083 14.5 12.3 14.5 13C14.5 13.7 14.2583 14.2917 13.775 14.775C13.2917 15.2583 12.7 15.5 12 15.5ZM4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V7C2 6.45 2.19583 5.97917 2.5875 5.5875C2.97917 5.19583 3.45 5 4 5H7.15L8.4 3.65C8.58333 3.45 8.80417 3.29167 9.0625 3.175C9.32083 3.05833 9.59167 3 9.875 3H14.125C14.4083 3 14.6792 3.05833 14.9375 3.175C15.1958 3.29167 15.4167 3.45 15.6 3.65L16.85 5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4Z" fill="#FF7048"/>
  </svg>
);

const IconSignature = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 15.275C3 15.7583 3.16667 16.1333 3.5 16.4C3.83333 16.6667 4.38333 16.8417 5.15 16.925C5.41667 16.9583 5.62917 17.0792 5.7875 17.2875C5.94583 17.4958 6.01667 17.7333 6 18C5.98333 18.2833 5.88333 18.5167 5.7 18.7C5.51667 18.8833 5.29167 18.9583 5.025 18.925C3.675 18.7583 2.66667 18.3708 2 17.7625C1.33333 17.1542 1 16.325 1 15.275C1 14.1917 1.44583 13.3125 2.3375 12.6375C3.22917 11.9625 4.46667 11.5583 6.05 11.425C6.7 11.375 7.1875 11.2708 7.5125 11.1125C7.8375 10.9542 8 10.7333 8 10.45C8 10.0833 7.825 9.79583 7.475 9.5875C7.125 9.37917 6.55 9.21667 5.75 9.1C5.48333 9.06667 5.27083 8.94167 5.1125 8.725C4.95417 8.50833 4.89167 8.26667 4.925 8C4.95833 7.71667 5.075 7.4875 5.275 7.3125C5.475 7.1375 5.70833 7.06667 5.975 7.1C7.35833 7.3 8.375 7.67083 9.025 8.2125C9.675 8.75417 10 9.5 10 10.45C10 11.3333 9.67917 12.025 9.0375 12.525C8.39583 13.025 7.45 13.325 6.2 13.425C5.13333 13.5083 4.33333 13.7042 3.8 14.0125C3.26667 14.3208 3 14.7417 3 15.275ZM13.875 18.25L9.75 14.125L18.375 5.5C18.7083 5.16667 19.1042 5 19.5625 5C20.0208 5 20.4167 5.16667 20.75 5.5L22.5 7.25C22.8333 7.58333 23 7.97917 23 8.4375C23 8.89583 22.8333 9.29167 22.5 9.625L13.875 18.25ZM8.975 20C8.69167 20.0667 8.44167 19.9917 8.225 19.775C8.00833 19.5583 7.93333 19.3083 8 19.025L8.775 15.25L12.725 19.2L8.975 20Z" fill="#FF7048"/>
  </svg>
);

const IconPayment = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 12H20V8H4V12Z" fill="#FF7048"/>
  </svg>
);

const IconStopNotes = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18H15C15.2833 18 15.5208 17.9042 15.7125 17.7125C15.9042 17.5208 16 17.2833 16 17C16 16.7167 15.9042 16.4792 15.7125 16.2875C15.5208 16.0958 15.2833 16 15 16H9C8.71667 16 8.47917 16.0958 8.2875 16.2875C8.09583 16.4792 8 16.7167 8 17C8 17.2833 8.09583 17.5208 8.2875 17.7125C8.47917 17.9042 8.71667 18 9 18ZM9 14H15C15.2833 14 15.5208 13.9042 15.7125 13.7125C15.9042 13.5208 16 13.2833 16 13C16 12.7167 15.9042 12.4792 15.7125 12.2875C15.5208 12.0958 15.2833 12 15 12H9C8.71667 12 8.47917 12.0958 8.2875 12.2875C8.09583 12.4792 8 12.7167 8 13C8 13.2833 8.09583 13.5208 8.2875 13.7125C8.47917 13.9042 8.71667 14 9 14ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H13.175C13.4417 2 13.6958 2.05 13.9375 2.15C14.1792 2.25 14.3917 2.39167 14.575 2.575L19.425 7.425C19.6083 7.60833 19.75 7.82083 19.85 8.0625C19.95 8.30417 20 8.55833 20 8.825V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM13 8C13 8.28333 13.0958 8.52083 13.2875 8.7125C13.4792 8.90417 13.7167 9 14 9H18L13 4V8Z" fill="#FF7048"/>
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6953 9.33301H5.30467C4.42854 9.33396 3.5886 9.64762 2.96908 10.2052C2.34957 10.7627 2.00106 11.5187 2 12.3072V15.333H14V12.3072C13.9989 11.5187 13.6504 10.7627 13.0309 10.2052C12.4114 9.64762 11.5715 9.33396 10.6953 9.33301Z" fill="#2B3B63"/>
    <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="#2B3B63"/>
  </svg>
);

// Mobile Link chain icon
const IconMobileLink = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.33333 10.8333C8.69121 11.3118 9.14874 11.7077 9.67503 11.9938C10.2013 12.2799 10.7835 12.4496 11.3817 12.4913C11.9798 12.5329 12.5799 12.4454 13.1414 12.2347C13.7029 12.024 14.2124 11.6952 14.6333 11.2708L17.1333 8.77083C17.8918 7.98529 18.3117 6.93321 18.302 5.84062C18.2922 4.74803 17.8536 3.70344 17.0811 2.93092C16.3086 2.1584 15.264 1.71979 14.1714 1.71005C13.0788 1.70032 12.0267 2.12022 11.2408 2.87917L9.7875 4.32417M11.6667 9.16667C11.3088 8.68821 10.8513 8.29231 10.325 8.00619C9.79874 7.72007 9.21654 7.55036 8.61833 7.50868C8.02013 7.46699 7.42009 7.55452 6.85861 7.7652C6.29714 7.97588 5.78767 8.30476 5.36667 8.72917L2.86667 11.2292C2.10818 12.0147 1.68831 13.0668 1.69805 14.1594C1.70779 15.252 2.14639 16.2966 2.91891 17.0691C3.69143 17.8416 4.73603 18.2802 5.82862 18.29C6.92121 18.2997 7.97329 17.8798 8.75883 17.1208L10.2042 15.6758" stroke="#2B3B63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StopDetail() {
  const { routeId, stopId } = useParams();
  const navigate = useNavigate();
  const { routes, updateStopStatus, updateWorkOrderStatus, reportWorkOrderIssue, startDrivingMode } = useDriver();
  const currentRoute = routes.find(r => r.id === routeId);
  const stop = currentRoute?.stops.find(s => s.id === stopId);
  const [showNextStopModal, setShowNextStopModal] = useState(false);
  const [pendingCompleteWoId, setPendingCompleteWoId] = useState<string | null>(null);
  const [showCompleteStopReview, setShowCompleteStopReview] = useState(false);
  const [reportWorkOrderId, setReportWorkOrderId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const currentStopKey = `${routeId || ''}:${stopId || ''}`;
  const defaultExpandedWoId = stop?.workOrders.find(wo => wo.status === 'Pending')?.id || null;
  const [expandedWoState, setExpandedWoState] = useState<{ stopKey: string; woId: string | null }>(() => ({
    stopKey: currentStopKey,
    woId: defaultExpandedWoId,
  }));
  const expandedWoId = expandedWoState.stopKey === currentStopKey ? expandedWoState.woId : defaultExpandedWoId;

  if (!currentRoute || !stop) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center bg-[#F4F5F8] font-['Google_Sans_Flex']">
        <span className="text-[16px] text-[#71727A]">Stop Not Found</span>
      </div>
    );
  }

  const commentCount = stop.comments?.length || 0;
  const isPending = stop.status === 'Pending';
  const isServicing = stop.status === 'Servicing';
  const isDone = stop.status === 'Done';

  const statusLabel = isServicing ? 'Arrived' : isDone ? 'Done' : 'Pending';

  // Primary button
  // Only allow I'm Arrived if no other stop in this route is currently Servicing
  const activeService = routes.flatMap(route => route.stops.map(routeStop => ({ route, stop: routeStop })))
    .find(item => item.stop.status === 'Servicing' && !(item.route.id === currentRoute.id && item.stop.id === stop.id));
  const arrivedDisabled = isPending && !!activeService;
  // Planning remains available before departure; arrival and execution begin only after the Route starts.
  const showArrivedAction = isPending && currentRoute.status === 'En Route';

  const handlePrimary = () => {
    if (arrivedDisabled) return;
    if (isPending) updateStopStatus(currentRoute.id, stop.id, 'Servicing');
  };

  const handleCompleteWorkOrder = (woId: string) => {
    updateWorkOrderStatus(currentRoute.id, stop.id, woId, 'Completed');
    const nextPendingWorkOrder = stop.workOrders.find(wo => wo.id !== woId && wo.status === 'Pending');
    setExpandedWoState({ stopKey: currentStopKey, woId: nextPendingWorkOrder?.id || null });
  };

  const pendingCompleteWo = stop.workOrders.find(wo => wo.id === pendingCompleteWoId);
  const reportWorkOrder = stop.workOrders.find(wo => wo.id === reportWorkOrderId);
  const relatedWorkOrderTasks = pendingCompleteWo
    ? currentRoute.stops.flatMap(routeStop => routeStop.workOrders.map(wo => ({ ...wo, stopId: routeStop.id }))).filter(wo => wo.id === pendingCompleteWo.id)
    : [];
  const isFinalWorkOrderAction = pendingCompleteWo
    ? relatedWorkOrderTasks.filter(task => task.stopId !== stop.id).every(task => task.status === 'Completed' || task.status === 'Failed')
    : false;
  const proofRequirements = pendingCompleteWo ? getProofRequirements(pendingCompleteWo) : null;
  const hasRequiredPhotos = (pendingCompleteWo?.photos?.length || 0) > 0;
  const hasRequiredSignature = Boolean(pendingCompleteWo?.signature);
  const hasRequiredNotes = Boolean(pendingCompleteWo?.notes?.trim());
  const canConfirmCompletion = Boolean(proofRequirements &&
    (!proofRequirements.photos || hasRequiredPhotos) &&
    (!proofRequirements.signature || hasRequiredSignature) &&
    (!proofRequirements.notes || hasRequiredNotes));

  const completedTaskCount = stop.workOrders.filter(wo => wo.status === 'Completed' || wo.status === 'Failed').length;
  const allStopActionsComplete = stop.workOrders.length > 0 && completedTaskCount === stop.workOrders.length;
  const showCompleteStopAction = isServicing && allStopActionsComplete;
  const nextStop = currentRoute.stops.find(s =>
    s.id !== stop.id &&
    s.status !== 'Done' &&
    s.workOrders.some(wo => wo.action !== 'Start' && wo.action !== 'End')
  );
  const handleNavigate = () => {
    sessionStorage.setItem('opshub_return_to_stop', `/route/${currentRoute.id}/stop/${stop.id}`);
    startDrivingMode(currentRoute.id, stop.id);
    const encodedAddress = encodeURIComponent(stop.address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const closeReportSheet = () => {
    setReportWorkOrderId(null);
    setReportReason('');
    setReportDetails('');
  };

  const confirmWorkOrderReport = () => {
    if (!reportWorkOrder || !reportReason) return;
    reportWorkOrderIssue(currentRoute.id, stop.id, reportWorkOrder.id, reportReason, reportDetails);
    const nextPending = stop.workOrders.find(workOrder => workOrder.id !== reportWorkOrder.id && workOrder.status === 'Pending');
    setExpandedWoState({ stopKey: currentStopKey, woId: nextPending?.id || null });
    closeReportSheet();
  };

  const primaryWO = stop.workOrders?.[0];
  const stopType = primaryWO?.action || 'Stop';
  const customerName = primaryWO?.customerName || 'Unknown Customer';
  const customerPhone = primaryWO?.customerPhone || 'N/A';
  const unitInfo = primaryWO?.unitInfo;

  return (
    <div
      className="relative flex-1 flex flex-col overflow-y-auto select-none h-full no-scrollbar bg-[#F4F5F8] font-['Google_Sans_Flex']"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 pt-4 md:pt-[66px] pb-4 shrink-0 sticky top-0 z-50 bg-white/95 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="size-11 bg-[#F4F5F8] rounded-full flex items-center justify-center shrink-0 border-none cursor-pointer active:scale-95 transition-transform text-[#2B3B63]"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>

        <h1 className="flex-1 min-w-0 m-0 text-[#2B3B63] text-[17px] font-semibold truncate">Stop {stop.num}</h1>
      </header>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className={`px-4 flex flex-col gap-3 pt-4 ${(showArrivedAction || showCompleteStopAction) ? 'pb-52' : 'pb-32'}`}>

        {/* Address Subtitle (Large like Route 6) */}
        <div>
          <div className={`w-fit mb-2 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
            isServicing ? 'bg-[#2563EB] text-white' : isDone ? 'bg-[#2FA301]/20 text-[#278900]' : 'bg-[#F09A11]/20 text-[#C67A00]'
          }`}>
            {isServicing && <span className="size-1.5 rounded-full bg-white" />}
            {statusLabel}
          </div>
          <h2 className="m-0 text-[#2B3B63] text-[24px] font-bold font-['Google_Sans_Flex'] leading-tight tracking-tight">{stop.address}</h2>
        </div>

        <div className="w-full">
          <button
            type="button"
            onClick={handleNavigate}
            className="w-full min-h-[52px] px-4 flex items-center justify-center gap-2 rounded-[14px] bg-white border border-[#DCE0E6] text-[#2B3B63] text-[16px] font-semibold active:scale-[0.98] transition-transform cursor-pointer"
          >
            <Navigation size={18} className="text-[#FF7048]" fill="currentColor" />
            Navigate
          </button>
        </div>

        {isPending && activeService && (
          <div
            className="rounded-[12px] px-3 py-2 text-center"
            style={{ background: 'rgba(239,154,11,0.12)', border: '1px solid rgba(239,154,11,0.3)' }}
          >
            <span style={{ color: '#F09A11', fontSize: 12, fontWeight: 500, fontFamily: 'Google Sans Flex' }}>
              Stop {activeService.stop.num} · {activeService.route.name} is currently in progress. Finish it before starting another stop.
            </span>
          </div>
        )}

        {/* Work Orders are always visible for planning; execution unlocks after arrival. */}
        <div className="flex flex-col gap-3 mt-3">
          <div className="flex items-center gap-2">
            <h3 className="text-[20px] font-bold text-[#2B3B63] font-['Google_Sans_Flex'] m-0">Work Orders</h3>
            <span className="min-w-6 h-6 px-1.5 rounded-full bg-[#2B3B63] text-white text-[12px] font-bold flex items-center justify-center">{stop.workOrders.length}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2.5 rounded-[12px] bg-[#E9EBF1]">
            <span className="text-[12px] font-semibold text-[#5F6572]">Tasks at this Stop</span>
            <span className={`text-[12px] font-bold ${allStopActionsComplete ? 'text-[#278900]' : 'text-[#2B3B63]'}`}>
              {completedTaskCount}/{stop.workOrders.length} complete
            </span>
          </div>
          {showCompleteStopAction && (
            <div className="rounded-[14px] bg-[#2FA301]/10 border border-[#2FA301]/20 p-3 flex gap-2.5">
              <Check size={18} className="text-[#278900] shrink-0 mt-0.5" />
              <p className="m-0 text-[12px] leading-relaxed text-[#3F5F33]">
                All tasks are complete. Review the Stop before marking it completed.
              </p>
            </div>
          )}
          {stop.workOrders.map((wo) => (
            <WorkOrderCard
              key={wo.id}
              workOrder={wo}
              routeId={currentRoute.id}
              stopId={stop.id}
              onComplete={setPendingCompleteWoId}
              onReport={setReportWorkOrderId}
              stopStatus={stop.status}
              isExpanded={expandedWoId === wo.id}
              onToggle={() => setExpandedWoState({ stopKey: currentStopKey, woId: expandedWoId === wo.id ? null : wo.id })}
            />
          ))}
        </div>

      </main>

      {/* Persistent arrival action for the route currently in progress. */}
      {showArrivedAction && (
        <div className="fixed left-0 right-0 bottom-[72px] z-[45] px-4 pt-3 pb-3 bg-gradient-to-t from-white via-white to-white/90 border-t border-[#E7E9EE]">
          <button
            onClick={handlePrimary}
            disabled={arrivedDisabled}
            className="w-full min-h-[56px] flex items-center justify-center gap-2 border-none active:scale-[0.98] transition-transform rounded-[14px] bg-[#FF7048] text-white disabled:bg-[#D4D6DD] disabled:text-[#71727A] disabled:cursor-not-allowed cursor-pointer"
          >
            {!arrivedDisabled && <IconArrived />}
            <span className="text-[16px] font-semibold font-['Google_Sans_Flex']">I'm Arrived</span>
          </button>
        </div>
      )}

      {showCompleteStopAction && (
        <div className="fixed left-0 right-0 bottom-[72px] z-[45] px-4 pt-3 pb-3 bg-gradient-to-t from-white via-white to-white/90 border-t border-[#E7E9EE]">
          <button
            type="button"
            onClick={() => setShowCompleteStopReview(true)}
            className="w-full min-h-[56px] flex items-center justify-center gap-2 border-none active:scale-[0.98] transition-transform rounded-[14px] bg-[#2FA301] text-white cursor-pointer"
          >
            <Check size={20} />
            <span className="text-[16px] font-bold font-['Google_Sans_Flex']">Review & Complete Stop</span>
          </button>
        </div>
      )}

      {/* Deliberate completion review */}
      {pendingCompleteWo && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex flex-col justify-end">
          <button className="flex-1 bg-transparent border-none" onClick={() => setPendingCompleteWoId(null)} aria-label="Close completion review" />
          <div role="dialog" aria-modal="true" aria-labelledby="task-review-title" className="bg-white rounded-t-[28px] px-4 pt-4 pb-6 max-h-[72%] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF2] shrink-0">
              <div>
                <h2 id="task-review-title" className="text-[18px] font-bold text-[#2B3B63] m-0">Review Completion</h2>
                <p className="text-[12px] text-[#8A909D] m-0 mt-0.5">{pendingCompleteWo.action} · {pendingCompleteWo.type}</p>
              </div>
              <button onClick={() => setPendingCompleteWoId(null)} className="size-10 rounded-full bg-[#F2F4F7] text-[#71727A] border-none flex items-center justify-center cursor-pointer" aria-label="Close">
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto py-4 no-scrollbar">
              <div className="bg-[#FFF7F3] border border-[#FF7048]/20 rounded-[14px] p-3 flex gap-2.5 mb-4">
                <AlertTriangle size={18} className="text-[#FF7048] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#4B5563] leading-relaxed m-0">
                  {isFinalWorkOrderAction
                    ? `This completes the final task for ${pendingCompleteWo.id}. The Stop will remain Arrived until you review and complete the Stop.`
                    : `This completes only the ${pendingCompleteWo.action.toLowerCase()} task at this stop. ${pendingCompleteWo.id} remains in progress until its remaining actions are complete.`}
                </p>
              </div>

              {proofRequirements && (
                <p className="m-0 mb-3 text-[12px] font-semibold leading-relaxed text-[#5F6572]">{proofRequirements.summary}</p>
              )}

              <div className="space-y-2">
                <div className="min-h-[48px] px-3 rounded-[12px] bg-[#F7F8FA] flex items-center gap-3">
                  <Camera size={18} className={hasRequiredPhotos ? 'text-[#2FA301]' : proofRequirements?.photos ? 'text-[#FF7048]' : 'text-[#9CA3AF]'} />
                  <span className="flex-1 text-[14px] font-semibold text-[#2B3B63]">Photos</span>
                  <span className={`text-[12px] font-medium ${hasRequiredPhotos ? 'text-[#2FA301]' : proofRequirements?.photos ? 'text-[#DC2626]' : 'text-[#8A909D]'}`}>{hasRequiredPhotos ? `${pendingCompleteWo.photos!.length} added` : proofRequirements?.photos ? 'Required' : 'Optional'}</span>
                </div>
                <div className="min-h-[48px] px-3 rounded-[12px] bg-[#F7F8FA] flex items-center gap-3">
                  <PenLine size={18} className={hasRequiredSignature ? 'text-[#2FA301]' : proofRequirements?.signature ? 'text-[#FF7048]' : 'text-[#9CA3AF]'} />
                  <span className="flex-1 text-[14px] font-semibold text-[#2B3B63]">Signature</span>
                  <span className={`text-[12px] font-medium ${hasRequiredSignature ? 'text-[#2FA301]' : proofRequirements?.signature ? 'text-[#DC2626]' : 'text-[#8A909D]'}`}>{hasRequiredSignature ? 'Captured' : proofRequirements?.signature ? 'Required' : 'Optional'}</span>
                </div>
                <div className="min-h-[48px] px-3 rounded-[12px] bg-[#F7F8FA] flex items-center gap-3">
                  <FileText size={18} className={hasRequiredNotes ? 'text-[#2FA301]' : proofRequirements?.notes ? 'text-[#FF7048]' : 'text-[#71727A]'} />
                  <span className="flex-1 text-[14px] font-semibold text-[#2B3B63]">Notes</span>
                  <span className={`text-[12px] font-medium ${hasRequiredNotes ? 'text-[#2FA301]' : proofRequirements?.notes ? 'text-[#DC2626]' : 'text-[#71727A]'}`}>{pendingCompleteWo.notes ? 'Added' : proofRequirements?.notes ? 'Required' : 'Optional'}</span>
                </div>
              </div>
            </div>

            <button
              disabled={!canConfirmCompletion}
              onClick={() => {
                handleCompleteWorkOrder(pendingCompleteWo.id);
                setPendingCompleteWoId(null);
              }}
              className="w-full min-h-[54px] bg-[#2FA301] text-white rounded-[14px] font-bold text-[16px] border-none flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#D4D6DD] disabled:text-[#71727A] disabled:cursor-not-allowed shrink-0"
            >
              <Check size={19} /> Confirm {pendingCompleteWo.action} Complete
            </button>
          </div>
        </div>
      )}

      {showCompleteStopReview && (
        <div className="fixed inset-0 z-[115] bg-black/50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-transparent border-none"
            onClick={() => setShowCompleteStopReview(false)}
            aria-label="Close Stop completion review"
          />
          <section role="dialog" aria-modal="true" aria-labelledby="stop-review-title" className="bg-white rounded-t-[28px] px-4 pt-4 pb-6 flex flex-col shadow-2xl">
            <header className="flex items-center justify-between pb-3 border-b border-[#ECEEF2]">
              <div>
                <h2 id="stop-review-title" className="m-0 text-[18px] font-bold text-[#2B3B63]">Complete Stop {stop.num}?</h2>
                <p className="m-0 mt-0.5 text-[12px] text-[#8A909D]">Final Stop confirmation</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCompleteStopReview(false)}
                className="size-10 rounded-full bg-[#F2F4F7] text-[#71727A] border-none flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </header>
            <div className="py-4">
              <div className="rounded-[16px] bg-[#2FA301]/10 border border-[#2FA301]/20 p-3.5 flex gap-3">
                <span className="size-8 rounded-full bg-[#2FA301] text-white flex items-center justify-center shrink-0">
                  <Check size={18} />
                </span>
                <div>
                  <p className="m-0 text-[14px] font-bold text-[#2B3B63]">{completedTaskCount} of {stop.workOrders.length} tasks complete</p>
                  <p className="m-0 mt-1 text-[12px] leading-relaxed text-[#5F6572]">
                    Completing this Stop updates Route progress. Work Orders with remaining Pickup or Dropoff tasks will stay In Progress.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[0.8fr_1.2fr] gap-2.5">
              <button
                type="button"
                onClick={() => setShowCompleteStopReview(false)}
                className="min-h-[54px] rounded-[14px] bg-white border border-[#D9DDE4] text-[#2B3B63] text-[15px] font-bold cursor-pointer"
              >
                Not Yet
              </button>
              <button
                type="button"
                onClick={() => {
                  updateStopStatus(currentRoute.id, stop.id, 'Done');
                  setShowCompleteStopReview(false);
                  setShowNextStopModal(true);
                }}
                className="min-h-[54px] rounded-[14px] bg-[#2FA301] border-none text-white text-[15px] font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={18} /> Complete Stop
              </button>
            </div>
          </section>
        </div>
      )}

      {reportWorkOrder && (
        <div className="fixed inset-0 z-[118] bg-black/50 flex flex-col justify-end">
          <button type="button" className="flex-1 bg-transparent border-none" onClick={closeReportSheet} aria-label="Close Work Order report" />
          <section role="dialog" aria-modal="true" aria-labelledby="report-work-order-title" className="max-h-[76%] rounded-t-[28px] bg-white px-4 pt-4 pb-6 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-[#ECEEF2] pb-3 shrink-0">
              <div>
                <h2 id="report-work-order-title" className="m-0 text-[18px] font-bold text-[#2B3B63]">Report an Exception</h2>
                <p className="m-0 mt-0.5 text-[12px] text-[#8A909D]">{reportWorkOrder.id} · {reportWorkOrder.action}</p>
              </div>
              <button type="button" onClick={closeReportSheet} className="size-10 rounded-full border-none bg-[#F2F4F7] text-[#71727A] flex items-center justify-center cursor-pointer" aria-label="Close">
                <X size={19} />
              </button>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto py-4 no-scrollbar">
              <p className="m-0 mb-3 text-[12px] leading-relaxed text-[#5F6572]">Choose why this Work Order action cannot be completed at this Stop.</p>
              <div className="grid grid-cols-2 gap-2">
                {WORK_ORDER_EXCEPTION_REASONS.map(reason => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setReportReason(reason)}
                    className={`min-h-[48px] rounded-[12px] border px-3 text-left text-[12px] font-semibold cursor-pointer ${reportReason === reason ? 'border-[#DC2626] bg-[#FEECEC] text-[#9F1D1D]' : 'border-[#DCE0E6] bg-white text-[#2B3B63]'}`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <label className="block mt-4">
                <span className="block mb-1.5 text-[12px] font-bold text-[#2B3B63]">Details <span className="font-medium text-[#8A909D]">(optional)</span></span>
                <textarea
                  value={reportDetails}
                  onChange={event => setReportDetails(event.target.value)}
                  placeholder="Add details for Dispatcher…"
                  rows={3}
                  className="w-full resize-none rounded-[13px] border border-[#DCE0E6] bg-white p-3 text-[14px] text-[#2B3B63] outline-none box-border focus:border-[#2B3B63]"
                />
              </label>
              <div className="mt-3 rounded-[13px] border border-[#F09A11]/25 bg-[#FFF7ED] p-3 flex gap-2.5">
                <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#C67A00]" aria-hidden="true" />
                <p className="m-0 text-[11px] leading-relaxed text-[#7A4A00]">This action will be recorded as an exception. Other Work Orders at this Stop still need to be resolved.</p>
              </div>
            </div>

            <div className="grid grid-cols-[0.8fr_1.2fr] gap-2.5 shrink-0">
              <button type="button" onClick={closeReportSheet} className="min-h-[54px] rounded-[14px] border border-[#D9DDE4] bg-white text-[15px] font-bold text-[#2B3B63] cursor-pointer">Cancel</button>
              <button
                type="button"
                disabled={!reportReason}
                onClick={confirmWorkOrderReport}
                className="min-h-[54px] rounded-[14px] border-none bg-[#DC2626] text-white text-[15px] font-bold flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#D4D6DD] disabled:text-[#71727A] disabled:cursor-not-allowed"
              >
                <Flag size={17} aria-hidden="true" /> Report Exception
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ── Auto-forward Modal ─────────────────────────────────────── */}
      {showNextStopModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[360px] rounded-[24px] p-[24px] flex flex-col items-center gap-[16px] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-[64px] bg-[#2FA301]/20 text-[#2FA301] rounded-full flex items-center justify-center mb-[8px]">
              <Check size={32} />
            </div>
            
            <h2 className="text-[#2B3B63] text-[24px] font-bold font-['Google_Sans_Flex'] m-0">Great Job!</h2>
            <p className="text-[#71727A] text-[15px] font-['Google_Sans_Flex'] m-0 text-center leading-relaxed">
              You have completed all tasks for this stop.
            </p>

            {nextStop ? (
              <div className="w-full mt-[8px]">
                <p className="text-[#71727A] text-[13px] font-bold uppercase tracking-wider mb-[8px] font-['Google_Sans_Flex']">Next Up</p>
                <div className="bg-[#F9F5F0] rounded-[16px] p-[16px] mb-[24px] border border-[#FF7048]/20">
                  <div className="flex gap-[12px] items-start w-full">
                    <div className="bg-[#ff7048] size-[28px] rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                      <span className="font-bold text-[13px]">{nextStop.num}</span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className="text-[#2B3B63] font-bold text-[16px] m-0 leading-tight font-['Google_Sans_Flex'] truncate">
                        {nextStop.address.split(',')[0]}
                      </h3>
                      <span className="text-[#71727A] text-[13px] font-['Google_Sans_Flex'] truncate">
                        {nextStop.address.split(',').slice(1).join(',')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[10px]">
                  <button 
                    onClick={() => {
                      setShowNextStopModal(false);
                      navigate(`/route/${currentRoute.id}/stop/${nextStop.id}`);
                    }}
                    className="w-full bg-[#FF7048] text-white py-[16px] rounded-[16px] font-semibold text-[16px] font-['Google_Sans_Flex'] shadow-[0_8px_20px_rgba(255,112,72,0.3)] active:scale-[0.98] transition-transform border-none flex items-center justify-center gap-[8px]"
                  >
                    <MapPin size={18} /> Navigate to Next
                  </button>
                  <button 
                    onClick={() => {
                      setShowNextStopModal(false);
                      navigate(`/route/${currentRoute.id}`);
                    }}
                    className="w-full bg-transparent text-[#71727A] py-[16px] rounded-[16px] font-semibold text-[15px] font-['Google_Sans_Flex'] active:scale-[0.98] transition-transform border-none"
                  >
                    Choose Another Stop
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full mt-[16px] flex flex-col gap-[10px]">
                <div className="bg-[#2FA301]/10 rounded-[16px] p-[16px] mb-[16px] text-center border border-[#2FA301]/20">
                  <span className="text-[#2FA301] font-bold text-[16px] font-['Google_Sans_Flex']">
                    All stops completed for this route!
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setShowNextStopModal(false);
                    navigate(`/route/${currentRoute.id}/summary`);
                  }}
                  className="w-full bg-[#2B3B63] text-white py-[16px] rounded-[16px] font-semibold text-[16px] font-['Google_Sans_Flex'] shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-transform border-none"
                >
                  Review Route Summary
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
