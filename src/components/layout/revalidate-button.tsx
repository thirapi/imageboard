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

  // This effect now handles both the countdown and the automatic refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.hidden) return; // Don't refresh if the tab is not visible

      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          // When countdown hits zero, trigger a refresh if one isn't already pending
          if (!isPending) {
            startTransition(() => {
              router.refresh();
            });
          }
          // Reset for the next cycle
          return COOLDOWN;
        }
        // Otherwise, just decrement the timer
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

    // Reset countdown and manage manual click cooldown
    setCountdown(COOLDOWN);
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
