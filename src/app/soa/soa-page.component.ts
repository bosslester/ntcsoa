import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SoaService, TechSOAHeaderCreateDto } from './soa.service';

import { SoaHeaderComponent } from './header/soa-header.component';
import { SoaFeesComponent } from './fees/soa-fees.component';
import { SoaLeftFormComponent } from './soa-left/soa-left-form.component';
import { SoaRightPanelComponent } from './soa-right/soa-right-panel.component';

@Component({
  selector: 'app-soa-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SoaHeaderComponent,
    SoaLeftFormComponent,
    SoaRightPanelComponent,
    SoaFeesComponent
  ],
  templateUrl: './soa-page.component.html',
  styleUrls: ['./soa-page.component.css']
})
export class SoaPageComponent {
  form: FormGroup;

  saving = false;
  savedHeaderId: number | null = null;

  constructor(private fb: FormBuilder, private soaService: SoaService) {
    this.form = this.fb.group({
      // ===========================
      // LEFT HEADER (SAVE NOW)
      // ===========================
      date: [null],
      payeeName: [''],
      address: [''],
      particulars: [''],
      periodFrom: [null],
      periodTo: [null],
      periodYears: [0],

      // ===========================
      // RIGHT PANEL (buttons)
      // ===========================
      txnNew: [false],
      txnRenew: [false],
      txnModification: [false],
      txnCO: [false],
      txnCV: [false],

      catROC: [false],
      catMS: [false],
      catMA: [false],
      catOTHERS: [false],

      remarks: [''],

      opAssessmentOnly: [false],
      opEndorsedForPayment: [false],
      opNotePayOnOrBefore: [''],

      preparedBy: ['Engr. Francis T. M. Alfanta'],
      approvedBy: ['Engr. William Ramon Luber'],

      opSeries: [''],
      orNumber: [''],
      datePaid: [null],

      // ===========================
      // Accounting fields
      // ===========================
      accounting: [''],
      accountingPosition: [''],

      // ===========================
      // FEES (MUST MATCH SoaFeesComponent)
      // ===========================

      // LICENSE
      licPermitToPurchase: [0],
      licFilingFee: [0],
      licPermitToPossess: [0],
      licConstructionPermitFee: [0],
      licRadioStationLicense: [0],
      licInspectionFee: [0],
      licSUF: [0],
      licFinesPenalties: [0],
      licSurcharges: [0],

// PERMIT
perPermitFees: [0],
perInspectionFee: [0],
perFilingFee: [0],
perSurcharges: [0],

// AMATEUR
amRadioStationLicense: [0],
amRadioOperatorsCert: [0],
amApplicationFee: [0],
amFilingFee: [0],
amSeminarFee: [0],
amSurcharges: [0],

// OTHER
appRegistrationFee: [0],
appSupervisionRegulationFee: [0],
appVerificationAuthFee: [0],
appExaminationFee: [0],
appClearanceCertificationFee: [0],
appModificationFee: [0],
appMiscIncome: [0],
appOthers: [0],

// GLOBAL
dst: [0],
totalAmount: [{ value: 0, disabled: true }]
    });
  }

  // ✅ SAVE button from right panel -> calls this
save(): void {
  const v = this.form.value;

  // Convert to safe ISO dates for .NET DateTime? (or null)
  const toIsoDate = (x: any): string | null => {
    if (x === null || x === undefined || x === '') return null;

    // If already YYYY-MM-DD (from <input type="date">), keep it
    if (typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)) return x;

    // If it's a Date object or other string, try parsing
    const d = new Date(x);
    if (isNaN(d.getTime())) return null;

    // For DateTime? in .NET, ISO is safest
    return d.toISOString();
  };

  const dateIssuedIso = toIsoDate(v.date);

  // ✅ If user typed invalid text in DATE, stop and show message
  if (v.date && !dateIssuedIso) {
    alert('Invalid DATE. Please select a valid date (use the date picker).');
    return;
  }

  const payload: TechSOAHeaderCreateDto = {
    dateIssued: dateIssuedIso,
    licensee: (v.payeeName ?? '') === '' ? null : v.payeeName,
    address: (v.address ?? '') === '' ? null : v.address,
    particulars: (v.particulars ?? '') === '' ? null : v.particulars,
    periodFrom: toIsoDate(v.periodFrom),
    periodTo: toIsoDate(v.periodTo),
    periodYears:
      v.periodYears === '' || v.periodYears === null || v.periodYears === undefined
        ? null
        : Number(v.periodYears),
  };

  this.saving = true;

  this.soaService.createHeader(payload).subscribe({
    next: (res) => {
      this.savedHeaderId = res?.id ?? res?.ID ?? null;
      this.saving = false;
      console.log('✅ Saved header:', res);
      alert(`✅ Saved! ID: ${this.savedHeaderId ?? 'N/A'}`);
    },
    error: (err) => {
      this.saving = false;
      console.error('❌ Save failed FULL:', err);

      const status = err?.status;
      const url = err?.url;
      const msg = err?.message;
      const serverMsg = err?.error;

      alert(
        `❌ Save failed\n\n` +
        `Status: ${status}\n` +
        `URL: ${url}\n` +
        `Message: ${msg}\n` +
        `Server: ${typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)}`
      );
    }
  });
}


  newRecord(): void {
    this.form.reset({
      periodYears: 0,
      txnNew: false,
      txnRenew: false,
      txnModification: false,
      txnCO: false,
      txnCV: false,
      catROC: false,
      catMS: false,
      catMA: false,
      catOTHERS: false,
      preparedBy: 'Engr. Francis T. M. Alfanta',
      approvedBy: 'Engr. William Ramon Luber',
      totalAmount: 0
    });
    this.savedHeaderId = null;
  }

  printSoa(): void { console.log('printSoa'); }
  assessmentOnly(): void { console.log('assessmentOnly'); }
  printOp(): void { console.log('printOp'); }
}