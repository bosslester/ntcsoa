import { MatDialog } from '@angular/material/dialog';
import { TxnType } from './txn-type-dialog.component';

import { CoastalKindDialogComponent, CoastalKind } from './coastal-kind-dialog.component';

import {
  CoastalTelephonyOptionsDialogComponent,
  ShipTxn,
  CoastalTelephonyPower,
} from './coastal-telephony-options-dialog.component';

import {
  CoastalTelegraphyOptionsDialogComponent,
  CoastalTelegraphyOptionsResult,
  CoastalTelegraphyPower,
} from './coastal-telegraphy-options-dialog.component';

export function openCoastalParticularsFlow(
  dialog: MatDialog,
  cancel: () => void,
  finalize: (finalText: string, txn?: TxnType) => void
): void {
  const refKind = dialog.open(CoastalKindDialogComponent, {
    width: '460px',
    maxWidth: '92vw',
    panelClass: 'soa-dlg',
    disableClose: true,
    autoFocus: false,
    restoreFocus: false,
  });

  refKind.afterClosed().subscribe((rk) => {
    if (!rk?.value) {
      cancel();
      return;
    }

    const kind = rk.value as CoastalKind;

    // ===================================================
    // RADIO TELEGRAPHY -> txn + powered HIGH/MEDIUM/LOW
    // ===================================================
    if (kind === 'RADIO_TELEGRAPHY') {
      const refOpts = dialog.open(CoastalTelegraphyOptionsDialogComponent, {
        width: '720px',
        maxWidth: '92vw',
        panelClass: 'soa-dlg',
        disableClose: true,
        autoFocus: false,
        restoreFocus: false,
      });

      refOpts.afterClosed().subscribe((ro: CoastalTelegraphyOptionsResult | undefined) => {
        if (!ro?.txn || !ro?.power) {
          cancel();
          return;
        }

        const txn = ro.txn as ShipTxn;
        const power = ro.power as CoastalTelegraphyPower;

        const txnText = txn === 'MOD' ? 'MODIFICATION' : txn;

        const powerText =
          power === 'HIGH_POWERED'
            ? 'HIGH POWERED'
            : power === 'MEDIUM_POWERED'
            ? 'MEDIUM POWERED'
            : 'LOW POWERED';

        const finalText = `COASTAL STATION LICENSE - RADIO TELEGRAPHY - ${powerText} - ${txnText}`;

        const txnForForm: TxnType =
          txn === 'RENEW' ? 'RENEW' : txn === 'MOD' ? 'MOD' : 'NEW';

        finalize(finalText, txnForForm);
      });

      return;
    }

    // ===================================================
    // RADIO TELEPHONY -> txn + band ONLY HF/VHF
    // ===================================================
    const refTel = dialog.open(CoastalTelephonyOptionsDialogComponent, {
      width: '720px',
      maxWidth: '92vw',
      panelClass: 'soa-dlg',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
    });

    refTel.afterClosed().subscribe((rt) => {
      if (!rt?.txn || !rt?.power) {
        cancel();
        return;
      }

      const txn = rt.txn as ShipTxn;
      const band = rt.power as CoastalTelephonyPower;

      const txnText = txn === 'MOD' ? 'MODIFICATION' : txn;

      const finalText = `COASTAL STATION LICENSE - RADIO TELEPHONY - ${band} - ${txnText}`;

      const txnForForm: TxnType =
        txn === 'RENEW' ? 'RENEW' : txn === 'MOD' ? 'MOD' : 'NEW';

      finalize(finalText, txnForForm);
    });
  });
}