import { MatDialog } from '@angular/material/dialog';
import { TxnType } from './txn-type-dialog.component';

import { ShipStationMainDialogComponent, ShipMain,} from './ship-station-main-dialog.component';

import { openShipStationLicenseFlow, ShipStationLicensePicked, } from './particulars-shipstation-license.flow';

import { openCoastalParticularsFlow } from './particulars-coastal.flow';

export function openShipStationParticularsFlow(
  dialog: MatDialog,
  cancel: () => void,
  finalize: (finalText: string, txn?: TxnType) => void
): void {
  const refMain = dialog.open(ShipStationMainDialogComponent, {
    width: '640px',
    maxWidth: '92vw',
    panelClass: 'soa-dlg',
    disableClose: true,
    autoFocus: false,
    restoreFocus: false,
  });

  refMain.afterClosed().subscribe((r0) => {
    if (!r0?.value) { cancel(); return; }

    const main = r0.value as ShipMain;

    if (main === 'SHIP_STATION_LICENSE') {
      openShipStationLicenseFlow(dialog, cancel, (picked: ShipStationLicensePicked) => {
        const txnText = picked.txn === 'MOD' ? 'MODIFICATION' : picked.txn;

        const powerText =
          picked.power === 'HIGH_POWERED'
            ? 'HIGH POWERED'
            : picked.power === 'MEDIUM_POWERED' || (picked.power as any) === 'HF_VHF_POWERED'
            ? 'MEDIUM POWERED'
            : (picked.power as any) === 'SESCL_LRIT_SSAS_SESFB'
            ? 'SESCL/LRIT/SSAS/SESFB'
            : 'LOW POWERED';

        const scopeText = picked.scope;

        const codeText =
          picked.scope === 'INTERNATIONAL' && (picked as any).intlCode
            ? ` - ${(picked as any).intlCode}`
            : '';

        const finalText = `SHIP STATION LICENSE - ${scopeText} - ${powerText}${codeText} - ${txnText}`;

        const txnForForm: TxnType =
          picked.txn === 'RENEW' ? 'RENEW' : picked.txn === 'MOD' ? 'MOD' : 'NEW';

        finalize(finalText, txnForForm);
      });
      return;
    }

    if (main === 'SHIP_EARTH_STATION_LICENSE') { finalize('SHIP EARTH STATION LICENSE'); return; }
    if (main === 'DELETION_CERTIFICATE') { finalize('DELETION CERTIFICATE'); return; }
    if (main === 'COASTAL_STATION_LICENSE') { openCoastalParticularsFlow(dialog, cancel, finalize); return; }

    cancel();
  });
}