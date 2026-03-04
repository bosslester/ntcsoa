import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type CoastalKind = 'RADIO_TELEGRAPHY' | 'RADIO_TELEPHONY';
export type CoastalKindDialogResult = { value: CoastalKind };

@Component({
  selector: 'app-coastal-kind-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">Coastal Station License</div>
      <div class="sub">Choose service</div>

      <div class="list">
        <label class="row" (click)="pick('RADIO_TELEGRAPHY')">
          <input class="cb" type="checkbox" [checked]="selected==='RADIO_TELEGRAPHY'" tabindex="-1" aria-hidden="true" />
          <span class="box" [class.on]="selected==='RADIO_TELEGRAPHY'"></span>
          <span class="txt">Radio Telegraphy</span>
        </label>

        <label class="row" (click)="pick('RADIO_TELEPHONY')">
          <input class="cb" type="checkbox" [checked]="selected==='RADIO_TELEPHONY'" tabindex="-1" aria-hidden="true" />
          <span class="box" [class.on]="selected==='RADIO_TELEPHONY'"></span>
          <span class="txt">Radio Telephony</span>
        </label>
      </div>

      <div class="dlgFoot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
        <button type="button" class="btn primary" [disabled]="!selected" (click)="submit()">Submit</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg { width:460px; max-width:92vw; padding:14px; box-sizing:border-box; overflow-x:hidden; font-family:Arial,sans-serif; background:#fff; }
    .dlgHead { font-size:18px; font-weight:700; margin-bottom:4px; }
    .sub { font-size:13px; font-weight:700; margin-bottom:10px; opacity:.85; }
    .list { display:grid; gap:8px; padding-left:2px; }
    .row { display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; font-size:14px; user-select:none; }

    .cb{ position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
    .box{ width:14px; height:14px; border:1px solid #333; border-radius:2px; background:#fff; display:inline-block; position:relative; flex:0 0 14px; }
    .box.on::after{ content:""; position:absolute; left:3px; top:3px; width:7px; height:4px; border-left:2px solid #2f74ff; border-bottom:2px solid #2f74ff; transform:rotate(-45deg); }

    .dlgFoot { margin-top:14px; display:flex; justify-content:flex-end; gap:8px; }
    .btn { height:34px; padding:0 12px; border:1px solid #999; background:#fff; border-radius:6px; cursor:pointer; }
    .btn.primary { border-color:#2f74ff; background:#2f74ff; color:#fff; }
    .btn:disabled { opacity:.55; cursor:not-allowed; }
  `]
})
export class CoastalKindDialogComponent {
  selected: CoastalKind | null = null;

  constructor(private ref: MatDialogRef<CoastalKindDialogComponent, CoastalKindDialogResult>) {}

  pick(v: CoastalKind) { this.selected = v; }
  submit() { if (this.selected) this.ref.close({ value: this.selected }); }
  close() { this.ref.close(); }
}