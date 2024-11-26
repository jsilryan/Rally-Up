import { useEffect, useState, RefObject } from "react";

export function useIsVisible(ref: RefObject<Element>): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });

    observer.observe(ref.current);

    // Clean up the observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
