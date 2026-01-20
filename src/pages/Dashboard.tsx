import { useState, useEffect } from 'react';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart, Users, UserCheck, Wallet, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  subscribeToGuests, 
  subscribeToTasks, 
  subscribeToVendors, 
  subscribeToBudgetCategories, 
  subscribeToSettings 
} from '@/lib/storage';
import { Guest, Task, Vendor, BudgetCategory, WeddingSettings } from '@/lib/types';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [settings, setSettings] = useState<WeddingSettings>({ coupleName: '', weddingDate: '', totalBudget: 0, venue: '' });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Subscribe to real-time updates
    unsubscribers.push(subscribeToSettings(setSettings));
    unsubscribers.push(subscribeToGuests(setGuests));
    unsubscribers.push(subscribeToTasks(setTasks));
    unsubscribers.push(subscribeToVendors(setVendors));
    unsubscribers.push(subscribeToBudgetCategories(setBudgetCategories));

    // Set loading to false after a short delay
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      clearTimeout(timer);
    };
  }, []);

  // Calculate stats
  const confirmedGuests = guests.filter(g => g.status === 'confirmed').length;
  const totalGuests = guests.length;
  const totalAttendees = confirmedGuests + guests.filter(g => g.status === 'confirmed').reduce((acc, g) => acc + g.companions, 0);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalBudget = settings.totalBudget || budgetCategories.reduce((acc, c) => acc + c.planned, 0);
  const totalSpent = budgetCategories.reduce((acc, c) => acc + c.spent, 0);
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const paidValue = vendors.reduce((acc, v) => 
    acc + v.payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0), 0
  );

  // Days until wedding
  const weddingDate = settings.weddingDate ? parseISO(settings.weddingDate) : null;
  const daysUntilWedding = weddingDate ? differenceInDays(weddingDate, new Date()) : null;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl font-bold text-foreground">
            {settings.coupleName || 'Seu Casamento'}
          </h1>
          {weddingDate && (
            <p className="text-lg text-muted-foreground">
              {format(weddingDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          )}
        </div>

        {/* Countdown */}
        {daysUntilWedding !== null && daysUntilWedding >= 0 && (
          <Card className="gradient-romantic border-none shadow-elegant">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="h-6 w-6 text-primary animate-pulse-soft" />
                  <span className="text-sm font-medium uppercase tracking-wider text-primary">
                    Contagem Regressiva
                  </span>
                  <Heart className="h-6 w-6 text-primary animate-pulse-soft" />
                </div>
                <div className="font-display text-7xl font-bold text-foreground mb-2">
                  {daysUntilWedding}
                </div>
                <p className="text-xl text-muted-foreground">
                  {daysUntilWedding === 1 ? 'dia' : 'dias'} para o grande dia
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/guests">
            <Card className="hover:shadow-romantic transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Convidados Confirmados
                </CardTitle>
                <UserCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{confirmedGuests}</div>
                <p className="text-xs text-muted-foreground">
                  de {totalGuests} convidados ({totalAttendees} pessoas total)
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/checklist">
            <Card className="hover:shadow-romantic transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tarefas Concluídas
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedTasks}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  de {totalTasks} tarefas
                </p>
                <Progress value={taskProgress} className="h-2" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/budget">
            <Card className="hover:shadow-romantic transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Orçamento Utilizado
                </CardTitle>
                <Wallet className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBudget)}
                </p>
                <Progress value={budgetProgress} className="h-2" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/vendors">
            <Card className="hover:shadow-romantic transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Fornecedores
                </CardTitle>
                <Clock className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{vendors.length}</div>
                <p className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(paidValue)} pago
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximas Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks
                .filter(t => !t.completed)
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full ${
                      task.priority === 'high' ? 'bg-destructive' :
                      task.priority === 'medium' ? 'bg-warning' : 'bg-sage'
                    }`} />
                    <span className="flex-1 text-sm">{task.title}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {task.phase}
                    </span>
                  </div>
                ))}
              {tasks.filter(t => !t.completed).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  🎉 Todas as tarefas foram concluídas!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
