import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-soa-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './soa-header.component.html',
  styleUrls: ['./soa-header.component.css']
})
export class SoaHeaderComponent {
  @Input() form!: FormGroup;
}