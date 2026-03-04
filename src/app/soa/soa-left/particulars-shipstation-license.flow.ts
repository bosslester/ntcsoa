import { MatDialog } from '@angular/material/dialog';

import {ShipStationLicenseScopeDialogComponent,ShipLicenseScope,} from './ship-station-license-scope-dialog.component';

// DOMESTIC dialog (txn + power)
import { ShipStationLicenseOptionsDialogComponent,ShipTxn,ShipPower,ShipStationLicenseOptionsResult, } from './ship-station-license-options-dialog.component';

// INTERNATIONAL dialog (telegraphy) + code picker
import {ShipStationInternationalTelegraphyDialogComponent,ShipStationInternationalTelegraphyDialogResult,
    ShipStationIntlCodeDialogComponent,ShipIntlCodeResult,ShipIntlCode,
} from './ship-station-international-code-dialog.component';

// =====================
// RETURN TYPE
// =====================
export type ShipStationLicensePicked = {
  scope: ShipLicenseScope;
  txn: ShipTxn;
  power: ShipPower;
  intlCode?: ShipIntlCode; // ✅ only for INTERNATIONAL SESCL/LRIT/SSAS/SESFB
};

export function openShipStationLicenseFlow(
  dialog: MatDialog,
  cancel: () => void,
  done: (picked: ShipStationLicensePicked) => void
): void {
  // 1) scope (DOMESTIC / INTERNATIONAL)
  const ref1 = dialog.open(ShipStationLicenseScopeDialogComponent, {
    width: '460px',
    maxWidth: '92vw',
    panelClass: 'soa-dlg',
    disableClose: true,
    autoFocus: false,
    restoreFocus: false,
  });

  ref1.afterClosed().subscribe((r1: { value?: ShipLicenseScope } | undefined) => {
    if (!r1?.value) {
      cancel();
      return;
    }

    const scope = r1.value as ShipLicenseScope;

    // ==========================================================
    // A) DOMESTIC -> open the domestic dialog you already have
    // ==========================================================
    if (scope === 'DOMESTIC') {
      const ref2 = dialog.open(ShipStationLicenseOptionsDialogComponent, {
        width: '720px',
        maxWidth: '92vw',
        panelClass: 'soa-dlg',
        disableClose: true,
        autoFocus: false,
        restoreFocus: false,
        data: { scope }, // optional, if your domestic UI needs label
      });

      ref2.afterClosed().subscribe((r2: ShipStationLicenseOptionsResult | undefined) => {
        if (!r2?.txn || !r2?.power) {
          cancel();
          return;
        }

        done({
          scope,
          txn: r2.txn as ShipTxn,
          power: r2.power as ShipPower,
        });
      });

      return;
    }

    // ==========================================================
    // B) INTERNATIONAL -> open International (Telegraphy) dialog
    // ==========================================================
    const refIntl = dialog.open(ShipStationInternationalTelegraphyDialogComponent, {
      width: '720px',
      maxWidth: '92vw',
      panelClass: 'soa-dlg',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
    });

    refIntl
      .afterClosed()
      .subscribe((ri: ShipStationInternationalTelegraphyDialogResult | undefined) => {
        if (!ri?.txn || !ri?.power) {
          cancel();
          return;
        }

        // ✅ special option requires code picker (SESCL/LRIT/SSAS/SESFB)
        if ((ri.power as any) === 'SESCL_LRIT_SSAS_SESFB') {
          const refCode = dialog.open(ShipStationIntlCodeDialogComponent, {
            width: '460px',
            maxWidth: '92vw',
            panelClass: 'soa-dlg',
            disableClose: true,
            autoFocus: false,
            restoreFocus: false,
          });

          refCode.afterClosed().subscribe((rc: ShipIntlCodeResult | undefined) => {
            if (!rc?.value) {
              cancel();
              return;
            }

            const code = rc.value as ShipIntlCode;

            // ✅ return picked with intlCode + power normalized to your main power type
            // We keep `power` as the special token OR you can map it to HIGH/MED/LOW if your compute expects that.
            done({
              scope,
              txn: ri.txn as ShipTxn,
              power: 'SESCL_LRIT_SSAS_SESFB' as any, // keep token for final string building
              intlCode: code,
            });
          });

          return;
        }

        // ✅ normal international power values (HIGH/MED/LOW)
        done({
          scope,
          txn: ri.txn as ShipTxn,
          power: ri.power as ShipPower,
        });
      });
  });
}