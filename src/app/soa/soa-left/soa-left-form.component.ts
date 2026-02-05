import { Component, Input } from '@angular/core';
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
export class SoaLeftFormComponent {
  @Input() form!: FormGroup;
payees: string[] = [
  'KENJI',
  'KARL',
  'CHRIS',
  'LISTER',
  'EMEL'
];

}