import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { useDriver } from './DriverContext';
import { cleanStopType } from './lib/utils';

// ─── Custom SVG Icons (Figma-aligned) ────────────────────────────────────────

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.22101 11.045C9.35869 11.1082 9.51381 11.1227 9.6608 11.086C9.8078 11.0493 9.9379 10.9636 10.0297 10.843L10.2663 10.533C10.3905 10.3674 10.5516 10.233 10.7367 10.1404C10.9219 10.0479 11.126 9.99967 11.333 9.99967H13.333C13.6866 9.99967 14.0258 10.1402 14.2758 10.3902C14.5259 10.6402 14.6663 10.9794 14.6663 11.333V13.333C14.6663 13.6866 14.5259 14.0258 14.2758 14.2758C14.0258 14.5259 13.6866 14.6663 13.333 14.6663C10.1504 14.6663 7.09816 13.4021 4.84773 11.1516C2.59729 8.90119 1.33301 5.84894 1.33301 2.66634C1.33301 2.31272 1.47348 1.97358 1.72353 1.72353C1.97358 1.47348 2.31272 1.33301 2.66634 1.33301H4.66634C5.01996 1.33301 5.3591 1.47348 5.60915 1.72353C5.8592 1.97358 5.99967 2.31272 5.99967 2.66634V4.66634C5.99967 4.87333 5.95148 5.07749 5.85891 5.26263C5.76634 5.44777 5.63194 5.60881 5.46634 5.73301L5.15434 5.96701C5.03195 6.06046 4.94569 6.1934 4.9102 6.34324C4.87472 6.49308 4.8922 6.65059 4.95967 6.78901C5.8708 8.63959 7.36929 10.1362 9.22101 11.045Z" fill="#2F3036"/>
  </svg>
);

const IconArrived = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.9998 21.9498V20.9498C8.91647 20.7165 7.12897 19.854 5.6373 18.3623C4.14564 16.8706 3.28314 15.0831 3.0498 12.9998H2.0498C1.76647 12.9998 1.52897 12.904 1.3373 12.7123C1.14564 12.5206 1.0498 12.2831 1.0498 11.9998C1.0498 11.7165 1.14564 11.479 1.3373 11.2873C1.52897 11.0956 1.76647 10.9998 2.0498 10.9998H3.0498C3.28314 8.91647 4.14564 7.12897 5.6373 5.6373C7.12897 4.14564 8.91647 3.28314 10.9998 3.0498V2.0498C10.9998 1.76647 11.0956 1.52897 11.2873 1.3373C11.479 1.14564 11.7165 1.0498 11.9998 1.0498C12.2831 1.0498 12.5206 1.14564 12.7123 1.3373C12.904 1.52897 12.9998 1.76647 12.9998 2.0498V3.0498C15.0831 3.28314 16.8706 4.14564 18.3623 5.6373C19.854 7.12897 20.7165 8.91647 20.9498 10.9998H21.9498C22.2331 10.9998 22.4706 11.0956 22.6623 11.2873C22.854 11.479 22.9498 11.7165 22.9498 11.9998C22.9498 12.2831 22.854 12.5206 22.6623 12.7123C22.4706 12.904 22.2331 12.9998 21.9498 12.9998H20.9498C20.7165 15.0831 19.854 16.8706 18.3623 18.3623C16.8706 19.854 15.0831 20.7165 12.9998 20.9498V21.9498C12.9998 22.2331 12.904 22.4706 12.7123 22.6623C12.5206 22.854 12.2831 22.9498 11.9998 22.9498C11.7165 22.9498 11.479 22.854 11.2873 22.6623C11.0956 22.4706 10.9998 22.2331 10.9998 21.9498ZM16.9498 16.9498C18.3165 15.5831 18.9998 13.9331 18.9998 11.9998C18.9998 10.0665 18.3165 8.41647 16.9498 7.0498C15.5831 5.68314 13.9331 4.9998 11.9998 4.9998C10.0665 4.9998 8.41647 5.68314 7.0498 7.0498C5.68314 8.41647 4.9998 10.0665 4.9998 11.9998C4.9998 13.9331 5.68314 15.5831 7.0498 16.9498C8.41647 18.3165 10.0665 18.9998 11.9998 18.9998C13.9331 18.9998 15.5831 18.3165 16.9498 16.9498ZM9.1748 14.8248C8.39147 14.0415 7.9998 13.0998 7.9998 11.9998C7.9998 10.8998 8.39147 9.95814 9.1748 9.1748C9.95814 8.39147 10.8998 7.9998 11.9998 7.9998C13.0998 7.9998 14.0415 8.39147 14.8248 9.1748C15.6081 9.95814 15.9998 10.8998 15.9998 11.9998C15.9998 13.0998 15.6081 14.0415 14.8248 14.8248C14.0415 15.6081 13.0998 15.9998 11.9998 15.9998C10.8998 15.9998 9.95814 15.6081 9.1748 14.8248ZM13.4123 13.4123C13.804 13.0206 13.9998 12.5498 13.9998 11.9998C13.9998 11.4498 13.804 10.979 13.4123 10.5873C13.0206 10.1956 12.5498 9.9998 11.9998 9.9998C11.4498 9.9998 10.979 10.1956 10.5873 10.5873C10.1956 10.979 9.9998 11.4498 9.9998 11.9998C9.9998 12.5498 10.1956 13.0206 10.5873 13.4123C10.979 13.804 11.4498 13.9998 11.9998 13.9998C12.5498 13.9998 13.0206 13.804 13.4123 13.4123Z" fill="white"/>
  </svg>
);

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

const IconNavigate = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.03858 13.743L2.26469 12.846C2.07472 12.8095 1.92113 12.7343 1.80392 12.6203C1.68671 12.5064 1.61033 12.3729 1.57477 12.2198C1.53921 12.0668 1.55076 11.9103 1.60942 11.7505C1.66807 11.5907 1.77461 11.4525 1.92902 11.336L13.5311 3.46842C13.6782 3.36368 13.8357 3.3145 14.0035 3.32088C14.1713 3.32726 14.3201 3.37084 14.4498 3.45162C14.5794 3.5324 14.6841 3.64671 14.7639 3.79456C14.8436 3.9424 14.8688 4.10541 14.8397 4.28359L12.8923 18.1658C12.8558 18.3558 12.7787 18.5123 12.6611 18.6354C12.5435 18.7585 12.4082 18.8378 12.2552 18.8734C12.1021 18.909 11.9486 18.8992 11.7947 18.8443C11.6407 18.7893 11.5055 18.6846 11.389 18.5302L8.03858 13.743Z" fill="white"/>
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6953 9.33301H5.30467C4.42854 9.33396 3.5886 9.64762 2.96908 10.2052C2.34957 10.7627 2.00106 11.5187 2 12.3072V15.333H14V12.3072C13.9989 11.5187 13.6504 10.7627 13.0309 10.2052C12.4114 9.64762 11.5715 9.33396 10.6953 9.33301Z" fill="#2F3036"/>
    <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="#2F3036"/>
  </svg>
);

// Mobile Link chain icon
const IconMobileLink = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.33333 10.8333C8.69121 11.3118 9.14874 11.7077 9.67503 11.9938C10.2013 12.2799 10.7835 12.4496 11.3817 12.4913C11.9798 12.5329 12.5799 12.4454 13.1414 12.2347C13.7029 12.024 14.2124 11.6952 14.6333 11.2708L17.1333 8.77083C17.8918 7.98529 18.3117 6.93321 18.302 5.84062C18.2922 4.74803 17.8536 3.70344 17.0811 2.93092C16.3086 2.1584 15.264 1.71979 14.1714 1.71005C13.0788 1.70032 12.0267 2.12022 11.2408 2.87917L9.7875 4.32417M11.6667 9.16667C11.3088 8.68821 10.8513 8.29231 10.325 8.00619C9.79874 7.72007 9.21654 7.55036 8.61833 7.50868C8.02013 7.46699 7.42009 7.55452 6.85861 7.7652C6.29714 7.97588 5.78767 8.30476 5.36667 8.72917L2.86667 11.2292C2.10818 12.0147 1.68831 13.0668 1.69805 14.1594C1.70779 15.252 2.14639 16.2966 2.91891 17.0691C3.69143 17.8416 4.73603 18.2802 5.82862 18.29C6.92121 18.2997 7.97329 17.8798 8.75883 17.1208L10.2042 15.6758" stroke="#2F3036" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StopDetail() {
  const { stopId } = useParams();
  const navigate = useNavigate();
  const { routes, updateStopStatus } = useDriver();

  const currentRoute = routes.find(r => r.stops.some(s => s.id === stopId));
  const stop = currentRoute?.stops.find(s => s.id === stopId);

  if (!currentRoute || !stop) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center" style={{ background: '#E8E9F1', fontFamily: "'Google Sans Flex', sans-serif" }}>
        <span style={{ fontSize: 16, color: '#71727A' }}>Stop Not Found</span>
      </div>
    );
  }

  const commentCount = stop.comments?.length || 0;
  const stopIndex = currentRoute.stops.findIndex(s => s.id === stop.id) + 1;
  const totalStops = currentRoute.stops.length;

  const isPending = stop.status === 'Pending';
  const isServicing = stop.status === 'Servicing';
  const isDone = stop.status === 'Done';

  // Status badge
  let statusBg = 'rgba(239,154,11,0.20)';
  let statusBorder = '1px solid #F09A11';
  let statusTextColor = '#F09A11';
  let statusLabel = 'Pending';
  if (isServicing) {
    statusBg = 'rgba(59,130,246,0.20)';
    statusBorder = '1px solid #3B82F6';
    statusTextColor = '#3B82F6';
    statusLabel = 'Arrived';
  } else if (isDone) {
    statusBg = 'rgba(47,163,1,0.20)';
    statusBorder = '1px solid #2FA301';
    statusTextColor = '#2FA301';
    statusLabel = 'Done';
  }

  // Primary button
  // Only allow I'm Arrived if no other stop in this route is currently Servicing
  const otherServiceStop = currentRoute.stops.find(s => s.id !== stop.id && s.status === 'Servicing');
  const arrivedDisabled = isPending && !!otherServiceStop; // disabled if another stop is being serviced

  const primaryLabel = isPending ? "I'm Arrived" : isServicing ? 'Mark Stop Done' : 'Completed';
  const handlePrimary = () => {
    if (arrivedDisabled) return;
    if (isPending) updateStopStatus(currentRoute.id, stop.id, 'Servicing');
    else if (isServicing) {
      updateStopStatus(currentRoute.id, stop.id, 'Done');
      navigate(`/route/${currentRoute.id}`);
    }
  };

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`;

  return (
    <div
      className="relative flex-1 flex flex-col overflow-y-auto select-none h-full no-scrollbar"
      style={{ background: '#E8E9F1', fontFamily: "'Google Sans Flex', sans-serif" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-[16px] px-4 pt-[66px] pb-3 shrink-0 sticky top-0 z-50"
        style={{ background: '#E8E9F1' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-[14px] bg-white rounded-full flex items-center justify-center shrink-0 border-none cursor-pointer active:scale-95 transition-transform"
          style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.10)' }}
        >
          <ChevronLeft size={16} color="#5E6578" />
        </button>

        <h1 className="flex-1 m-0" style={{ color: '#2F3036', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
          Stop {stopIndex}/{totalStops}
        </h1>

        <button
          className="flex items-center gap-[6px] px-[12px] py-[12px] rounded-full border-none cursor-pointer active:scale-95 transition-transform shrink-0"
          style={{ background: '#D4D6DD' }}
        >
          <IconMobileLink />
          <span style={{ color: '#2F3036', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Mobile Link</span>
        </button>
      </header>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="px-4 pb-32 flex flex-col gap-[12px] mt-[4px]">

        {/* Stop type + status */}
        <div className="flex items-center gap-[10px]">
          <span style={{ color: '#2F3036', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
            {cleanStopType(stop.type)}
          </span>
          <div
            className="px-[8px] py-[3px] rounded-[6px] flex items-center justify-center shrink-0"
            style={{ background: statusBg, outline: statusBorder, outlineOffset: '-1px' }}
          >
            <span style={{ color: statusTextColor, fontSize: 11, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Address */}
        <h2 className="m-0" style={{ color: '#2F3036', fontSize: 26, fontWeight: 600, fontFamily: 'Google Sans Flex', lineHeight: 1.2 }}>
          {stop.address}
        </h2>

        {/* Unit line: size + model name */}
        <div style={{ color: '#FF7048', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
          {stop.unitInfo.size}{stop.unitInfo.modelName ? ` ${stop.unitInfo.modelName}` : ''}
        </div>

        {/* Customer + Phone row */}
        <div className="flex items-center gap-[16px]">
          <div className="flex-1 flex items-center gap-[6px] min-w-0 overflow-hidden">
            <div className="shrink-0"><IconUser /></div>
            <span className="truncate" style={{ color: '#2F3036', fontSize: 12, fontWeight: 500, fontFamily: 'Google Sans Flex' }}>
              {stop.customerName}
            </span>
          </div>
          <a
            href={`tel:${stop.customerPhone}`}
            className="flex items-center gap-[6px] px-[8px] py-[8px] rounded-[10px] shrink-0 no-underline active:scale-95 transition-transform"
            style={{ outline: '1px solid #C5C6CC', outlineOffset: '-1px' }}
          >
            <div className="shrink-0"><IconPhone /></div>
            <span style={{ color: '#2F3036', fontSize: 12, fontWeight: 500, fontFamily: 'Google Sans Flex' }}>
              {stop.customerPhone}
            </span>
          </a>
        </div>

        {/* Google Maps card */}
        <div
          className="relative overflow-hidden rounded-[16px]"
          style={{ height: 132, boxShadow: '0px 1px 2px rgba(0,0,0,0.25)', background: 'white' }}
        >
          <img src="/map-thumbnail.jpg" alt="Map" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center no-underline"
          >
            <div
              className="flex items-center gap-[6px] px-[14px] py-[10px] rounded-full"
              style={{ background: 'rgba(31,32,36,0.80)' }}
            >
              <IconNavigate />
              <span style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Navigate</span>
            </div>
          </a>
        </div>

        {/* Primary Action Button */}
        {!isDone && (
          <>
            <button
              onClick={handlePrimary}
              disabled={arrivedDisabled}
              className="w-full flex items-center justify-center gap-[6px] border-none cursor-pointer active:scale-[0.98] transition-transform rounded-[16px]"
              style={{
                paddingTop: 15.5, paddingBottom: 15.5,
                background: arrivedDisabled ? '#D4D6DD' : '#FF7048',
                boxShadow: arrivedDisabled ? 'none' : '0px 8px 20px rgba(255,112,72,0.35)',
                cursor: arrivedDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending && !arrivedDisabled && <IconArrived />}
              <span style={{ color: arrivedDisabled ? '#71727A' : 'white', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
                {primaryLabel}
              </span>
            </button>
            {arrivedDisabled && otherServiceStop && (
              <div
                className="rounded-[12px] px-3 py-2 text-center"
                style={{ background: 'rgba(239,154,11,0.12)', border: '1px solid rgba(239,154,11,0.3)' }}
              >
                <span style={{ color: '#F09A11', fontSize: 12, fontWeight: 500, fontFamily: 'Google Sans Flex' }}>
                  Stop #{currentRoute.stops.find(s => s.id === otherServiceStop.id)?.num} is currently being serviced
                </span>
              </div>
            )}
          </>
        )}

        {/* Notes */}
        {stop.notes && (
          <div className="flex items-start gap-[6px] rounded-[16px] p-[10px]" style={{ background: '#FFF7EE' }}>
            <div className="shrink-0 mt-[2px]"><IconNote /></div>
            <p className="flex-1 m-0" style={{ color: '#71727A', fontSize: 14, fontWeight: 400, fontFamily: 'Google Sans Flex', lineHeight: 1.5 }}>
              {stop.notes}
            </p>
          </div>
        )}

        {/* Building Orientation */}
        {stop.buildingOrientation && (
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-[4px]">
              <div className="shrink-0"><IconBuildingOrientation /></div>
              <span style={{ color: '#2F3036', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Building Orientation</span>
            </div>
            <p className="m-0" style={{ color: '#71727A', fontSize: 14, fontWeight: 400, fontFamily: 'Google Sans Flex', lineHeight: 1.5 }}>
              {stop.buildingOrientation}
            </p>
          </div>
        )}

        {/* Delivery Instruction */}
        {stop.deliveryInstruction && (
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-[4px]">
              <div className="shrink-0"><IconDeliveryInstruction /></div>
              <span style={{ color: '#2F3036', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Delivery Instruction</span>
            </div>
            <p className="m-0" style={{ color: '#71727A', fontSize: 14, fontWeight: 400, fontFamily: 'Google Sans Flex', lineHeight: 1.5 }}>
              {stop.deliveryInstruction}
            </p>
          </div>
        )}

        {/* Unit Info Card */}
        <div
          className="flex items-stretch overflow-hidden rounded-[16px] cursor-pointer active:scale-[0.99] transition-transform mt-[8px]"
          style={{ background: 'white', boxShadow: '0px 8px 20px rgba(0,0,0,0.06)' }}
          onClick={() => navigate(`/stop/${stop.id}/building`)}
        >
          {/* Left: unit thumbnail — first building photo */}
          <div
            className="shrink-0 overflow-hidden"
            style={{ width: 114, alignSelf: 'stretch', background: 'rgba(108,110,122,0.15)' }}
          >
            <img
              src="/Building Image 1.jpg"
              alt="Unit"
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
              }}
            />
          </div>

          {/* Right: unit details */}
          <div className="flex-1 px-[10px] py-[20px] flex items-center justify-between gap-[12px] min-w-0">
            <div className="flex flex-col gap-[2px] min-w-0 flex-1">
              <div style={{ color: '#FF7048', fontSize: 11, fontWeight: 500, fontFamily: 'Google Sans Flex' }}>
                Serial# :{stop.unitInfo.serial}
              </div>
              {/* Full product name — allow wrap, not truncate */}
              <div style={{ color: '#2F3036', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex', lineHeight: 1.4 }}>
                {stop.unitInfo.size}{stop.unitInfo.modelName ? ` ${stop.unitInfo.modelName}` : ''}
              </div>
            </div>
            <ChevronRight size={16} className="text-[#71727A] shrink-0" />
          </div>
        </div>

        {/* Action Rows */}
        <div
          className="flex flex-col px-[16px] rounded-[24px] overflow-hidden mt-[8px]"
          style={{ background: 'white', boxShadow: '0px 8px 40px rgba(0,0,0,0.06)' }}
        >
          {/* Add Photo */}
          <div
            onClick={() => navigate(`/stop/${stop.id}/photos`)}
            className="flex items-center justify-between py-[16px] cursor-pointer active:opacity-70 transition-opacity"
            style={{ borderBottom: '1px solid #E8E9F1' }}
          >
            <div className="flex items-center gap-[10px]">
              <IconCamera />
              <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Add Photo</span>
            </div>
            <div className="flex items-center gap-[8px]">
              {stop.photos && stop.photos.length > 0 && (
                <span className="text-white px-2 py-0.5 rounded-full" style={{ background: '#FF7048', fontSize: 12, fontWeight: 600 }}>
                  {stop.photos.length}
                </span>
              )}
              <ChevronRight size={16} className="text-[#71727A]" />
            </div>
          </div>


          <div
            onClick={() => navigate(`/stop/${stop.id}/signature`)}
            className="flex items-center justify-between py-[16px] cursor-pointer active:opacity-70 transition-opacity"
            style={{ borderBottom: '1px solid #E8E9F1' }}
          >
            <div className="flex items-center gap-[10px]">
              <IconSignature />
              <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Delivery Signature</span>
            </div>
            <div className="flex items-center gap-[8px]">
              {stop.signature ? (
                <span className="flex items-center gap-1" style={{ color: '#2FA301', fontSize: 12, fontWeight: 600 }}>
                  <Check size={14} /> Signed
                </span>
              ) : (
                <ChevronRight size={16} className="text-[#71727A]" />
              )}
            </div>
          </div>

          {/* Payment */}
          <div
            onClick={() => alert('Payment feature coming soon!')}
            className="flex items-center justify-between py-[16px] cursor-pointer active:opacity-70 transition-opacity"
            style={{ borderBottom: '1px solid #E8E9F1' }}
          >
            <div className="flex items-center gap-[10px]">
              <IconPayment />
              <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Payment</span>
            </div>
            <ChevronRight size={16} className="text-[#71727A]" />
          </div>

          {/* Stop Notes */}
          <div
            onClick={() => navigate(`/stop/${stop.id}/notes`)}
            className="flex items-center justify-between py-[16px] cursor-pointer active:opacity-70 transition-opacity"
          >
            <div className="flex items-center gap-[10px]">
              <IconStopNotes />
              <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Stop Notes</span>
            </div>
            <div className="flex items-center gap-[8px]">
              {commentCount > 0 && (
                <span className="text-white px-2 py-0.5 rounded-full" style={{ background: '#FF7048', fontSize: 12, fontWeight: 600 }}>
                  {commentCount}
                </span>
              )}
              <ChevronRight size={16} className="text-[#71727A]" />
            </div>
          </div>
        </div>

      </main>

{/* ── FAB: Quick Call Customer ─────────────────────────────────────── */}
      <div className="fixed bottom-[100px] right-[16px] z-50">
        <a
          href={`tel:${stop.customerPhone}`}
          className="flex items-center justify-center no-underline rounded-full active:scale-95 transition-transform"
          style={{ width: 54, height: 54, background: '#FF7048', boxShadow: '0px 8px 24px rgba(255,112,72,0.45)' }}
        >
          <IconPhone />
        </a>
      </div>
    </div>
  );
}
