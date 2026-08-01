const LogoMark = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M19.5 42C17.8431 42 16.5 40.6569 16.5 39V38H13.5C10.1863 38 7.5 35.3137 7.5 32V13C7.5 9.68629 10.1863 7 13.5 7H34.5C37.8137 7 40.5 9.68629 40.5 13V32C40.5 35.3137 37.8137 38 34.5 38H24.75L22.125 41.25C21.2452 42.3685 19.9199 43.0048 18.5 43H19.5Z"
      fill="white"
    />
    <line x1="16.5" y1="18" x2="31.5" y2="18" stroke="#0F766E" strokeWidth="2.4" strokeLinecap="round"/>
    <line x1="16.5" y1="24.5" x2="27" y2="24.5" stroke="#0F766E" strokeWidth="2.4" strokeLinecap="round"/>
    <circle cx="13.5" cy="31" r="1.5" fill="#0F766E"/>
  </svg>
);

const LogoIcon = () => (
  <div className="relative">
    <div className="w-[88px] h-[88px] md:w-[96px md:h-[96px] rounded-[28px] md:rounded-[30px] bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
      <LogoMark />
    </div>
  </div>
);

const BigChatBubble3D = () => (
  <div className="relative" aria-hidden="true">
    <svg
      width="120"
      // height="170"
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-2xl"
    >
      <defs>
        <linearGradient id="bubbleTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#BBF7D0" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>
        <linearGradient id="bubbleSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="bubbleBottom" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g transform="rotate(-6 110 90) skewX(-6) skewY(-2)">
        <rect x="30" y="20" width="160" height="112" rx="32" fill="url(#bubbleTop)" />
        <rect x="30" y="122" width="160" height="18" rx="10" fill="url(#bubbleBottom)" opacity="0.9" />
        <path d="M60 138 L75 158 L92 138" fill="url(#bubbleSide)" opacity="0.7" />
        <circle cx="70" cy="60" r="7" fill="#0F766E" opacity="0.55" />
        <rect x="90" y="55" width="72" height="9" rx="4.5" fill="#0F766E" opacity="0.5" />
        <rect x="90" y="75" width="88" height="9" rx="4.5" fill="#0F766E" opacity="0.42" />
        <rect x="90" y="95" width="56" height="9" rx="4.5" fill="#0F766E" opacity="0.35" />
      </g>
    </svg>
  </div>
);

const HeartChatBubble = () => (
  <svg
    width="62"
    height="56"
    viewBox="0 0 62 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M8 8H44C48.4183 8 52 11.5817 52 16V36C52 40.4183 48.4183 44 44 44H30L20 54V44H8C3.58172 44 0 40.4183 0 36V16C0 11.5817 3.58172 8 8 8Z"
      stroke="#0F766E"
      strokeOpacity="0.55"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="white"
      fillOpacity="0.55"
    />
    <path
      d="M17 17C15.674 16.9996 15.3627 17.1304 15.1161 17.3728C14.8695 17.6152 14.7193 17.9432 14.6983 18.286C14.6772 18.6288 14.7868 18.9612 15.004 19.216L20.0727 25.0358L25.1379 19.216C25.3728 18.9559 25.5017 18.6158 25.5008 18.2645C25.4999 17.9132 25.3691 17.5762 25.1325 17.3236C24.8959 17.071 24.5782 16.9282 24.2487 16.9289C23.9192 16.9297 23.6062 17.0757 23.3894 17.3355C23.1727 17.5953 23.0776 17.9422 23.1306 18.282L23.1415 18.45L22.0801 19.6668C22.0501 19.7009 22.0122 19.7301 21.9685 19.7525C21.9247 19.7749 21.8768 19.7898 21.8281 19.796L20.1792 19.995L20.0858 20.0049L20.0739 19.9964L20.062 19.9878L19.9786 19.9519L19.8952 19.9159L19.8917 19.9072L19.8641 19.8344C19.8366 19.7617 19.7873 19.7078 19.7255 19.6726C19.6636 19.6373 19.5929 19.6227 19.5221 19.6313L18.0552 19.7761L17.0159 18.5882C16.9774 18.5471 16.9469 18.4959 16.9274 18.4382C16.9079 18.3805 16.9002 18.3179 16.9052 18.2554C16.9101 18.193 16.9275 18.1329 16.9559 18.081C16.9843 18.0291 17.0228 17.988 17.068 17.9611C17.1132 17.9342 17.1637 17.9226 17.2135 17.9281L17 18Z"
      fill="#0F766E"
      fillOpacity="0.65"
    />
  </svg>
);

const Sparkle1 = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M11 2L12.7 8.3L19 10L12.7 11.7L11 18L9.3 11.7L3 10L9.3 8.3L11 2Z" fill="#0F766E" fillOpacity="0.55" />
  </svg>
);

const Sparkle2 = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="6" cy="6" r="2.5" fill="#0F766E" fillOpacity="0.4" />
  </svg>
);

const PaperPlane = () => (
  <svg width="70" height="56" viewBox="0 0 70 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M10 48L58 8L44 30L58 8L42 46L32 34L10 48Z"
      stroke="#0F766E"
      strokeOpacity="0.45"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray="4 4"
    />
    <path
      d="M10 48L32 34"
      stroke="#0F766E"
      strokeOpacity="0.6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const Dot = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="4" cy="4" r="3" fill="#0F766E" fillOpacity="0.35" />
  </svg>
);

interface AuthHeroProps {
  showIllustration?: boolean;
}

const AuthHero = ({ showIllustration = true }: AuthHeroProps) => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-green-50/40 to-background">
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[520px] h-[420px] rounded-full bg-primary/8 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 -right-20 w-72 h-72 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative pt-safe px-6 md:px-8 md:pb-8 flex flex-col items-center">
        <div className="mt-10 md:mt-12 animate-fade-in">
          <LogoIcon />
        </div>

        <h1 className="mt-6 md:mt-7 text-3xl md:text-5xl font-bold tracking-tight animate-fade-in fade-in-delay-1">
          <span className="text-primary">Draft</span>
          <span className="text-primary-text">Buddy</span>
        </h1>

        <p className="mt-1 md:mt-4 text-[12px] md:text-2xl text-secondary-text font-medium animate-fade-in fade-in-delay-2">
          Text yourself. <span className="font-semibold text-primary">Save anything.</span>
        </p>

        {showIllustration && (
          <div className="relative w-full max-w-sm h-[150px] md:h-[200px] mt-4 md:mt-6 flex items-center justify-center animate-fade-in fade-in-delay-3">
            <div className="absolute top-2 left-2 md:left-0 animate-float-1">
              <HeartChatBubble />
            </div>
            <div className="relative z-10 animate-float-2">
              <BigChatBubble3D />
            </div>
            <div className="absolute top-6 right-2 md:right-2 animate-float-3">
              <Sparkle1 />
            </div>
            <div className="absolute bottom-14 left-10 md:left-16 animate-float-1" style={{ animationDelay: "0.6s" }}>
              <Sparkle2 />
            </div>
            <div className="absolute top-20 right-10 md:right-16 animate-float-2" style={{ animationDelay: "0.4s" }}>
              <Dot />
            </div>
            <div className="absolute bottom-4 right-0 md:right-4 animate-float-3" style={{ animationDelay: "0.8s" }}>
              <PaperPlane />
            </div>
            <div className="absolute bottom-20 right-28 md:right-40 animate-float-1" style={{ animationDelay: "1s" }}>
              <Sparkle2 className="w-2 h-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthHero;
