"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Link2 } from "lucide-react";
import { useState } from "react";

export const CopyPost = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isHovering || isCopied}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={copyLinkToClipboard}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            <span className="sr-only">Copy link</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isCopied ? "Copied" : "Copy link"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
