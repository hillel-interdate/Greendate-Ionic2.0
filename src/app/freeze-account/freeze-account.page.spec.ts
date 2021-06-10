import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezeAccountPage } from './freeze-account.page';

describe('FreezeAccountPage', () => {
  let component: FreezeAccountPage;
  let fixture: ComponentFixture<FreezeAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezeAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezeAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
