import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirdropDetailComponent } from './airdrop-detail.component';

describe('AirdropDetailComponent', () => {
  let component: AirdropDetailComponent;
  let fixture: ComponentFixture<AirdropDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirdropDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirdropDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
