import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Trash2, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { subscribeToTasks, addTask, updateTask, deleteTask } from '@/lib/storage';
import { Task, TaskPhase, TaskPriority, TASK_PHASE_ORDER } from '@/lib/types';

const priorityColors: Record<TaskPriority, string> = { high: 'bg-destructive', medium: 'bg-warning', low: 'bg-sage' };
const priorityLabels: Record<TaskPriority, string> = { high: 'Alta', medium: 'Média', low: 'Baixa' };

export default function Checklist() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterPhase, setFilterPhase] = useState<TaskPhase | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', phase: '6-9 meses' as TaskPhase, priority: 'medium' as TaskPriority, dueDate: '' });

  useEffect(() => { const unsub = subscribeToTasks(setTasks); return () => unsub(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTask({ ...formData, completed: false });
    setIsDialogOpen(false);
    setFormData({ title: '', description: '', phase: '6-9 meses', priority: 'medium', dueDate: '' });
  };

  const handleToggleComplete = async (id: string, completed: boolean) => { await updateTask(id, { completed }); };
  const handleDelete = async (id: string) => { if (confirm('Remover tarefa?')) await deleteTask(id); };

  const groupedTasks = TASK_PHASE_ORDER.reduce((acc, phase) => {
    const phaseTasks = tasks.filter(t => t.phase === phase && (filterPhase === 'all' || t.phase === filterPhase) && (showCompleted || !t.completed));
    if (phaseTasks.length > 0 || filterPhase === phase) acc[phase] = phaseTasks;
    return acc;
  }, {} as Record<TaskPhase, Task[]>);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><h1 className="font-display text-3xl font-bold">Checklist</h1><p className="text-muted-foreground">Acompanhe todas as tarefas</p></div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Nova Tarefa</Button></DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Nova Tarefa</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Título *</Label><Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Descrição</Label><Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Fase</Label><Select value={formData.phase} onValueChange={v => setFormData({ ...formData, phase: v as TaskPhase })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TASK_PHASE_ORDER.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Prioridade</Label><Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v as TaskPriority })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="high">Alta</SelectItem><SelectItem value="medium">Média</SelectItem><SelectItem value="low">Baixa</SelectItem></SelectContent></Select></div>
                </div>
                <Button type="submit" className="w-full">Adicionar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="gradient-romantic border-none">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div><p className="text-sm font-medium text-muted-foreground">Progresso</p><p className="text-3xl font-bold">{completedCount} <span className="text-lg font-normal text-muted-foreground">de {tasks.length}</span></p></div>
              <div className="text-right"><p className="text-4xl font-bold text-primary">{progress.toFixed(0)}%</p></div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-muted-foreground" /><Select value={filterPhase} onValueChange={v => setFilterPhase(v as TaskPhase | 'all')}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas</SelectItem>{TASK_PHASE_ORDER.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          <Button variant={showCompleted ? 'secondary' : 'outline'} size="sm" onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? 'Esconder Concluídas' : 'Mostrar Concluídas'}</Button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([phase, phaseTasks]) => (
            <Card key={phase}>
              <CardHeader className="pb-3"><CardTitle className="flex items-center justify-between"><span className="flex items-center gap-2">{phase}<Badge variant="outline">{phaseTasks.length}</Badge></span></CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {phaseTasks.map(task => (
                  <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${task.completed ? 'bg-muted/30 opacity-70' : 'hover:bg-muted/50'}`}>
                    <button onClick={() => handleToggleComplete(task.id, !task.completed)}>{task.completed ? <CheckCircle className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}</button>
                    <div className={`h-2 w-2 rounded-full ${priorityColors[task.priority]}`} />
                    <div className="flex-1"><p className={task.completed ? 'line-through text-muted-foreground' : ''}>{task.title}</p></div>
                    <Badge variant="outline" className="text-xs">{priorityLabels[task.priority]}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
