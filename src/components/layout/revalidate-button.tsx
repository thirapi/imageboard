'use client';

import { useRouter } from 'next/navigation';
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
import { revalidateHomePage } from '@/app/actions'; // <-- 1. Import the new action

const COOLDOWN = 60; // 60 seconds

export function RevalidateButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(COOLDOWN);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : COOLDOWN));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. Updated handleClick function
  const handleClick = async () => {
    setIsDisabled(true);
    startTransition(async () => {
      // First, tell the server to invalidate the cache for the home page
      await revalidateHomePage();
      // Then, refresh the page to get the newly generated content
      router.refresh();
    });

    // Reset countdown and manage cooldown period
    setCountdown(COOLDOWN);
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000); // 5-second spam prevention
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
