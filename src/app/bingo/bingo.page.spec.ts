import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoPage } from './bingo.page';

describe('BingoPage', () => {
  let component: BingoPage;
  let fixture: ComponentFixture<BingoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BingoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
