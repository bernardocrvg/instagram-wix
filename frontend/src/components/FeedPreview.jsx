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

  // Lógica de Grid e Alinhamento
  const numColumns = config.feedType === 'fixed' ? 5 : config.columns;
  
  // O container do grid ocupa 100% da largura
  // O justify-content alinha os itens dentro dele se sobrarem espaços
  const gridStyle = {
    display: 'grid',
    width: '100%',
    gap: `${config.gap}px`,
    // Define colunas fixas baseadas na porcentagem total dividida pelo número de colunas
    // Isso garante que cada item tenha o tamanho "certo" de 1/N do container
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`, 
    
    // Se tiver menos itens que colunas, o grid normal esticaria ou deixaria buraco.
    // Para alinhar, precisamos que o grid não ocupe 100% se tiver poucos itens?
    // NÃO. O grid deve ocupar 100%.
    // Se quisermos alinhar os itens SOBRANTES (ex: 3 itens num grid de 5),
    // Grid padrão alinha à esquerda (start).
    
    // TRUQUE: Se quisermos centralizar um grid que tem menos itens que colunas,
    // precisamos restringir a largura do container do grid.
  };

  // Wrapper para alinhar o grid em si quando ele for menor que a tela
  const wrapperStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: config.alignment, // start, center, end
  };

  // Se o número de posts for menor que o número de colunas,
  // o grid deve encolher para respeitar o alinhamento.
  // Caso contrário, ele ocupa 100%.
  const actualColumns = Math.min(displayPosts.length || numColumns, numColumns);
  
  // Estilo final do Grid
  const finalGridStyle = {
    ...gridStyle,
    // Se tivermos menos posts que colunas, forçamos o grid a ter apenas essas colunas
    // para que ele não ocupe 100% e possa ser alinhado pelo wrapper
    gridTemplateColumns: `repeat(${actualColumns}, 1fr)`,
    // Largura máxima baseada na proporção (opcional, mas ajuda no visual)
    maxWidth: displayPosts.length < numColumns ? `${(displayPosts.length / numColumns) * 100}%` : '100%',
    // Se for 100%, o maxWidth não atrapalha. Se for menos, ele encolhe e o wrapper alinha.
    // Mas espere! Se usarmos 1fr, ele vai tentar ocupar o espaço disponível.
    // A melhor abordagem para alinhamento de "poucos itens" é usar flex no wrapper e largura fixa/max-content no grid.
    
    // CORREÇÃO DEFINITIVA:
    // Vamos manter o grid com o número de colunas CONFIGURADO.
    // Mas se tivermos menos itens, eles vão ficar à esquerda (padrão do grid).
    // O usuário quer que o BLOCO de itens fique centralizado.
    // Então se são 5 colunas e tem 3 itens, os 3 itens devem ficar no meio?
    // OU o grid deve ter 3 colunas?
    
    // Interpretação: "Caso tenha menos de 5, é necessário respeitar o alinhamento escolhido."
    // Isso significa que se eu escolhi CENTRO e tenho 3 itens (num grid de 5),
    // os 3 itens devem ficar centralizados na tela.
    
    // Para isso funcionar, o grid precisa ter `grid-template-columns: repeat(3, 1fr)` (dinâmico)
    // E o wrapper alinha esse grid menor.
    gridTemplateColumns: `repeat(${actualColumns}, 1fr)`,
    width: displayPosts.length < numColumns ? 'auto' : '100%',
    // Adicionamos min-width para garantir que não fique minúsculo
    minWidth: displayPosts.length < numColumns ? 'fit-content' : '100%'
  };

  // Se estiver carregando, usamos o número total de colunas para o esqueleto
  if (isLoading) {
      finalGridStyle.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
      finalGridStyle.width = '100%';
  }

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
                    <div style={finalGridStyle}>
                    {isLoading ? (
                        Array(config.feedType === 'fixed' ? 5 : (config.columns * (config.rows || 2))).fill(null).map((_, i) => (
                            <Skeleton 
                                key={`skeleton-${i}`} 
                                className="w-full" 
                                style={{ 
                                    aspectRatio: config.aspectRatio,
                                    borderRadius: `${config.borderRadius}px`,
                                    minWidth: '50px'
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
