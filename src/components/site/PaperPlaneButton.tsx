import { type ReactNode, useEffect, useState } from "react";
import { Loader2, CheckCircle2, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaperPlaneButtonProps {
  type?: "submit" | "button" | undefined;
  disabled?: boolean | undefined;
  isSubmitting?: boolean | undefined;
  isSuccess?: boolean | undefined;
  idleText?: string | undefined;
  submittingText?: string | undefined;
  successText?: string | undefined;
  className?: string | undefined;
  icon?: ReactNode | undefined;
  onClick?: () => void;
}

export function PaperPlaneButton({
  type = "submit",
  disabled = false,
  isSubmitting = false,
  isSuccess = false,
  idleText = "Submit Guidance Request",
  submittingText = "Submitting Enquiry…",
  successText = "Submitted Successfully",
  className,
  icon,
  onClick,
}: PaperPlaneButtonProps) {
  const [showFlyingPlane, setShowFlyingPlane] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowFlyingPlane(true);
      const timer = setTimeout(() => {
        setShowFlyingPlane(false);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setShowFlyingPlane(false);
    }
  }, [isSuccess]);

  return (
    <div className="relative inline-block w-full">
      {/* Flying paper plane animation (ONLY triggered after confirmed backend success) */}
      {showFlyingPlane && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 animate-paper-plane"
        >
          <svg
            className="h-7 w-7 text-[#B47A4B] drop-shadow-md"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      )}

      <button
        type={type}
        disabled={disabled || isSubmitting || isSuccess}
        onClick={onClick}
        className={cn(
          "relative w-full h-12 rounded-xl text-white font-semibold text-[15px] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer select-none",
          isSuccess
            ? "bg-[#243B35] text-white"
            : isSubmitting
              ? "bg-[#243B35]/85 text-white/90"
              : "bg-[#243B35] hover:bg-[#1A2C27] active:scale-[0.99]",
          (disabled || isSubmitting) && "opacity-70 cursor-not-allowed",
          className,
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            <span>{submittingText}</span>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-[#9AAB94] animate-in zoom-in-75 duration-200" />
            <span className="text-[#FAF9F5]">{successText}</span>
          </>
        ) : (
          <>
            <span>{idleText}</span>
            {icon ? icon : <SendHorizontal className="h-4 w-4 ml-1" />}
          </>
        )}
      </button>
    </div>
  );
}

