import { Injectable, signal, computed } from '@angular/core';
import { GuestProfile, GuestType } from '../models/guest-profile.model';
import { GUESTS_MOCK } from '../guest-profiles-mock';

@Injectable({
  providedIn: 'root'
})
export class GuestProfilesService {
  private guests = signal<GuestProfile[]>(GUESTS_MOCK);
  
  selectedGuestId = signal<string | null>(GUESTS_MOCK[0].id);
  searchQuery = signal('');
  typeFilter = signal<string>('All Guests');

  filteredGuests = computed(() => {
    let list = this.guests();
    const query = this.searchQuery().toLowerCase();
    const filter = this.typeFilter();

    if (query) {
      list = list.filter(g => 
        g.firstName.toLowerCase().includes(query) || 
        g.lastName.toLowerCase().includes(query) ||
        g.phone.includes(query) ||
        g.email.toLowerCase().includes(query)
      );
    }

    if (filter !== 'All Guests') {
      const typeMap: Record<string, GuestType> = {
        'VIP Guests': 'VIP',
        'Repeat Guests': 'Repeat',
        'Corporate Guests': 'Corporate',
        'Blacklisted Guests': 'Blacklisted'
      };
      const requestedType = typeMap[filter];
      if (requestedType) {
        list = list.filter(g => g.type.includes(requestedType));
      }
    }

    return list;
  });

  selectedGuest = computed(() => {
    const id = this.selectedGuestId();
    return this.guests().find(g => g.id === id) || null;
  });

  selectGuest(id: string) {
    this.selectedGuestId.set(id);
  }

  setSearchQuery(q: string) {
    this.searchQuery.set(q);
  }

  setTypeFilter(f: string) {
    this.typeFilter.set(f);
  }
}
