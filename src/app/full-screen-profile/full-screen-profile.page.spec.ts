import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenProfilePage } from './full-screen-profile.page';

describe('FullScreenProfilePage', () => {
  let component: FullScreenProfilePage;
  let fixture: ComponentFixture<FullScreenProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullScreenProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
