export default function ShedLogoAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 100 100" 
        fill="none" 
        stroke="#FF7048" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-[dash_2s_ease-in-out_infinite]"
      >
        <path 
          d="M 15 90 L 85 90 L 85 40 L 50 15 L 15 40 Z" 
          strokeDasharray="300"
          strokeDashoffset="300"
        />
      </svg>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          0% {
            stroke-dashoffset: 300;
            fill: transparent;
          }
          50% {
            stroke-dashoffset: 0;
            fill: transparent;
          }
          70% {
            fill: #FF7048;
          }
          100% {
            stroke-dashoffset: 0;
            fill: #FF7048;
          }
        }
      `}} />
    </div>
  );
}
