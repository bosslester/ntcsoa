import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ShipTxn, ShipPower } from './ship-station-license-options-dialog.component';

/* ============================================================
   ✅ INTERNATIONAL TELEGRAPHY DIALOG (your UI)
   Exports:
     - ShipStationInternationalTelegraphyDialogComponent
     - ShipStationInternationalTelegraphyDialogResult
   ============================================================ */

export type ShipStationInternationalTelegraphyDialogResult = {
  txn: ShipTxn;
  power: ShipPower;
};

@Component({
  selector: 'app-ship-station-international-telegraphy-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">Ship Station License</div>
      <div class="sub">International (Telegraphy)</div>

      <div class="grid2">
        <!-- LEFT -->
        <div class="col">
          <div class="head">Transaction</div>

          <label class="row" (click)="pickTxn('NEW')">
            <input class="cb" type="checkbox" [checked]="txn==='NEW'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="txn==='NEW'"></span>
            <span class="txt">New</span>
          </label>

          <label class="row" (click)="pickTxn('RENEW')">
            <input class="cb" type="checkbox" [checked]="txn==='RENEW'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="txn==='RENEW'"></span>
            <span class="txt">Renew</span>
          </label>

          <label class="row" (click)="pickTxn('MOD')">
            <input class="cb" type="checkbox" [checked]="txn==='MOD'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="txn==='MOD'"></span>
            <span class="txt">Mod</span>
          </label>

          <label class="row" (click)="pickTxn('DUPLICATE')">
            <input class="cb" type="checkbox" [checked]="txn==='DUPLICATE'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="txn==='DUPLICATE'"></span>
            <span class="txt">Duplicate</span>
          </label>
        </div>

        <!-- RIGHT -->
        <div class="col">
          <div class="head">Powered / Option</div>

          <label class="row" (click)="pickPower('HIGH_POWERED')">
            <input class="cb" type="checkbox" [checked]="power==='HIGH_POWERED'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="power==='HIGH_POWERED'"></span>
            <span class="txt">High Powered</span>
          </label>

          <label class="row" (click)="pickPower('MEDIUM_POWERED')">
            <input class="cb" type="checkbox" [checked]="power==='MEDIUM_POWERED'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="power==='MEDIUM_POWERED'"></span>
            <span class="txt">Medium Powered</span>
          </label>

          <label class="row" (click)="pickPower('LOW_POWERED')">
            <input class="cb" type="checkbox" [checked]="power==='LOW_POWERED'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="power==='LOW_POWERED'"></span>
            <span class="txt">Low Powered</span>
          </label>

          <div class="divider"></div>

          <label class="row" (click)="pickPower('SESCL_LRIT_SSAS_SESFB')">
            <input class="cb" type="checkbox" [checked]="power==='SESCL_LRIT_SSAS_SESFB'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="power==='SESCL_LRIT_SSAS_SESFB'"></span>
            <span class="txt">SESCL/LRIT/SSAS/SESFB</span>
          </label>
        </div>
      </div>

      <div class="dlgFoot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
        <button type="button" class="btn primary" [disabled]="!txn || !power" (click)="submit()">Submit</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg { width: 720px; max-width: 94vw; padding: 14px; box-sizing: border-box; font-family: Arial,sans-serif; background:#fff; }
    .dlgHead { font-size: 20px; font-weight: 800; margin-bottom: 2px; }
    .sub { font-size: 13px; font-weight: 700; margin-bottom: 12px; opacity: .85; }
    .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 22px; align-items:start; }
    .col { display:grid; gap: 8px; }
    .head { font-size: 14px; font-weight: 800; margin-bottom: 2px; }
    .row { display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; font-size:14px; user-select:none; }
    .cb{ position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
    .box{ width:14px; height:14px; border:1px solid #333; border-radius:2px; background:#fff; display:inline-block; position:relative; flex:0 0 14px; }
    .box.on::after{ content:""; position:absolute; left:3px; top:3px; width:7px; height:4px; border-left:2px solid #2f74ff; border-bottom:2px solid #2f74ff; transform:rotate(-45deg); }
    .divider { height: 1px; background: #bbb; margin: 6px 0; }
    .dlgFoot { margin-top: 14px; display:flex; justify-content:flex-end; gap: 8px; }
    .btn { height:34px; padding:0 12px; border:1px solid #999; background:#fff; border-radius:6px; cursor:pointer; }
    .btn.primary { border-color:#2f74ff; background:#2f74ff; color:#fff; }
    .btn:disabled { opacity:.55; cursor:not-allowed; }
  `],
})
export class ShipStationInternationalTelegraphyDialogComponent {
  txn: ShipTxn | null = null;
  power: ShipPower | null = null;

  constructor(
    private ref: MatDialogRef<
      ShipStationInternationalTelegraphyDialogComponent,
      ShipStationInternationalTelegraphyDialogResult
    >
  ) {}

  pickTxn(v: ShipTxn) { this.txn = v; }
  pickPower(v: ShipPower) { this.power = v; }

  submit() {
    if (!this.txn || !this.power) return;
    this.ref.close({ txn: this.txn, power: this.power });
  }

  close() { this.ref.close(); }
}

/* ============================================================
   ✅ CODE PICKER DIALOG (SESCL / LRIT / SSAS / SESFB)
   Exports:
     - ShipStationIntlCodeDialogComponent
     - ShipIntlCode
     - ShipIntlCodeResult
   ============================================================ */

export type ShipIntlCode = 'SESCL' | 'LRIT' | 'SSAS' | 'SESFB';
export type ShipIntlCodeResult = { value?: ShipIntlCode };

@Component({
  selector: 'app-ship-station-intl-code-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">International Code</div>
      <div class="sub">Select SESCL / LRIT / SSAS / SESFB</div>

      <label class="row" (click)="pick('SESCL')">
        <input class="cb" type="checkbox" [checked]="val==='SESCL'" tabindex="-1" aria-hidden="true" />
        <span class="box" [class.on]="val==='SESCL'"></span>
        <span class="txt">SESCL</span>
      </label>

      <label class="row" (click)="pick('LRIT')">
        <input class="cb" type="checkbox" [checked]="val==='LRIT'" tabindex="-1" aria-hidden="true" />
        <span class="box" [class.on]="val==='LRIT'"></span>
        <span class="txt">LRIT</span>
      </label>

      <label class="row" (click)="pick('SSAS')">
        <input class="cb" type="checkbox" [checked]="val==='SSAS'" tabindex="-1" aria-hidden="true" />
        <span class="box" [class.on]="val==='SSAS'"></span>
        <span class="txt">SSAS</span>
      </label>

      <label class="row" (click)="pick('SESFB')">
        <input class="cb" type="checkbox" [checked]="val==='SESFB'" tabindex="-1" aria-hidden="true" />
        <span class="box" [class.on]="val==='SESFB'"></span>
        <span class="txt">SESFB</span>
      </label>

      <div class="dlgFoot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
        <button type="button" class="btn primary" [disabled]="!val" (click)="submit()">Submit</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg { width: 440px; max-width: 94vw; padding: 14px; box-sizing: border-box; font-family: Arial,sans-serif; background:#fff; }
    .dlgHead { font-size: 20px; font-weight: 800; margin-bottom: 2px; }
    .sub { font-size: 13px; font-weight: 700; margin-bottom: 12px; opacity: .85; }
    .row { display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; font-size:14px; user-select:none; margin: 6px 0; }
    .cb{ position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
    .box{ width:14px; height:14px; border:1px solid #333; border-radius:2px; background:#fff; display:inline-block; position:relative; flex:0 0 14px; }
    .box.on::after{ content:""; position:absolute; left:3px; top:3px; width:7px; height:4px; border-left:2px solid #2f74ff; border-bottom:2px solid #2f74ff; transform:rotate(-45deg); }
    .dlgFoot { margin-top: 14px; display:flex; justify-content:flex-end; gap: 8px; }
    .btn { height:34px; padding:0 12px; border:1px solid #999; background:#fff; border-radius:6px; cursor:pointer; }
    .btn.primary { border-color:#2f74ff; background:#2f74ff; color:#fff; }
    .btn:disabled { opacity:.55; cursor:not-allowed; }
  `],
})
export class ShipStationIntlCodeDialogComponent {
  val: ShipIntlCode | null = null;

  constructor(
    private ref: MatDialogRef<ShipStationIntlCodeDialogComponent, ShipIntlCodeResult>
  ) {}

  pick(v: ShipIntlCode) { this.val = v; }

  submit() {
    if (!this.val) return;
    this.ref.close({ value: this.val });
  }

  close() { this.ref.close(); }
}