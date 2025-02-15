import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConsentAuthorizeResponse } from '../../api/models/consent-authorize-response';
import { AisService } from '../../common/services/ais.service';
import { SettingsService } from '../../common/services/settings.service';
import { ShareDataService } from '../../common/services/share-data.service';
import { PSUAISProvidesAccessToOnlineBankingAccountFunctionalityService } from '../../api/services/psuaisprovides-access-to-online-banking-account-functionality.service';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss'],
})
export class ResultPageComponent implements OnInit, OnDestroy {
  public authResponse: ConsentAuthorizeResponse;
  public scaStatus: string;
  public aisDoneRequest: PSUAISProvidesAccessToOnlineBankingAccountFunctionalityService.AisDoneUsingGETParams;
  public devPortalLink: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private aisService: AisService,
    private settingService: SettingsService,
    private shareService: ShareDataService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    // get dev portal link
    this.devPortalLink =
      this.settingService.settings.devPortalUrl +
      '/test-cases/redirect-consent-post';

    // Manual redirect is used because of the CORS error otherwise
    this.route.queryParams.subscribe((params) => {
      let oauth2 = params.oauth2;
      if (oauth2 === undefined || oauth2 !== 'true') {
        oauth2 = false;
      }

      this.aisDoneRequest = {
        encryptedConsentId: params.encryptedConsentId,
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
          if (authResponse.authConfirmationCode) {
            this.aisDoneRequest.authConfirmationCode =
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
    this.aisService.aisDone(this.aisDoneRequest).subscribe((resp) => {
      if (resp.redirectUrl) {
        this.authService.clearSession();
        window.location.href = resp.redirectUrl;
      }
    });
  }

  ngOnDestroy(): void {}
}
