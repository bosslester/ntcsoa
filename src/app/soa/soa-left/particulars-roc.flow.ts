import { MatDialog } from '@angular/material/dialog';
import { TxnTypeDialogComponent, TxnType } from './txn-type-dialog.component';
import { RocSubtypeDialogComponent } from './roc-subtype-dialog.component';
import { RocLevelDialogComponent } from './roc-level-dialog.component';

export function openRocParticularsFlow(
  dialog: MatDialog,
  cancel: () => void,
  finalize: (finalText: string, txn: TxnType) => void
) {
  const ref2 = dialog.open(RocSubtypeDialogComponent, {
    width: '520px',
    disableClose: true,
    autoFocus: false,
    restoreFocus: false,
  });

  ref2.afterClosed().subscribe((res2) => {
    if (!res2?.value) {
      cancel();
      return;
    }

    const subtype = String(res2.value ?? '').trim().toUpperCase();

    const openTxn = (base: string) => {
      const refTxn = dialog.open(TxnTypeDialogComponent, {
        width: '460px',
        disableClose: true,
        autoFocus: false,
        restoreFocus: false,
      });

      refTxn.afterClosed().subscribe((resTxn) => {
        if (!resTxn?.value) {
          cancel();
          return;
        }

        const txn = resTxn.value as TxnType;
        const txnText = txn === 'MOD' ? 'MODIFICATION' : txn;
        finalize(`${base} - ${txnText}`, txn);
      });
    };

    // RTG/PHN needs level dialog
    if (subtype === 'RTG' || subtype === 'PHN') {
      const refLevel = dialog.open(RocLevelDialogComponent, {
        width: '420px',
        disableClose: true,
        autoFocus: false,
        restoreFocus: false,
        data: { base: subtype },
      });

      refLevel.afterClosed().subscribe((resL) => {
        if (!resL?.value) {
          cancel();
          return;
        }

        const leveled = String(resL.value ?? '').trim().toUpperCase(); // 1RTG/2RTG/3RTG...
        openTxn(`ROC - ${leveled}`);
      });

      return;
    }

    openTxn(`ROC - ${subtype}`);
  });
}