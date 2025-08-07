import { FaHome, FaRobot, FaServer, FaCog, FaHistory, FaBell, FaChartLine } from 'react-icons/fa';
import { IconType } from 'react-icons';

export interface NavItem {
  path: string;
  icon: IconType;
  label: string;
  children?: NavItem[];
}

export const navigationItems: NavItem[] = [
  { path: '/', icon: FaHome, label: 'Dashboard' },
  { path: '/agents', icon: FaRobot, label: 'Agent Status' },
  { path: '/system', icon: FaServer, label: 'System Health' },
  { path: '/settings', icon: FaCog, label: 'Settings' }
];

export interface ToolItem {
  icon: IconType;
  label: string;
  action: () => void;
}

export const toolItems: ToolItem[] = [
  { icon: FaCog, label: 'Configuration', action: () => console.log('Configuration clicked') },
  { icon: FaHistory, label: 'Recent Activity', action: () => console.log('Recent Activity clicked') },
  { icon: FaBell, label: 'Notifications', action: () => console.log('Notifications clicked') },
  { icon: FaChartLine, label: 'Analytics', action: () => console.log('Analytics clicked') }
]; 