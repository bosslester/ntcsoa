import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type RocSubtype =
  | 'RTG'
  | 'PHN'
  | 'SROP'
  | 'GROC'
  | 'RROC-AIRCRAFT'
  | 'TEMP-FOREIGN-PILOT'
  | 'RROC-RLM';

export type RocSubtypeDialogResult = { value: RocSubtype };

@Component({
  selector: 'app-roc-subtype-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">ROC Subtype</div>

      <div class="btnGrid">
        <button type="button" class="pickBtn" (click)="pick('RTG')">RTG</button>
        <button type="button" class="pickBtn" (click)="pick('PHN')">PHN</button>

        <button type="button" class="pickBtn" (click)="pick('SROP')">SROP</button>
        <button type="button" class="pickBtn" (click)="pick('GROC')">GROC</button>

        <button type="button" class="pickBtn wide" (click)="pick('RROC-AIRCRAFT')">RROC - Aircraft</button>
        <button type="button" class="pickBtn wide" (click)="pick('TEMP-FOREIGN-PILOT')">Temporary ROC - Foreign Pilot</button>
        <button type="button" class="pickBtn wide" (click)="pick('RROC-RLM')">RROC - RLM</button>
      </div>

      <div class="dlgFoot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg { width: 520px; max-width: 92vw; padding: 14px; font-family: Arial, sans-serif; }
    .dlgHead { font-size: 18px; font-weight: 700; margin-bottom: 12px; }

    .btnGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .pickBtn {
      height: 56px;
      border: 1px solid #bbb;
      border-radius: 10px;
      background: #fff;
      cursor: pointer;
      font-weight: 700;
      font-size: 13px;
    }
    .pickBtn:hover { border-color: #2f74ff; }
    .wide { grid-column: 1 / -1; }

    .dlgFoot { margin-top: 14px; display: flex; justify-content: flex-end; }
    .btn { height: 34px; padding: 0 12px; border: 1px solid #999; background: #fff; border-radius: 6px; cursor: pointer; }
  `]
})
export class RocSubtypeDialogComponent {
  constructor(private ref: MatDialogRef<RocSubtypeDialogComponent, RocSubtypeDialogResult>) {}

  pick(value: RocSubtype) {
    this.ref.close({ value });
  }

  close() {
    this.ref.close();
  }
}