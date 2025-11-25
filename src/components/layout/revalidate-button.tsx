'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { revalidatePageByPath } from '@/app/actions';

const COOLDOWN = 60; // 60 seconds

export function RevalidateButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(COOLDOWN);
  const [prevIsPending, setPrevIsPending] = useState(false);

  // This effect detects when a refresh has finished and resets the countdown.
  useEffect(() => {
    if (prevIsPending && !isPending) {
      setCountdown(COOLDOWN);
    }
    setPrevIsPending(isPending);
  }, [isPending, prevIsPending]);

  // This effect handles the countdown and triggers the automatic refresh.
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Pause countdown if the tab is hidden or a refresh is in progress.
      if (document.hidden || isPending) {
        return;
      }

      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          // When countdown hits zero, just trigger the refresh.
          // The effect above will handle resetting the countdown when it's done.
          startTransition(() => {
            router.refresh();
          });
          return 0; // Keep countdown at 0 while refreshing.
        }
        // Otherwise, just decrement the timer.
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPending, router]);

  const handleClick = async () => {
    setIsDisabled(true);
    startTransition(async () => {
      await revalidatePageByPath(pathname);
      router.refresh();
    });

    // Cooldown to prevent spamming manual refresh.
    // The countdown reset is now handled by the useEffect above.
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };

  const getTooltipContent = () => {
    if (isPending) return 'Refreshing...';
    if (isDisabled) return `Cooldown...`;
    return `Auto-refresh in ${countdown}s. Click to refresh now.`;
  };

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            disabled={isPending || isDisabled}
          >
            <RefreshCw
              className={cn('h-4 w-4', {
                'animate-spin': isPending,
              })}
            />
            <span className="sr-only">Refresh Data</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
