import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Settings2, LayoutGrid, StretchHorizontal } from 'lucide-react';

export default function FeedConfigurator({ config, setConfig, onGenerate }) {
  
  const handleTypeChange = (value) => {
    if (value === 'fixed') {
      setConfig({ ...config, feedType: 'fixed', columns: 5, rows: 1 });
    } else {
      setConfig({ ...config, feedType: 'custom', columns: 3, rows: 2 });
    }
  };

  return (
    <Card className="h-full border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Configuration
        </CardTitle>
        <CardDescription>
          Customize your feed layout and behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Source Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Source</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">@</span>
                <Input 
                    id="username" 
                    placeholder="username" 
                    className="pl-7 h-9"
                    value={config.username}
                    onChange={(e) => setConfig({...config, username: e.target.value})}
                />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="hashtag">Hashtag</Label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">#</span>
                <Input 
                    id="hashtag" 
                    placeholder="travel" 
                    className="pl-7 h-9"
                    value={config.hashtag}
                    onChange={(e) => setConfig({...config, hashtag: e.target.value})}
                />
                </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Feed Type Selection */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Feed Type</h3>
            <Tabs value={config.feedType} onValueChange={handleTypeChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="fixed" className="flex items-center gap-2">
                        <StretchHorizontal className="w-4 h-4" />
                        Fixed Strip
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" />
                        Custom Grid
                    </TabsTrigger>
                </TabsList>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground border">
                    {config.feedType === 'fixed' ? (
                        <p>Shows exactly <strong>5 posts</strong>. Displays as 1 row on desktop and 5 rows on mobile automatically.</p>
                    ) : (
                        <p>Fully customizable grid. Define up to 10 rows and 10 columns to fit any space.</p>
                    )}
                </div>
            </Tabs>
        </div>

        {/* Layout Settings */}
        <div className="space-y-6">
          
          {config.feedType === 'custom' && (
            <>
                <div className="space-y-4">
                    <div className="flex justify-between">
                    <Label>Columns (Desktop)</Label>
                    <span className="text-sm text-muted-foreground">{config.columns}</span>
                    </div>
                    <Slider 
                    value={[config.columns]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(val) => setConfig({...config, columns: val[0]})}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                    <Label>Rows</Label>
                    <span className="text-sm text-muted-foreground">{config.rows}</span>
                    </div>
                    <Slider 
                    value={[config.rows]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(val) => setConfig({...config, rows: val[0]})}
                    />
                </div>
            </>
          )}

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Gap (px)</Label>
              <span className="text-sm text-muted-foreground">{config.gap}px</span>
            </div>
            <Slider 
              value={[config.gap]} 
              min={0} 
              max={40} 
              step={4} 
              onValueChange={(val) => setConfig({...config, gap: val[0]})}
            />
          </div>

          <div className="space-y-2">
            <Label>Auto-Update Interval</Label>
            <Select 
                value={config.refreshInterval.toString()} 
                onValueChange={(val) => setConfig({...config, refreshInterval: parseInt(val)})}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="60">Every 1 minute</SelectItem>
                    <SelectItem value="300">Every 5 minutes</SelectItem>
                    <SelectItem value="900">Every 15 minutes</SelectItem>
                    <SelectItem value="3600">Every 1 hour</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="show-captions" className="cursor-pointer">Show Captions</Label>
            <Switch 
              id="show-captions" 
              checked={config.showCaptions}
              onCheckedChange={(val) => setConfig({...config, showCaptions: val})}
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
