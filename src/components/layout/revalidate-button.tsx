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

  useEffect(() => {
    if (prevIsPending && !isPending) {
      setCountdown(COOLDOWN);
    }
    setPrevIsPending(isPending);
  }, [isPending, prevIsPending]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.hidden || isPending) {
        return;
      }

      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          // This now mirrors the manual click logic to ensure a fresh fetch.
          startTransition(async () => {
            await revalidatePageByPath(pathname); // Forcefully invalidate the server cache
            router.refresh(); // Then fetch the new, non-cached page
          });
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
    // Added pathname to the dependency array as it's used in the effect.
  }, [isPending, router, pathname]);

  const handleClick = async () => {
    setIsDisabled(true);
    startTransition(async () => {
      await revalidatePageByPath(pathname);
      router.refresh();
    });

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
