import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Code } from 'lucide-react';
import { toast } from "sonner";

export default function CodeGenerator({ open, onOpenChange, config }) {
  const [copied, setCopied] = React.useState(false);

  // Detecta a URL base atual para gerar o link correto do script
  const getScriptUrl = () => {
    // Em desenvolvimento local, usa placeholder. Em produção, usa a URL real.
    const origin = window.location.origin + window.location.pathname;
    // Remove 'index.html' ou barra final se houver
    const baseUrl = origin.replace(/\/index\.html$/, '').replace(/\/$/, '');
    return `${baseUrl}/widget.js`;
  };

  const generateCode = () => {
    const totalPosts = config.feedType === 'fixed' ? 5 : (config.columns * config.rows);
    const scriptUrl = getScriptUrl();
    
    // CSS Base
    const baseCss = `
  #instawix-feed { 
    display: grid; 
    width: 100%; 
    gap: ${config.gap}px;
    box-sizing: border-box;
  }
  .instawix-post { 
    width: 100%; 
    aspect-ratio: ${config.aspectRatio.replace('/', '/')}; 
    object-fit: cover; 
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: 4px; /* Opcional: borda arredondada */
  }
  .instawix-post img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
    display: block;
  }
  .instawix-post:hover img {
    transform: scale(1.05);
  }
`;

    // CSS Específico por Tipo
    let layoutCss = '';
    
    if (config.feedType === 'fixed') {
        layoutCss = `
  /* Desktop: 5 colunas */
  @media (min-width: 768px) {
    #instawix-feed { grid-template-columns: repeat(5, 1fr); }
  }
  /* Mobile: 1 coluna */
  @media (max-width: 767px) {
    #instawix-feed { grid-template-columns: 1fr; }
  }
`;
    } else {
        layoutCss = `
  #instawix-feed { 
    grid-template-columns: repeat(${config.columns}, 1fr);
  }
  /* Mobile: Ajuste para 2 colunas se for grade muito densa */
  @media (max-width: 600px) {
    #instawix-feed { grid-template-columns: repeat(2, 1fr); } 
  }
`;
    }

    return `<!-- InstaWix Feed -->
<div 
  id="instawix-feed" 
  data-user="${config.username}" 
  data-tag="${config.hashtag}" 
  data-limit="${config.feedType === 'paginated' ? 100 : totalPosts}"
  data-type="${config.feedType}"
  data-per-page="${config.itemsPerPage || 12}"
  data-gap="${config.gap}"
></div>
<script src="${scriptUrl}" async></script>
<style>
  ${baseCss}
  ${layoutCss}
</style>
<!-- Fim do Widget -->`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Copiar Código de Incorporação
          </DialogTitle>
          <DialogDescription>
            Copie este código e cole em um bloco HTML/Embed no seu site Wix.
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
            O script será carregado de: <br/>
            <code className="bg-muted px-1 py-0.5 rounded">{getScriptUrl()}</code>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
