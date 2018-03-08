import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirdropListComponent } from './airdrop-list.component';

describe('AirdropListComponent', () => {
  let component: AirdropListComponent;
  let fixture: ComponentFixture<AirdropListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirdropListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirdropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
