import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Helper para converter Hex para RGBA
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
};

export default function FeedPreview({ config, isLoading, posts }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when config changes
  useEffect(() => {
    setCurrentPage(1);
  }, [config.feedType, config.hashtag]);

  // Carrega a fonte do Google dinamicamente para o preview
  useEffect(() => {
    if (config.fontFamily && config.fontFamily !== 'custom') {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${config.fontFamily.replace(/ /g, '+')}:wght@${config.fontWeight}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }
  }, [config.fontFamily, config.fontWeight]);

  // Calculate limits
  let displayPosts = [];
  let totalPages = 1;

  if (config.feedType === 'fixed') {
    displayPosts = posts.slice(0, 5);
  } else if (config.feedType === 'custom') {
    const limit = config.columns * config.rows;
    displayPosts = posts.slice(0, limit);
  } else if (config.feedType === 'paginated') {
    const limit = config.itemsPerPage || 9;
    totalPages = Math.ceil(posts.length / limit);
    const start = (currentPage - 1) * limit;
    displayPosts = posts.slice(start, start + limit);
  }

  // Estilo do container para alinhamento
  // CORREÇÃO: Usando margin auto para centralizar o bloco inteiro
  const wrapperStyle = {
    display: 'flex',
    justifyContent: config.alignment, // 'start', 'center', 'end'
    width: '100%'
  };

  const gridStyle = {
    display: 'grid',
    gap: `${config.gap}px`,
    gridTemplateColumns: config.feedType === 'fixed' 
        ? `repeat(5, 1fr)` 
        : `repeat(${config.columns}, 1fr)`,
    // Se não for 100% de largura, o alinhamento funciona melhor
    width: config.alignment === 'center' ? 'fit-content' : '100%',
    maxWidth: '100%'
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-10 bg-muted/50 border-b flex items-center px-4 gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
          <span>Pré-visualização</span>
          <span className="text-muted-foreground/50">|</span>
          <span className="font-normal">@{config.username || 'usuario'}</span>
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col">
        {displayPosts.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center flex-1">
                <p>Nenhum post encontrado.</p>
                {config.hashtag && <p className="text-xs mt-2">Tente remover o filtro de hashtag.</p>}
            </div>
        ) : (
            <div className="flex-1 w-full">
                <div style={wrapperStyle}>
                    <div style={gridStyle}>
                    {isLoading ? (
                        Array(config.feedType === 'fixed' ? 5 : (config.columns * (config.rows || 2))).fill(null).map((_, i) => (
                            <Skeleton 
                                key={`skeleton-${i}`} 
                                className="w-full" 
                                style={{ 
                                    aspectRatio: config.aspectRatio,
                                    borderRadius: `${config.borderRadius}px`,
                                    minWidth: '50px' // Evita colapso
                                }}
                            />
                        ))
                    ) : (
                        displayPosts.map((post, idx) => (
                            <a 
                                key={`${post.id}-${idx}`} 
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-muted overflow-hidden cursor-pointer animate-in fade-in zoom-in duration-500 block"
                                style={{ 
                                    animationDelay: `${idx * 50}ms`,
                                    aspectRatio: config.aspectRatio,
                                    borderRadius: `${config.borderRadius}px`,
                                    minWidth: '50px'
                                }}
                            >
                            <img 
                                src={post.imageUrl} 
                                alt={post.caption} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4"
                                style={{
                                    backgroundColor: hexToRgba(config.overlayColor, config.overlayOpacity)
                                }}
                            >
                                {config.showCaptions && (
                                <p 
                                    className="text-xs text-center line-clamp-3 mt-2 font-medium"
                                    style={{
                                        fontFamily: config.fontFamily === 'custom' ? 'inherit' : config.fontFamily,
                                        fontWeight: config.fontWeight,
                                        color: config.captionColor
                                    }}
                                >
                                    {post.caption}
                                </p>
                                )}
                            </div>
                            </a>
                        ))
                    )}
                    </div>
                </div>
            </div>
        )}
        
        {/* Paginação */}
        {config.feedType === 'paginated' && totalPages > 1 && !isLoading && (
            <div className="mt-6 flex items-center justify-center gap-4 pt-4 border-t">
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                </span>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    Próximo <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
