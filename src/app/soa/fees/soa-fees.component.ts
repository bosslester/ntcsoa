import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, } from '@angular/forms';
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
    'licPermitToPurchase',
    'licFilingFee',
    'licPermitToPossess',
    'licConstructionPermitFee',
    'licRadioStationLicense',
    'licInspectionFee',
    'licSUF',
    'licFinesPenalties',
    'licSurcharges',

    'appRegistrationFee',
    'appSupervisionRegulationFee',
    'appVerificationAuthFee',
    'appExaminationFee',
    'appClearanceCertificationFee',
    'appModificationFee',
    'appMiscIncome',
    'appOthers',

    'perPermitFees',
    'perInspectionFee',
    'perFilingFee',
    'perSurcharges',

    'amRadioStationLicense',
    'amRadioOperatorsCert',
    'amApplicationFee',
    'amFilingFee',
    'amSeminarFee',
    'amSurcharges',

    'dst',
  ];

  ngOnInit(): void {
    if (!this.form) return;

    this.setupRocComputation();
    this.setupAmateurFormulas();
    this.setupTotalComputation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =====================================================
  // ROC + DST COMPUTATION
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
          return;
        }

        const row = this.ROC_TABLE[String(rocClass)?.trim()];
        if (!row) {
          this.safePatch(dstCtrl, 0);
          this.safePatch(certCtrl, 0);
          return;
        }

        const safeYears = this.toNumber(years);
        const total = row.roc * safeYears + row.dst;

        this.safePatch(dstCtrl, row.dst);
        this.safePatch(certCtrl, total);
      });
  }

  // =====================================================
  // ALL 21 FORMULAS
  // =====================================================
  private setupAmateurFormulas(): void {
    const typeCtrl = this.pickCtrl([
      'amType',
      'amateurType',
      'operatorType',
      'selectedOperator',
    ]);

    const yearsCtrl = this.pickCtrl([
      'amYears',
      'years',
      'numberOfYears',
    ]);

    if (!typeCtrl || !yearsCtrl) return;

    combineLatest([
      typeCtrl.valueChanges.pipe(startWith(typeCtrl.value)),
      yearsCtrl.valueChanges.pipe(startWith(yearsCtrl.value)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([type, years]) => {

        const yr  = this.toNumber(years);
        const ff  = this.toNumber(this.form.get('amFilingFee')?.value);
        const lf  = this.toNumber(this.form.get('amRadioStationLicense')?.value);
        const sur = this.toNumber(this.form.get('amSurcharges')?.value);
        const dst = this.toNumber(this.form.get('dst')?.value);
        const mod = this.toNumber(this.form.get('appModificationFee')?.value);
        const cpf = this.toNumber(this.form.get('licConstructionPermitFee')?.value);
        const sp  = this.toNumber(this.form.get('perPermitFees')?.value);
        const pur = this.toNumber(this.form.get('licPermitToPurchase')?.value);
        const pos = this.toNumber(this.form.get('licPermitToPossess')?.value);

        let result = 0;

        switch (String(type)) {

          // ===== A SERIES =====
          case 'AT-ROC-NEW':
            result = (lf * yr) + dst;
            break;

          case 'AT-ROC-RENEWAL':
            result = (lf * yr) + dst + sur;
            break;

          case 'AT-ROC-MOD':
            result = mod + dst;
            break;

          // ===== B SERIES =====
          case 'AT-RSL-PURPOS':
            result = pur + pos + dst;
            break;

          case 'PERMIT-STF':
            result = sp + dst;
            break;

          // ===== C SERIES =====
          case 'AT-LIFETIME-PURPOS':
            result = pur + pos + dst;
            break;

          // ===== D SERIES =====
          case 'AT-CLUB-PURPOS':
            result = pur + pos + dst;
            break;

          case 'AT-CLUB-NEW':
            result = ff + cpf + (lf * yr) + dst;
            break;

          case 'AT-CLUB-RENEWAL':
            result = (lf * yr) + dst + sur;
            break;

          case 'AT-CLUB-MOD':
            result = ff + cpf + mod + dst;
            break;

          // ===== E SERIES =====
          case 'AT-TEMPORARY':
            result = ff + pur + pos + dst;
            break;

          // ===== F SERIES =====
          case 'VANITY':
            result = (sp * yr) + dst;
            break;

          case 'SPECIAL-EVENT':
            result = sp + dst;
            break;

          // ===== H SERIES =====
          case 'PERMIT-STORAGE':
            result = pos + dst;
            break;
        }

        this.safePatch(
          this.form.get('amRadioOperatorsCert')!,
          result
        );
      });
  }

  // =====================================================
  // TOTAL AMOUNT
  // =====================================================
  private setupTotalComputation(): void {
    let totalCtrl = this.form.get('totalAmount');

    if (!totalCtrl) {
      this.form.addControl('totalAmount', new FormControl(0));
      totalCtrl = this.form.get('totalAmount')!;
    }

    for (const name of this.TOTAL_FIELDS) {
      if (!this.form.get(name)) {
        this.form.addControl(name, new FormControl(0));
      }
    }

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
          total += this.toNumber(val);
        }
        totalCtrl!.patchValue(total, { emitEvent: false });
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
