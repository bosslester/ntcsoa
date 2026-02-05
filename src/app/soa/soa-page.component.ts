import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SoaHeaderComponent } from './header/soa-header.component';
import { SoaLeftFormComponent } from './soa-left/soa-left-form.component';
import { SoaFeesComponent } from './fees/soa-fees.component';
import { SoaRightPanelComponent } from './soa-right/soa-right-panel.component';

@Component({
  selector: 'app-soa-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SoaHeaderComponent,
    SoaLeftFormComponent,
    SoaFeesComponent,
    SoaRightPanelComponent
  ],
  templateUrl: './soa-page.component.html',
  styleUrls: ['./soa-page.component.css']
})
export class SoaPageComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      isMobileLicensing: [true],
      soaSeries: [''],
      seriesNumber: [''],

      date: [''],
      payorName: [''],
      address: [''],
      particulars: [''],
      periodCovered: [''],

      txnNew: [true],
      txnRenew: [true],
      txnModification: [true],
      txnCO: [false],
      txnCV: [true],

      catROC: [true],
      catMS: [false],
      catMA: [false],
      catOTHERS: [false],

      remarks: [''],

      // LICENSES
      licPermitToPurchase: [''],
      licFilingFee: [''],
      licPermitToPossess: [''],
      licConstructionPermitFee: [''],
      licRadioStationLicense: [''],
      licInspectionFee: [''],
      licSUF: [''],
      licFinesPenalties: [''],
      licSurcharges: [''],

      // OTHER APPLICATION
      appRegistrationFee: [''],
      appSupervisionRegulationFee: [''],
      appVerificationAuthFee: [''],
      appExaminationFee: [''],
      appClearanceCertificationFee: [''],
      appModificationFee: [''],
      appMiscIncome: [''],
      appOthers: [''],

      // PERMITS
      perPermitFees: [''],
      perInspectionFee: [''],
      perFilingFee: [''],
      perSurcharges: [''],

      // AMATEUR/ROC
      amRadioStationLicense: [''],
      amRadioOperatorsCert: [''],
      amApplicationFee: [''],
      amFilingFee: [''],
      amSeminarFee: [''],
      amSurcharges: [''],

      dst: [''],
      totalAmount: [''],

      accounting: [''],
      accountingPosition: [''],

      opAssessmentOnly: [false],
      opEndorsedForPayment: [false],
      opNotePayOnOrBefore: [''],

      preparedBy: [''],
      approvedBy: [''],

      opSeries: [''],
      orNumber: [''],
      datePaid: ['']
    });
  }

  save() {}
  newRecord() {}
  printSoa() {}
  assessmentOnly() {}
  printOp() {}
}