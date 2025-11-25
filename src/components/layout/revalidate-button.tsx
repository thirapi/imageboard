"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COOLDOWN = 60; // 60 seconds

export function RevalidateButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(COOLDOWN);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsDisabled(true);
    setCountdown(COOLDOWN);
    startTransition(() => {
      router.refresh();
    });
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000); // 5-second spam prevention
  };

  useEffect(() => {
    if (countdown === 0) {
        setCountdown(COOLDOWN);
        // We don't trigger a refresh here because the server's `revalidate` handles it.
        // The countdown is purely a visual guide for the user.
    }
  }, [countdown]);

  const getTooltipContent = () => {
    if (isPending) return "Refreshing...";
    if (isDisabled) return `Cooldown...`;
    if (countdown > 0) return `Auto-refresh in ${countdown}s`;
    return "Ready to refresh";
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
              className={cn("h-4 w-4", {
                "animate-spin": isPending,
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
