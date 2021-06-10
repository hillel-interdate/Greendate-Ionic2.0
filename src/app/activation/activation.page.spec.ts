import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationPage } from './activation.page';

describe('ActivationPage', () => {
  let component: ActivationPage;
  let fixture: ComponentFixture<ActivationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
