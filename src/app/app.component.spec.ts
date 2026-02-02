import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SoaService } from './services/soa.service';
import { of } from 'rxjs';

describe('AppComponent (Upgraded Tests)', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let soaService: jasmine.SpyObj<SoaService>;

  // Runs before every test
  beforeEach(async () => {

    // Create fake SoaService
    const soaSpy = jasmine.createSpyObj('SoaService', [
      'getById',
      'update'
    ]);

    await TestBed.configureTestingModule({

      imports: [
        AppComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],

      providers: [
        { provide: SoaService, useValue: soaSpy }
      ]

    }).compileComponents();

    // Create component
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Inject fake service
    soaService = TestBed.inject(SoaService) as jasmine.SpyObj<SoaService>;

    // ✅ IMPORTANT: Mock API + Run lifecycle
    soaService.getById.and.returnValue(of({}));
    fixture.detectChanges(); // runs ngOnInit()
  });


  // -------------------------------
  // TEST 1: App Creation
  // -------------------------------
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });


  // -------------------------------
  // TEST 2: Form Initialization
  // -------------------------------
  it('should initialize the form', () => {

    expect(component.form).toBeDefined();
    expect(component.form.get('payor')).toBeTruthy();
    expect(component.form.get('id')?.value).toBe(6792);

  });


  // -------------------------------
  // TEST 3: loadSoa()
  // -------------------------------
  it('should load SOA data and patch the form', () => {

    const mockData = {
      id: 6792,
      licensee: 'Juan Dela Cruz',
      rslRadioStation: 100,
      rocOperatorFee: 50,
      rslSurcharge: 20,
      dst: 10
    };

    soaService.getById.and.returnValue(of(mockData));

    component.loadSoa(6792);

    expect(soaService.getById).toHaveBeenCalledWith(6792);

    expect(component.form.value.payor)
      .toBe('Juan Dela Cruz');

    expect(component.form.value.radioLicense)
      .toBe(100);
  });


  // -------------------------------
  // TEST 4: total Getter
  // -------------------------------
  it('should calculate total correctly', () => {

    component.form.patchValue({
      radioLicense: 100,
      rocCert: 50,
      surchargeAmateur: 20,
      dst: 10
    });

    expect(component.total).toBe(180);
  });


  // -------------------------------
  // TEST 5: save()
  // -------------------------------
  it('should call update() when form is valid', () => {

    soaService.update.and.returnValue(of({}));

    component.form.patchValue({
      payor: 'Test User'
    });

    component.save();

    expect(soaService.update).toHaveBeenCalled();
  });

});
