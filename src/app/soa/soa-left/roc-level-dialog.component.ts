import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type RocLevelDialogData = { base: 'RTG' | 'PHN' };
export type RocLevelDialogResult = { value: string }; // 1RTG / 2RTG / 3RTG or 1PHN / 2PHN / 3PHN

@Component({
  selector: 'app-roc-level-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">Select {{ data.base }} Level</div>

      <div class="btnGrid">
        <button type="button" class="pickBtn" (click)="pick(1)">1{{ data.base }}</button>
        <button type="button" class="pickBtn" (click)="pick(2)">2{{ data.base }}</button>
        <button type="button" class="pickBtn" (click)="pick(3)">3{{ data.base }}</button>
      </div>

      <div class="dlgFoot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg { width: 420px; max-width: 92vw; padding: 14px; font-family: Arial, sans-serif; }
    .dlgHead { font-size: 18px; font-weight: 700; margin-bottom: 12px; }

    .btnGrid { display: grid; grid-template-columns: 1fr; gap: 10px; }
    .pickBtn {
      height: 54px;
      border: 1px solid #bbb;
      border-radius: 10px;
      background: #fff;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
    }
    .pickBtn:hover { border-color: #2f74ff; }

    .dlgFoot { margin-top: 14px; display: flex; justify-content: flex-end; }
    .btn { height: 34px; padding: 0 12px; border: 1px solid #999; background: #fff; border-radius: 6px; cursor: pointer; }
  `]
})
export class RocLevelDialogComponent {
  constructor(
    private ref: MatDialogRef<RocLevelDialogComponent, RocLevelDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: RocLevelDialogData
  ) {}

  pick(level: 1 | 2 | 3) {
    const value = `${level}${this.data.base}`;
    this.ref.close({ value });
  }

  close() {
    this.ref.close();
  }
}