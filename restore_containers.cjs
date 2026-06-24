const fs = require('fs');

let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

const missingContainers = `
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

`;

content = content.replace(/function MainContainer\(\{ stop \}: any\) \{/, missingContainers + '\nfunction MainContainer({ stop }: any) {');

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Containers restored');
