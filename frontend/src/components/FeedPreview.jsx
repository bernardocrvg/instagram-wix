import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { mockPosts } from '../lib/mockData';

export default function FeedPreview({ config }) {
  // Calculate total posts based on type
  const totalPosts = config.feedType === 'fixed' 
    ? 5 
    : (config.columns * config.rows);

  // Generate enough mock data if we need more than what we have
  const displayPosts = Array(totalPosts).fill(null).map((_, i) => {
    return mockPosts[i % mockPosts.length];
  });

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
      {/* Browser Mock Header */}
      <div className="h-10 bg-muted/50 border-b flex items-center px-4 gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 text-center text-xs text-muted-foreground font-medium">
          Preview Mode ({config.feedType === 'fixed' ? 'Desktop View' : 'Custom Grid'})
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        <div 
          className="grid w-full transition-all duration-500 ease-in-out"
          style={{
            gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
            gap: `${config.gap}px`
          }}
        >
          {displayPosts.map((post, idx) => (
            <div 
                key={`${post.id}-${idx}`} 
                className="group relative aspect-square bg-muted rounded-md overflow-hidden cursor-pointer animate-in fade-in zoom-in duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
            >
              <img 
                src={post.imageUrl} 
                alt={post.caption} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2 p-4">
                <div className="flex items-center gap-4 font-bold">
                  <div className="flex items-center gap-1">
                    <Heart className="fill-white w-5 h-5" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="fill-white w-5 h-5" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                {config.showCaptions && (
                  <p className="text-xs text-center line-clamp-2 mt-2 opacity-90">
                    {post.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {config.feedType === 'custom' && totalPosts > 9 && (
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
