import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GuestProfile } from '../../models/guest-profile.model';

@Component({
  selector: 'app-documents-tab',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-black text-[#1B3A5C] uppercase tracking-widest">Guest Identification</h3>
        <button mat-flat-button class="!bg-[#1B3A5C] !text-white !font-bold !rounded-xl">
          <mat-icon class="mr-1">upload_file</mat-icon>
          Upload New
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (doc of guest.documents; track doc.id) {
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <mat-icon>{{doc.type === 'Passport' ? 'public' : 'badge'}}</mat-icon>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-slate-900 mb-0.5 truncate">{{doc.type}}</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Expires {{doc.expiryDate | date:'dd MMM yyyy'}}</p>
              </div>
              <div class="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100/50">
                Active
              </div>
            </div>

            <div class="flex items-center gap-2 pt-4 border-t border-slate-50">
              <button class="flex-1 h-9 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                Preview
              </button>
              <button class="w-9 h-9 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <mat-icon class="!text-sm !w-4 !h-4">download</mat-icon>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-16 flex flex-col items-center justify-center text-center">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <mat-icon class="text-4xl text-slate-200">folder_off</mat-icon>
            </div>
            <h3 class="text-lg font-black text-slate-900 mb-1">No documents found</h3>
            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest max-w-[200px]">Guest identity documents have not been uploaded yet</p>
          </div>
        }
      </div>
    </div>
  `
})
export class DocumentsTabComponent {
  @Input({ required: true }) guest!: GuestProfile;
}
