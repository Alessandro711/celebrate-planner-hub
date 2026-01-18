import { useState, useEffect } from 'react';
import { Plus, Store, Trash2, Edit, Phone, Mail, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getVendors, addVendor, updateVendor, deleteVendor } from '@/lib/storage';
import { Vendor, VendorCategory, VendorPayment, VENDOR_CATEGORY_LABELS } from '@/lib/types';

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'other' as VendorCategory,
    contact: '',
    phone: '',
    email: '',
    totalValue: 0,
    notes: '',
  });

  useEffect(() => {
    setVendors(getVendors());
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'other',
      contact: '',
      phone: '',
      email: '',
      totalValue: 0,
      notes: '',
    });
    setEditingVendor(null);
  };

  const handleOpenDialog = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData({
        name: vendor.name,
        category: vendor.category,
        contact: vendor.contact || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        totalValue: vendor.totalValue,
        notes: vendor.notes || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVendor) {
      updateVendor(editingVendor.id, { ...formData, payments: editingVendor.payments });
    } else {
      addVendor({ ...formData, payments: [] });
    }
    setVendors(getVendors());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este fornecedor?')) {
      deleteVendor(id);
      setVendors(getVendors());
      if (selectedVendor?.id === id) {
        setSelectedVendor(null);
      }
    }
  };

  const handleAddPayment = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const newPayment: VendorPayment = {
      id: crypto.randomUUID(),
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      paid: false,
      description: `Parcela ${vendor.payments.length + 1}`,
    };

    updateVendor(vendorId, { payments: [...vendor.payments, newPayment] });
    setVendors(getVendors());
    setSelectedVendor(getVendors().find(v => v.id === vendorId) || null);
  };

  const handleUpdatePayment = (vendorId: string, paymentId: string, updates: Partial<VendorPayment>) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const updatedPayments = vendor.payments.map(p =>
      p.id === paymentId ? { ...p, ...updates } : p
    );

    updateVendor(vendorId, { payments: updatedPayments });
    setVendors(getVendors());
    setSelectedVendor(getVendors().find(v => v.id === vendorId) || null);
  };

  const handleDeletePayment = (vendorId: string, paymentId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    updateVendor(vendorId, { payments: vendor.payments.filter(p => p.id !== paymentId) });
    setVendors(getVendors());
    setSelectedVendor(getVendors().find(v => v.id === vendorId) || null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const totalContracted = vendors.reduce((acc, v) => acc + v.totalValue, 0);
  const totalPaid = vendors.reduce((acc, v) =>
    acc + v.payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0), 0
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Fornecedores</h1>
            <p className="text-muted-foreground">Gerencie seus fornecedores e pagamentos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingVendor ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Fornecedor *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={v => setFormData({ ...formData, category: v as VendorCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(VENDOR_CATEGORY_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalValue">Valor Total</Label>
                    <Input
                      id="totalValue"
                      type="number"
                      value={formData.totalValue}
                      onChange={e => setFormData({ ...formData, totalValue: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contato</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
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
                  {editingVendor ? 'Salvar Alterações' : 'Adicionar Fornecedor'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-rose-light p-2">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{vendors.length}</p>
                  <p className="text-sm text-muted-foreground">Fornecedores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gold-light p-2">
                  <DollarSign className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalContracted)}</p>
                  <p className="text-sm text-muted-foreground">Total Contratado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sage-light p-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
                  <p className="text-sm text-muted-foreground">Total Pago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor List */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-medium text-lg">Lista de Fornecedores</h2>
            {vendors.map(vendor => {
              const paidAmount = vendor.payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
              const isSelected = selectedVendor?.id === vendor.id;

              return (
                <Card
                  key={vendor.id}
                  className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary shadow-romantic' : 'hover:shadow-romantic'}`}
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{vendor.name}</h3>
                          <Badge variant="secondary">{VENDOR_CATEGORY_LABELS[vendor.category]}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {vendor.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {vendor.phone}
                            </span>
                          )}
                          {vendor.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {vendor.email}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">
                          <span className="text-success font-medium">{formatCurrency(paidAmount)}</span>
                          <span className="text-muted-foreground"> / {formatCurrency(vendor.totalValue)}</span>
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleOpenDialog(vendor); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(vendor.id); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {vendors.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nenhum fornecedor cadastrado</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <h2 className="font-medium text-lg">Pagamentos</h2>
            {selectedVendor ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {selectedVendor.name}
                    <Button size="sm" variant="outline" onClick={() => handleAddPayment(selectedVendor.id)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Parcela
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedVendor.payments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhuma parcela cadastrada
                    </p>
                  ) : (
                    selectedVendor.payments.map(payment => (
                      <div key={payment.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                        <Checkbox
                          checked={payment.paid}
                          onCheckedChange={(checked) =>
                            handleUpdatePayment(selectedVendor.id, payment.id, { paid: !!checked })
                          }
                        />
                        <div className="flex-1 space-y-1">
                          <Input
                            value={payment.description || ''}
                            onChange={e =>
                              handleUpdatePayment(selectedVendor.id, payment.id, { description: e.target.value })
                            }
                            className="h-7 text-sm"
                            placeholder="Descrição"
                          />
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={payment.amount}
                              onChange={e =>
                                handleUpdatePayment(selectedVendor.id, payment.id, { amount: Number(e.target.value) })
                              }
                              className="h-7 text-sm w-28"
                              placeholder="Valor"
                            />
                            <Input
                              type="date"
                              value={payment.dueDate}
                              onChange={e =>
                                handleUpdatePayment(selectedVendor.id, payment.id, { dueDate: e.target.value })
                              }
                              className="h-7 text-sm"
                            />
                          </div>
                        </div>
                        <Badge className={payment.paid ? 'bg-sage-light text-success' : 'bg-gold-light text-warning'}>
                          {payment.paid ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDeletePayment(selectedVendor.id, payment.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Selecione um fornecedor para ver os pagamentos</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
