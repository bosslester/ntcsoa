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

interface AmateurRow {
  purc?: number;
  POS?: number;
  STF?: number;
  ff?: number;
  CPF?: number;
  LF?: number;
  ROC?: number;
  MOD?: number;
  DST?: number;
  SUR50?: number;
  SUR100?: number;
}

interface ShipStationFeeRow {
  FF: number;
  PURF: number;
  POSF: number;
  CPF: number;
  LF: number;
  IF: number;
  MOD: number;
  DST: number;
  SUR50: number;
  SUR100: number;
  cert?: number;
}

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
  private readonly AMATEUR_TYPES: Record<string, AmateurRow> = {
    'AT-ROC':{ purc: 0, POS: 0, STF: 0, ff: 0, CPF: 0, LF: 0, ROC: 60, MOD: 50, DST: 30, SUR50: 30, SUR100: 60 },
    'AT-RSL CLASS A':{ purc: 50, POS: 50, STF: 50, ff: 0, CPF: 0, LF: 120, ROC: 60, MOD: 50, DST: 30, SUR50: 60, SUR100: 120},
    'AT-RSL CLASS B':{ purc: 50, POS: 50, STF: 50, ff: 0, CPF: 0, LF: 132, ROC: 60, MOD: 50, DST: 30, SUR50: 66, SUR100: 132},
    'AT-RSL CLASS C':{ purc: 50, POS: 50, STF: 50, ff: 0, CPF: 0, LF: 144, ROC: 60, MOD: 50, DST: 30, SUR50: 72, SUR100: 144},
    'AT-RSL CLASS D':{ purc: 50, POS: 50, STF: 50, ff: 0, CPF: 0, LF: 144, ROC: 60, MOD: 50, DST: 30, SUR50: 72, SUR100: 144},
    'AT-LIFETIME':{ purc: 50, POS: 50, STF: 50, ff: 0, CPF: 0, LF: 50, ROC: 60, MOD: 50, DST: 30, SUR50: 0, SUR100: 0},
    'AT-CLUB RSL SIMPLEX':{ purc: 50, POS: 50, STF: 50, ff: 180, CPF: 600, LF: 700, ROC: 60, MOD: 50, DST: 30, SUR50: 350, SUR100: 700},
    'AT-CLUB REPEATER':{ purc: 50, POS: 50, STF: 50, ff: 180, CPF: 600, LF: 1320, ROC: 60, MOD: 50, DST: 30, SUR50: 660, SUR100: 1320},
    'TEMPORARY PERMIT FOREIGN': {purc: 0, POS: 0, STF: 0, ff: 0, CPF: 0, LF: 0, ROC: 0, MOD: 0, DST: 0, SUR50: 0, SUR100: 0},
    'CLASS A':{ purc: 50, POS: 50, STF: 50, ff: 0, CPF: 0, LF: 120, ROC: 60, MOD: 0, DST: 30, SUR50: 0, SUR100: 0},
    'CLASS B':{ purc: 50, POS: 50, STF: 50, ff: 0, CPF: 0, LF: 132, ROC: 60, MOD: 0, DST: 30, SUR50: 0, SUR100: 0},
    'CLASS C':{ purc: 50, POS: 50, STF: 50, ff: 0, CPF: 0, LF: 144, ROC: 60, MOD: 0, DST: 30, SUR50: 0, SUR100: 0},

    'SPECIAL EVENT':{ purc: 0, POS: 0, STF: 0, ff: 120, CPF: 0, LF: 0, ROC: 60, MOD: 0, DST: 30, SUR50: 30, SUR100: 0},
    'VANITY':{ purc: 50, POS: 50, STF: 50, ff: 1000, CPF: 0, LF: 0, ROC: 60, MOD: 0, DST: 30, SUR50: 30, SUR100: 0},
  };

  // =====================================================
  // COMPLETE SHIP STATION FEES
  // =====================================================
  private readonly SHIP_STATION_FEES: Record<string, ShipStationFeeRow> = {
    'DOMESTIC TRADE HIGH POW': { FF: 180, PURF: 240, POSF: 120, CPF: 720, LF: 840, IF: 720, MOD: 180, DST: 30, SUR50: 420, SUR100: 840 },
    'DOMESTIC TRADE MEDIUM POW': { FF: 180, PURF: 120, POSF: 96, CPF: 600, LF: 720, IF: 720, MOD: 180, DST: 30, SUR50: 360, SUR100: 720 },
    'DOMESTIC TRADE LOW POW': { FF: 180, PURF: 60, POSF: 60, CPF: 480, LF: 600, IF: 720, MOD: 180, DST: 30, SUR50: 300, SUR100: 600 },

    'INTERNATIONAL TRADE HIGH POW': { FF: 180, PURF: 240, POSF: 120, CPF: 1200, LF: 1500, IF: 1200, MOD: 180, DST: 30, SUR50: 750, SUR100: 1500 },
    'INTERNATIONAL TRADE MEDIUM POW': { FF: 180, PURF: 120, POSF: 96, CPF: 1200, LF: 1500, IF: 1200, MOD: 180, DST: 30, SUR50: 750, SUR100: 1500 },
    'INTERNATIONAL TRADE LOW POW': { FF: 180, PURF: 96, POSF: 60, CPF: 1200, LF: 1500, IF: 1200, MOD: 180, DST: 30, SUR50: 750, SUR100: 1500 },
    'INTERNATIONAL SESC/LRIT/SSAS/SESFB':{ FF: 180, PURF: 360, POSF: 360, CPF: 1200, LF: 1440, IF: 1200, MOD: 180, DST: 30, SUR50: 720, SUR100: 1440 },

    'PRIV COASTAL RADTELEGRAPHY HIGH POW': { FF: 180, PURF: 240, POSF: 120, CPF: 1320, LF: 1440, IF: 720, MOD: 180, DST: 30, SUR50: 720, SUR100: 1440 },
    'PRIV COASTAL RADTELEGRAPHY MEDIUM POW': { FF: 180, PURF: 120, POSF: 96, CPF: 960, LF: 1200, IF: 720, MOD: 180, DST: 30, SUR50: 600, SUR100: 1200 },
    'PRIV COASTAL RADTELEGRAPHY LOW POW': { FF: 180, PURF: 96, POSF: 60, CPF: 600, LF: 1080, IF: 720, MOD: 180, DST: 30, SUR50: 540, SUR100: 1080 },

    'PRIV COASTAL RADTELEPHONY HIGH POW': { FF: 180, PURF: 120, POSF: 96, CPF: 480, LF: 720, IF: 720, MOD: 180, DST: 30, SUR50: 360, SUR100: 720 },
    'PRIV COASTAL RADTELEPHONY LOW POW': { FF: 180, PURF: 120, POSF: 96, CPF: 480, LF: 480, IF: 480, MOD: 180, DST: 30, SUR50: 240, SUR100: 480 },

    'DELETION ': { FF: 180, cert: 200, PURF: 0, POSF: 0, CPF: 0, LF: 0, IF: 0, MOD: 0, DST: 30, SUR50: 0, SUR100: 0 },
  };




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
    this.setupShipStationFormulas();
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
  // 21 AMATEUR FORMULAS (UNCHANGED)
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

  // ==============================
  // A. AT-ROC
  // ==============================

  // A.1 AT-ROC (NEW)
  // FEE AT-ROC = (ROC)(YR) + DST
  case 'A1-AT-ROC-NEW':
    result = (lf * yr) + dst;
    break;

  // A.2 AT-ROC (RENEWAL)
  // FEE AT-ROC = (ROC)(YR) + DST + SUR
  case 'A2-AT-ROC-RENEWAL':
    result = (lf * yr) + dst + sur;
    break;

  // A.3 AT-ROC (MODIFICATION)
  // FEE AT-ROC = MOD + DST
  case 'A3-AT-ROC-MODIFICATION':
    result = mod + dst;
    break;


  // ==============================
  // B. AT-RSL
  // ==============================

  // B.1 AT-RSL Permit to Purchase/Possess
  // FEE PUR/POS = (PUR)(UNIT) + (POS)(UNIT) + DST
  case 'B1-AT-RSL-PURPOS':
    result = pur + pos + dst;
    break;

  // B.2 AT-RSL (NEW)
  // FEE AT-RSL = FF + (LF)(YR) + DST
  case 'B2-AT-RSL-NEW':
    result = ff + (lf * yr) + dst;
    break;

  // B.3 AT-RSL (RENEWAL)
  // FEE AT-RSL = (LF)(YR) + DST + SUR
  case 'B3-AT-RSL-RENEWAL':
    result = (lf * yr) + dst + sur;
    break;

  // B.4 AT-RSL (MODIFICATION)
  // FEE AT-RSL = FF + MOD + DST
  case 'B4-AT-RSL-MODIFICATION':
    result = ff + mod + dst;
    break;

  // B.5 Permit to Sell/Transfer
  // FEE STF = (STF)(UNIT) + DST
  case 'B5-PERMIT-STF':
    result = sp + dst;
    break;


  // ==============================
  // C. AT-LIFETIME
  // ==============================

  // C.1 AT-LIFETIME Permit to Purchase/Possess
  case 'C1-AT-LIFETIME-PURPOS':
    result = pur + pos + dst;
    break;

  // C.2 AT-LIFETIME
  // FEE AT-LIFETIME = LF + DST
  case 'C2-AT-LIFETIME':
    result = lf + dst;
    break;

  // C.3 AT-LIFETIME (MODIFICATION)
  case 'C3-AT-LIFETIME-MODIFICATION':
    result = ff + mod + dst;
    break;


  // ==============================
  // D. AT-CLUB
  // ==============================

  // D.1 AT-CLUB Permit to Purchase/Possess
  case 'D1-AT-CLUB-PURPOS':
    result = pur + pos + dst;
    break;

  // D.2 AT-CLUB RSL (NEW)
  case 'D2-AT-CLUB-NEW':
    result = ff + cpf + (lf * yr) + dst;
    break;

  // D.3 AT-CLUB RSL (RENEWAL)
  case 'D3-AT-CLUB-RENEWAL':
    result = (lf * yr) + dst + sur;
    break;

  // D.4 AT-CLUB RSL (MODIFICATION)
  case 'D4-AT-CLUB-MODIFICATION':
    result = ff + cpf + mod + dst;
    break;


  // ==============================
  // E. Temporary Permit
  // ==============================

  case 'E-TEMPORARY':
    result = ff + pur + pos + dst;
    break;


  // ==============================
  // F. Vanity Call Sign
  // ==============================

  // F.1 NEW
  case 'F1-VANITY-NEW':
    result = (sp * yr) + dst;
    break;

  // F.2 RENEWAL
  case 'F2-VANITY-RENEWAL':
    result = (sp * yr) + dst;
    break;


  // ==============================
  // G. Special Event
  // ==============================

  case 'G-SPECIAL-EVENT':
    result = sp + dst;
    break;


  // ==============================
  // H. Permit to Possess Storage
  // ==============================

  case 'H-PERMIT-STORAGE':
    result = pos + dst;
    break;
}


      this.safePatch(this.form.get('amRadioOperatorsCert')!, result);
    });
  }

  // =====================================================
// SHIP STATION FORMULAS (A–F)
// =====================================================
private setupShipStationFormulas(): void {

  const typeCtrl  = this.pickCtrl(['shipType','shipStationType','selectedShip']);
  const yearsCtrl = this.pickCtrl(['shipYears','years','numberOfYears']);
  const unitsCtrl = this.pickCtrl(['shipUnits','units']);

  if (!typeCtrl) return;

  combineLatest([
    typeCtrl.valueChanges.pipe(startWith(typeCtrl.value)),
    yearsCtrl?.valueChanges.pipe(startWith(yearsCtrl.value)) ?? [],
    unitsCtrl?.valueChanges.pipe(startWith(unitsCtrl.value)) ?? [],
  ])
  .pipe(takeUntil(this.destroy$))
  .subscribe(([type, years, units]) => {

    const row = this.SHIP_STATION_FEES[String(type)?.trim()];
    if (!row) return;

    const yr  = this.toNumber(years);
    const unit = this.toNumber(units);
    const sur = this.toNumber(this.form.get('licSurcharges')?.value);

    let result = 0;

    switch (String(type)) {

      // =====================================================
      // A.1 Permit to Purchase / Possess
      // FEE = (FF)(UNIT) + (PUR)(UNIT) + (POS)(UNIT) + DST
      // =====================================================
      case 'A1-PURPOS':
        result =
          (row.FF * unit) +
          (row.PURF * unit) +
          (row.POSF * unit) +
          row.DST;
        break;

      // =====================================================
      // A.2 Domestic Trade NEW (No Installed Equipment)
      // FEE = CPF + (LF)(YR) + (IF)(YR) + DST
      // =====================================================
      case 'A2-DOM-NEW-NO-EQ':
        result =
          row.CPF +
          (row.LF * yr) +
          (row.IF * yr) +
          row.DST;
        break;

      // =====================================================
      // A.3 Domestic Trade NEW (With Installed Equipment)
      // FEE = FF + PUR + POS + CPF + LF + IF + DST
      // =====================================================
      case 'A3-DOM-NEW-WITH-EQ':
        result =
          (row.FF * unit) +
          (row.PURF * unit) +
          (row.POSF * unit) +
          row.CPF +
          (row.LF * yr) +
          (row.IF * yr) +
          row.DST;
        break;

      // =====================================================
      // A.4 Domestic Trade RENEWAL
      // FEE = (LF)(YR) + (IF)(YR) + DST + SUR
      // =====================================================
      case 'A4-DOM-RENEWAL':
        result =
          (row.LF * yr) +
          (row.IF * yr) +
          row.DST +
          sur;
        break;

      // =====================================================
      // A.5 Domestic Trade MODIFICATION
      // FEE = FF + CPF + MOD + DST
      // =====================================================
      case 'A5-DOM-MOD':
        result =
          row.FF +
          row.CPF +
          row.MOD +
          row.DST;
        break;

      // =====================================================
      // B.1 International Trade RENEWAL
      // =====================================================
      case 'B1-INT-RENEWAL':
        result =
          (row.LF * yr) +
          (row.IF * yr) +
          row.DST +
          sur;
        break;

      // =====================================================
      // B.2 International Trade MODIFICATION
      // =====================================================
      case 'B2-INT-MOD':
        result =
          (row.FF * unit) +
          (row.PURF * unit) +
          (row.POSF * unit) +
          row.CPF +
          row.MOD +
          row.DST;
        break;

      // =====================================================
      // C.1 Private Coastal Permit to Purchase/Possess
      // =====================================================
      case 'C1-PRIV-PURPOS':
        result =
          (row.FF * unit) +
          (row.PURF * unit) +
          (row.POSF * unit) +
          row.DST;
        break;

      // =====================================================
      // C.2 Private Coastal NEW
      // =====================================================
      case 'C2-PRIV-NEW':
        result =
          row.CPF +
          (row.LF * yr) +
          (row.IF * yr) +
          row.DST;
        break;

      // =====================================================
      // C.3 Private Coastal RENEWAL
      // =====================================================
      case 'C3-PRIV-RENEWAL':
        result =
          (row.LF * yr) +
          (row.IF * yr) +
          row.DST +
          sur;
        break;

      // =====================================================
      // C.4 Private Coastal MODIFICATION
      // =====================================================
      case 'C4-PRIV-MOD':
        result =
          row.FF +
          row.CPF +
          row.MOD +
          row.DST;
        break;

      // =====================================================
      // D. Permit to Possess for Storage
      // =====================================================
      case 'D-POS-STORAGE':
        result =
          (row.POSF * unit) +
          row.DST;
        break;

      // =====================================================
      // E. Permit to Sell / Transfer
      // =====================================================
      case 'E-SELL-TRANSFER':
        result =
          (row.POSF * unit) +
          row.DST;
        break;

      // =====================================================
      // F. Deletion Certificate
      // FEE = FF * CERT + DST
      // =====================================================
      case 'F-DELETION':
        result =
          (row.FF * (row.cert ?? 1)) +
          row.DST;
        break;
    }

    this.safePatch(this.form.get('licRadioStationLicense')!, result);
    this.safePatch(this.form.get('dst')!, row.DST);
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
