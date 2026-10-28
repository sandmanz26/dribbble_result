import type { Role } from '@/data/clinic'

// Role-based access. The menu shows only what a role may open; a direct link to anything else
// shows a "no access" screen instead of the data.
export type Mod = 'today' | 'registration' | 'queue' | 'vitals' | 'consult' | 'lab' | 'pharmacy' | 'cashier' | 'patients' | 'schedule' | 'inventory' | 'integrations' | 'reports' | 'asa' | 'activity' | 'settings'
const ALL: Mod[] = ['today', 'registration', 'queue', 'vitals', 'consult', 'lab', 'pharmacy', 'cashier', 'patients', 'schedule', 'inventory', 'integrations', 'reports', 'asa', 'activity', 'settings']
export const ACCESS: Record<Role, Mod[]> = {
  admin: ALL,
  manager: ALL,
  frontdesk: ['today', 'registration', 'queue', 'patients', 'schedule', 'asa', 'activity'],
  nurse: ['today', 'queue', 'vitals', 'lab', 'patients'],
  doctor: ['today', 'queue', 'consult', 'lab', 'patients', 'schedule'],
  pharmacist: ['today', 'pharmacy', 'inventory', 'asa', 'activity'],
  cashier: ['today', 'cashier', 'queue', 'activity'],
}
export const can = (r: Role, m: Mod) => ACCESS[r].includes(m)
