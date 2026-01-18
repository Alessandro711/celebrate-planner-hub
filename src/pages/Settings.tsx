import { useState, useEffect } from 'react';
import { Save, Heart, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getSettings, saveSettings } from '@/lib/storage';
import { WeddingSettings } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const [settings, setSettings] = useState<WeddingSettings>(getSettings());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    saveSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configurações salvas!",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    }, 500);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Configure as informações do seu casamento</p>
        </div>

        {/* Wedding Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Informações do Casamento
            </CardTitle>
            <CardDescription>
              Estas informações aparecerão no dashboard e em outras partes do aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coupleName">Nome do Casal</Label>
              <Input
                id="coupleName"
                value={settings.coupleName}
                onChange={e => setSettings({ ...settings, coupleName: e.target.value })}
                placeholder="Ex: Maria & João"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weddingDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data do Casamento
              </Label>
              <Input
                id="weddingDate"
                type="date"
                value={settings.weddingDate}
                onChange={e => setSettings({ ...settings, weddingDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Local do Casamento</Label>
              <Input
                id="venue"
                value={settings.venue || ''}
                onChange={e => setSettings({ ...settings, venue: e.target.value })}
                placeholder="Ex: Igreja São José / Buffet Bella Vista"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBudget">Orçamento Total (R$)</Label>
              <Input
                id="totalBudget"
                type="number"
                value={settings.totalBudget}
                onChange={e => setSettings({ ...settings, totalBudget: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>

        {/* Data Info */}
        <Card className="border-dashed">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              💡 Os dados são salvos localmente no seu navegador. Para sincronizar entre dispositivos, 
              você pode adicionar um banco de dados no futuro.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
