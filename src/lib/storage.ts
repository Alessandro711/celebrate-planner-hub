import { Guest, WeddingPartyMember, Vendor, BudgetCategory, Task, WeddingSettings } from './types';

const STORAGE_KEYS = {
  guests: 'wedding_guests',
  weddingParty: 'wedding_party',
  vendors: 'wedding_vendors',
  budgetCategories: 'wedding_budget_categories',
  tasks: 'wedding_tasks',
  settings: 'wedding_settings',
} as const;

// Generic storage functions
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Guests
export function getGuests(): Guest[] {
  return getItem<Guest[]>(STORAGE_KEYS.guests, []);
}

export function saveGuests(guests: Guest[]): void {
  setItem(STORAGE_KEYS.guests, guests);
}

export function addGuest(guest: Omit<Guest, 'id'>): Guest {
  const guests = getGuests();
  const newGuest: Guest = { ...guest, id: crypto.randomUUID() };
  guests.push(newGuest);
  saveGuests(guests);
  return newGuest;
}

export function updateGuest(id: string, updates: Partial<Guest>): void {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index !== -1) {
    guests[index] = { ...guests[index], ...updates };
    saveGuests(guests);
  }
}

export function deleteGuest(id: string): void {
  const guests = getGuests().filter(g => g.id !== id);
  saveGuests(guests);
}

// Wedding Party
export function getWeddingParty(): WeddingPartyMember[] {
  return getItem<WeddingPartyMember[]>(STORAGE_KEYS.weddingParty, []);
}

export function saveWeddingParty(members: WeddingPartyMember[]): void {
  setItem(STORAGE_KEYS.weddingParty, members);
}

export function addWeddingPartyMember(member: Omit<WeddingPartyMember, 'id'>): WeddingPartyMember {
  const members = getWeddingParty();
  const newMember: WeddingPartyMember = { ...member, id: crypto.randomUUID() };
  members.push(newMember);
  saveWeddingParty(members);
  return newMember;
}

export function updateWeddingPartyMember(id: string, updates: Partial<WeddingPartyMember>): void {
  const members = getWeddingParty();
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...updates };
    saveWeddingParty(members);
  }
}

export function deleteWeddingPartyMember(id: string): void {
  const members = getWeddingParty().filter(m => m.id !== id);
  saveWeddingParty(members);
}

// Vendors
export function getVendors(): Vendor[] {
  return getItem<Vendor[]>(STORAGE_KEYS.vendors, []);
}

export function saveVendors(vendors: Vendor[]): void {
  setItem(STORAGE_KEYS.vendors, vendors);
}

export function addVendor(vendor: Omit<Vendor, 'id'>): Vendor {
  const vendors = getVendors();
  const newVendor: Vendor = { ...vendor, id: crypto.randomUUID() };
  vendors.push(newVendor);
  saveVendors(vendors);
  return newVendor;
}

export function updateVendor(id: string, updates: Partial<Vendor>): void {
  const vendors = getVendors();
  const index = vendors.findIndex(v => v.id === id);
  if (index !== -1) {
    vendors[index] = { ...vendors[index], ...updates };
    saveVendors(vendors);
  }
}

export function deleteVendor(id: string): void {
  const vendors = getVendors().filter(v => v.id !== id);
  saveVendors(vendors);
}

// Budget Categories
export function getBudgetCategories(): BudgetCategory[] {
  const defaultCategories: BudgetCategory[] = [
    { id: '1', name: 'Local e Recepção', planned: 0, spent: 0, color: 'rose' },
    { id: '2', name: 'Buffet e Bebidas', planned: 0, spent: 0, color: 'gold' },
    { id: '3', name: 'Decoração', planned: 0, spent: 0, color: 'sage' },
    { id: '4', name: 'Fotografia e Vídeo', planned: 0, spent: 0, color: 'champagne' },
    { id: '5', name: 'Música e Entretenimento', planned: 0, spent: 0, color: 'rose' },
    { id: '6', name: 'Vestuário e Beleza', planned: 0, spent: 0, color: 'gold' },
    { id: '7', name: 'Convites e Papelaria', planned: 0, spent: 0, color: 'sage' },
    { id: '8', name: 'Outros', planned: 0, spent: 0, color: 'champagne' },
  ];
  return getItem<BudgetCategory[]>(STORAGE_KEYS.budgetCategories, defaultCategories);
}

export function saveBudgetCategories(categories: BudgetCategory[]): void {
  setItem(STORAGE_KEYS.budgetCategories, categories);
}

export function updateBudgetCategory(id: string, updates: Partial<BudgetCategory>): void {
  const categories = getBudgetCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    saveBudgetCategories(categories);
  }
}

// Tasks
export function getTasks(): Task[] {
  const defaultTasks: Task[] = [
    { id: '1', title: 'Definir data e horário', completed: false, phase: '12+ meses', priority: 'high' },
    { id: '2', title: 'Definir orçamento total', completed: false, phase: '12+ meses', priority: 'high' },
    { id: '3', title: 'Escolher local da cerimônia', completed: false, phase: '12+ meses', priority: 'high' },
    { id: '4', title: 'Escolher local da festa', completed: false, phase: '12+ meses', priority: 'high' },
    { id: '5', title: 'Contratar cerimonialista', completed: false, phase: '9-12 meses', priority: 'medium' },
    { id: '6', title: 'Contratar fotógrafo e videomaker', completed: false, phase: '9-12 meses', priority: 'high' },
    { id: '7', title: 'Escolher buffet', completed: false, phase: '9-12 meses', priority: 'high' },
    { id: '8', title: 'Montar lista de convidados', completed: false, phase: '9-12 meses', priority: 'medium' },
    { id: '9', title: 'Escolher padrinhos e madrinhas', completed: false, phase: '6-9 meses', priority: 'medium' },
    { id: '10', title: 'Escolher vestido de noiva', completed: false, phase: '6-9 meses', priority: 'high' },
    { id: '11', title: 'Escolher traje do noivo', completed: false, phase: '6-9 meses', priority: 'medium' },
    { id: '12', title: 'Contratar decoração', completed: false, phase: '6-9 meses', priority: 'medium' },
    { id: '13', title: 'Contratar música/DJ', completed: false, phase: '6-9 meses', priority: 'medium' },
    { id: '14', title: 'Enviar convites', completed: false, phase: '3-6 meses', priority: 'high' },
    { id: '15', title: 'Definir cardápio', completed: false, phase: '3-6 meses', priority: 'medium' },
    { id: '16', title: 'Prova de vestido', completed: false, phase: '1-3 meses', priority: 'high' },
    { id: '17', title: 'Confirmar lista de convidados', completed: false, phase: '1-3 meses', priority: 'high' },
    { id: '18', title: 'Ensaio fotográfico', completed: false, phase: '1-3 meses', priority: 'low' },
    { id: '19', title: 'Reunião final com fornecedores', completed: false, phase: 'Última semana', priority: 'high' },
    { id: '20', title: 'Confirmar horários e detalhes', completed: false, phase: 'Última semana', priority: 'high' },
  ];
  return getItem<Task[]>(STORAGE_KEYS.tasks, defaultTasks);
}

export function saveTasks(tasks: Task[]): void {
  setItem(STORAGE_KEYS.tasks, tasks);
}

export function addTask(task: Omit<Task, 'id'>): Task {
  const tasks = getTasks();
  const newTask: Task = { ...task, id: crypto.randomUUID() };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): void {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
  }
}

export function deleteTask(id: string): void {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
}

// Settings
export function getSettings(): WeddingSettings {
  const defaultSettings: WeddingSettings = {
    coupleName: '',
    weddingDate: '',
    totalBudget: 0,
    venue: '',
  };
  return getItem<WeddingSettings>(STORAGE_KEYS.settings, defaultSettings);
}

export function saveSettings(settings: WeddingSettings): void {
  setItem(STORAGE_KEYS.settings, settings);
}
