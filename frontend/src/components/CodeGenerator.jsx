import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Code } from 'lucide-react';
import { toast } from "sonner";

export default function CodeGenerator({ open, onOpenChange, config }) {
  const [copied, setCopied] = React.useState(false);

  const getScriptUrl = () => {
    const origin = window.location.origin + window.location.pathname;
    const baseUrl = origin.replace(/\/index\.html$/, '').replace(/\/$/, '');
    return `${baseUrl}/widget.js`;
  };

  const generateCode = () => {
    const totalPosts = config.feedType === 'fixed' ? 5 : (config.columns * config.rows);
    const scriptUrl = getScriptUrl();
    
    // Gera o link da fonte do Google se necessário
    let fontImport = '';
    let fontFamily = 'sans-serif';
    
    if (config.fontFamily && config.fontFamily !== 'custom') {
        fontFamily = `'${config.fontFamily}', sans-serif`;
        fontImport = `<link href="https://fonts.googleapis.com/css2?family=${config.fontFamily.replace(/ /g, '+')}:wght@${config.fontWeight}&display=swap" rel="stylesheet">`;
    } else if (config.fontFamily === 'custom' && config.customFontUrl) {
        // Se for URL de arquivo de fonte
        if (config.customFontUrl.includes('.')) {
            fontImport = `<style>@font-face { font-family: 'CustomFont'; src: url('${config.customFontUrl}'); }</style>`;
            fontFamily = "'CustomFont', sans-serif";
        } else {
            // Se for apenas nome de fonte já existente no site
            fontFamily = `'${config.customFontUrl}', sans-serif`;
        }
    }

    // Lógica de Alinhamento
    let containerAlign = '';
    if (config.alignment === 'center') containerAlign = 'margin: 0 auto;';
    if (config.alignment === 'end') containerAlign = 'margin-left: auto;';
    if (config.alignment === 'start') containerAlign = 'margin-right: auto;';

    // CSS Base
    const baseCss = `
  #instawix-feed { 
    display: grid; 
    width: 100%; 
    gap: ${config.gap}px;
    box-sizing: border-box;
    ${containerAlign}
  }
  .instawix-post { 
    width: 100%; 
    aspect-ratio: ${config.aspectRatio.replace('/', '/')}; 
    object-fit: cover; 
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: ${config.borderRadius}px;
  }
  .instawix-post img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
    display: block;
    border-radius: ${config.borderRadius}px;
  }
  .instawix-post:hover img {
    transform: scale(1.05);
  }
  /* Estilos da Legenda (Overlay) */
  .instawix-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-radius: ${config.borderRadius}px;
  }
  .instawix-post:hover .instawix-overlay {
    opacity: 1;
  }
  .instawix-caption {
    color: white;
    font-family: ${fontFamily};
    font-weight: ${config.fontWeight};
    font-size: 12px;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    line-height: 1.4;
  }
`;

    let layoutCss = '';
    
    if (config.feedType === 'fixed') {
        layoutCss = `
  @media (min-width: 768px) {
    #instawix-feed { grid-template-columns: repeat(5, 1fr); }
  }
  @media (max-width: 767px) {
    #instawix-feed { grid-template-columns: 1fr; }
  }
`;
    } else {
        layoutCss = `
  #instawix-feed { 
    grid-template-columns: repeat(${config.columns}, 1fr);
  }
  @media (max-width: 600px) {
    #instawix-feed { grid-template-columns: repeat(2, 1fr); } 
  }
`;
    }

    return `<!-- InstaWix Feed -->
${fontImport}
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
