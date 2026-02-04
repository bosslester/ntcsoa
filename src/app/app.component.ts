import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SoaService } from './services/soa.service';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDividerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  // default load
  private readonly defaultId = 6792;
  users: string[] = [];

  constructor(private fb: FormBuilder, private soaService: SoaService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.defaultId],
      date: [''],
      payor: ['', Validators.required],
      address: [''],
      particulars: [''],
      period: [''],

      radioLicense: [0],
      rocCert: [0],
      surchargeAmateur: [0],
      dst: [0],

      remarks: ['']
    });

    this.loadSoa(this.defaultId);
  }

  // ✅ helper for input type="date"
  private toDateInput(val: any): string {
    if (!val) return '';
    const s = String(val);
    return s.length >= 10 ? s.substring(0, 10) : s; // YYYY-MM-DD
  }

  loadSoa(id: number): void {
    this.loading = true;

    this.soaService.getById(id).subscribe({
      next: (db: any) => {
        this.form.patchValue({
          id: db.id ?? db.ID ?? id,
          date: this.toDateInput(db.dateIssued ?? db.DateIssued ?? ''),
          payor: db.licensee ?? db.LICENSEE ?? '',
          address: db.address ?? db.Address ?? '',
          particulars: db.particulars ?? db.Particulars ?? '',
          period: db.periodCovered ?? db.PeriodCovered ?? '',

          radioLicense: +(db.rslRadioStation ?? db.rocRadioStation ?? 0),
          rocCert: +(db.rocOperatorFee ?? 0),
          surchargeAmateur: +(db.rslSurcharge ?? db.rocSurcharge ?? 0),
          dst: +(db.dst ?? db.DST ?? 0),

          remarks: db.remarksNote ?? db.REMARKS_NOTE ?? db['REMARKS/NOTE'] ?? ''
        });

        this.loading = false;
      },
      error: (err: any) => {
        console.error('SOA load error', err);
        this.loading = false;
      }
    });
  }

  get total(): number {
    const f = this.form.value as any;
    return (+f.radioLicense || 0) + (+f.rocCert || 0) + (+f.surchargeAmateur || 0) + (+f.dst || 0);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fill required fields.');
      return;
    }

    const f = this.form.value as any;

    // ✅ HEADER payload (upper fields first)
    const payload = {
      dateIssued: f.date ? new Date(f.date).toISOString() : null,
      licensee: f.payor || null,
      address: f.address || null,
      particulars: f.particulars || null,
      periodCovered: f.period || null,
      rslRadioStation: +f.radioLicense || 0,
      rocOperatorFee: +f.rocCert || 0,
      rslSurcharge: +f.surchargeAmateur || 0,
      dst: +f.dst || 0,

      remarksNote: f.remarks || null,
      totalAmount: this.total
    };

    this.loading = true;

    // ✅ IMPORTANT: call header endpoint
    this.soaService.updateHeader(+f.id, payload).subscribe({
      next: () => {
        this.loading = false;
        alert('SOA Saved (Header)');
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Save error', err);
        alert('Save failed. Check console.');
      }
    });
  }
}