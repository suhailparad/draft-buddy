export default function SplashScreen() {

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
            <div className="w-[88px] h-22 md:w-24 md:h-24 rounded-[28px] md:rounded-[30px] bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
            <LogoMark />
            </div>
        </div>
    );

  return (
    <div className="fixed  inset-0 flex items-center justify-center bg-emerald-200/20">
      <div className="flex flex-col items-center">
        <div className="mt-10 md:mt-12 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-[28px] bg-emerald-600/30" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-full">
                <LogoIcon />
                </div>
            </div>
        </div>

        <h1 className="mt-6 md:mt-7 text-3xl md:text-5xl font-bold tracking-tight">
          <span className="text-primary">Draft</span>
          <span className="text-primary-text ml-0.5">Buddy</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-[13px] text-slate-400">
          Loading your buddy...
        </p>

      </div>
      <div className="absolute bottom-4 text-[13px] text-slate-400">Version 0.0.1</div>
    </div>
  );
}