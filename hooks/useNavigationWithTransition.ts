"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";

interface UseNavigationWithTransitionOptions {
  onBeforeNavigation?: () => void;
  onAfterNavigation?: () => void;
}

/**
 * A hook that provides navigation with a loading state using React's useTransition
 *
 * @example
 * const { navigate, isNavigating } = useNavigationWithTransition();
 *
 * return (
 *   <button
 *     onClick={() => navigate('/dashboard')}
 *     disabled={isNavigating}
 *   >
 *     {isNavigating ? 'Loading...' : 'Go to Dashboard'}
 *   </button>
 * );
 */
export function useNavigationWithTransition(
  options: UseNavigationWithTransitionOptions = {}
) {
  const { onBeforeNavigation, onAfterNavigation } = options;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (href: string) => {
      if (onBeforeNavigation) {
        onBeforeNavigation();
      }

      startTransition(() => {
        router.push(href);

        if (onAfterNavigation) {
          // This will run after the transition has started, but not necessarily when
          // the page has fully loaded
          onAfterNavigation();
        }
      });
    },
    [router, onBeforeNavigation, onAfterNavigation]
  );

  return {
    navigate,
    isNavigating: isPending,
  };
}

export default useNavigationWithTransition;
