import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Edit2, Save } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getBudgetCategories, saveBudgetCategories, getSettings, saveSettings } from '@/lib/storage';
import { BudgetCategory } from '@/lib/types';

const categoryColors: Record<string, string> = {
  rose: 'bg-rose',
  gold: 'bg-gold',
  sage: 'bg-sage',
  champagne: 'bg-champagne',
};

export default function Budget() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [settings, setSettings] = useState(getSettings());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ planned: 0, spent: 0 });
  const [editingTotalBudget, setEditingTotalBudget] = useState(false);
  const [tempTotalBudget, setTempTotalBudget] = useState(0);

  useEffect(() => {
    setCategories(getBudgetCategories());
    setSettings(getSettings());
  }, []);

  const totalPlanned = categories.reduce((acc, c) => acc + c.planned, 0);
  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);
  const totalBudget = settings.totalBudget || totalPlanned;
  const remaining = totalBudget - totalSpent;
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleEdit = (category: BudgetCategory) => {
    setEditingId(category.id);
    setEditValues({ planned: category.planned, spent: category.spent });
  };

  const handleSave = (id: string) => {
    const updatedCategories = categories.map(c =>
      c.id === id ? { ...c, ...editValues } : c
    );
    saveBudgetCategories(updatedCategories);
    setCategories(updatedCategories);
    setEditingId(null);
  };

  const handleSaveTotalBudget = () => {
    const newSettings = { ...settings, totalBudget: tempTotalBudget };
    saveSettings(newSettings);
    setSettings(newSettings);
    setEditingTotalBudget(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">Orçamento</h1>
          <p className="text-muted-foreground">Controle financeiro do seu casamento</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="gradient-romantic border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Orçamento Total
                {!editingTotalBudget ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setTempTotalBudget(settings.totalBudget);
                      setEditingTotalBudget(true);
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleSaveTotalBudget}
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingTotalBudget ? (
                <Input
                  type="number"
                  value={tempTotalBudget}
                  onChange={e => setTempTotalBudget(Number(e.target.value))}
                  className="text-2xl font-bold h-auto py-1"
                />
              ) : (
                <div className="text-3xl font-bold">{formatCurrency(totalBudget)}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(totalPlanned)} planejado por categoria
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Total Gasto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalSpent)}</div>
              <Progress value={overallProgress} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {overallProgress.toFixed(1)}% do orçamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Saldo Restante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${remaining < 0 ? 'text-destructive' : 'text-success'}`}>
                {formatCurrency(remaining)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {remaining < 0 ? 'Acima do orçamento!' : 'Disponível para gastar'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Categorias de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map(category => {
                const progress = category.planned > 0 ? (category.spent / category.planned) * 100 : 0;
                const isOverBudget = category.spent > category.planned && category.planned > 0;
                const isEditing = editingId === category.id;

                return (
                  <div key={category.id} className="space-y-2 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${categoryColors[category.color]}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {isEditing ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Planejado:</span>
                              <Input
                                type="number"
                                value={editValues.planned}
                                onChange={e => setEditValues({ ...editValues, planned: Number(e.target.value) })}
                                className="w-28 h-8"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Gasto:</span>
                              <Input
                                type="number"
                                value={editValues.spent}
                                onChange={e => setEditValues({ ...editValues, spent: Number(e.target.value) })}
                                className="w-28 h-8"
                              />
                            </div>
                            <Button size="sm" onClick={() => handleSave(category.id)}>
                              <Save className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="text-right">
                              <p className={`font-medium ${isOverBudget ? 'text-destructive' : ''}`}>
                                {formatCurrency(category.spent)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                de {formatCurrency(category.planned)}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(progress, 100)}
                          className={`h-2 flex-1 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
                        />
                        <span className={`text-xs font-medium w-12 text-right ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
