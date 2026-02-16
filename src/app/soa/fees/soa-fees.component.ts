import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule,} from '@angular/forms';
import { Subject, combineLatest, startWith } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type RocRow = {
  ff: number;
  af: number;
  semFee: number;
  roc: number;
  mod: number;
  dst: number;
  sur50: number;
  sur100: number;
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

  // =====================================================
  // COMPLETE ROC TABLE
  // =====================================================
  private readonly ROC_TABLE: Record<string, RocRow> = {

    'RTG 1st': { ff: 0, af: 0, semFee: 0, roc: 180, mod: 120, dst: 30, sur50: 90, sur100: 180 },
    'RTG 2nd': { ff: 0, af: 0, semFee: 0, roc: 120, mod: 120, dst: 30, sur50: 60, sur100: 120 },
    'RTG 3rd': { ff: 0, af: 0, semFee: 0, roc: 60,  mod: 120, dst: 30, sur50: 30, sur100: 60 },

    'PHN 1st': { ff: 0, af: 0, semFee: 0, roc: 120, mod: 120, dst: 30, sur50: 60, sur100: 120 },
    'PHN 2nd': { ff: 0, af: 0, semFee: 0, roc: 100, mod: 120, dst: 30, sur50: 50, sur100: 100 },
    'PHN 3rd': { ff: 0, af: 0, semFee: 0, roc: 60,  mod: 120, dst: 30, sur50: 30, sur100: 60 },

    'RROC- AIRCRAFT': { ff: 0, af: 0, semFee: 0, roc: 100, mod: 120, dst: 30, sur50: 50, sur100: 100 },

    'SROP':     { ff: 20, af: 20, semFee: 60, roc: 120, mod: 30,  dst: 30, sur50: 30, sur100: 60 },
    'GROC':     { ff: 10, af: 20, semFee: 0,  roc: 60,  mod: 120, dst: 30, sur50: 30, sur100: 60 },
    'RROC-RLM': { ff: 10, af: 20, semFee: 0,  roc: 60,  mod: 120, dst: 30, sur50: 30, sur100: 60 },
  };
  // =====================================================
  // COMPLETE AMATEUR TYPES  
  // =====================================================
  private readonly AMATEUR_TYPES = [
    'AT-ROC-NEW',
    'AT-ROC-RENEWAL',
    'AT-ROC-MOD',
    'AT-RSL-PUR/POS',
    'AT-RSL NEW',
    'AT-RSL RENEWAL',
    'AT-RSL-MOD',
    'PERMIT-SELL/TRANSFER',
    'AT-LIFETIME-PURPOS',
    'AT-LIFETIME',
    'AT-LIFETIME MOD',
    'AT-CLUB-PUR/POS',
    'AT-CLUB RSL NEW',
    'AT-CLUB RSL RENEWAL',
    'AT-CLUB RSL MOD',
    'TEMPORARY-PERMIT TO OPERATE',
    'SPECIAL PERMIT FOR THE ISE OF VANITY CALL SIGN(NEW)',
    'SPECIAL PERMIT FOR THE ISE OF VANITY CALL SIGN(RENEWAL)',
    'SPECIAL PERMIT FOR THE ISE OF VANITY CALL SIGN',
    'PERMIT TO POSSESS FOR STORAGE OF AMATEUR RADIO STATIONS',
  ];

  // =====================================================
  // TOTAL FIELDS
  // =====================================================
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

  // =========
  // LIFECYCLE
  // =========
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
  // OFFICIAL ROC FORMULAS (A–G)
  // =====================================================
  private setupRocComputation(): void {

    const certCtrl = this.form.get('amRadioOperatorsCert');
    const dstCtrl  = this.form.get('dst');
    const filingCtrl = this.form.get('amFilingFee');
    const seminarCtrl = this.form.get('amSeminarFee');
    const surCtrl = this.form.get('amSurcharges');
    const modCtrl = this.form.get('appModificationFee');

    if (!certCtrl || !dstCtrl) return;

    const typeCtrl = this.pickCtrl(['amType','amateurType','operatorType','selectedOperator']);
    const classCtrl = this.pickCtrl(['rocClass','rocOperator','operator','rocType','classRoc','roc']);
    const yearsCtrl = this.pickCtrl(['rocYears','years','numberOfYears','noOfYears','rocYr','yr']);

    if (!typeCtrl || !classCtrl || !yearsCtrl) return;

    combineLatest([
      typeCtrl.valueChanges.pipe(startWith(typeCtrl.value)),
      classCtrl.valueChanges.pipe(startWith(classCtrl.value)),
      yearsCtrl.valueChanges.pipe(startWith(yearsCtrl.value)),
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([type, rocClass, years]) => {

      const row = this.ROC_TABLE[String(rocClass)?.trim()];
      if (!row) return;

      const yr  = this.toNumber(years);
      const sur = this.toNumber(surCtrl?.value);
      const mod = this.toNumber(modCtrl?.value);

      let total = 0;

      switch (String(type)) {

        // A.1 Commercial ROC (NEW) & B.1 RROC-Aircraft (NEW)
        // FEE ROC = (ROC)(YR) + DST
        case 'COMM-NEW':
        case 'RROC-AIRCRAFT-NEW':
          total = (row.roc * yr) + row.dst;
          break;

        // A.2 Commercial ROC (REN) & B.2 RROC Aircraft (REN)
        // FEE ROC = (ROC)(YR) + DST + SUR
        case 'COMM-REN':
        case 'RROC-AIRCRAFT-REN':
          total = (row.roc * yr) + row.dst + sur;
          break;

        // C. Temporary ROC for Foreign Pilot
        // FEE ROC = ROC + DST
        case 'TEMP-FOREIGN':
          total = row.roc + row.dst;
          break;

        // D.1 SROP (NEW)
        // FEE ROC = AF + SEM + (ROC)(YR) + DST
        case 'SROP-NEW':
          total = row.af + row.semFee + (row.roc * yr) + row.dst;
          break;

        // D.2 SROP (RENEWAL)
        // FEE ROC = (ROC)(YR) + DST + SUR
        case 'SROP-REN':
          total = (row.roc * yr) + row.dst + sur;
          break;

        // E.1 GROC (NEW) & F.1 RROC-RLM (NEW)
        // FEE ROC = FF + AF + (ROC)(YR) + DST
        case 'GROC-NEW':
        case 'RROC-RLM-NEW':
          total = row.ff + row.af + (row.roc * yr) + row.dst;
          break;

        // E.2 GROC (RENEWAL) & F.2 RROC-RLM (RENEWAL)
        // FEE ROC = (ROC)(YR) + DST + SUR
        case 'GROC-REN':
        case 'RROC-RLM-REN':
          total = (row.roc * yr) + row.dst + sur;
          break;

        // G. Modification of any certificates
        // FEE ROC = MOD + DST
        case 'MODIFICATION':
          total = mod + row.dst;
          break;
      }

      this.safePatch(dstCtrl, row.dst);
      this.safePatch(certCtrl, total);

      if (filingCtrl) this.safePatch(filingCtrl, row.ff);
      if (seminarCtrl) this.safePatch(seminarCtrl, row.semFee);
    });
  }

  // =====================================================
  // YOUR 21 AMATEUR FORMULAS (UNCHANGED)
  // =====================================================
  private setupAmateurFormulas(): void {

    const typeCtrl = this.pickCtrl(['amType','amateurType','operatorType','selectedOperator']);
    const yearsCtrl = this.pickCtrl(['amYears','years','numberOfYears']);

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

        case 'AT-ROC-NEW':
          result = (lf * yr) + dst;
          break;

        case 'AT-ROC-RENEWAL':
          result = (lf * yr) + dst + sur;
          break;

        case 'AT-ROC-MOD':
          result = mod + dst;
          break;

        case 'AT-RSL-PURPOS':
        case 'AT-LIFETIME-PURPOS':
        case 'AT-CLUB-PURPOS':
          result = pur + pos + dst;
          break;

        case 'PERMIT-STF':
        case 'SPECIAL-EVENT':
          result = sp + dst;
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

        case 'AT-TEMPORARY':
          result = ff + pur + pos + dst;
          break;

        case 'VANITY':
          result = (sp * yr) + dst;
          break;

        case 'PERMIT-STORAGE':
          result = pos + dst;
          break;
      }

      this.safePatch(this.form.get('amRadioOperatorsCert')!, result);
    });
  }

  // =====================================================
  // TOTAL COMPUTATION
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

  private toNumber(value: any): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
}
