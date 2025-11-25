import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Settings2, LayoutGrid, StretchHorizontal, Search, BookOpen, AlignLeft, AlignCenter, AlignRight, Type, Palette, Download, MousePointerClick } from 'lucide-react';

const GOOGLE_FONTS = [
  "Inter", "Montserrat", "Roboto", "Open Sans", "Lato", "Poppins", 
  "Playfair Display", "Merriweather", "Nunito", "Raleway", "Oswald",
  "Wix Madefor Display"
];

export default function FeedConfigurator({ config, setConfig, onGenerate, isLoading }) {
  const [tempFontUrl, setTempFontUrl] = useState(config.customFontUrl);

  const handleTypeChange = (value) => {
    if (value === 'fixed') {
      setConfig({ ...config, feedType: 'fixed', columns: 5, rows: 1 });
    } else if (value === 'custom') {
      setConfig({ ...config, feedType: 'custom', columns: 3, rows: 2 });
    } else {
      setConfig({ ...config, feedType: 'paginated', columns: 3, rows: 3, itemsPerPage: 9 });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onGenerate();
    }
  };

  const handleLoadFont = () => {
    setConfig({ ...config, customFontUrl: tempFontUrl });
  };

  // Componente auxiliar para o seletor de cor com Hex
  const ColorPicker = ({ label, value, onChange }) => (
    <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">{label}</Label>
        <div className="flex gap-2 items-center">
            <div className="relative w-8 h-8 shrink-0">
                <Input 
                    type="color" 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)} 
                    className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0" 
                />
                <div 
                    className="w-full h-full rounded border shadow-sm" 
                    style={{ backgroundColor: value }} 
                />
            </div>
            <Input 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="font-mono text-xs h-8 uppercase" 
                maxLength={7} 
            />
        </div>
    </div>
  );

  return (
    <Card className="h-full border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Configuração
        </CardTitle>
        <CardDescription>
          Personalize o layout e comportamento do feed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Fonte */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fonte</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">@</span>
                <Input 
                    id="username" 
                    placeholder="usuario" 
                    className="pl-7 h-9"
                    value={config.username}
                    onChange={(e) => setConfig({...config, username: e.target.value})}
                    onKeyDown={handleKeyDown}
                />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="hashtag">Hashtag {config.feedType === 'paginated' && <span className="text-red-500">*</span>}</Label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">#</span>
                <Input 
                    id="hashtag" 
                    placeholder="viagem" 
                    className="pl-7 h-9"
                    value={config.hashtag}
                    onChange={(e) => setConfig({...config, hashtag: e.target.value})}
                    onKeyDown={handleKeyDown}
                />
                </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 border-0" 
            variant="outline"
            onClick={onGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Search className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Atualizando...' : 'Atualizar Preview'}
          </Button>
        </div>

        <div className="h-px bg-border" />

        {/* Tipo de Feed */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tipo de Feed</h3>
            <Tabs value={config.feedType} onValueChange={handleTypeChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="fixed" className="flex items-center gap-2 text-xs">
                        <StretchHorizontal className="w-3 h-3" />
                        Faixa
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex items-center gap-2 text-xs">
                        <LayoutGrid className="w-3 h-3" />
                        Grade
                    </TabsTrigger>
                    <TabsTrigger value="paginated" className="flex items-center gap-2 text-xs">
                        <BookOpen className="w-3 h-3" />
                        Páginas
                    </TabsTrigger>
                </TabsList>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground border">
                    {config.feedType === 'fixed' && <p>Mostra exatamente <strong>5 posts</strong>. 1 linha no PC, 5 linhas no celular.</p>}
                    {config.feedType === 'custom' && <p>Grade fixa. Você define quantas linhas e colunas quer mostrar.</p>}
                    {config.feedType === 'paginated' && <p>Mostra todos os posts com a hashtag escolhida, divididos em várias páginas.</p>}
                </div>
            </Tabs>
        </div>

        {/* Configurações de Paginação (Condicional) */}
        {config.feedType === 'paginated' && (
            <div className="space-y-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4" /> Estilo da Paginação
                </h3>

                {/* Botão Anterior */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold">Botão Anterior</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <ColorPicker 
                            label="Texto" 
                            value={config.btnPrevTextColor} 
                            onChange={(val) => setConfig({...config, btnPrevTextColor: val})} 
                        />
                        <ColorPicker 
                            label="Fundo" 
                            value={config.btnPrevBgColor} 
                            onChange={(val) => setConfig({...config, btnPrevBgColor: val})} 
                        />
                    </div>
                </div>

                {/* Botão Próximo */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold">Botão Próximo</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <ColorPicker 
                            label="Texto" 
                            value={config.btnNextTextColor} 
                            onChange={(val) => setConfig({...config, btnNextTextColor: val})} 
                        />
                        <ColorPicker 
                            label="Fundo" 
                            value={config.btnNextBgColor} 
                            onChange={(val) => setConfig({...config, btnNextBgColor: val})} 
                        />
                    </div>
                </div>

                {/* Borda dos Botões */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold">Borda dos Botões</Label>
                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] text-muted-foreground">Espessura</Label>
                                <span className="text-[10px] text-muted-foreground">{config.btnBorderWidth}px</span>
                            </div>
                            <Slider value={[config.btnBorderWidth]} min={0} max={10} step={1} onValueChange={(val) => setConfig({...config, btnBorderWidth: val[0]})} />
                        </div>
                        <ColorPicker 
                            label="Cor da Borda" 
                            value={config.btnBorderColor} 
                            onChange={(val) => setConfig({...config, btnBorderColor: val})} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Fonte Botões</Label>
                        <Select value={config.btnFontFamily} onValueChange={(val) => setConfig({...config, btnFontFamily: val})}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {GOOGLE_FONTS.map(font => (<SelectItem key={font} value={font}>{font}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Peso Botões</Label>
                        <Select value={config.btnFontWeight} onValueChange={(val) => setConfig({...config, btnFontWeight: val})}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="300">Leve</SelectItem>
                                <SelectItem value="400">Normal</SelectItem>
                                <SelectItem value="600">Semi-Bold</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                                <SelectItem value="800">Extra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Fonte Info</Label>
                        <Select value={config.infoFontFamily} onValueChange={(val) => setConfig({...config, infoFontFamily: val})}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {GOOGLE_FONTS.map(font => (<SelectItem key={font} value={font}>{font}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Peso Info</Label>
                        <Select value={config.infoFontWeight} onValueChange={(val) => setConfig({...config, infoFontWeight: val})}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="300">Leve</SelectItem>
                                <SelectItem value="400">Normal</SelectItem>
                                <SelectItem value="600">Semi-Bold</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                                <SelectItem value="800">Extra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Cor do Texto Info</Label>
                    <div className="flex gap-2 items-center">
                        <div className="relative w-8 h-8 shrink-0">
                            <Input type="color" value={config.infoTextColor} onChange={(e) => setConfig({...config, infoTextColor: e.target.value})} className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0" />
                            <div className="w-full h-full rounded border shadow-sm" style={{ backgroundColor: config.infoTextColor }} />
                        </div>
                        <Input value={config.infoTextColor} onChange={(e) => setConfig({...config, infoTextColor: e.target.value})} className="font-mono text-xs h-8 uppercase" maxLength={7} />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Arredondamento Botão</Label>
                        <span className="text-xs text-muted-foreground">{config.btnRadius}px</span>
                    </div>
                    <Slider value={[config.btnRadius]} min={0} max={30} step={1} onValueChange={(val) => setConfig({...config, btnRadius: val[0]})} />
                </div>
            </div>
        )}

        {/* Cores e Efeitos */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4" /> Cores e Efeitos
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Cor da Legenda</Label>
                    <div className="flex gap-2 items-center">
                        <div className="relative w-10 h-10 shrink-0">
                            <Input 
                                type="color" 
                                value={config.captionColor}
                                onChange={(e) => setConfig({...config, captionColor: e.target.value})}
                                className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0"
                            />
                            <div 
                                className="w-full h-full rounded border shadow-sm" 
                                style={{ backgroundColor: config.captionColor }} 
                            />
                        </div>
                        <Input 
                            value={config.captionColor}
                            onChange={(e) => setConfig({...config, captionColor: e.target.value})}
                            className="font-mono text-xs h-10 uppercase"
                            maxLength={7}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Cor do Fundo (Hover)</Label>
                    <div className="flex gap-2 items-center">
                        <div className="relative w-10 h-10 shrink-0">
                            <Input 
                                type="color" 
                                value={config.overlayColor}
                                onChange={(e) => setConfig({...config, overlayColor: e.target.value})}
                                className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0"
                            />
                            <div 
                                className="w-full h-full rounded border shadow-sm" 
                                style={{ backgroundColor: config.overlayColor }} 
                            />
                        </div>
                        <Input 
                            value={config.overlayColor}
                            onChange={(e) => setConfig({...config, overlayColor: e.target.value})}
                            className="font-mono text-xs h-10 uppercase"
                            maxLength={7}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <Label>Opacidade do Fundo (%)</Label>
                    <span className="text-sm text-muted-foreground">{config.overlayOpacity}%</span>
                </div>
                <Slider 
                    value={[config.overlayOpacity]} 
                    min={0} 
                    max={100} 
                    step={5} 
                    onValueChange={(val) => setConfig({...config, overlayOpacity: val[0]})}
                />
            </div>
        </div>

        {/* Estilo e Layout */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estilo</h3>

          {/* Alinhamento */}
          <div className="space-y-2">
            <Label>Alinhamento do Feed</Label>
            <Tabs value={config.alignment} onValueChange={(val) => setConfig({...config, alignment: val})} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="start"><AlignLeft className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="center"><AlignCenter className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="end"><AlignRight className="w-4 h-4" /></TabsTrigger>
                </TabsList>
            </Tabs>
          </div>

          {/* Proporção */}
          <div className="space-y-2">
            <Label>Proporção da Imagem</Label>
            <Select 
                value={config.aspectRatio} 
                onValueChange={(val) => setConfig({...config, aspectRatio: val})}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1/1">1:1 (Quadrado)</SelectItem>
                    <SelectItem value="3/4">3:4 (Retrato)</SelectItem>
                    <SelectItem value="4/5">4:5 (Instagram)</SelectItem>
                    <SelectItem value="9/16">9:16 (Stories)</SelectItem>
                </SelectContent>
            </Select>
          </div>

          {/* Tipografia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <Label>Tipografia da Legenda</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select 
                    value={config.fontFamily} 
                    onValueChange={(val) => setConfig({...config, fontFamily: val})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Fonte" />
                    </SelectTrigger>
                    <SelectContent>
                        {GOOGLE_FONTS.map(font => (
                            <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                        <SelectItem value="custom">Outra (Link)</SelectItem>
                    </SelectContent>
                </Select>

                <Select 
                    value={config.fontWeight} 
                    onValueChange={(val) => setConfig({...config, fontWeight: val})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Peso" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="300">Leve (300)</SelectItem>
                        <SelectItem value="400">Normal (400)</SelectItem>
                        <SelectItem value="500">Médio (500)</SelectItem>
                        <SelectItem value="600">Semi-Negrito (600)</SelectItem>
                        <SelectItem value="700">Negrito (700)</SelectItem>
                        <SelectItem value="800">Extra-Negrito (800)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {config.fontFamily === 'custom' && (
                <div className="flex gap-2">
                    <Input 
                        placeholder="URL da fonte (ex: .woff2) ou Nome" 
                        value={tempFontUrl}
                        onChange={(e) => setTempFontUrl(e.target.value)}
                        className="text-xs flex-1"
                    />
                    <Button size="sm" variant="secondary" onClick={handleLoadFont}>
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            )}
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Arredondamento (Radius)</Label>
              <span className="text-sm text-muted-foreground">{config.borderRadius}px</span>
            </div>
            <Slider 
              value={[config.borderRadius]} 
              min={0} 
              max={50} 
              step={1} 
              onValueChange={(val) => setConfig({...config, borderRadius: val[0]})}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Espaçamento (Gap)</Label>
              <span className="text-sm text-muted-foreground">{config.gap}px</span>
            </div>
            <Slider 
              value={[config.gap]} 
              min={0} 
              max={50} 
              step={1} 
              onValueChange={(val) => setConfig({...config, gap: val[0]})}
            />
          </div>

          {(config.feedType === 'custom' || config.feedType === 'paginated') && (
            <>
                <div className="space-y-4">
                    <div className="flex justify-between">
                    <Label>Colunas (PC)</Label>
                    <span className="text-sm text-muted-foreground">{config.columns}</span>
                    </div>
                    <Slider 
                    value={[config.columns]} 
                    min={1} 
                    max={6} 
                    step={1} 
                    onValueChange={(val) => setConfig({...config, columns: val[0]})}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                    <Label>{config.feedType === 'paginated' ? 'Posts por Página' : 'Linhas'}</Label>
                    <span className="text-sm text-muted-foreground">
                        {config.feedType === 'paginated' ? config.itemsPerPage : config.rows}
                    </span>
                    </div>
                    <Slider 
                    value={[config.feedType === 'paginated' ? config.itemsPerPage : config.rows]} 
                    min={1} 
                    max={20} 
                    step={1} 
                    onValueChange={(val) => {
                        if (config.feedType === 'paginated') {
                            setConfig({...config, itemsPerPage: val[0]});
                        } else {
                            setConfig({...config, rows: val[0]});
                        }
                    }}
                    />
                </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="show-captions" className="cursor-pointer">Mostrar Legendas</Label>
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
