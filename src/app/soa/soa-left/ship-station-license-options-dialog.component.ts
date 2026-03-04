import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type ShipTxn = 'NEW' | 'RENEW' | 'MOD' | 'DUPLICATE';

// ✅ shared union so flow accepts international option too
export type ShipPower =
  | 'HIGH_POWERED'
  | 'MEDIUM_POWERED'
  | 'LOW_POWERED'
  | 'SESCL_LRIT_SSAS_SESFB';

export type ShipStationLicenseOptionsResult = {
  txn: ShipTxn;
  power: ShipPower;
};

// ✅ alias (if any file still imports DialogResult)
export type ShipStationLicenseOptionsDialogResult = ShipStationLicenseOptionsResult;

@Component({
  selector: 'app-ship-station-license-options-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="title">Ship Station License</div>
      <div class="sub">Choose transaction + power (Domestic)</div>

      <div class="grid">
        <!-- LEFT: TRANSACTION -->
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

        <!-- RIGHT: POWER -->
        <div class="col">
          <div class="head">Powered</div>

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
        </div>
      </div>

      <div class="foot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
        <button type="button" class="btn primary" [disabled]="!txn || !power" (click)="submit()">Submit</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg{ width: 760px; max-width: 92vw; padding: 14px 16px; box-sizing: border-box; font-family: Arial, sans-serif; background:#fff; }
    .title{ font-size: 22px; font-weight: 800; margin: 2px 0 2px; }
    .sub{ font-size: 13px; color:#333; margin: 0 0 10px; }
    .grid{ display:grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items:start; margin-top: 4px; }
    .head{ font-weight: 800; font-size: 14px; margin-bottom: 6px; }
    .col{ display:grid; gap: 6px; }
    .row{ display:flex; align-items:center; gap: 10px; cursor:pointer; user-select:none; font-weight: 700; font-size: 14px; }
    .cb{ position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
    .box{ width: 14px; height: 14px; border: 1px solid #333; border-radius: 2px; background:#fff; display:inline-block; position:relative; flex: 0 0 14px; }
    .box.on::after{
      content:""; position:absolute; left: 3px; top: 3px; width: 7px; height: 4px;
      border-left: 2px solid #2f74ff; border-bottom: 2px solid #2f74ff; transform: rotate(-45deg);
    }
    .foot{ display:flex; justify-content:flex-end; gap: 10px; margin-top: 16px; }
    .btn{ height: 34px; padding: 0 14px; border: 1px solid #999; background:#fff; border-radius: 6px; cursor:pointer; }
    .btn.primary{ border-color:#2f74ff; background:#2f74ff; color:#fff; }
    .btn:disabled{ opacity:.55; cursor:not-allowed; }
  `],
})
export class ShipStationLicenseOptionsDialogComponent {
  txn: ShipTxn | null = null;
  power: ShipPower | null = null;

  constructor(
    private ref: MatDialogRef<ShipStationLicenseOptionsDialogComponent, ShipStationLicenseOptionsResult>
  ) {}

  pickTxn(v: ShipTxn) { this.txn = v; }
  pickPower(v: ShipPower) { this.power = v; }

  submit() {
    if (!this.txn || !this.power) return;
    this.ref.close({ txn: this.txn, power: this.power });
  }

  close() { this.ref.close(); }
}