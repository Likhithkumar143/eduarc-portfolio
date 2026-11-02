import { useState, useRef, useEffect, type CSSProperties } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number | string | undefined;
  height?: number | string | undefined;
  className?: string | undefined;
  imgClassName?: string | undefined;
  priority?: boolean | undefined;
  aspectRatio?: string | undefined;
  placeholderSrc?: string | undefined;
  sizes?: string | undefined;
  srcSet?: string | undefined;
  style?: CSSProperties | undefined;
  onLoad?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  priority = false,
  aspectRatio,
  placeholderSrc,
  sizes,
  srcSet,
  style,
  onLoad,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the browser already has the image cached, mark loaded immediately
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  const containerStyle: CSSProperties = {
    ...style,
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-hairline bg-[#FAF9F5] p-6 text-center text-muted-foreground shadow-2xs",
          className,
        )}
        style={containerStyle}
      >
        <ImageOff className="h-7 w-7 text-muted-foreground/50 mb-2" />
        <span className="text-xs font-medium text-slate-500 line-clamp-2">
          {alt || "Image preview unavailable"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden bg-[#E8E0D1]/20 isolate", className)}
      style={containerStyle}
    >
      {/* LQIP Placeholder preview / shimmer while loading */}
      {!isLoaded && (
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          {placeholderSrc ? (
            <img
              src={placeholderSrc}
              alt=""
              className="h-full w-full object-cover filter blur-md scale-110 opacity-70"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-tr from-[#E8E0D1]/30 via-[#9AAB94]/15 to-[#243B35]/10 animate-pulse" />
          )}
        </div>
      )}

      {/* High-resolution progressive image with blur-up transition */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        sizes={sizes}
        srcSet={srcSet}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "progressive-img block h-full w-full object-cover",
          priority && "progressive-img-priority",
          isLoaded ? "progressive-img-loaded" : "progressive-img-loading",
          imgClassName,
        )}
      />
    </div>
  );
}
