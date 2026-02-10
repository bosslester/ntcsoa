import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, combineLatest, startWith } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type RocRow = {
  roc: number;
  dst: number;
};

@Component({
  selector: 'app-soa-fees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './soa-fees.component.html',
  styleUrls: ['./soa-fees.component.css'],
})
export class SoaFeesComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() mode: 'left' | 'mid' = 'left';

  private destroy$ = new Subject<void>();

  // =========================
  // ROC TABLE
  // =========================
  private readonly ROC_TABLE: Record<string, RocRow> = {
    'RTG 1st': { roc: 180, dst: 30 },
    'RTG 2nd': { roc: 120, dst: 30 },
    'RTG 3rd': { roc: 60, dst: 30 },

    'PHN 1st': { roc: 120, dst: 30 },
    'PHN 2nd': { roc: 100, dst: 30 },
    'PHN 3rd': { roc: 60, dst: 30 },

    'RROC- AIRCRAFT': { roc: 100, dst: 30 },
    'SROP': { roc: 60, dst: 30 },
    'GROC': { roc: 60, dst: 30 },
    'RROC-RLM': { roc: 60, dst: 30 },
  };

  // =========================
  // TOTAL AMOUNT FIELDS
  // =========================
  private readonly TOTAL_FIELDS: string[] = [
    // LICENSES
    'licPermitToPurchase',
    'licFilingFee',
    'licPermitToPossess',
    'licConstructionPermitFee',
    'licRadioStationLicense',
    'licInspectionFee',
    'licSUF',
    'licFinesPenalties',
    'licSurcharges',

    // OTHER APPLICATION
    'appRegistrationFee',
    'appSupervisionRegulationFee',
    'appVerificationAuthFee',
    'appExaminationFee',
    'appClearanceCertificationFee',
    'appModificationFee',
    'appMiscIncome',
    'appOthers',

    // PERMITS
    'perPermitFees',
    'perInspectionFee',
    'perFilingFee',
    'perSurcharges',

    // AMATEUR & ROC
    'amRadioStationLicense',
    'amRadioOperatorsCert',
    'amApplicationFee',
    'amFilingFee',
    'amSeminarFee',
    'amSurcharges',

    // DST
    'dst',
  ];

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    if (!this.form) return;

    this.setupRocComputation();
    this.setupTotalComputation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =====================================================
  // ROC + DST COMPUTATION (IF–ELSE)
  // =====================================================
  private setupRocComputation(): void {
    const certCtrl = this.form.get('amRadioOperatorsCert');
    const dstCtrl = this.form.get('dst');

    if (!certCtrl || !dstCtrl) return;

    const isNewCtrl = this.pickCtrl([
      'isNew',
      'new',
      'chkNew',
      'isNEW',
      'newApplication',
    ]);

    const classCtrl = this.pickCtrl([
      'rocClass',
      'rocOperator',
      'operator',
      'rocType',
      'classRoc',
      'roc',
    ]);

    const yearsCtrl = this.pickCtrl([
      'rocYears',
      'years',
      'numberOfYears',
      'noOfYears',
      'rocYr',
      'yr',
    ]);

    if (!isNewCtrl || !classCtrl || !yearsCtrl) return;

    combineLatest([
      isNewCtrl.valueChanges.pipe(startWith(isNewCtrl.value)),
      classCtrl.valueChanges.pipe(startWith(classCtrl.value)),
      yearsCtrl.valueChanges.pipe(startWith(yearsCtrl.value)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isNew, rocClass, years]) => {
        if (!this.toBool(isNew)) {
          this.safePatch(dstCtrl, 0);
          this.safePatch(certCtrl, 0);
        } else if (!rocClass) {
          this.safePatch(dstCtrl, 0);
          this.safePatch(certCtrl, 0);
        } else if (!this.ROC_TABLE[String(rocClass).trim()]) {
          this.safePatch(dstCtrl, 0);
          this.safePatch(certCtrl, 0);
        } else {
          const row = this.ROC_TABLE[String(rocClass).trim()];
          const yrs = this.toNumber(years);
          const safeYears = yrs > 0 ? yrs : 0;

          const dst = row.dst;
          const total = row.roc * safeYears + dst;

          this.safePatch(dstCtrl, dst);
          this.safePatch(certCtrl, total);
        }
      });
  }

  // =====================================================
  // TOTAL AMOUNT COMPUTATION (ALL FIELDS)
  // =====================================================
  private setupTotalComputation(): void {
    const totalCtrl = this.form.get('totalAmount');
    if (!totalCtrl) return;

    const feeCtrls = this.TOTAL_FIELDS
      .map(name => this.form.get(name))
      .filter((c): c is AbstractControl => !!c);

    combineLatest(
      feeCtrls.map(ctrl => ctrl.valueChanges.pipe(startWith(ctrl.value)))
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        let total = 0;

        for (const val of values) {
          const num = Number(val);
          if (!isNaN(num)) {
            total += num;
          }
        }

        totalCtrl.patchValue(total, { emitEvent: false });
      });
  }

  // =====================================================
  // HELPERS
  // =====================================================
  private pickCtrl(names: string[]): AbstractControl | null {
    for (const name of names) {
      const ctrl = this.form.get(name);
      if (ctrl) return ctrl;
    }
    return null;
  }

  private safePatch(ctrl: AbstractControl, value: any): void {
    ctrl.patchValue(value, { emitEvent: false });
  }

  private toBool(value: any): boolean {
    return (
      value === true ||
      value === 1 ||
      value === '1' ||
      String(value).toLowerCase() === 'true'
    );
  }

  private toNumber(value: any): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
}
