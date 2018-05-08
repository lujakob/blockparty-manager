import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVariantDialogComponent } from './select-variant-dialog.component';

describe('SelectVariantDialogComponent', () => {
  let component: SelectVariantDialogComponent;
  let fixture: ComponentFixture<SelectVariantDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectVariantDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectVariantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
