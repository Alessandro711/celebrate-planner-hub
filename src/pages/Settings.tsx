import { useState, useEffect } from 'react';
import { Save, Heart, Calendar, LogOut, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { subscribeToSettings, saveSettings } from '@/lib/storage';
import { logout } from '@/lib/auth';
import { WeddingSettings } from '@/lib/types';
import { COLOR_PALETTES, applyPalette } from '@/lib/palettes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<WeddingSettings>({ coupleName: '', weddingDate: '', totalBudget: 0, venue: '', colorPalette: 'green' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { const unsub = subscribeToSettings(setSettings); return () => unsub(); }, []);

  const handlePaletteChange = (paletteId: string) => {
    setSettings({ ...settings, colorPalette: paletteId });
    applyPalette(paletteId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveSettings(settings);
    setIsSaving(false);
    toast.success('Configurações salvas!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div><h1 className="font-display text-3xl font-bold">Configurações</h1><p className="text-muted-foreground">Configure as informações do seu casamento</p></div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" />Informações do Casamento</CardTitle><CardDescription>Estas informações aparecerão no dashboard</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="coupleName">Nome do Casal</Label><Input id="coupleName" value={settings.coupleName} onChange={e => setSettings({ ...settings, coupleName: e.target.value })} placeholder="Ex: Maria & João" /></div>
            <div className="space-y-2"><Label htmlFor="weddingDate" className="flex items-center gap-2"><Calendar className="h-4 w-4" />Data do Casamento</Label><Input id="weddingDate" type="date" value={settings.weddingDate} onChange={e => setSettings({ ...settings, weddingDate: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="venue">Local do Casamento</Label><Input id="venue" value={settings.venue || ''} onChange={e => setSettings({ ...settings, venue: e.target.value })} placeholder="Ex: Igreja São José" /></div>
            <div className="space-y-2"><Label htmlFor="totalBudget">Orçamento Total (R$)</Label><Input id="totalBudget" type="number" value={settings.totalBudget} onChange={e => setSettings({ ...settings, totalBudget: Number(e.target.value) })} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Paleta de Cores</CardTitle><CardDescription>Escolha o tema visual do aplicativo</CardDescription></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COLOR_PALETTES.map(palette => (
                <button
                  key={palette.id}
                  onClick={() => handlePaletteChange(palette.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                    (settings.colorPalette || 'green') === palette.id
                      ? "border-primary bg-muted shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex gap-1">
                    {palette.preview.map((color, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{palette.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2"><Save className="h-4 w-4" />{isSaving ? 'Salvando...' : 'Salvar Configurações'}</Button>

        <Card className="border-destructive/30">
          <CardContent className="py-6">
            <Button variant="outline" onClick={handleLogout} className="w-full gap-2 text-destructive hover:text-destructive"><LogOut className="h-4 w-4" />Sair da Conta</Button>
          </CardContent>
        </Card>

        <Card className="border-dashed"><CardContent className="py-6 text-center"><p className="text-sm text-muted-foreground">☁️ Os dados são salvos na nuvem e sincronizados entre dispositivos.</p></CardContent></Card>
      </div>
    </AppLayout>
  );
}
