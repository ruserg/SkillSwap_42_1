import type { TUser } from "@/entities/user/types";
import { useEffect } from "react";

type ScrollSection = {
  popular: boolean;
  new: boolean;
};

interface UseInfinityScrollProps {
  triggerArray: TUser[];
  isSectionActive?: ScrollSection;
  scrollSection?: keyof ScrollSection;
  setCountState: (count: number | ((prev: number) => number)) => void;
  setSectionActive?: (updater: (prev: ScrollSection) => ScrollSection) => void;
  nextNumber: number;
  sentinelRef: React.RefObject<HTMLElement | null>;
  isWithoutToggle?: boolean;
  currentCount?: number;
}

export const useInfinityScroll = (props: UseInfinityScrollProps) => {
  const {
    triggerArray,
    isSectionActive,
    scrollSection,
    nextNumber = 3,
    setCountState,
    setSectionActive,
    sentinelRef,
    isWithoutToggle = false,
    currentCount = 0,
  } = props;

  useEffect(() => {
    if (triggerArray.length === 0) return;
    if (
      !isWithoutToggle &&
      (!scrollSection || !isSectionActive?.[scrollSection])
    )
      return;
    if (isWithoutToggle) if (currentCount >= triggerArray.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          setCountState((prevCount) => {
            const setNewCount = prevCount + nextNumber;
            if (setNewCount >= triggerArray.length) return triggerArray.length;
            return setNewCount;
          });
        });
      },
      {
        root: null,
        threshold: 0,
      },
    );

    const isElementInViewport = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    };

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);

      if (isElementInViewport(sentinelRef.current)) {
        setCountState((prevCount) => prevCount + nextNumber);
      }
    }

    return () => observer.disconnect();
  }, [
    triggerArray,
    isWithoutToggle
      ? currentCount
      : isSectionActive && scrollSection && isSectionActive?.[scrollSection],
  ]);

  const loadMoreList = () => {
    if (setSectionActive && scrollSection) {
      setSectionActive((prev) => ({
        ...prev,
        [scrollSection]: true,
      }));
    }
  };

  const hideMoreList = (count: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCountState(count);
    if (setSectionActive && scrollSection) {
      setSectionActive((prev) => ({
        ...prev,
        [scrollSection]: false,
      }));
    }
  };

  return {
    loadMoreList,
    hideMoreList,
  };
};
