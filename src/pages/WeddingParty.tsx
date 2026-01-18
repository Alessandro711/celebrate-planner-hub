import { useState, useEffect } from 'react';
import { Plus, Heart, Trash2, Edit, User } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getWeddingParty, addWeddingPartyMember, updateWeddingPartyMember, deleteWeddingPartyMember } from '@/lib/storage';
import { WeddingPartyMember, WeddingPartyRole, WEDDING_PARTY_ROLE_LABELS } from '@/lib/types';

export default function WeddingParty() {
  const [members, setMembers] = useState<WeddingPartyMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<WeddingPartyMember | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'padrinho' as WeddingPartyRole,
    customRole: '',
    phone: '',
    email: '',
    side: 'groom' as 'groom' | 'bride',
    notes: '',
  });

  useEffect(() => {
    setMembers(getWeddingParty());
  }, []);

  const groomSide = members.filter(m => m.side === 'groom');
  const brideSide = members.filter(m => m.side === 'bride');

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'padrinho',
      customRole: '',
      phone: '',
      email: '',
      side: 'groom',
      notes: '',
    });
    setEditingMember(null);
  };

  const handleOpenDialog = (member?: WeddingPartyMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        customRole: member.customRole || '',
        phone: member.phone || '',
        email: member.email || '',
        side: member.side,
        notes: member.notes || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateWeddingPartyMember(editingMember.id, formData);
    } else {
      addWeddingPartyMember(formData);
    }
    setMembers(getWeddingParty());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este membro?')) {
      deleteWeddingPartyMember(id);
      setMembers(getWeddingParty());
    }
  };

  const MemberCard = ({ member }: { member: WeddingPartyMember }) => (
    <Card className="hover:shadow-romantic transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-light">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium">{member.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {member.role === 'outro' ? member.customRole : WEDDING_PARTY_ROLE_LABELS[member.role]}
            </Badge>
            {member.phone && (
              <p className="text-sm text-muted-foreground mt-2">{member.phone}</p>
            )}
            {member.email && (
              <p className="text-sm text-muted-foreground">{member.email}</p>
            )}
            {member.notes && (
              <p className="text-xs text-muted-foreground mt-2 italic">{member.notes}</p>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(member)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Padrinhos e Madrinhas</h1>
            <p className="text-muted-foreground">Gerencie os padrinhos e madrinhas do casamento</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
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
                    <Label>Função</Label>
                    <Select
                      value={formData.role}
                      onValueChange={v => setFormData({ ...formData, role: v as WeddingPartyRole })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(WEDDING_PARTY_ROLE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lado</Label>
                    <Select
                      value={formData.side}
                      onValueChange={v => setFormData({ ...formData, side: v as 'groom' | 'bride' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="groom">Noivo</SelectItem>
                        <SelectItem value="bride">Noiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.role === 'outro' && (
                  <div className="space-y-2">
                    <Label htmlFor="customRole">Função Personalizada</Label>
                    <Input
                      id="customRole"
                      value={formData.customRole}
                      onChange={e => setFormData({ ...formData, customRole: e.target.value })}
                      placeholder="Ex: Mestre de Cerimônias"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
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
                  {editingMember ? 'Salvar Alterações' : 'Adicionar Membro'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Two Columns */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Groom's Side */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Lado do Noivo</h2>
              <Badge variant="outline">{groomSide.length}</Badge>
            </div>
            <div className="space-y-3">
              {groomSide.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
              {groomSide.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Nenhum membro adicionado</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Bride's Side */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Lado da Noiva</h2>
              <Badge variant="outline">{brideSide.length}</Badge>
            </div>
            <div className="space-y-3">
              {brideSide.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
              {brideSide.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Nenhum membro adicionado</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
