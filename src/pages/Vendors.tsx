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
import { subscribeToVendors, addVendor, updateVendor, deleteVendor } from '@/lib/storage';
import { Vendor, VendorCategory, VendorPayment, VENDOR_CATEGORY_LABELS } from '@/lib/types';

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({ name: '', category: 'other' as VendorCategory, contact: '', phone: '', email: '', totalValue: 0, notes: '' });

  useEffect(() => { const unsub = subscribeToVendors(setVendors); return () => unsub(); }, []);

  useEffect(() => { if (selectedVendor) setSelectedVendor(vendors.find(v => v.id === selectedVendor.id) || null); }, [vendors]);

  const resetForm = () => { setFormData({ name: '', category: 'other', contact: '', phone: '', email: '', totalValue: 0, notes: '' }); setEditingVendor(null); };

  const handleOpenDialog = (vendor?: Vendor) => {
    if (vendor) { setEditingVendor(vendor); setFormData({ name: vendor.name, category: vendor.category, contact: vendor.contact || '', phone: vendor.phone || '', email: vendor.email || '', totalValue: vendor.totalValue, notes: vendor.notes || '' }); }
    else resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVendor) await updateVendor(editingVendor.id, { ...formData, payments: editingVendor.payments });
    else await addVendor({ ...formData, payments: [] });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => { if (confirm('Remover fornecedor?')) { await deleteVendor(id); if (selectedVendor?.id === id) setSelectedVendor(null); } };

  const handleAddPayment = async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    const newPayment: VendorPayment = { id: crypto.randomUUID(), amount: 0, dueDate: new Date().toISOString().split('T')[0], paid: false, description: `Parcela ${vendor.payments.length + 1}` };
    await updateVendor(vendorId, { payments: [...vendor.payments, newPayment] });
  };

  const handleUpdatePayment = async (vendorId: string, paymentId: string, updates: Partial<VendorPayment>) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    await updateVendor(vendorId, { payments: vendor.payments.map(p => p.id === paymentId ? { ...p, ...updates } : p) });
  };

  const handleDeletePayment = async (vendorId: string, paymentId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    await updateVendor(vendorId, { payments: vendor.payments.filter(p => p.id !== paymentId) });
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const totalContracted = vendors.reduce((a, v) => a + v.totalValue, 0);
  const totalPaid = vendors.reduce((a, v) => a + v.payments.filter(p => p.paid).reduce((s, p) => s + p.amount, 0), 0);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><h1 className="font-display text-3xl font-bold">Fornecedores</h1></div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button onClick={() => handleOpenDialog()} className="gap-2"><Plus className="h-4 w-4" />Adicionar</Button></DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>{editingVendor ? 'Editar' : 'Novo'} Fornecedor</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Nome *</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Categoria</Label><Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v as VendorCategory })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(VENDOR_CATEGORY_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Valor Total</Label><Input type="number" value={formData.totalValue} onChange={e => setFormData({ ...formData, totalValue: Number(e.target.value) })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Telefone</Label><Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Observações</Label><Textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
                <Button type="submit" className="w-full">{editingVendor ? 'Salvar' : 'Adicionar'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-full bg-rose-light p-2"><Store className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold">{vendors.length}</p><p className="text-sm text-muted-foreground">Fornecedores</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-full bg-gold-light p-2"><DollarSign className="h-5 w-5 text-gold" /></div><div><p className="text-2xl font-bold">{formatCurrency(totalContracted)}</p><p className="text-sm text-muted-foreground">Total Contratado</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-full bg-sage-light p-2"><CheckCircle className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p><p className="text-sm text-muted-foreground">Total Pago</p></div></div></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-medium text-lg">Lista de Fornecedores</h2>
            {vendors.map(vendor => {
              const paidAmount = vendor.payments.filter(p => p.paid).reduce((s, p) => s + p.amount, 0);
              return (
                <Card key={vendor.id} className={`cursor-pointer transition-all ${selectedVendor?.id === vendor.id ? 'ring-2 ring-primary' : 'hover:shadow-romantic'}`} onClick={() => setSelectedVendor(vendor)}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2"><h3 className="font-medium">{vendor.name}</h3><Badge variant="secondary">{VENDOR_CATEGORY_LABELS[vendor.category]}</Badge></div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">{vendor.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{vendor.phone}</span>}</div>
                        <p className="text-sm"><span className="text-success font-medium">{formatCurrency(paidAmount)}</span> / {formatCurrency(vendor.totalValue)}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleOpenDialog(vendor); }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleDelete(vendor.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {vendors.length === 0 && <Card className="border-dashed"><CardContent className="py-12 text-center"><Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" /><p className="text-muted-foreground">Nenhum fornecedor</p></CardContent></Card>}
          </div>

          <div className="space-y-3">
            <h2 className="font-medium text-lg">Pagamentos</h2>
            {selectedVendor ? (
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center justify-between">{selectedVendor.name}<Button size="sm" variant="outline" onClick={() => handleAddPayment(selectedVendor.id)}><Plus className="h-4 w-4 mr-1" />Parcela</Button></CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {selectedVendor.payments.length === 0 ? <p className="text-center text-muted-foreground py-4">Nenhuma parcela</p> : selectedVendor.payments.map(payment => (
                    <div key={payment.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Checkbox checked={payment.paid} onCheckedChange={c => handleUpdatePayment(selectedVendor.id, payment.id, { paid: !!c })} />
                      <div className="flex-1 space-y-1">
                        <Input value={payment.description || ''} onChange={e => handleUpdatePayment(selectedVendor.id, payment.id, { description: e.target.value })} className="h-7 text-sm" />
                        <div className="flex gap-2">
                          <Input type="number" value={payment.amount} onChange={e => handleUpdatePayment(selectedVendor.id, payment.id, { amount: Number(e.target.value) })} className="h-7 text-sm w-28" />
                          <Input type="date" value={payment.dueDate} onChange={e => handleUpdatePayment(selectedVendor.id, payment.id, { dueDate: e.target.value })} className="h-7 text-sm" />
                        </div>
                      </div>
                      <Badge className={payment.paid ? 'bg-sage-light text-success' : 'bg-gold-light text-warning'}>{payment.paid ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeletePayment(selectedVendor.id, payment.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : <Card className="border-dashed"><CardContent className="py-12 text-center"><p className="text-muted-foreground">Selecione um fornecedor</p></CardContent></Card>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
