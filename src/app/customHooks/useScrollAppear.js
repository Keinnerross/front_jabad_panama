// utils/scrollAppear.js
'use client';
import { useEffect } from 'react';

export function useScrollAppear(ref, onVisible, onHidden, delayThreshold = 0.3, delayMs = 0) {
  useEffect(() => {
    let timeoutId = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          if (entry.intersectionRatio > delayThreshold) {
            onVisible();
          } else if (entry.intersectionRatio === 0) {
            onHidden();
          }
        }, delayMs);
      },
      {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
      console.log('observing');
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, onVisible, onHidden, delayThreshold, delayMs]);
}
