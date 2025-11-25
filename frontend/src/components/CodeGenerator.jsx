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

  // Helper para converter Hex para RGBA
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  const generateCode = () => {
    const totalPosts = config.feedType === 'fixed' ? 5 : (config.columns * config.rows);
    const scriptUrl = getScriptUrl();
    
    // Gera imports de fontes (Deduplicado)
    const fontsToLoad = new Set();
    if (config.fontFamily && config.fontFamily !== 'custom') fontsToLoad.add(config.fontFamily);
    if (config.btnFontFamily && config.btnFontFamily !== 'custom') fontsToLoad.add(config.btnFontFamily);
    if (config.infoFontFamily && config.infoFontFamily !== 'custom') fontsToLoad.add(config.infoFontFamily);

    let fontImports = '';
    fontsToLoad.forEach(font => {
        fontImports += `<link href="https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n`;
    });

    if (config.fontFamily === 'custom' && config.customFontUrl && config.customFontUrl.includes('.')) {
        fontImports += `<style>@font-face { font-family: 'CustomFont'; src: url('${config.customFontUrl}'); }</style>\n`;
    }

    // Lógica de Alinhamento (CORRIGIDA)
    let wrapperStyle = `display: flex; width: 100%; justify-content: ${config.alignment};`;
    let gridWidth = config.alignment === 'center' ? 'width: fit-content; max-width: 100%;' : 'width: 100%;';

    // CSS Base
    const baseCss = `
  #instawix-wrapper {
    ${wrapperStyle}
  }
  #instawix-feed { 
    display: grid; 
    gap: ${config.gap}px;
    box-sizing: border-box;
    ${gridWidth}
  }
  .instawix-post { 
    width: 100%; 
    aspect-ratio: ${config.aspectRatio.replace('/', '/')}; 
    object-fit: cover; 
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: ${config.borderRadius}px;
    min-width: 50px;
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
    background: ${hexToRgba(config.overlayColor, config.overlayOpacity)};
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
    color: ${config.captionColor};
    font-family: ${config.fontFamily === 'custom' ? "'CustomFont', sans-serif" : `'${config.fontFamily}', sans-serif`};
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
  /* Estilos de Paginação */
  .instawix-nav {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
    grid-column: 1 / -1;
  }
  .instawix-btn {
    font-family: ${config.btnFontFamily === 'custom' ? 'sans-serif' : `'${config.btnFontFamily}', sans-serif`};
    font-weight: ${config.btnFontWeight};
    border-radius: ${config.btnRadius}px;
    border: 1px solid rgba(0,0,0,0.1);
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .instawix-btn:disabled {
    opacity: 0.5;
    cursor: default;
  }
  /* Botão Anterior */
  .instawix-prev {
    color: ${config.btnPrevTextColor};
    background-color: ${config.btnPrevBgColor};
  }
  .instawix-prev:not(:disabled):hover {
    color: ${config.btnNextTextColor};
    background-color: ${config.btnNextBgColor};
  }
  /* Botão Próximo */
  .instawix-next {
    color: ${config.btnNextTextColor};
    background-color: ${config.btnNextBgColor};
  }
  .instawix-next:not(:disabled):hover {
    color: ${config.btnPrevTextColor};
    background-color: ${config.btnPrevBgColor};
  }
  
  .instawix-info {
    color: ${config.infoTextColor};
    font-family: ${config.infoFontFamily === 'custom' ? 'sans-serif' : `'${config.infoFontFamily}', sans-serif`};
    font-weight: ${config.infoFontWeight};
    font-size: 14px;
    align-self: center;
  }
`;

    // CSS Específico por Tipo
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
  /* Desktop (Padrão escolhido) */
  #instawix-feed { 
    grid-template-columns: repeat(${config.columns}, 1fr);
  }
  
  /* Tablet (Máximo 3 colunas) */
  @media (max-width: 768px) {
    #instawix-feed { 
      grid-template-columns: repeat(${Math.min(config.columns, 3)}, 1fr); 
    } 
  }

  /* Mobile (Máximo 2 colunas) */
  @media (max-width: 480px) {
    #instawix-feed { 
      grid-template-columns: repeat(${Math.min(config.columns, 2)}, 1fr); 
    } 
  }
`;
    }

    // Script de Ajuste Dinâmico para Alinhamento
    const alignmentScript = `
    <script>
    (function() {
        function adjustAlignment() {
            const feed = document.getElementById('instawix-feed');
            if (!feed) return;
            const items = feed.querySelectorAll('.instawix-post').length;
            const cols = ${config.feedType === 'fixed' ? 5 : config.columns};
            
            if (items > 0 && items < cols) {
                feed.style.gridTemplateColumns = 'repeat(' + items + ', 1fr)';
                feed.style.width = 'fit-content';
            } else {
                feed.style.width = '100%';
                feed.style.removeProperty('grid-template-columns');
            }
        }
        setInterval(adjustAlignment, 500);
    })();
    </script>
    `;

    return `<!-- InstaWix Feed -->
${fontImports}
<div id="instawix-wrapper">
  <div 
    id="instawix-feed" 
    data-user="${config.username}" 
    data-tag="${config.hashtag}" 
    data-limit="${config.feedType === 'paginated' ? 100 : totalPosts}"
    data-type="${config.feedType}"
    data-per-page="${config.itemsPerPage || 12}"
    data-gap="${config.gap}"
  ></div>
</div>
<script src="${scriptUrl}" async></script>
${alignmentScript}
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
