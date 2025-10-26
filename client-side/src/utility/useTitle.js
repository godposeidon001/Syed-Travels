import { useEffect, useRef } from "react";

export default function useTitle(title, { suffix = "Travel Explorer", keepPrevOnEmpty = true } = {}) {
  const prevTitleRef = useRef(typeof document !== "undefined" ? document.title : "");

  useEffect(() => {
    if (typeof document === "undefined") return;

    const prev = document.title;
    prevTitleRef.current = prev;

    const safe = (t) => (t && String(t).trim()) || (keepPrevOnEmpty ? prev : "");
    const next = safe(title);
    document.title = next ? (suffix ? `${next} | ${suffix}` : next) : prev;

    
    return () => {
      document.title = prevTitleRef.current || prev;
    };
  }, [title, suffix, keepPrevOnEmpty]);
}
