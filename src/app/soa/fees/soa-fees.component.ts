import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Subject, combineLatest, startWith } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type RocRow = { roc: number; dst: number };

@Component({
  selector: 'app-soa-fees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './soa-fees.component.html',
  styleUrls: ['./soa-fees.component.css']
})
export class SoaFeesComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() mode: 'left' | 'mid' = 'left';

  private destroy$ = new Subject<void>();

  // ✅ Your table mapping (from screenshot)
  private readonly ROC_TABLE: Record<string, RocRow> = {
    'RTG 1st': { roc: 180, dst: 30 },
    'RTG 2nd': { roc: 120, dst: 30 },
    'RTG 3rd': { roc: 60,  dst: 30 },

    'PHN 1st': { roc: 120, dst: 30 },
    'PHN 2nd': { roc: 100, dst: 30 },
    'PHN 3rd': { roc: 60,  dst: 30 },

    'RROC- AIRCRAFT': { roc: 100, dst: 30 },
    'SROP': { roc: 60, dst: 30 },
    'GROC': { roc: 60, dst: 30 },
    'RROC-RLM': { roc: 60, dst: 30 },
  };

  ngOnInit(): void {
    if (!this.form) return;

    // ✅ OUTPUT controls (already in your HTML)
    const certCtrl = this.form.get('amRadioOperatorsCert');
    const dstCtrl  = this.form.get('dst');

    if (!certCtrl || !dstCtrl) return;

    // ✅ INPUT controls (MUST exist in your parent form)
    // We try multiple possible names so you don't need to change HTML.
    const isNewCtrl = this.pickCtrl(['isNew', 'new', 'chkNew', 'isNEW', 'newApplication']);
    const classCtrl = this.pickCtrl(['rocClass', 'rocOperator', 'operator', 'rocType', 'classRoc', 'roc']);
    const yearsCtrl = this.pickCtrl(['rocYears', 'years', 'numberOfYears', 'noOfYears', 'rocYr', 'yr']);

    // If any of these are missing, do nothing (keeps your UI stable)
    if (!isNewCtrl || !classCtrl || !yearsCtrl) return;

    combineLatest([
      isNewCtrl.valueChanges.pipe(startWith(isNewCtrl.value)),
      classCtrl.valueChanges.pipe(startWith(classCtrl.value)),
      yearsCtrl.valueChanges.pipe(startWith(yearsCtrl.value)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isNew, rocClass, years]) => {
        // Apply only when NEW is checked
        if (!this.toBool(isNew)) {
          this.safePatch(dstCtrl, null);
          this.safePatch(certCtrl, null);
          return;
        }

        const key = String(rocClass ?? '').trim();
        const row = this.ROC_TABLE[key];

        if (!row) {
          this.safePatch(dstCtrl, null);
          this.safePatch(certCtrl, null);
          return;
        }

        const y = this.toNumber(years);
        const safeYears = y > 0 ? y : 0;

        const dst = row.dst; // 30
        const total = (row.roc * safeYears) + dst;

        this.safePatch(dstCtrl, dst);
        this.safePatch(certCtrl, total);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------------
  // Helpers (no HTML needed)
  // -------------------------
  private pickCtrl(names: string[]): AbstractControl | null {
    for (const n of names) {
      const c = this.form.get(n);
      if (c) return c;
    }
    return null;
  }

  private safePatch(ctrl: AbstractControl, val: any): void {
    // emitEvent:false prevents loops when patching computed fields
    ctrl.patchValue(val, { emitEvent: false });
  }

  private toBool(v: any): boolean {
    return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
  }

  private toNumber(v: any): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
}



