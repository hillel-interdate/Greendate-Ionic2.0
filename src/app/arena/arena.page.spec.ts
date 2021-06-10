import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaPage } from './arena.page';

describe('ArenaPage', () => {
  let component: ArenaPage;
  let fixture: ComponentFixture<ArenaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArenaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
