import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShareDataService } from '../../common/services/share-data.service';
import { PaymentDetailsComponent } from './payment-details.component';

describe('PaymentDetailsComponent', () => {
  let component: PaymentDetailsComponent;
  let fixture: ComponentFixture<PaymentDetailsComponent>;
  let shareDataService: ShareDataService;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PaymentDetailsComponent],
        providers: [ShareDataService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsComponent);
    component = fixture.componentInstance;
    shareDataService = TestBed.inject(ShareDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty when no auth response for accounts', () => {
    component.authResponse = null;
    const result = component.totalAmount;
    expect(result).toBe(0);
  });

  it('should return 0 when auth response for accounts has no payment', () => {
    component.authResponse = {
      payment: null,
    };
    const result = component.totalAmount;
    expect(result).toBe(0);
  });

  it('should return totalAmount when auth response for accounts has payments', () => {
    component.authResponse = {
      payment: {
        targets: [
          {
            instructedAmount: {
              amount: 15,
            },
          },
          {
            instructedAmount: {
              amount: 110,
            },
          },
        ],
      },
    };
    const result = component.totalAmount;
    expect(result).toBe(125);
  });
});
