import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Code } from 'lucide-react';
import { toast } from "sonner";

export default function CodeGenerator({ open, onOpenChange, config }) {
  const [copied, setCopied] = React.useState(false);

  const generateCode = () => {
    return `<!-- InstaWix Feed Widget -->
<div id="instawix-feed" data-user="${config.username}" data-tag="${config.hashtag}" data-cols="${config.columns}" data-gap="${config.gap}"></div>
<script src="https://cdn.instawix.app/widget.js" async></script>
<style>
  #instawix-feed { width: 100%; display: grid; grid-template-columns: repeat(${config.columns}, 1fr); gap: ${config.gap}px; }
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Get Embed Code
          </DialogTitle>
          <DialogDescription>
            Copy this code and paste it into an HTML/Embed block on your Wix site.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-4">
          <Textarea 
            className="min-h-[150px] font-mono text-xs bg-muted/50 resize-none p-4"
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
