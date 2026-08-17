import { useNavigate } from 'react-router';
import { useState } from 'react';
import ShedLogoAnimation from './components/ShedLogoAnimation';

export default function Login() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  if (isLoggingIn) {
    return (
      <div className="w-full h-full bg-[#2B3B63] flex flex-col items-center justify-center p-6 relative font-['Google_Sans_Flex']">
        <ShedLogoAnimation />
        <p className="text-white/80 mt-6 font-bold text-[18px] animate-pulse">Syncing data...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#2B3B63] flex flex-col items-center justify-center p-6 relative font-['Google_Sans_Flex']">
      <div className="mb-12 flex flex-col items-center justify-center">
        <img src="/ShedPro.svg" alt="ShedPro Logo" className="w-[180px] h-auto invert brightness-0" />
        <span className="text-[#FF7048] text-[22px] font-bold mt-2 tracking-wide">Driver App</span>
      </div>
      
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
        
        <button onClick={handleLogin} className="w-full bg-[#FF7048] text-white font-bold text-[16px] py-4 rounded-[16px] mt-4 active:scale-95 transition-transform border-none cursor-pointer">
          Login
        </button>
        
        <div className="mt-8 pt-8 border-t border-white/20 flex flex-col items-center">
          <p className="text-white/70 text-sm mb-4">Or preview the application design</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-[#2B3B63] font-bold text-[16px] py-4 rounded-[16px] active:scale-95 transition-transform border-none cursor-pointer"
          >
            View Prototype
          </button>
        </div>
      </div>
    </div>
  );
}
