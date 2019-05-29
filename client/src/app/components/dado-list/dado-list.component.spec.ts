import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DadoListComponent } from './dado-list.component';

describe('DadoListComponent', () => {
  let component: DadoListComponent;
  let fixture: ComponentFixture<DadoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DadoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DadoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
