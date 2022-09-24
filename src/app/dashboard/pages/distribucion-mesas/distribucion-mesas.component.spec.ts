import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribucionMesasComponent } from './distribucion-mesas.component';

describe('DistribucionMesasComponent', () => {
  let component: DistribucionMesasComponent;
  let fixture: ComponentFixture<DistribucionMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistribucionMesasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistribucionMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
