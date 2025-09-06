import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaterBillReadingPage } from './water-bill-reading.page';

describe('WaterBillReadingPage', () => {
  let component: WaterBillReadingPage;
  let fixture: ComponentFixture<WaterBillReadingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterBillReadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
