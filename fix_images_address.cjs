const fs = require('fs');

let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// 1. Re-add BuildingImagesContainer
const imagesCode = `
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
`;

// Insert BuildingImagesContainer before MainContainer
content = content.replace(/function MainContainer\(\{ stop \}: any\) \{/, imagesCode + '\nfunction MainContainer({ stop }: any) {');

// Add BuildingImagesContainer call into BuildingDetailsContainer
content = content.replace(
  /<\/div>\n    <\/div>\n  \);\n\}\n\nfunction CustomerInfoContainer/,
  `    </div>\n      <BuildingImagesContainer />\n    </div>\n  );\n}\n\nfunction CustomerInfoContainer`
);

// 2. Fix AddressContainer to put badge side-by-side with Address
const oldAddressRegex = /function AddressContainer\(\{ stop \}: any\) \{[\s\S]*?\}\n\nfunction StopStatusContainer/;
const newAddress = `function AddressContainer({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Address Container">
      <div className="flex flex-row items-center gap-[12px] font-['Google_Sans_Flex'] w-full">
        <div className={"px-[8px] py-[3px] rounded-[6px] text-[12px] font-medium shrink-0 font-['Google_Sans_Flex'] border " + (stop.status === 'Done' ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" : stop.status === 'Servicing' ? "bg-[rgba(59,130,246,0.2)] text-[#3b82f6] border-[#3b82f6]" : "bg-[#FFF5E5] text-[#F59E0B] border-[#FDE68A]")}>
          {stop.status === 'Done' ? 'Completed' : stop.status === 'Servicing' ? 'Arrived' : 'Pending'}
        </div>
        <div className="[word-break:break-word] font-semibold leading-[normal] not-italic shrink-0 text-[#2f3036] text-[30px] truncate">
          {stop.address}
        </div>
      </div>
      <StopStatusContainer stop={stop} />
    </div>
  );
}

function StopStatusContainer`;

content = content.replace(oldAddressRegex, newAddress);

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Images and Address fixed');
