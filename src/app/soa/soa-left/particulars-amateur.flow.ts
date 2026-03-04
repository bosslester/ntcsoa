import { MatDialog } from '@angular/material/dialog';
import { TxnTypeDialogComponent, TxnType } from './txn-type-dialog.component';
import { AmateurParticularsDialogComponent } from './amateur-particulars-dialog.component';

export function openAmateurParticularsFlow(
  dialog: MatDialog,
  cancel: () => void,
  finalize: (finalText: string, txn: TxnType) => void
) {
  const refAm = dialog.open(AmateurParticularsDialogComponent, {
    width: '560px',
    disableClose: true,
    autoFocus: false,
    restoreFocus: false,
  });

  refAm.afterClosed().subscribe((resAm) => {
    if (!resAm?.amateurChoice) {
      cancel();
      return;
    }

    const choice = String(resAm.amateurChoice ?? '').trim();

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
      const finalText = `Amateur - ${choice} - ${txnText}`;
      finalize(finalText, txn);
    });
  });
}