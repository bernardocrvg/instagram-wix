import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Code } from 'lucide-react';
import { toast } from "sonner";

export default function CodeGenerator({ open, onOpenChange, config }) {
  const [copied, setCopied] = React.useState(false);

  const generateCode = () => {
    const totalPosts = config.feedType === 'fixed' ? 5 : (config.columns * config.rows);
    
    // CSS for Fixed Layout (Responsive)
    const fixedCss = `
  #instawix-feed { 
    display: grid; 
    width: 100%; 
    gap: ${config.gap}px;
  }
  /* Desktop: 5 columns */
  @media (min-width: 768px) {
    #instawix-feed { grid-template-columns: repeat(5, 1fr); }
  }
  /* Mobile: 1 column (stacked) */
  @media (max-width: 767px) {
    #instawix-feed { grid-template-columns: 1fr; }
  }
`;

    // CSS for Custom Layout (Grid)
    const customCss = `
  #instawix-feed { 
    display: grid; 
    width: 100%; 
    gap: ${config.gap}px;
    grid-template-columns: repeat(${config.columns}, 1fr);
  }
  /* Mobile adjustment for custom grid if needed */
  @media (max-width: 600px) {
    #instawix-feed { grid-template-columns: repeat(2, 1fr); } /* Fallback to 2 cols on mobile for dense grids */
  }
`;

    return `<!-- InstaWix Feed Widget (${config.feedType === 'fixed' ? 'Fixed Strip' : 'Custom Grid'}) -->
<div 
  id="instawix-feed" 
  data-user="${config.username}" 
  data-tag="${config.hashtag}" 
  data-limit="${totalPosts}"
  data-refresh="${config.refreshInterval}"
></div>
<script src="https://cdn.instawix.app/widget.js" async></script>
<style>
  ${config.feedType === 'fixed' ? fixedCss : customCss}
  .instawix-post { width: 100%; aspect-ratio: 1/1; object-fit: cover; }
</style>
<!-- End Widget -->`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Get Embed Code
          </DialogTitle>
          <DialogDescription>
            Copy this code and paste it into an HTML/Embed block on your Wix site.
            <br/>
            <span className="text-xs text-primary mt-1 inline-block">
              * Includes auto-update every {config.refreshInterval / 60} mins.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-4">
          <Textarea 
            className="min-h-[200px] font-mono text-xs bg-muted/50 resize-none p-4"
            readOnly
            value={generateCode()}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        <DialogFooter className="sm:justify-start">
          <div className="text-xs text-muted-foreground">
            Need help? <a href="#" className="text-primary hover:underline">Read our Wix integration guide</a>.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
