import { useEffect, useRef } from "react";
import { useAppSelector } from "~/hooks/state";

export function FullscreenBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  const currentBackgroundUrl = useAppSelector((state) => state.settings.background.currentUrl);

  useEffect(() => {
    const listener = () => {
      if (document.fullscreenElement) {
        if (bgRef.current) {
          bgRef.current.style.display = "block";
        }
      } else {
        if (bgRef.current) {
          bgRef.current.style.display = "none";
        }
      }
    };
    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, [currentBackgroundUrl]);

  return (
    <div ref={bgRef} id="fullscreenGridBackground" />
  )
}