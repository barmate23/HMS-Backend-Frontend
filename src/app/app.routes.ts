import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) 
  },
  { 
    path: 'reservations', 
    loadComponent: () => import('./pages/reservation-center/reservation-center').then(m => m.ReservationCenter) 
  },
  { 
    path: 'arrivals', 
    loadComponent: () => import('./pages/arrivals/arrivals').then(m => m.ArrivalsPage) 
  },
  { 
    path: 'departures', 
    loadComponent: () => import('./pages/departures/departures').then(m => m.DeparturesPage) 
  },
  { 
    path: 'in-house', 
    loadComponent: () => import('./pages/in-house/in-house').then(m => m.InHousePage) 
  },
  { 
    path: 'room-rack', 
    loadComponent: () => import('./pages/room-rack/room-rack').then(m => m.RoomRackPage) 
  },
  { 
    path: 'guest-profile', 
    loadComponent: () => import('./pages/guest-profile/guest-profile').then(m => m.GuestsPage) 
  },
  { 
    path: 'night-audit', 
    loadComponent: () => import('./pages/night-audit/night-audit').then(m => m.NightAuditPage) 
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./pages/reports/reports').then(m => m.ReportsPage) 
  },
];
