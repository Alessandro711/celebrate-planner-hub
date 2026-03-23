import { Guest, WeddingPartyMember, Vendor, BudgetCategory, Task, WeddingSettings } from './types';
import { database, ref, get, set, onValue } from './firebase';
import { getCurrentUserId } from './auth';

function getUserPath(subPath: string): string {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  return `weddings/${uid}/${subPath}`;
}

const dataCache: Record<string, any> = {};

const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: '1', name: 'Local e Recepção', planned: 0, spent: 0, color: 'rose' },
  { id: '2', name: 'Buffet e Bebidas', planned: 0, spent: 0, color: 'gold' },
  { id: '3', name: 'Decoração', planned: 0, spent: 0, color: 'sage' },
  { id: '4', name: 'Fotografia e Vídeo', planned: 0, spent: 0, color: 'champagne' },
  { id: '5', name: 'Música e Entretenimento', planned: 0, spent: 0, color: 'rose' },
  { id: '6', name: 'Vestuário e Beleza', planned: 0, spent: 0, color: 'gold' },
  { id: '7', name: 'Convites e Papelaria', planned: 0, spent: 0, color: 'sage' },
  { id: '8', name: 'Outros', planned: 0, spent: 0, color: 'champagne' },
];

const DEFAULT_TASKS: Task[] = [
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

const DEFAULT_SETTINGS: WeddingSettings = {
  coupleName: '',
  weddingDate: '',
  totalBudget: 0,
  venue: '',
};

async function getFromFirebase<T>(path: string, defaultValue: T): Promise<T> {
  try {
    const snapshot = await get(ref(database, path));
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (Array.isArray(defaultValue) && typeof data === 'object' && !Array.isArray(data)) {
        return Object.values(data) as T;
      }
      return data as T;
    }
    await setToFirebase(path, defaultValue);
    return defaultValue;
  } catch (error) {
    console.error('Error reading from Firebase:', error);
    return defaultValue;
  }
}

async function setToFirebase<T>(path: string, value: T): Promise<void> {
  try {
    await set(ref(database, path), value);
    dataCache[path] = value;
  } catch (error) {
    console.error('Error writing to Firebase:', error);
  }
}

export function subscribeToData<T>(
  path: string,
  defaultValue: T,
  callback: (data: T) => void
): () => void {
  const dbRef = ref(database, path);

  const unsubscribe = onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (Array.isArray(defaultValue) && typeof data === 'object' && !Array.isArray(data)) {
        callback(Object.values(data) as T);
      } else {
        callback(data as T);
      }
    } else {
      callback(defaultValue);
    }
  }, (error) => {
    console.error('Firebase subscription error:', error);
    callback(defaultValue);
  });

  return unsubscribe;
}

// Guests
export async function getGuests(): Promise<Guest[]> {
  return getFromFirebase<Guest[]>(getUserPath('guests'), []);
}
export async function saveGuests(guests: Guest[]): Promise<void> {
  await setToFirebase(getUserPath('guests'), guests);
}
export async function addGuest(guest: Omit<Guest, 'id'>): Promise<Guest> {
  const guests = await getGuests();
  const newGuest: Guest = { ...guest, id: crypto.randomUUID() };
  guests.push(newGuest);
  await saveGuests(guests);
  return newGuest;
}
export async function updateGuest(id: string, updates: Partial<Guest>): Promise<void> {
  const guests = await getGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index !== -1) { guests[index] = { ...guests[index], ...updates }; await saveGuests(guests); }
}
export async function deleteGuest(id: string): Promise<void> {
  const guests = (await getGuests()).filter(g => g.id !== id);
  await saveGuests(guests);
}
export function subscribeToGuests(callback: (guests: Guest[]) => void): () => void {
  return subscribeToData<Guest[]>(getUserPath('guests'), [], callback);
}

// Wedding Party
export async function getWeddingParty(): Promise<WeddingPartyMember[]> {
  return getFromFirebase<WeddingPartyMember[]>(getUserPath('weddingParty'), []);
}
export async function saveWeddingParty(members: WeddingPartyMember[]): Promise<void> {
  await setToFirebase(getUserPath('weddingParty'), members);
}
export async function addWeddingPartyMember(member: Omit<WeddingPartyMember, 'id'>): Promise<WeddingPartyMember> {
  const members = await getWeddingParty();
  const newMember: WeddingPartyMember = { ...member, id: crypto.randomUUID() };
  members.push(newMember);
  await saveWeddingParty(members);
  return newMember;
}
export async function updateWeddingPartyMember(id: string, updates: Partial<WeddingPartyMember>): Promise<void> {
  const members = await getWeddingParty();
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) { members[index] = { ...members[index], ...updates }; await saveWeddingParty(members); }
}
export async function deleteWeddingPartyMember(id: string): Promise<void> {
  const members = (await getWeddingParty()).filter(m => m.id !== id);
  await saveWeddingParty(members);
}
export function subscribeToWeddingParty(callback: (members: WeddingPartyMember[]) => void): () => void {
  return subscribeToData<WeddingPartyMember[]>(getUserPath('weddingParty'), [], callback);
}

// Vendors
export async function getVendors(): Promise<Vendor[]> {
  return getFromFirebase<Vendor[]>(getUserPath('vendors'), []);
}
export async function saveVendors(vendors: Vendor[]): Promise<void> {
  await setToFirebase(getUserPath('vendors'), vendors);
}
export async function addVendor(vendor: Omit<Vendor, 'id'>): Promise<Vendor> {
  const vendors = await getVendors();
  const newVendor: Vendor = { ...vendor, id: crypto.randomUUID() };
  vendors.push(newVendor);
  await saveVendors(vendors);
  return newVendor;
}
export async function updateVendor(id: string, updates: Partial<Vendor>): Promise<void> {
  const vendors = await getVendors();
  const index = vendors.findIndex(v => v.id === id);
  if (index !== -1) { vendors[index] = { ...vendors[index], ...updates }; await saveVendors(vendors); }
}
export async function deleteVendor(id: string): Promise<void> {
  const vendors = (await getVendors()).filter(v => v.id !== id);
  await saveVendors(vendors);
}
export function subscribeToVendors(callback: (vendors: Vendor[]) => void): () => void {
  return subscribeToData<Vendor[]>(getUserPath('vendors'), [], callback);
}

// Budget Categories
export async function getBudgetCategories(): Promise<BudgetCategory[]> {
  return getFromFirebase<BudgetCategory[]>(getUserPath('budgetCategories'), DEFAULT_BUDGET_CATEGORIES);
}
export async function saveBudgetCategories(categories: BudgetCategory[]): Promise<void> {
  await setToFirebase(getUserPath('budgetCategories'), categories);
}
export async function updateBudgetCategory(id: string, updates: Partial<BudgetCategory>): Promise<void> {
  const categories = await getBudgetCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) { categories[index] = { ...categories[index], ...updates }; await saveBudgetCategories(categories); }
}
export function subscribeToBudgetCategories(callback: (categories: BudgetCategory[]) => void): () => void {
  return subscribeToData<BudgetCategory[]>(getUserPath('budgetCategories'), DEFAULT_BUDGET_CATEGORIES, callback);
}

// Tasks
export async function getTasks(): Promise<Task[]> {
  return getFromFirebase<Task[]>(getUserPath('tasks'), DEFAULT_TASKS);
}
export async function saveTasks(tasks: Task[]): Promise<void> {
  await setToFirebase(getUserPath('tasks'), tasks);
}
export async function addTask(task: Omit<Task, 'id'>): Promise<Task> {
  const tasks = await getTasks();
  const newTask: Task = { ...task, id: crypto.randomUUID() };
  tasks.push(newTask);
  await saveTasks(tasks);
  return newTask;
}
export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  const tasks = await getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) { tasks[index] = { ...tasks[index], ...updates }; await saveTasks(tasks); }
}
export async function deleteTask(id: string): Promise<void> {
  const tasks = (await getTasks()).filter(t => t.id !== id);
  await saveTasks(tasks);
}
export function subscribeToTasks(callback: (tasks: Task[]) => void): () => void {
  return subscribeToData<Task[]>(getUserPath('tasks'), DEFAULT_TASKS, callback);
}

// Settings
export async function getSettings(): Promise<WeddingSettings> {
  return getFromFirebase<WeddingSettings>(getUserPath('settings'), DEFAULT_SETTINGS);
}
export async function saveSettings(settings: WeddingSettings): Promise<void> {
  await setToFirebase(getUserPath('settings'), settings);
}
export function subscribeToSettings(callback: (settings: WeddingSettings) => void): () => void {
  return subscribeToData<WeddingSettings>(getUserPath('settings'), DEFAULT_SETTINGS, callback);
}
