import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type AmateurChoice =
  | 'AT-ROC'
  | 'AT-RSL Class A'
  | 'AT-RSL Class B'
  | 'AT-RSL Class C'
  | 'AT-RSL Class D'
  | 'AT-LIFETIME'
  | 'AT-CLUB RSL Simplex'
  | 'AT-CLUB RSL Repeater'
  | 'Temporary Permit - Class A (Foreign Visitor)'
  | 'Temporary Permit - Class B (Foreign Visitor)'
  | 'Temporary Permit - Class C (Foreign Visitor)'
  | 'Special Permit - Special Event Call Sign (per event)'
  | 'Special Permit - Vanity Call Sign (per year)';

export type AmateurParticularsDialogResult = { amateurChoice: AmateurChoice };

type Item = { label: string; value: AmateurChoice; hint?: string };

@Component({
  selector: 'app-amateur-particulars-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">Select Amateur Particular</div>

      <!-- ✅ Search WITHOUT ngModel -->
      <input
        class="search"
        type="text"
        placeholder="Search (Class A, Lifetime, Permit...)"
        (input)="onSearch($event)"
      />

      <div class="listWrap">
        <div class="grid">
          <button
            type="button"
            class="item"
            *ngFor="let it of filtered"
            (click)="pick(it.value)"
            [title]="it.label"
          >
            <div class="label">{{ it.label }}</div>
            <div class="hint" *ngIf="it.hint">{{ it.hint }}</div>
          </button>
        </div>

        <div class="empty" *ngIf="filtered.length === 0">No match.</div>
      </div>

      <div class="dlgFoot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg{ width:520px; max-width:92vw; padding:14px; box-sizing:border-box; overflow-x:hidden;
          font-family:Arial,sans-serif; background:#fff; }
    .dlgHead{ font-size:18px; font-weight:700; margin-bottom:10px; }

    .search{
      width:100%;
      height:34px;
      border:1px solid #bbb;
      border-radius:8px;
      padding:0 10px;
      box-sizing:border-box;
      margin-bottom:10px;
      outline:none;
    }
    .search:focus{ border-color:#2f74ff; }

    .listWrap{
      max-height: 62vh;
      overflow: auto;
      border: 1px solid #e6e6e6;
      border-radius: 10px;
      padding: 10px;
    }

    .grid{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap:10px;
    }

    .item{
      min-height:54px;
      border:1px solid #bbb;
      border-radius:10px;
      background:#fff;
      cursor:pointer;
      font-size:12.5px;
      font-weight:700;
      padding:10px;
      text-align:left;
      display:flex;
      flex-direction:column;
      gap:4px;
    }
    .item:hover{ border-color:#2f74ff; }

    .label{ font-size:12.8px; font-weight:700; }
    .hint{ font-size:11px; font-weight:400; opacity:.85; }

    .empty{
      padding:14px;
      text-align:center;
      font-size:12px;
      opacity:.7;
    }

    .dlgFoot{ margin-top:14px; display:flex; justify-content:flex-end; }
    .btn{ height:34px; padding:0 12px; border:1px solid #999; background:#fff; border-radius:6px; cursor:pointer; }
  `]
})
export class AmateurParticularsDialogComponent {
  private q = '';

  items: Item[] = [
    { label: 'AT-ROC', value: 'AT-ROC', hint: 'Amateur ROC' },
    { label: 'AT-RSL Class A', value: 'AT-RSL Class A', hint: 'Radio Station License (Class A)' },
    { label: 'AT-RSL Class B', value: 'AT-RSL Class B', hint: 'Radio Station License (Class B)' },
    { label: 'AT-RSL Class C', value: 'AT-RSL Class C', hint: 'Radio Station License (Class C)' },
    { label: 'AT-RSL Class D', value: 'AT-RSL Class D', hint: 'Radio Station License (Class D)' },
    { label: 'AT-LIFETIME', value: 'AT-LIFETIME', hint: 'Lifetime license' },
    { label: 'AT-CLUB RSL Simplex', value: 'AT-CLUB RSL Simplex', hint: 'Club station (Simplex)' },
    { label: 'AT-CLUB RSL Repeater', value: 'AT-CLUB RSL Repeater', hint: 'Club station (Repeater)' },

    { label: 'Temporary Permit - Class A (Foreign Visitor)', value: 'Temporary Permit - Class A (Foreign Visitor)', hint: 'Temporary permit' },
    { label: 'Temporary Permit - Class B (Foreign Visitor)', value: 'Temporary Permit - Class B (Foreign Visitor)', hint: 'Temporary permit' },
    { label: 'Temporary Permit - Class C (Foreign Visitor)', value: 'Temporary Permit - Class C (Foreign Visitor)', hint: 'Temporary permit' },

    { label: 'Special Permit - Special Event Call Sign (per event)', value: 'Special Permit - Special Event Call Sign (per event)', hint: 'Special permit' },
    { label: 'Special Permit - Vanity Call Sign (per year)', value: 'Special Permit - Vanity Call Sign (per year)', hint: 'Special permit' },
  ];

  filtered: Item[] = [...this.items];

  constructor(
    private ref: MatDialogRef<AmateurParticularsDialogComponent, AmateurParticularsDialogResult>
  ) {}

  onSearch(ev: Event) {
    const v = (ev.target as HTMLInputElement).value || '';
    this.q = v.trim().toLowerCase();

    if (!this.q) {
      this.filtered = [...this.items];
      return;
    }

    this.filtered = this.items.filter(it => {
      const hay = `${it.label} ${it.hint ?? ''}`.toLowerCase();
      return hay.includes(this.q);
    });
  }

  pick(amateurChoice: AmateurChoice) {
    this.ref.close({ amateurChoice });
  }

  close() {
    this.ref.close();
  }
}