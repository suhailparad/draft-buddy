interface AuthFooterProps {
  questionText: string;
  actionText: string;
  onAction: () => void;
}

const AuthFooter = ({ questionText, actionText, onAction }: AuthFooterProps) => {
  return (
    <p className="text-center text-[13px] text-secondary-text mt-6 md:mt-8 font-medium">
      {questionText}{" "}
      <button
        type="button"
        onClick={onAction}
        className="text-primary font-bold hover:text-primary-hover transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-1 py-0.5 -mx-1 -my-0.5"
        aria-label={actionText}
      >
        {actionText}
      </button>
    </p>
  );
};

export default AuthFooter;
