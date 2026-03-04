import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type AddressTown = { townCity: string; barangays: string[] };
export type AddressProvince = { province: string; towns: AddressTown[] };

export type AddressDialogData = {
  provinces: AddressProvince[];
  initial?: {
    province?: string;
    townCity?: string;
    brgy?: string;
    line4?: string;
  };
};

export type AddressDialogResult = {
  province: string;
  townCity: string;
  brgy: string;
  line4: string;
  fullAddress: string;
};

@Component({
  selector: 'app-address-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dlg">
      <div class="dlgHead">Select Address</div>

      <form [formGroup]="fg" class="dlgBody">
        <div class="row">
          <label>Province</label>
          <select formControlName="province">
            <option value="">-- Select Province --</option>
            <option *ngFor="let p of provinces" [value]="p.province">
              {{ p.province }}
            </option>
          </select>
        </div>

        <div class="row">
          <label>Town/City</label>
          <select formControlName="townCity">
            <option value="">-- Select Town/City --</option>
            <option *ngFor="let t of towns" [value]="t.townCity">
              {{ t.townCity }}
            </option>
          </select>
        </div>

        <div class="row">
          <label>Brgy</label>
          <select formControlName="brgy">
            <option value="">-- Select Brgy --</option>
            <option *ngFor="let b of brgys" [value]="b">{{ b }}</option>
          </select>
        </div>

        <div class="row">
          <label>Unit # / Bldg / Street / Purok</label>
          <input
            type="text"
            formControlName="line4"
            placeholder="e.g. Unit 2, ABC Bldg, Purok 3"
          />
        </div>
      </form>

      <div class="dlgFoot">
        <button type="button" class="btn" (click)="close()">Cancel</button>
        <button
          type="button"
          class="btn primary"
          [disabled]="fg.invalid"
          (click)="useAddress()"
        >
          Use Address
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dlg {
        width: 520px;
        max-width: 92vw;
        padding: 14px;
        font-family: Arial, sans-serif;
      }
      .dlgHead {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 12px;
      }
      .dlgBody {
        display: grid;
        gap: 10px;
      }
      .row {
        display: grid;
        gap: 6px;
      }
      label {
        font-size: 13px;
        font-weight: 600;
      }
      select,
      input {
        height: 34px;
        padding: 6px 8px;
        border: 1px solid #bbb;
        border-radius: 6px;
      }
      .dlgFoot {
        margin-top: 14px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      .btn {
        height: 34px;
        padding: 0 12px;
        border: 1px solid #999;
        background: #fff;
        border-radius: 6px;
        cursor: pointer;
      }
      .btn.primary {
        border-color: #2f74ff;
        background: #2f74ff;
        color: #fff;
      }
      .btn:disabled,
      .btn.primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class AddressDialogComponent {
  provinces: AddressProvince[] = [];
  towns: AddressTown[] = [];
  brgys: string[] = [];

  fg = this.fb.group({
    province: ['', Validators.required],
    townCity: this.fb.control({ value: '', disabled: true }, Validators.required),
    brgy: this.fb.control({ value: '', disabled: true }, Validators.required),
    line4: [''],
  });

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<AddressDialogComponent, AddressDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: AddressDialogData
  ) {
    this.provinces = data?.provinces ?? [];
    const init = data?.initial ?? {};

    // preload province
    if (init.province) {
      this.fg.patchValue({ province: init.province }, { emitEvent: false });
      this.onProvinceChanged(init.province, false);
    }

    // preload town
    if (init.townCity) {
      this.fg.patchValue({ townCity: init.townCity }, { emitEvent: false });
      this.onTownChanged(init.townCity, false);
    }

    // preload brgy + line4
    if (init.brgy) this.fg.patchValue({ brgy: init.brgy }, { emitEvent: false });
    if (init.line4) this.fg.patchValue({ line4: init.line4 }, { emitEvent: false });

    // listeners
    this.fg.get('province')!.valueChanges.subscribe((prov) => {
      this.onProvinceChanged((prov || '').toString(), true);
    });

    this.fg.get('townCity')!.valueChanges.subscribe((town) => {
      this.onTownChanged((town || '').toString(), true);
    });
  }

  private onProvinceChanged(province: string, reset: boolean) {
    this.towns = this.getTowns(province);

    const townCtrl = this.fg.get('townCity')!;
    const brgyCtrl = this.fg.get('brgy')!;

    if (this.towns.length > 0) townCtrl.enable({ emitEvent: false });
    else townCtrl.disable({ emitEvent: false });

    // clear dependent
    this.brgys = [];
    brgyCtrl.disable({ emitEvent: false });

    if (reset) {
      this.fg.patchValue({ townCity: '', brgy: '' }, { emitEvent: false });
    }
  }

  private onTownChanged(townCity: string, reset: boolean) {
    const province = (this.fg.get('province')!.value || '').toString();
    this.brgys = this.getBrgys(province, townCity);

    const brgyCtrl = this.fg.get('brgy')!;
    if (this.brgys.length > 0) brgyCtrl.enable({ emitEvent: false });
    else brgyCtrl.disable({ emitEvent: false });

    if (reset) this.fg.patchValue({ brgy: '' }, { emitEvent: false });
  }

  private getTowns(province: string): AddressTown[] {
    const p = this.provinces.find((x) => x.province === province);
    return p?.towns ?? [];
  }

  private getBrgys(province: string, townCity: string): string[] {
    const p = this.provinces.find((x) => x.province === province);
    const t = p?.towns?.find((x) => x.townCity === townCity);
    return t?.barangays ?? [];
  }

  close(): void {
    this.ref.close();
  }

  useAddress(): void {
    const v = this.fg.getRawValue();
    const full = this.buildFullAddress(v.province!, v.townCity!, v.brgy!, v.line4 || '');
    this.ref.close({
      province: v.province!,
      townCity: v.townCity!,
      brgy: v.brgy!,
      line4: v.line4 || '',
      fullAddress: full,
    });
  }

  private buildFullAddress(province: string, townCity: string, brgy: string, line4: string): string {
    const parts = [line4, brgy, townCity, province]
      .map((x) => (x || '').trim())
      .filter(Boolean);
    return parts.join(', ');
  }
}