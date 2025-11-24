import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedPreview({ config, isLoading, posts }) {
  // Calculate total posts based on type
  const limit = config.feedType === 'fixed' 
    ? 5 
    : (config.columns * config.rows);

  // Use the passed posts (real or mock) and slice to limit
  const displayPosts = posts.slice(0, limit);

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
      {/* Browser Mock Header */}
      <div className="h-10 bg-muted/50 border-b flex items-center px-4 gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
          <span>Preview Mode</span>
          <span className="text-muted-foreground/50">|</span>
          <span className="font-normal">@{config.username || 'username'}</span>
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {displayPosts.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <p>No posts found matching your criteria.</p>
                {config.hashtag && <p className="text-xs mt-2">Try removing the hashtag filter.</p>}
            </div>
        ) : (
            <div 
            className="grid w-full transition-all duration-500 ease-in-out"
            style={{
                gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
                gap: `${config.gap}px`
            }}
            >
            {isLoading ? (
                // Loading Skeletons
                Array(limit).fill(null).map((_, i) => (
                    <Skeleton 
                        key={`skeleton-${i}`} 
                        className="aspect-square w-full rounded-md" 
                    />
                ))
            ) : (
                // Actual Posts
                displayPosts.map((post, idx) => (
                    <a 
                        key={`${post.id}-${idx}`} 
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square bg-muted rounded-md overflow-hidden cursor-pointer animate-in fade-in zoom-in duration-500 block"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                    <img 
                        src={post.imageUrl} 
                        alt={post.caption} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2 p-4">
                        {config.showCaptions && (
                        <p className="text-xs text-center line-clamp-3 mt-2 opacity-90 font-medium">
                            {post.caption}
                        </p>
                        )}
                    </div>
                    </a>
                ))
            )}
            </div>
        )}
        
        {config.feedType === 'custom' && limit > 9 && !isLoading && (
            <div className="mt-8 text-center">
                <button className="px-6 py-2 bg-[#3897f0] text-white text-sm font-semibold rounded hover:bg-[#3897f0]/90 transition-colors">
                    Load More
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
