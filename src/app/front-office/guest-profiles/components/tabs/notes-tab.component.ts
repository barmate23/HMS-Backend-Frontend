import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GuestProfile } from '../../models/guest-profile.model';

@Component({
  selector: 'app-notes-tab',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-black text-[#1B3A5C] uppercase tracking-widest">Guest Notes</h3>
        <button mat-flat-button class="!bg-[#FF8C42] !text-white !font-bold !rounded-xl">
          <mat-icon class="mr-1">add_comment</mat-icon>
          Add Note
        </button>
      </div>

      <div class="relative pl-6 space-y-6">
        <!-- Vertical Line -->
        <div class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

        @for (note of sortedNotes; track note.id) {
          <div class="relative group">
            <!-- Timeline Bullet -->
            <div class="absolute -left-[23px] top-4 w-2 h-2 rounded-full border-2 border-white transition-all"
                 [class.bg-orange-500]="note.isPinned"
                 [class.bg-slate-300]="!note.isPinned"></div>
            
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-50 relative">
              @if (note.isPinned) {
                <mat-icon class="absolute top-4 right-4 text-orange-400 !text-sm !w-4 !h-4">push_pin</mat-icon>
              }
              
              <div class="flex items-center gap-3 mb-3">
                <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                  {{getInitials(note.staffName)}}
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 leading-none">{{note.staffName}}</h4>
                  <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{{note.timestamp | date:'dd MMM yyyy • HH:mm'}}</p>
                </div>
              </div>
              
              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                {{note.content}}
              </p>

              <div class="mt-4 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                <button class="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1B3A5C]">Edit</button>
                <button class="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600">Delete</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="py-20 flex flex-col items-center justify-center text-center">
            <mat-icon class="text-4xl text-slate-100 mb-2">speaker_notes_off</mat-icon>
            <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">No notes for this guest</p>
          </div>
        }
      </div>
    </div>
  `
})
export class NotesTabComponent {
  @Input({ required: true }) guest!: GuestProfile;

  get sortedNotes() {
    return [...this.guest.notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('');
  }
}
