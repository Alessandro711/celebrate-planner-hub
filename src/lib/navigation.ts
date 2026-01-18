import { Heart, Users, UserCheck, Wallet, Store, CheckSquare, Settings, LayoutDashboard } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Convidados',
    href: '/guests',
    icon: Users,
  },
  {
    title: 'Padrinhos',
    href: '/wedding-party',
    icon: Heart,
  },
  {
    title: 'Orçamento',
    href: '/budget',
    icon: Wallet,
  },
  {
    title: 'Fornecedores',
    href: '/vendors',
    icon: Store,
  },
  {
    title: 'Checklist',
    href: '/checklist',
    icon: CheckSquare,
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
];
