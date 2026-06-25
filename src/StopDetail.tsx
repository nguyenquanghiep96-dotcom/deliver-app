import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDriver } from './DriverContext';
import { cleanStopType } from './lib/utils';
import { cn } from './lib/utils';
import { TagBadge, StatusBadge } from './components/Badges';

import svgPaths from "./StopDetailsExport/svg-uh1w3x0b6s";





function ModernGradient() {
  return (
    <div className="h-[393px] relative w-[1507px]" data-name="Modern Gradient">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1507 393">
        <g clipPath="url(#clip0_1_663)" id="Modern Gradient" opacity="0.4">
          <rect fill="#BABABA" height="393" width="1507" />
          <g filter="url(#filter0_f_1_663)" id="Gradient Circle 1">
            <circle cx="166.484" cy="160.225" fill="var(--fill-0, #2B3B63)" r="180.254" />
          </g>
          <g filter="url(#filter1_f_1_663)" id="Gradient Circle 2">
            <circle cx="217.223" cy="288.714" fill="var(--fill-0, #F97048)" r="195.901" />
          </g>
          <g filter="url(#filter2_f_1_663)" id="Gradient Circle 3">
            <ellipse cx="398.06" cy="195.275" fill="var(--fill-0, #E8E9F1)" rx="251.604" ry="251.604" />
          </g>
          <g filter="url(#filter3_f_1_663)" id="Gradient Circle 4">
            <ellipse cx="311" cy="132" fill="var(--fill-0, #93AEED)" fillOpacity="0.25" rx="146" ry="144" />
          </g>
          <g filter="url(#filter4_f_1_663)" id="Gradient Circle 5">
            <ellipse cx="921" cy="222" fill="var(--fill-0, #C0CADF)" fillOpacity="0.25" rx="426" ry="420" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="610.859" id="filter0_f_1_663" width="610.859" x="-138.945" y="-145.204">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_663" stdDeviation="62.588" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="641.801" id="filter1_f_1_663" width="641.801" x="-103.678" y="-32.1866">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_663" stdDeviation="62.5" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="753.56" id="filter2_f_1_663" width="753.56" x="21.2799" y="-181.505">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_663" stdDeviation="62.588" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="418" id="filter3_f_1_663" width="422" x="100" y="-77">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_663" stdDeviation="32.5" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="970" id="filter4_f_1_663" width="982" x="430" y="-263">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_663" stdDeviation="32.5" />
          </filter>
          <clipPath id="clip0_1_663">
            <rect fill="white" height="393" width="1507" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function StopUserContainer({ stop }: any) {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Stop User Container">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="User Icon">
        <div className="absolute inset-[58.33%_12.5%_4.17%_12.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 6">
            <path d={svgPaths.p2b6bd900} fill="var(--fill-0, #71727A)" id="Vector" />
          </svg>
        </div>
        <div className="absolute bottom-1/2 left-1/4 right-1/4 top-0" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <path d={svgPaths.p7c19700} fill="var(--fill-0, #71727A)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Google_Sans_Flex'] font-normal leading-[normal] not-italic relative shrink-0 text-[#71727a] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        {stop.customerName}
      </p>
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Layer_1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
        <g clipPath="url(#clip0_1_643)" id="Layer_1">
          <path d={svgPaths.p103de100} fill="var(--fill-0, #FF7048)" id="Vector" />
          <path d={svgPaths.p39da900} fill="var(--fill-0, #FF7048)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_643">
            <rect fill="white" height="13.3333" width="13.3333" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function StopInfoContainer({ stop }: any) {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[89px]" data-name="Stop Info Container">
      <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col font-['Proxima_Nova:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff7048] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">{stop.id}</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="New Tab Icon">
        <Layer />
      </div>
    </div>
  );
}

function StopStatusIndicator({ stop }: any) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="Stop Status Indicator">
      <TagBadge text={cleanStopType(stop.type)} />
      <StopUserContainer stop={stop} />
      <StopInfoContainer stop={stop} />
    </div>
  );
}

function StopStatusContainer({ stop }: any) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Stop Status Container">
      <StopStatusIndicator stop={stop} />
    </div>
  );
}

function AddressContainer({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Address Container">
      <StatusBadge status={stop.status} />
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[normal] not-italic relative shrink-0 text-[#2f3036] text-[30px] w-full">
        <p className="leading-[normal]">{stop.address}</p>
      </div>
      <StopStatusContainer stop={stop} />
    </div>
  );
}

function Description24DpE3E3E3Fill1Wght400Grad0Opsz() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="description_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="description_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.p43c0f0} fill="var(--fill-0, #FF7048)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function NoteHeader() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Note Header">
      <Description24DpE3E3E3Fill1Wght400Grad0Opsz />
      <p className="[word-break:break-word] font-['Google_Sans_Flex'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#2f3036] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        Stop Notes
      </p>
    </div>
  );
}

function NoteContainer({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative rounded-[5px] shrink-0 w-full" data-name="Note Container">
      <NoteHeader />
      <p className="[word-break:break-word] font-['Google_Sans_Flex'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#71727a] text-[14px] w-[min-content]" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        {stop.notes}
      </p>
    </div>
  );
}

function Description24DpE3E3E3Fill1Wght400Grad0Opsz1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="description_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="description_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.p2752f090} fill="var(--fill-0, #FF7048)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function InstructionHeader() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Instruction Header">
      <Description24DpE3E3E3Fill1Wght400Grad0Opsz1 />
      <p className="[word-break:break-word] font-['Google_Sans_Flex'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#2f3036] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        Delivery Instruction
      </p>
    </div>
  );
}

function NoteContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative rounded-[5px] shrink-0 w-full" data-name="Note Container">
      <InstructionHeader />
      <p className="[word-break:break-word] font-['Google_Sans_Flex'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#71727a] text-[14px] w-[min-content]" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        Repossession of unit #INV-0091. Owner is aware of repossession. If gates are locked, call dispatcher immediately.
      </p>
    </div>
  );
}

function NotesContainer({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Notes Container">
      <NoteContainer stop={stop} />
      <NoteContainer1 />
    </div>
  );
}

function Navigation24DpE3E3E3Fill1Wght400Grad0Opsz() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="navigation_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="navigation_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.p225d9180} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonFilled({ stop }: any) {
  return (
    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`} target="_blank" 
       className="flex-1 bg-[#ff7048] text-white font-medium py-[14px] px-[8px] rounded-[16px] transition-all active:scale-95 text-[15px] flex items-center justify-center gap-[6px] shadow-[0_4px_15px_rgba(255,112,72,0.3)] font-['Google_Sans_Flex'] decoration-none truncate">
       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
       <span>Navigate</span>
    </a>
  );
}

function ButtonFilled1() {
  return (
    <div onClick={() => window.submitStopDone?.()} 
         className="flex-1 bg-[#ff7048] text-white font-medium py-[14px] px-[8px] rounded-[16px] transition-all active:scale-95 text-[15px] flex items-center justify-center gap-[6px] shadow-[0_4px_15px_rgba(255,112,72,0.3)] font-['Google_Sans_Flex'] cursor-pointer">
       <span>Mark Stop Done</span>
    </div>
  );
}

function ActionButtonsContainer() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="Action Buttons Container">
      <ButtonFilled stop={stop} />
      <ButtonFilled1 />
    </div>
  );
}

function AddressAndStatus({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Address and Status">
      <AddressContainer stop={stop} />
      <NotesContainer stop={stop} />
      <ActionButtonsContainer />
    </div>
  );
}

function PhotoCamera24DpE3E3E3Fill1Wght400Grad0Opsz() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="photo_camera_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="photo_camera_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.pbd5a700} fill="var(--fill-0, #FF7048)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function AddPhotoText() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-center min-w-px relative" data-name="Add Photo Text">
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#2f3036] text-[16px] text-ellipsis w-full whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal] overflow-hidden text-ellipsis">Add Photo</p>
      </div>
    </div>
  );
}

function AddPhotoHeader() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] h-full items-center min-w-px relative" data-name="Add Photo Header">
      <PhotoCamera24DpE3E3E3Fill1Wght400Grad0Opsz />
      <AddPhotoText />
    </div>
  );
}

function Group1() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Group">
          <path d={svgPaths.p334830f0} fill="var(--fill-0, #71727A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-[8.33%] contents left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }} data-name="Group">
      <div className="absolute bottom-[8.33%] flex items-center justify-center left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <Group1 />
        </div>
      </div>
    </div>
  );
}

function AddPhotoContainer() {
  return (
    <div onClick={() => window.triggerPhotoAdd?.()} className="content-stretch flex gap-[16px] items-center py-[16px] relative shrink-0 w-full cursor-pointer active:opacity-70" data-name="Add Photo Container">
      <div aria-hidden className="absolute border-[#e8e9f1] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <AddPhotoHeader />
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Arrow Icon">
        <Group />
      </div>
    </div>
  );
}

function CreditCard24DpE3E3E3Fill1Wght400Grad0Opsz() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="credit_card_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="credit_card_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.p382b9180} fill="var(--fill-0, #FF7048)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function PaymentText() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-center min-w-px relative" data-name="Payment Text">
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#2f3036] text-[16px] text-ellipsis w-full whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal] overflow-hidden text-ellipsis">Payment</p>
      </div>
    </div>
  );
}

function PaymentHeader() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] h-full items-center min-w-px relative" data-name="Payment Header">
      <CreditCard24DpE3E3E3Fill1Wght400Grad0Opsz />
      <PaymentText />
    </div>
  );
}

function Group3() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Group">
          <path d={svgPaths.p334830f0} fill="var(--fill-0, #71727A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute bottom-[8.33%] contents left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }} data-name="Group">
      <div className="absolute bottom-[8.33%] flex items-center justify-center left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <Group3 />
        </div>
      </div>
    </div>
  );
}

function PaymentContainer() {
  return (
    <div className="content-stretch flex gap-[16px] items-center py-[16px] relative shrink-0 w-full cursor-pointer active:opacity-70" data-name="Payment Container">
      <div aria-hidden className="absolute border-[#e8e9f1] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <PaymentHeader />
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Arrow Icon">
        <Group2 />
      </div>
    </div>
  );
}

function StylusNote24DpE3E3E3Fill1Wght400Grad0Opsz() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="stylus_note_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="stylus_note_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.p3fd3d000} fill="var(--fill-0, #FF7048)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SignatureText() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-center min-w-px relative" data-name="Signature Text">
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#2f3036] text-[16px] text-ellipsis w-full whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal] overflow-hidden text-ellipsis">Delivery Signature</p>
      </div>
    </div>
  );
}

function SignatureHeader() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] h-full items-center min-w-px relative" data-name="Signature Header">
      <StylusNote24DpE3E3E3Fill1Wght400Grad0Opsz />
      <SignatureText />
    </div>
  );
}

function Group5() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Group">
          <path d={svgPaths.p334830f0} fill="var(--fill-0, #71727A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute bottom-[8.33%] contents left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }} data-name="Group">
      <div className="absolute bottom-[8.33%] flex items-center justify-center left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <Group5 />
        </div>
      </div>
    </div>
  );
}

function SignatureContainer() {
  return (
    <div onClick={() => window.triggerSignature?.()} className="content-stretch flex gap-[16px] items-center py-[16px] relative shrink-0 w-full cursor-pointer active:opacity-70" data-name="Signature Container">
      <div aria-hidden className="absolute border-[#e8e9f1] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <SignatureHeader />
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Arrow Icon">
        <Group4 />
      </div>
    </div>
  );
}

function Description24DpE3E3E3Fill1Wght400Grad0Opsz2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="description_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="description_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.pa196bc0} fill="var(--fill-0, #FF7048)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CommentText() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-center min-w-px relative" data-name="Comment Text">
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#2f3036] text-[16px] text-ellipsis w-full whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal] overflow-hidden text-ellipsis">Comment / Notes</p>
      </div>
    </div>
  );
}

function CommentHeader() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] h-full items-center min-w-px relative" data-name="Comment Header">
      <Description24DpE3E3E3Fill1Wght400Grad0Opsz2 />
      <CommentText />
    </div>
  );
}

function Group7() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Group">
          <path d={svgPaths.p334830f0} fill="var(--fill-0, #71727A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute bottom-[8.33%] contents left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }} data-name="Group">
      <div className="absolute bottom-[8.33%] flex items-center justify-center left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <Group7 />
        </div>
      </div>
    </div>
  );
}

function CommentContainer() {
  return (
    <div onClick={() => window.triggerComment?.()} className="content-stretch flex gap-[16px] items-center py-[16px] relative shrink-0 w-full cursor-pointer active:opacity-70" data-name="Comment Container">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <CommentHeader />
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Arrow Icon">
        <Group6 />
      </div>
    </div>
  );
}

function RecentStopCard() {
  return (
    <div className="bg-white relative rounded-[24px] shrink-0 w-full" data-name="Recent Stop Card">
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end px-[16px] relative size-full">
          <AddPhotoContainer />
          <PaymentContainer />
          <SignatureContainer />
          <CommentContainer />
        </div>
      </div>
    </div>
  );
}

function AddressInfo({ stop }: any) {
  return (
    <div className="flex flex-col gap-[10px] items-start w-full px-4 relative z-10" data-name="Address Info">
      <AddressAndStatus stop={stop} />
      <RecentStopCard />
    </div>
  );
}

function Group9() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Group">
          <path d={svgPaths.p334830f0} fill="var(--fill-0, #5E6578)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute bottom-[8.33%] contents left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }} data-name="Group">
      <div className="absolute bottom-[8.33%] flex items-center justify-center left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }}>
        <div className="flex-none h-[100cqw] rotate-90 w-[100cqh]">
          <Group9 />
        </div>
      </div>
    </div>
  );
}

function ButtonIcon({ navigate }: any) {
  return (
    <div onClick={() => navigate(-1)} className="bg-[#e8e9f1] content-stretch flex items-center p-[14px] relative rounded-[50px] shrink-0 cursor-pointer active:scale-95" data-name="Button Icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Back Icon">
        <Group8 />
      </div>
    </div>
  );
}

function Header({ stop, currentRoute, navigate, isScrolled }: any) {
  return (
    <div className={`h-[110px] px-4 pt-[60px] pb-4 flex justify-between items-center w-full shrink-0 z-50 font-['Google_Sans_Flex'] sticky top-0 transition-all duration-150 ${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-transparent border-transparent'}`}>
      <button 
        onClick={() => navigate(-1)}
        className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-black/5 active:scale-90 transition-transform shrink-0 cursor-pointer text-[#2F3036]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <span className="text-[18px] font-semibold text-[#2F3036] truncate font-['Google_Sans_Flex'] px-2 absolute left-1/2 -translate-x-1/2">
        Stop {stop.num}/{currentRoute?.stops?.length}
      </span>

      <button 
        onClick={() => window.location.href = `tel:${stop.customerPhone}`}
        className="bg-[#e8e9f1] flex items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none text-[#2f3036] active:scale-90 transition-transform"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </button>
    </div>
  );
}


function BuildingDetailsContainer({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Building Details Container">
      <div className="content-stretch flex h-[20px] items-center justify-center px-[16px] relative shrink-0">
        <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold h-full justify-center leading-[0] relative shrink-0 text-[#2f3036] text-[18px] w-full">
          <p className="leading-[normal]">Building Details</p>
        </div>
      </div>
      <div className="relative shrink-0 w-full mt-4 px-[16px]">
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pb-[10px] relative shrink-0 w-full border-b border-[#d4d6dd]">
            <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-normal justify-center leading-[0] relative shrink-0 text-[#71727a] text-[14px] w-full">
              <p className="leading-[normal]">Style:</p>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[0] relative shrink-0 text-[#2f3036] text-[16px] w-full">
              <p className="leading-[normal]">Monitor Barn</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pb-[10px] relative shrink-0 w-full border-b border-[#d4d6dd]">
            <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-normal justify-center leading-[0] relative shrink-0 text-[#71727a] text-[14px] w-full">
              <p className="leading-[normal]">Size:</p>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[0] relative shrink-0 text-[#2f3036] text-[16px] w-full">
              <p className="leading-[normal]">14x20</p>
            </div>
          </div>
        </div>
          </div>
      <BuildingImagesContainer />
    </div>
  );
}

function CustomerInfoContainer({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Customer Info Container">
      <div className="content-stretch flex h-[20px] items-center justify-center px-[16px] relative shrink-0">
        <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold h-full justify-center leading-[0] relative shrink-0 text-[#2f3036] text-[18px] w-full">
          <p className="leading-[normal]">Customer Infor</p>
        </div>
      </div>
      <div className="relative shrink-0 w-full mt-4 px-[16px]">
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pb-[10px] relative shrink-0 w-full border-b border-[#d4d6dd]">
            <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-normal justify-center leading-[0] relative shrink-0 text-[#71727a] text-[14px] w-full">
              <p className="leading-[normal]">Name:</p>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[0] relative shrink-0 text-[#2f3036] text-[16px] w-full">
              <p className="leading-[normal]">{stop.customerName}</p>
            </div>
          </div>
          <div className="content-stretch flex flex-row items-center justify-between pb-[10px] relative shrink-0 w-full">
            <div className="flex flex-col gap-[4px]">
              <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-normal justify-center leading-[0] relative shrink-0 text-[#71727a] text-[14px] w-full">
                <p className="leading-[normal]">Phone:</p>
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[0] relative shrink-0 text-[#2f3036] text-[16px] w-full">
                <p className="leading-[normal]">{stop.customerPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function BuildingImagesContainer() {
  return (
    <div className="flex gap-[10px] items-start overflow-x-auto relative shrink-0 w-[calc(100%+16px)] -mr-4 pr-4 no-scrollbar snap-x mt-4" data-name="Building Images Container">
      <div className="relative rounded-[16px] shrink-0 size-[209px] snap-start">
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src="/Building Image 1.jpg" />
        <div aria-hidden className="absolute border border-[#d8dadf] border-solid inset-0 rounded-[16px]" />
      </div>
      <div className="relative rounded-[16px] shrink-0 size-[209px] snap-start">
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src="/Building Image 2.jpg" />
        <div aria-hidden className="absolute border border-[#d8dadf] border-solid inset-0 rounded-[16px]" />
      </div>
      <div className="relative rounded-[16px] shrink-0 size-[209px] snap-start">
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src="/Building Image 3.jpg" />
        <div aria-hidden className="absolute border border-[#d8dadf] border-solid inset-0 rounded-[16px]" />
      </div>
      <div className="relative rounded-[16px] shrink-0 size-[209px] snap-start">
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src="/Building Image 4.jpg" />
        <div aria-hidden className="absolute border border-[#d8dadf] border-solid inset-0 rounded-[16px]" />
      </div>
      <div className="relative rounded-[16px] shrink-0 size-[209px] snap-start">
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src="/Building Image 5.jpg" />
        <div aria-hidden className="absolute border border-[#d8dadf] border-solid inset-0 rounded-[16px]" />
      </div>
    </div>
  );
}

function MainContainer({ stop }: any) {
  return (
    <div className="flex flex-col gap-[25px] items-start w-full px-4 pb-32 pt-4 relative z-10" data-name="Main Container">
      <BuildingDetailsContainer stop={stop} />
      <CustomerInfoContainer stop={stop} />
    </div>
  );
}

function ButtonFilled3({ stop }: any) {
  return null;
}

function LeftArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px overflow-clip pb-[13px] pt-[18px] relative" data-name="Left Area">
      <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🧩 Status Bar › Time">
        <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-black text-center tracking-[-0.43px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          1:47
        </p>
      </div>
    </div>
  );
}

function Hole() {
  return <div className="bg-black h-[37px] relative rounded-[100px] shrink-0 w-[126px]" data-name="Hole" />;
}

function CellularbarsF() {
  return (
    <div className="absolute inset-[13.04%_9.65%_24.27%_7.41%] overflow-clip" data-name="cellularbars F17">
      <div className="absolute inset-[75.47%_0.05%_0.06%_83.23%]" data-name="Bar Empty">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.25535 3.06814">
          <path d={svgPaths.p28984780} fill="var(--fill-0, black)" id="Bar Empty" opacity="0.2" />
        </svg>
      </div>
      <div className="absolute inset-[0_0_0.06%_83.25%]" data-name="Bar #4 Full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.26252 12.5306">
          <path d={svgPaths.p378f8200} fill="var(--fill-0, black)" id="Bar #4 Full" />
        </svg>
      </div>
      <div className="absolute inset-[75.47%_27.78%_0.06%_55.5%]" data-name="Bar Empty">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.25535 3.06814">
          <path d={svgPaths.p28984780} fill="var(--fill-0, black)" id="Bar Empty" opacity="0.2" />
        </svg>
      </div>
      <div className="absolute inset-[22.74%_27.76%_0.06%_55.52%]" data-name="Bar #3 Full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.2553 9.67947">
          <path d={svgPaths.p3a92fa80} fill="var(--fill-0, black)" id="Bar #3 Full" />
        </svg>
      </div>
      <div className="absolute inset-[75.47%_55.51%_0.06%_27.77%]" data-name="Bar Empty">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.25535 3.06814">
          <path d={svgPaths.p28984780} fill="var(--fill-0, black)" id="Bar Empty" opacity="0.2" />
        </svg>
      </div>
      <div className="absolute inset-[43.58%_55.52%_0.06%_27.76%]" data-name="Bar #2 Full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.25535 7.06653">
          <path d={svgPaths.p265d0b00} fill="var(--fill-0, black)" id="Bar #2 Full" />
        </svg>
      </div>
      <div className="absolute inset-[75.47%_83.28%_0.06%_0]" data-name="Bar Empty">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.25535 3.06814">
          <path d={svgPaths.p28984780} fill="var(--fill-0, black)" id="Bar Empty" opacity="0.2" />
        </svg>
      </div>
      <div className="absolute inset-[61.6%_83.28%_0.06%_0]" data-name="Bar #1 Full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.25535 4.80727">
          <path d={svgPaths.p10af4d00} fill="var(--fill-0, black)" id="Bar #1 Full" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[20px] relative shrink-0 w-[23.478px]" data-name="Icon">
      <CellularbarsF />
    </div>
  );
}

function WifiF() {
  return (
    <div className="absolute h-[12.004px] left-[1.74px] top-[3.48px] w-[16.621px]" data-name="wifi F17">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6208 12.0037">
        <g clipPath="url(#clip0_1_592)" id="wifi F17">
          <path d={svgPaths.p1df45d00} fill="var(--fill-0, black)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_592">
            <rect fill="white" height="12.0037" width="16.6208" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <WifiF />
    </div>
  );
}

function Battery100F22Fina() {
  return (
    <div className="absolute h-[12.135px] left-[2.61px] top-[3.48px] w-[26.824px]" data-name="battery.100 F22 Fina">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.8242 12.1346">
        <g clipPath="url(#clip0_1_576)" id="battery.100 F22 Fina">
          <path d={svgPaths.p84db871} fill="var(--fill-0, black)" id="Outside" opacity="0.4" />
          <path d={svgPaths.p6bd9400} fill="var(--fill-0, black)" id="Inside" />
        </g>
        <defs>
          <clipPath id="clip0_1_576">
            <rect fill="white" height="12.1346" width="26.8242" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[31.304px]" data-name="Icon">
      <Battery100F22Fina />
    </div>
  );
}

function Icons() {
  return (
    <div className="content-stretch flex gap-[3px] items-start relative shrink-0" data-name="Icons">
      <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🧩 Status Bar › Cellular Icon">
        <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🧩 Status Bar › Cellular Icon">
          <Icon />
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🧩 Status Bar › Wi-Fi Icon">
        <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🧩 Status Bar › Wi-Fi Icon">
          <Icon1 />
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🧩 Status Bar › Battery Icon">
        <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🧩 Status Bar › Battery Icon">
          <Icon2 />
        </div>
      </div>
    </div>
  );
}

function RightArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px overflow-clip pb-[13px] pt-[18px] relative" data-name="Right Area">
      <Icons />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip px-[10px] relative shrink-0 w-[393px]" data-name="Status Bar">
      <LeftArea />
      <div className="content-stretch flex flex-col items-start pb-[6px] pt-[11px] relative shrink-0" data-name="🧩 Status Bar › Dynamic Island">
        <Hole />
      </div>
      <RightArea />
    </div>
  );
}


export default function StopDetail() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const mainEl = document.getElementById('scroll-container');
    if (!mainEl) return;
    const handleScroll = (e) => {
      setIsScrolled(e.target.scrollTop > 10);
    };
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);
  const { stopId } = useParams();
  const navigate = useNavigate();
  const { routes, updateStopStatus, addPhoto, saveSignature, addComment } = useDriver();

  const currentRoute = routes.find(r => r.stops.some(s => s.id === stopId));
  const stop = currentRoute?.stops.find(s => s.id === stopId);

  const [sigModalType, setSigModalType] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef(null);

  if (!currentRoute || !stop) {
    return <div className="p-8 text-center">Stop Not Found</div>;
  }

  // Hook handlers to window for nested components to trigger
  window.submitStopDone = () => {
    updateStopStatus(currentRoute.id, stop.id, 'Done');
    navigate(`/route/${currentRoute.id}`);
  };
  window.triggerPhotoAdd = () => fileInputRef.current?.click();
  window.triggerSignature = () => setSigModalType('customer');
  window.triggerComment = () => setShowCommentModal(true);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          addPhoto(currentRoute.id, stop.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1C2340';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveSignature(currentRoute.id, stop.id, canvas.toDataURL());
    setSigModalType(null);
  };

  const submitComment = () => {
    if (!newComment.trim()) return;
    addComment(currentRoute.id, stop.id, newComment);
    setNewComment('');
    setShowCommentModal(false);
  };

  return (
    <div className="pb-[120px] relative flex flex-col min-h-full font-['Google_Sans_Flex'] overflow-x-hidden no-scrollbar" data-name="Stop Details" >
      
      <Header stop={stop} currentRoute={currentRoute} navigate={navigate} isScrolled={isScrolled} />
      <AddressInfo stop={stop} />
      <MainContainer stop={stop} />
      <ButtonFilled3 stop={stop} />

      {/* Hidden file input */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />

      {/* SIGNATURE MODAL */}
      {sigModalType !== null && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-5 shadow-2xl flex flex-col font-['Google_Sans_Flex']">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[14px] font-bold text-[#2f3036] uppercase">Draw Signature</h3>
              <button onClick={() => setSigModalType(null)} className="text-gray-400 hover:text-gray-600 font-extrabold text-sm border-none bg-transparent">✕</button>
            </div>
            <div className="bg-[#F8F9FA] border-2 border-dashed border-[#C7C7CC] rounded-2xl h-44 mt-4 relative overflow-hidden touch-none">
              <canvas
                ref={canvasRef} width={320} height={176}
                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair"
              />
            </div>
            <div className="flex gap-2.5 mt-5">
              <button onClick={clearCanvas} className="flex-1 py-3.5 bg-gray-100 rounded-xl text-xs font-bold border-none">Clear</button>
              <button onClick={saveSig} className="flex-1 py-3.5 bg-[#FF7048] text-white rounded-xl text-xs font-bold border-none">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS MODAL */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-5 shadow-2xl font-['Google_Sans_Flex']">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[14px] font-bold text-[#2f3036] uppercase">Add Stop Comment</h3>
              <button onClick={() => setShowCommentModal(false)} className="text-gray-400 hover:text-gray-600 font-extrabold text-sm border-none bg-transparent">✕</button>
            </div>
            <textarea
              value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type delivery log notes or issue comments..."
              className="w-full border border-gray-200 rounded-xl p-3 text-xs mt-4 h-24 focus:outline-none focus:ring-1 focus:ring-[#FF7048]"
            />
            <div className="flex gap-2.5 mt-4">
              <button onClick={() => setShowCommentModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl text-xs font-bold border-none">Cancel</button>
              <button onClick={submitComment} className="flex-1 py-3 bg-[#FF7048] text-white rounded-xl text-xs font-bold border-none">Add log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
