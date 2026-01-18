export type GuestStatus = 'confirmed' | 'pending' | 'declined';
export type GuestGroup = 'family_groom' | 'family_bride' | 'friends' | 'work' | 'other';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: GuestStatus;
  group: GuestGroup;
  companions: number;
  dietaryRestrictions?: string;
  notes?: string;
}

export type WeddingPartyRole = 'padrinho' | 'madrinha' | 'padrinho_alianca' | 'madrinha_velas' | 'daminha' | 'pajem' | 'outro';

export interface WeddingPartyMember {
  id: string;
  name: string;
  role: WeddingPartyRole;
  customRole?: string;
  phone?: string;
  email?: string;
  side: 'groom' | 'bride';
  notes?: string;
}

export type VendorCategory = 'venue' | 'catering' | 'photography' | 'video' | 'music' | 'decoration' | 'cake' | 'flowers' | 'dress' | 'suit' | 'invitations' | 'other';

export interface VendorPayment {
  id: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  description?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contact?: string;
  phone?: string;
  email?: string;
  totalValue: number;
  payments: VendorPayment[];
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
  color: 'rose' | 'gold' | 'sage' | 'champagne';
}

export type TaskPhase = '12+ meses' | '9-12 meses' | '6-9 meses' | '3-6 meses' | '1-3 meses' | 'Última semana' | 'Dia do casamento';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  phase: TaskPhase;
  priority: TaskPriority;
  dueDate?: string;
}

export interface WeddingSettings {
  coupleName: string;
  weddingDate: string;
  totalBudget: number;
  venue?: string;
}

export const GUEST_STATUS_LABELS: Record<GuestStatus, string> = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
  declined: 'Recusado',
};

export const GUEST_GROUP_LABELS: Record<GuestGroup, string> = {
  family_groom: 'Família do Noivo',
  family_bride: 'Família da Noiva',
  friends: 'Amigos',
  work: 'Trabalho',
  other: 'Outros',
};

export const WEDDING_PARTY_ROLE_LABELS: Record<WeddingPartyRole, string> = {
  padrinho: 'Padrinho',
  madrinha: 'Madrinha',
  padrinho_alianca: 'Padrinho de Aliança',
  madrinha_velas: 'Madrinha de Velas',
  daminha: 'Daminha',
  pajem: 'Pajem',
  outro: 'Outro',
};

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  venue: 'Local',
  catering: 'Buffet',
  photography: 'Fotografia',
  video: 'Vídeo',
  music: 'Música/DJ',
  decoration: 'Decoração',
  cake: 'Bolo',
  flowers: 'Flores',
  dress: 'Vestido',
  suit: 'Traje',
  invitations: 'Convites',
  other: 'Outros',
};

export const TASK_PHASE_ORDER: TaskPhase[] = [
  '12+ meses',
  '9-12 meses',
  '6-9 meses',
  '3-6 meses',
  '1-3 meses',
  'Última semana',
  'Dia do casamento',
];
