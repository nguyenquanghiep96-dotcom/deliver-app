import svgPaths from "./svg-39yy3pz6nt";

function CurrentStopInfoContainer() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Current Stop Info Container">
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Google_Sans_Flex',sans-serif] font-semibold justify-center leading-[0] min-w-px not-italic relative text-[18px] text-white" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal] truncate">R-015 - Fort Worth</p>
      </div>
      <div className="bg-[#2fa301] content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[6px] py-[2px] relative rounded-[6px] shrink-0" data-name="Status">
        <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
          <p className="leading-[normal]">En Route</p>
        </div>
      </div>
    </div>
  );
}

function CurrentStopAddressContainer() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0 w-full" data-name="Current Stop Address Container">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="compass (1) 2">
        <div className="absolute bg-[#c5c6cc] inset-[31.25%_43.75%_0_43.75%]" />
        <div className="absolute bottom-1/2 left-1/4 right-1/4 top-0">
          <div className="absolute inset-[0_-20%_-40%_-20%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.2 11.2">
              <g filter="url(#filter0_d_2_2741)" id="Ellipse 7">
                <circle cx="5.6" cy="4" fill="var(--fill-0, #FF7048)" r="4" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="11.2" id="filter0_d_2_2741" width="11.2" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="1.6" />
                  <feGaussianBlur stdDeviation="0.8" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_2741" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow_2_2741" mode="normal" result="shape" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Google_Sans_Flex',sans-serif] font-normal justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[#c5c6cc] text-[15px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal] overflow-hidden text-ellipsis">123 William St, Manhattan, NY, 10038</p>
      </div>
    </div>
  );
}

function CurrentStopDetailsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Current Stop Details Container">
      <CurrentStopInfoContainer />
      <CurrentStopAddressContainer />
    </div>
  );
}

function ProgressIndicatorContainer() {
  return (
    <div className="grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full" data-name="Progress Indicator Container">
      <div className="bg-white/20 col-1 h-[6px] ml-0 mt-0 relative rounded-[10px] row-1 w-full" data-name="Total Progress" />
      <div className="bg-[#ff7048] col-1 h-[6px] ml-0 mt-0 relative rounded-[10px] row-1 w-[42.25%]" data-name="Completed Progress" />
    </div>
  );
}

function ProgressBar() {
  return (
    <div className="content-stretch flex flex-col h-[6px] items-start relative shrink-0 w-full" data-name="Progress Bar">
      <ProgressIndicatorContainer />
    </div>
  );
}

function ProgressBarContainer1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Progress Bar Container">
      <ProgressBar />
    </div>
  );
}

function ProgressBarContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-end min-w-px relative" data-name="Progress Bar Container">
      <ProgressBarContainer1 />
    </div>
  );
}

function ProgressInfo() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Progress Info">
      <ProgressBarContainer />
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal]">2/6</p>
      </div>
    </div>
  );
}

function StopsSummaryContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Stops Summary Container">
      <div aria-hidden className="absolute border-white/10 border-r border-solid inset-y-1 right-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c5c6cc] text-[12px] text-center w-full" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal]">Stops done</p>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white w-full" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal]">2/5</p>
      </div>
    </div>
  );
}

function RemainingStopsContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Remaining Stops Container">
      <div aria-hidden className="absolute border-white/10 border-r border-solid inset-y-1 right-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c5c6cc] text-[12px] text-center w-full" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal]">Remaining</p>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white w-full" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal]">18.4 mi</p>
      </div>
    </div>
  );
}

function EstimatedDoneContainer() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-center leading-[0] min-w-px not-italic relative text-center" data-name="Estimated Done Container">
      <div className="flex flex-col font-['Google_Sans_Flex',sans-serif] font-normal justify-center relative shrink-0 text-[#c5c6cc] text-[12px] w-full" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal]">Est. done</p>
      </div>
      <div className="flex flex-col font-['Google_Sans_Flex',sans-serif] font-semibold justify-center relative shrink-0 text-[18px] text-white w-full" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal]">04:30 PM</p>
      </div>
    </div>
  );
}

function StopsSummary() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full pt-2 border-t border-white/10" data-name="Stops Summary">
      <StopsSummaryContainer />
      <RemainingStopsContainer />
      <EstimatedDoneContainer />
    </div>
  );
}

function CurrentStopInfo() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="Current Stop Info">
      <CurrentStopDetailsContainer />
      <ProgressInfo />
      <StopsSummary />
      <div className="bg-[#ff7048] relative rounded-[16px] shrink-0 w-full active:scale-[0.98] transition-transform shadow-lg shadow-black/20" data-name="Button/Filled">
        <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[6px] items-center justify-center px-[30px] py-[15.5px] relative size-full">
            <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
              <p className="leading-[normal]">Continue Route</p>
            </div>
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon / Interface / Arrow Forward - Outline">
              <div className="absolute inset-[18.38%_18.44%_18.44%_16.67%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3833 10.1087">
                  <g id="Vector">
                    <mask fill="white" id="path-1-inside-1_2_2808">
                      <path d={svgPaths.p3417e480} />
                    </mask>
                    <path d={svgPaths.p16487160} fill="var(--stroke-0, white)" mask="url(#path-1-inside-1_2_2808)" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden className="absolute border border-[#faa087] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function CurrentStopContainer() {
  return (
    <div className="content-stretch drop-shadow-[0px_8px_20px_rgba(0,0,0,0.1)] flex items-start p-[16px] relative rounded-[24px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(226.972deg, rgb(73, 74, 80) 2.3104%, rgb(31, 32, 36) 100.9%)" }} data-name="Current Stop Container">
      <div aria-hidden className="absolute border-2 border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <CurrentStopInfo />
    </div>
  );
}

export default function ActiveRouteDetails() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative size-full" data-name="Active Route Details">
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex',sans-serif] font-semibold justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#2f3036] text-[16px] w-[min-content]" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal]">Active Route</p>
      </div>
      <CurrentStopContainer />
    </div>
  );
}
