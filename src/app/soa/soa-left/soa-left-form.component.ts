import { Component, Input, OnInit } from '@angular/core'; // ✅ ADDED OnInit
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-soa-left-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './soa-left-form.component.html',
  styleUrls: ['./soa-left-form.component.css']
})
export class SoaLeftFormComponent implements OnInit { // ✅ ADDED OnInit
  @Input() form!: FormGroup;

  payees: string[] = [
    'KENJI',
    'KARL',
    'CHRIS',
    'LISTER',
    'EMEL'
  ];

  // ✅ ADDED
  ngOnInit(): void {
    if (!this.form) return;

    this.form.get('periodFrom')?.valueChanges.subscribe(() => this.computeYears());
    this.form.get('periodTo')?.valueChanges.subscribe(() => this.computeYears());
  }

  // ✅ ADDED
  computeYears(): void {
    const from = this.form.get('periodFrom')?.value;
    const to = this.form.get('periodTo')?.value;

    if (!from || !to) {
      this.form.get('periodYears')?.setValue(null);
      return;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    let years = toDate.getFullYear() - fromDate.getFullYear();

    if (
      toDate.getMonth() < fromDate.getMonth() ||
      (toDate.getMonth() === fromDate.getMonth() &&
        toDate.getDate() < fromDate.getDate())
    ) {
      years--;
    }

    this.form.get('periodYears')?.setValue(years >= 0 ? years : 0);
  }
}
