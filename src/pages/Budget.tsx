import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Edit2, Save, Plus, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { subscribeToBudgetCategories, saveBudgetCategories, subscribeToSettings, saveSettings } from '@/lib/storage';
import { BudgetCategory, WeddingSettings } from '@/lib/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const categoryColors: Record<string, string> = {
  rose: 'bg-rose',
  gold: 'bg-gold',
  sage: 'bg-sage',
  champagne: 'bg-champagne',
};

const COLOR_OPTIONS: Array<{ value: BudgetCategory['color']; label: string }> = [
  { value: 'rose', label: 'Rose' },
  { value: 'gold', label: 'Gold' },
  { value: 'sage', label: 'Sage' },
  { value: 'champagne', label: 'Champagne' },
];

export default function Budget() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [settings, setSettings] = useState<WeddingSettings>({ coupleName: '', weddingDate: '', totalBudget: 0, venue: '' });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ planned: 0, spent: 0 });

  const [editingTotalBudget, setEditingTotalBudget] = useState(false);
  const [tempTotalBudget, setTempTotalBudget] = useState(0);

  // ======= NOVO: ADD CATEGORY DIALOG STATE =======
  const [addOpen, setAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    planned: number;
    spent: number;
    color: BudgetCategory['color'];
  }>({
    name: '',
    planned: 0,
    spent: 0,
    color: 'rose',
  });

  useEffect(() => {
    const unsub1 = subscribeToBudgetCategories(setCategories);
    const unsub2 = subscribeToSettings(setSettings);
    return () => { unsub1(); unsub2(); };
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

  const handleSave = async (id: string) => {
    const updatedCategories = categories.map(c =>
      c.id === id ? { ...c, ...editValues } : c
    );
    await saveBudgetCategories(updatedCategories);
    setEditingId(null);
  };

  const handleSaveTotalBudget = async () => {
    const newSettings = { ...settings, totalBudget: tempTotalBudget };
    await saveSettings(newSettings);
    setEditingTotalBudget(false);
  };

  // ======= NOVO: ADD / REMOVE CATEGORIES =======
  const handleAddCategory = async () => {
    const name = newCategory.name.trim();
    if (!name) return;

    // impede duplicar por nome (opcional)
    const exists = categories.some(c => c.name.trim().toLowerCase() === name.toLowerCase());
    if (exists) return;

    const created: BudgetCategory = {
      id: crypto.randomUUID(),
      name,
      planned: Number(newCategory.planned) || 0,
      spent: Number(newCategory.spent) || 0,
      color: newCategory.color,
    };

    await saveBudgetCategories([...categories, created]);

    // reset e fecha
    setNewCategory({ name: '', planned: 0, spent: 0, color: 'rose' });
    setAddOpen(false);
  };

  const handleRemoveCategory = async (id: string) => {
    // regra: não deixar remover a última (evita tela vazia)
    if (categories.length <= 1) return;

    // se estava editando a categoria removida, sai do modo edição
    if (editingId === id) setEditingId(null);

    const updated = categories.filter(c => c.id !== id);
    await saveBudgetCategories(updated);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold">Orçamento</h1>
          <p className="text-muted-foreground">Controle financeiro do seu casamento</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="gradient-romantic border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Orçamento Total
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    if (editingTotalBudget) handleSaveTotalBudget();
                    else { setTempTotalBudget(settings.totalBudget); setEditingTotalBudget(true); }
                  }}
                >
                  {editingTotalBudget ? <Save className="h-3 w-3" /> : <Edit2 className="h-3 w-3" />}
                </Button>
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
              <p className="text-xs text-muted-foreground mt-1">{formatCurrency(totalPlanned)} planejado por categoria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />Total Gasto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalSpent)}</div>
              <Progress value={overallProgress} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">{overallProgress.toFixed(1)}% do orçamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />Saldo Restante
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />Categorias de Gastos
              </span>

              {/* ======= NOVO: BOTÃO ADICIONAR ======= */}
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Adicionar
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[520px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar categoria</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input
                        placeholder="Ex: Exames, Recepção, Marketing..."
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Dica: evite nomes duplicados.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Planejado</Label>
                        <Input
                          type="number"
                          value={newCategory.planned}
                          onChange={(e) => setNewCategory({ ...newCategory, planned: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Gasto</Label>
                        <Input
                          type="number"
                          value={newCategory.spent}
                          onChange={(e) => setNewCategory({ ...newCategory, spent: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cor</Label>
                      <Select
                        value={newCategory.color}
                        onValueChange={(v) => setNewCategory({ ...newCategory, color: v as BudgetCategory['color'] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha uma cor" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLOR_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter className="mt-2">
                    <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddCategory}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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

                      <div className="flex items-center gap-2 md:gap-4">
                        {isEditing ? (
                          <>
                            <div className="hidden md:flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Planejado:</span>
                              <Input
                                type="number"
                                value={editValues.planned}
                                onChange={e => setEditValues({ ...editValues, planned: Number(e.target.value) })}
                                className="w-28 h-8"
                              />
                            </div>

                            <div className="hidden md:flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Gasto:</span>
                              <Input
                                type="number"
                                value={editValues.spent}
                                onChange={e => setEditValues({ ...editValues, spent: Number(e.target.value) })}
                                className="w-28 h-8"
                              />
                            </div>

                            {/* mobile: inputs empilhados (simples) */}
                            <div className="md:hidden grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                value={editValues.planned}
                                onChange={e => setEditValues({ ...editValues, planned: Number(e.target.value) })}
                                className="h-8"
                                placeholder="Planejado"
                              />
                              <Input
                                type="number"
                                value={editValues.spent}
                                onChange={e => setEditValues({ ...editValues, spent: Number(e.target.value) })}
                                className="h-8"
                                placeholder="Gasto"
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

                            {/* ======= NOVO: REMOVER COM CONFIRMAÇÃO ======= */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  disabled={categories.length <= 1}
                                  title={categories.length <= 1 ? 'Não é possível remover a última categoria' : 'Remover categoria'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover categoria?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Isso vai apagar a categoria <b>{category.name}</b> (planejado/gasto). Essa ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => handleRemoveCategory(category.id)}
                                  >
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
