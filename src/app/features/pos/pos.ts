import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Food' | 'Beverage' | 'Dessert';
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <!-- Menu Section -->
      <div class="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
        <div class="flex items-center justify-between sticky top-0 bg-surface-50 py-2 z-10">
          <h2 class="text-2xl font-bold text-surface-900">Restaurant POS</h2>
          <div class="flex space-x-2">
            @for (cat of categories; track cat) {
              <button 
                (click)="selectedCategory.set(cat)"
                [class]="selectedCategory() === cat ? 'bg-brand-600 text-white' : 'bg-white text-surface-600 hover:bg-surface-100'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-surface-200"
              >
                {{cat}}
              </button>
            }
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (item of filteredMenu(); track item.id) {
            <div 
              (click)="addToCart(item)"
              (keydown.enter)="addToCart(item)"
              tabindex="0"
              role="button"
              class="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden group cursor-pointer hover:border-brand-500 transition-all"
            >
              <div class="h-40 overflow-hidden relative">
                <img [src]="item.image" [alt]="item.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer">
                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <mat-icon class="text-white text-3xl">add_shopping_cart</mat-icon>
                </div>
              </div>
              <div class="p-4">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-surface-900">{{item.name}}</h4>
                  <span class="text-brand-600 font-bold"><span>$</span>{{item.price}}</span>
                </div>
                <p class="text-xs text-surface-500">{{item.category}}</p>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Order Summary Section -->
      <div class="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col overflow-hidden sticky top-0 h-[calc(100vh-12rem)]">
        <div class="p-6 border-b border-surface-100">
          <h3 class="font-bold text-surface-900 flex items-center">
            <mat-icon class="mr-2 text-brand-600">receipt_long</mat-icon>
            Current Order
          </h3>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          @if (cart().length === 0) {
            <div class="flex flex-col items-center justify-center h-full text-surface-400 space-y-2">
              <mat-icon class="text-4xl">shopping_basket</mat-icon>
              <p class="text-sm">Your cart is empty</p>
            </div>
          } @else {
            @for (item of cart(); track item.id) {
              <div class="flex items-center justify-between group">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-lg bg-surface-100 flex items-center justify-center text-xs font-bold mr-3 overflow-hidden">
                    <img [src]="item.image" [alt]="item.name" class="w-full h-full object-cover" referrerpolicy="no-referrer">
                  </div>
                  <div>
                    <p class="text-sm font-bold text-surface-900">{{item.name}}</p>
                    <p class="text-xs text-surface-500">
                      {{item.quantity}} x <span>$</span>{{item.price}}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-bold text-surface-900"><span>$</span>{{item.price * item.quantity}}</span>
                  <button (click)="removeFromCart(item.id)" class="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <mat-icon class="text-sm">delete</mat-icon>
                  </button>
                </div>
              </div>
            }
          }
        </div>

        <div class="p-6 bg-surface-50 border-t border-surface-100 space-y-4">
          <div class="space-y-2">
            <div class="flex justify-between text-sm text-surface-500">
              <span>Subtotal</span>
              <span><span>$</span>{{subtotal()}}</span>
            </div>
            <div class="flex justify-between text-sm text-surface-500">
              <span>Tax (10%)</span>
              <span><span>$</span>{{tax()}}</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-surface-900 pt-2 border-t border-surface-200">
              <span>Total</span>
              <span><span>$</span>{{total()}}</span>
            </div>
          </div>

          <button 
            [disabled]="cart().length === 0"
            class="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pos {
  categories = ['All', 'Food', 'Beverage', 'Dessert'];
  selectedCategory = signal('All');

  menuItems: MenuItem[] = [
    { id: 'm1', name: 'Classic Burger', price: 12, category: 'Food', image: 'https://picsum.photos/seed/burger/400/300' },
    { id: 'm2', name: 'Margherita Pizza', price: 15, category: 'Food', image: 'https://picsum.photos/seed/pizza/400/300' },
    { id: 'm3', name: 'Caesar Salad', price: 10, category: 'Food', image: 'https://picsum.photos/seed/salad/400/300' },
    { id: 'm4', name: 'Iced Coffee', price: 5, category: 'Beverage', image: 'https://picsum.photos/seed/coffee/400/300' },
    { id: 'm5', name: 'Fresh Orange Juice', price: 6, category: 'Beverage', image: 'https://picsum.photos/seed/juice/400/300' },
    { id: 'm6', name: 'Chocolate Lava Cake', price: 8, category: 'Dessert', image: 'https://picsum.photos/seed/cake/400/300' },
    { id: 'm7', name: 'Fruit Platter', price: 9, category: 'Dessert', image: 'https://picsum.photos/seed/fruit/400/300' },
    { id: 'm8', name: 'Pasta Carbonara', price: 14, category: 'Food', image: 'https://picsum.photos/seed/pasta/400/300' },
  ];

  cart = signal<CartItem[]>([]);

  filteredMenu = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.menuItems;
    return this.menuItems.filter(item => item.category === cat);
  });

  subtotal = computed(() => this.cart().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  tax = computed(() => Math.round(this.subtotal() * 0.1));
  total = computed(() => this.subtotal() + this.tax());

  addToCart(item: MenuItem) {
    this.cart.update((current: CartItem[]) => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }

  removeFromCart(id: string) {
    this.cart.update((current: CartItem[]) => current.filter(i => i.id !== id));
  }
}
