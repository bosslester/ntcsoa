import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-soa-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './soa-form.component.html',
  styleUrls: ['./soa-form.component.css']
})
export class SoaFormComponent {

  isMobile = true;
  soaSeries = '';

  types = {
    new: true,
    renew: true,
    modification: false,
    co: false,
    cv: false,
    roc: false,
    ms: false,
    ma: false,
    others: false
  };

}
