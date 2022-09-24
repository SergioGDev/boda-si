import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInvitadosComponent } from './gestion-invitados.component';

describe('GestionInvitadosComponent', () => {
  let component: GestionInvitadosComponent;
  let fixture: ComponentFixture<GestionInvitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionInvitadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionInvitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
