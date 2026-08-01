const Divider = ({ text = "OR CONTINUE WITH" }: { text?: string }) => {
  return (
    <div className="flex items-center gap-4 w-full my-6">
      <div className="flex-1 h-px bg-border" aria-hidden="true" />
      <span className="text-[11px] font-bold tracking-[0.14em] text-secondary-text uppercase">
        {text}
      </span>
      <div className="flex-1 h-px bg-border" aria-hidden="true" />
    </div>
  );
};

export default Divider;
