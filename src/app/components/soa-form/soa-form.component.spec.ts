import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoaFormComponent } from './soa-form.component';
import { FormsModule } from '@angular/forms';

describe('SoaFormComponent', () => {

  let component: SoaFormComponent;
  let fixture: ComponentFixture<SoaFormComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      // Because this is a standalone component
      imports: [SoaFormComponent, FormsModule]

    }).compileComponents();

    fixture = TestBed.createComponent(SoaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });


  // ✅ Test 1: Component loads
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  // ✅ Test 2: Default isMobile value
  it('should have isMobile set to true by default', () => {
    expect(component.isMobile).toBeTrue();
  });


  // ✅ Test 3: Default soaSeries
  it('should have empty soaSeries initially', () => {
    expect(component.soaSeries).toBe('');
  });


  // ✅ Test 4: Default checkbox values
  it('should initialize types correctly', () => {

    expect(component.types.new).toBeTrue();
    expect(component.types.renew).toBeTrue();

    expect(component.types.modification).toBeFalse();
    expect(component.types.co).toBeFalse();
    expect(component.types.cv).toBeFalse();
    expect(component.types.roc).toBeFalse();
    expect(component.types.ms).toBeFalse();
    expect(component.types.ma).toBeFalse();
    expect(component.types.others).toBeFalse();

  });


  // ✅ Test 5: Changing isMobile works
  it('should update isMobile when changed', () => {

    component.isMobile = false;

    expect(component.isMobile).toBeFalse();

  });


  // ✅ Test 6: Changing soaSeries works
  it('should update soaSeries when assigned', () => {

    component.soaSeries = 'SOA-2026-001';

    expect(component.soaSeries).toBe('SOA-2026-001');

  });


  // ✅ Test 7: Toggle "others" type
  it('should allow toggling others type', () => {

    component.types.others = true;

    expect(component.types.others).toBeTrue();

  });

});
