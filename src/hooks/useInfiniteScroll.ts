import { useEffect, useRef, RefObject } from 'react';

interface UseInfiniteScrollOptions {
  /**
   * 더 불러올 데이터가 있는지 여부
   */
  hasMore: boolean;
  /**
   * 현재 로딩 중인지 여부
   */
  isLoading: boolean;
  /**
   * 스크롤이 하단에 도달했을 때 호출할 콜백 함수
   */
  onLoadMore: () => void;
  /**
   * Intersection Observer의 threshold 값 (0~1)
   * 기본값: 0.1 (요소가 10% 보이면 트리거)
   */
  threshold?: number;
  /**
   * Intersection Observer의 rootMargin 값
   * 기본값: '100px' (요소가 뷰포트에서 100px 전에 트리거)
   */
  rootMargin?: string;
}

/**
 * 무한 스크롤을 위한 커스텀 훅
 * Intersection Observer API를 사용하여 하단 요소 감지
 *
 * @example
 * ```tsx
 * const observerRef = useInfiniteScroll({
 *   hasMore: currentPage < totalPages,
 *   isLoading: isLoadingMore,
 *   onLoadMore: () => setCurrentPage(prev => prev + 1),
 * });
 *
 * return (
 *   <>
 *     <div>목록...</div>
 *     <div ref={observerRef} style={{ height: '20px' }} />
 *   </>
 * );
 * ```
 */
export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions): RefObject<HTMLDivElement> => {
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 더 불러올 데이터가 없거나 로딩 중이면 Observer 생성하지 않음
    if (!hasMore || isLoading) {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
        observerInstanceRef.current = null;
      }
      return;
    }

    // Intersection Observer 생성
    observerInstanceRef.current = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        // 요소가 뷰포트에 보이고, 로딩 중이 아니며, 더 불러올 데이터가 있을 때
        if (entry.isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // 요소 관찰 시작
    if (observerRef.current && observerInstanceRef.current) {
      observerInstanceRef.current.observe(observerRef.current);
    }

    // cleanup: 컴포넌트 언마운트 시 Observer 해제
    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
        observerInstanceRef.current = null;
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin]);

  return observerRef;
};
