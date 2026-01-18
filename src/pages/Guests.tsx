import { useState, useEffect } from 'react';
import { Plus, Search, Filter, UserCheck, Clock, UserX, Users, Trash2, Edit } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getGuests, addGuest, updateGuest, deleteGuest } from '@/lib/storage';
import { Guest, GuestStatus, GuestGroup, GUEST_STATUS_LABELS, GUEST_GROUP_LABELS } from '@/lib/types';

const statusIcons: Record<GuestStatus, React.ReactNode> = {
  confirmed: <UserCheck className="h-4 w-4 text-success" />,
  pending: <Clock className="h-4 w-4 text-warning" />,
  declined: <UserX className="h-4 w-4 text-destructive" />,
};

const statusColors: Record<GuestStatus, string> = {
  confirmed: 'bg-sage-light text-sage border-sage/30',
  pending: 'bg-gold-light text-gold border-gold/30',
  declined: 'bg-rose-light text-destructive border-destructive/30',
};

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<GuestStatus | 'all'>('all');
  const [filterGroup, setFilterGroup] = useState<GuestGroup | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'pending' as GuestStatus,
    group: 'friends' as GuestGroup,
    companions: 0,
    dietaryRestrictions: '',
    notes: '',
  });

  useEffect(() => {
    setGuests(getGuests());
  }, []);

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || guest.status === filterStatus;
    const matchesGroup = filterGroup === 'all' || guest.group === filterGroup;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const stats = {
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    pending: guests.filter(g => g.status === 'pending').length,
    declined: guests.filter(g => g.status === 'declined').length,
    totalCompanions: guests.reduce((acc, g) => acc + g.companions, 0),
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'pending',
      group: 'friends',
      companions: 0,
      dietaryRestrictions: '',
      notes: '',
    });
    setEditingGuest(null);
  };

  const handleOpenDialog = (guest?: Guest) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        name: guest.name,
        email: guest.email || '',
        phone: guest.phone || '',
        status: guest.status,
        group: guest.group,
        companions: guest.companions,
        dietaryRestrictions: guest.dietaryRestrictions || '',
        notes: guest.notes || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGuest) {
      updateGuest(editingGuest.id, formData);
    } else {
      addGuest(formData);
    }
    setGuests(getGuests());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este convidado?')) {
      deleteGuest(id);
      setGuests(getGuests());
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Convidados</h1>
            <p className="text-muted-foreground">Gerencie a lista de convidados do seu casamento</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Convidado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingGuest ? 'Editar Convidado' : 'Novo Convidado'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={v => setFormData({ ...formData, status: v as GuestStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(GUEST_STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Grupo</Label>
                    <Select
                      value={formData.group}
                      onValueChange={v => setFormData({ ...formData, group: v as GuestGroup })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(GUEST_GROUP_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companions">Acompanhantes</Label>
                  <Input
                    id="companions"
                    type="number"
                    min="0"
                    value={formData.companions}
                    onChange={e => setFormData({ ...formData, companions: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietary">Restrições Alimentares</Label>
                  <Input
                    id="dietary"
                    value={formData.dietaryRestrictions}
                    onChange={e => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    placeholder="Ex: Vegetariano, alergia a frutos do mar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingGuest ? 'Salvar Alterações' : 'Adicionar Convidado'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sage-light p-2">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                  <p className="text-sm text-muted-foreground">Confirmados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gold-light p-2">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-rose-light p-2">
                  <UserX className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.declined}</p>
                  <p className="text-sm text-muted-foreground">Recusados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-champagne p-2">
                  <Users className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{guests.length + stats.totalCompanions}</p>
                  <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={v => setFilterStatus(v as GuestStatus | 'all')}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(GUEST_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterGroup} onValueChange={v => setFilterGroup(v as GuestGroup | 'all')}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os grupos</SelectItem>
                  {Object.entries(GUEST_GROUP_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Guest List */}
        <div className="space-y-3">
          {filteredGuests.map(guest => (
            <Card key={guest.id} className="hover:shadow-romantic transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{guest.name}</h3>
                      {guest.companions > 0 && (
                        <span className="text-xs text-muted-foreground">
                          +{guest.companions} acompanhante{guest.companions > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      {guest.email && <span>{guest.email}</span>}
                      {guest.phone && <span>• {guest.phone}</span>}
                    </div>
                    {guest.dietaryRestrictions && (
                      <p className="text-xs text-muted-foreground mt-1">
                        🍽️ {guest.dietaryRestrictions}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {GUEST_GROUP_LABELS[guest.group]}
                    </Badge>
                    <Badge className={statusColors[guest.status]}>
                      <span className="flex items-center gap-1">
                        {statusIcons[guest.status]}
                        {GUEST_STATUS_LABELS[guest.status]}
                      </span>
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(guest)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(guest.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredGuests.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {guests.length === 0 
                    ? 'Nenhum convidado cadastrado ainda' 
                    : 'Nenhum convidado encontrado com os filtros aplicados'}
                </p>
                {guests.length === 0 && (
                  <Button onClick={() => handleOpenDialog()} variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Convidado
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
