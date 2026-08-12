import { useNavigate } from 'react-router';
// We'll just use an img tag pointing to a generic ShedPro logo or use text if logo isn't easily imported this way.
// Actually, imgCompanyLogo is available in Home.tsx, we can import it.
import imgCompanyLogo from '../icon/Logo/Powered by ShedPro.svg';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full bg-[#2B3B63] flex flex-col items-center justify-center p-6 relative font-['Google_Sans_Flex']">
      <h1 className="text-white text-3xl font-bold mb-12 text-center tracking-tight">ShedPro<br/><span className="text-[#FF7048] text-xl">Driver App</span></h1>
      
      <div className="w-full max-w-sm flex flex-col gap-4">
        
        <input 
          type="text" 
          placeholder="Email or Username" 
          className="w-full bg-white/10 border border-white/20 rounded-[16px] px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-[#FF7048] text-base"
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full bg-white/10 border border-white/20 rounded-[16px] px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-[#FF7048] text-base"
        />
        
        <button className="w-full bg-[#FF7048] text-white font-bold text-[16px] py-4 rounded-[16px] mt-4 active:scale-95 transition-transform border-none cursor-pointer">
          Login
        </button>
        
        <div className="mt-8 pt-8 border-t border-white/20 flex flex-col items-center">
          <p className="text-white/70 text-sm mb-4">Or preview the application design</p>
          <button 
            onClick={() => navigate('/home')}
            className="w-full bg-white text-[#2B3B63] font-bold text-[16px] py-4 rounded-[16px] active:scale-95 transition-transform border-none cursor-pointer"
          >
            View Prototype
          </button>
        </div>
      </div>
    </div>
  );
}
