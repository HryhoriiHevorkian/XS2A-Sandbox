import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaymentAuthorizeResponse } from '../../api/models/payment-authorize-response';
import { SettingsService } from '../../common/services/settings.service';
import { ShareDataService } from '../../common/services/share-data.service';
import { PisService } from '../../common/services/pis.service';
import { PSUPISProvidesAccessToOnlineBankingPaymentFunctionalityService } from '../../api/services/psupisprovides-access-to-online-banking-payment-functionality.service';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss'],
})
export class ResultPageComponent implements OnInit, OnDestroy {
  public authResponse: PaymentAuthorizeResponse;
  public scaStatus: string;
  public pisDoneRequest: PSUPISProvidesAccessToOnlineBankingPaymentFunctionalityService.PisDoneUsingGET1Params;
  public devPortalLink: string;
  public multilevelSca = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private settingService: SettingsService,
    private pisService: PisService,
    private shareService: ShareDataService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    // get dev portal link
    this.devPortalLink =
      this.settingService.settings.devPortalUrl +
      '/test-cases/redirect-payment-initiation-post';

    // Manual redirect is used because of the CORS error otherwise
    this.route.queryParams.subscribe((params) => {
      let oauth2 = params.oauth2;

      if (oauth2 === undefined || oauth2 !== 'true') {
        oauth2 = false;
      }

      this.pisDoneRequest = {
        encryptedPaymentId: params.encryptedConsentId,
        authorisationId: params.authorisationId,
        oauth2: oauth2,
        authConfirmationCode: null,
      };
    });

    // get consent data from shared service
    this.shareService.currentData.subscribe((data) => {
      if (data) {
        this.shareService.currentData.subscribe((authResponse) => {
          this.authResponse = authResponse;
          this.scaStatus = this.authResponse.scaStatus;
          const payment = this.authResponse.payment;

          if (payment && payment.transactionStatus === 'PATC') {
            this.multilevelSca = true;
          }

          if (authResponse.authConfirmationCode) {
            this.pisDoneRequest.encryptedPaymentId =
              authResponse.authConfirmationCode;
          }
        });
      }
    });
  }

  redirectToDevPortal() {
    if (this.devPortalLink) {
      this.authService.clearSession();
      window.location.href = this.devPortalLink;
    }
  }

  redirectToTpp() {
    this.pisService.pisDone(this.pisDoneRequest).subscribe((resp) => {
      if (resp.redirectUrl) {
        this.authService.clearSession();
        window.location.href = resp.redirectUrl;
      }
    });
  }

  ngOnDestroy(): void {}
}
