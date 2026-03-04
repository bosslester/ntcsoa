import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type ParticularsDialogResult = { value: 'ROC' | 'Amateur' | 'ShipStation' };

@Component({
  selector: 'app-particulars-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">Select Service</div>

      <div class="btnGrid">
        <button type="button" class="pickBtn" (click)="pick('ROC')">
          <span class="txt">ROC</span>
        </button>

        <button type="button" class="pickBtn" (click)="pick('Amateur')">
          <span class="txt">Amateur</span>
        </button>

        <button type="button" class="pickBtn" (click)="pick('ShipStation')">
          <span class="txt">Ship Station</span>
        </button>
      </div>

      <div class="dlgFoot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg{ width:100%; max-width:92vw; padding:14px; box-sizing:border-box; overflow-x:hidden;
          font-family:Arial,sans-serif; background:#fff; }
    .dlgHead{ font-size:18px; font-weight:700; margin-bottom:12px; }
    .btnGrid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .pickBtn{ height:70px; border:1px solid #bbb; border-radius:10px; background:#fff;
              cursor:pointer; display:grid; place-items:center; }
    .pickBtn:hover{ border-color:#2f74ff; }
    .txt{ font-size:14px; font-weight:700; }
    .dlgFoot{ margin-top:14px; display:flex; justify-content:flex-end; }
    .btn{ height:34px; padding:0 12px; border:1px solid #999; background:#fff; border-radius:6px; cursor:pointer; }
  `]
})
export class ParticularsDialogComponent {
  constructor(
    private ref: MatDialogRef<ParticularsDialogComponent, ParticularsDialogResult>
  ) {}

  pick(value: 'ROC' | 'Amateur' | 'ShipStation') {
    this.ref.close({ value });
  }

  close() {
    this.ref.close();
  }
}