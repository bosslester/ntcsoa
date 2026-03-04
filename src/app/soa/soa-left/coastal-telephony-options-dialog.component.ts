import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type ShipTxn = 'NEW' | 'RENEW' | 'MOD' | 'DUPLICATE';
export type CoastalTelephonyPower = 'HF' | 'VHF';

export type CoastalTelephonyOptionsDialogResult = {
  txn: ShipTxn;
  power: CoastalTelephonyPower;
};

@Component({
  selector: 'app-coastal-telephony-options-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">Coastal Station - Radio Telephony</div>
      <div class="sub">Choose transaction + band</div>

      <div class="grid">
        <!-- TXN -->
        <div class="col">
          <div class="colHead">Transaction</div>

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

        <!-- POWER -->
        <div class="col">
          <div class="colHead">Band</div>

          <label class="row" (click)="pickPower('HF')">
            <input class="cb" type="checkbox" [checked]="power==='HF'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="power==='HF'"></span>
            <span class="txt">HF</span>
          </label>

          <label class="row" (click)="pickPower('VHF')">
            <input class="cb" type="checkbox" [checked]="power==='VHF'" tabindex="-1" aria-hidden="true" />
            <span class="box" [class.on]="power==='VHF'"></span>
            <span class="txt">VHF</span>
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
    .dlg { width:560px; max-width:92vw; padding:14px; box-sizing:border-box; overflow-x:hidden; font-family:Arial,sans-serif; background:#fff; }
    .dlgHead { font-size:18px; font-weight:700; margin-bottom:4px; }
    .sub { font-size:13px; font-weight:700; margin-bottom:10px; opacity:.85; }

    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
    .colHead { font-size:13px; font-weight:800; margin-bottom:8px; }
    .row { display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; font-size:14px; user-select:none; padding:2px 0; }

    .cb{ position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
    .box{ width:14px; height:14px; border:1px solid #333; border-radius:2px; background:#fff; display:inline-block; position:relative; flex:0 0 14px; }
    .box.on::after{ content:""; position:absolute; left:3px; top:3px; width:7px; height:4px; border-left:2px solid #2f74ff; border-bottom:2px solid #2f74ff; transform:rotate(-45deg); }

    .dlgFoot { margin-top:14px; display:flex; justify-content:flex-end; gap:8px; }
    .btn { height:34px; padding:0 12px; border:1px solid #999; background:#fff; border-radius:6px; cursor:pointer; }
    .btn.primary { border-color:#2f74ff; background:#2f74ff; color:#fff; }
    .btn:disabled { opacity:.55; cursor:not-allowed; }

    @media (max-width: 520px){
      .grid{ grid-template-columns: 1fr; }
    }
  `]
})
export class CoastalTelephonyOptionsDialogComponent {
  txn: ShipTxn | null = null;
  power: CoastalTelephonyPower | null = null;

  constructor(private ref: MatDialogRef<CoastalTelephonyOptionsDialogComponent, CoastalTelephonyOptionsDialogResult>) {}

  pickTxn(v: ShipTxn) { this.txn = v; }
  pickPower(v: CoastalTelephonyPower) { this.power = v; }

  submit() {
    if (!this.txn || !this.power) return;
    this.ref.close({ txn: this.txn, power: this.power });
  }

  close() { this.ref.close(); }
}