import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ConsentAuthorizeResponse } from '../../api/models/consent-authorize-response';
import { ScaUserDataTO } from '../../api/models/sca-user-data-to';
import { RoutingPath } from '../../common/models/routing-path.model';
import { AisService } from '../../common/services/ais.service';
import { CustomizeService } from '../../common/services/customize.service';
import { ShareDataService } from '../../common/services/share-data.service';

@Component({
  selector: 'app-select-sca',
  templateUrl: './select-sca.component.html',
  styleUrls: ['./select-sca.component.scss'],
})
export class SelectScaComponent implements OnInit, OnDestroy {
  public authResponse: ConsentAuthorizeResponse;
  public selectedScaMethod: ScaUserDataTO;
  public scaForm: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
    public customizeService: CustomizeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private aisService: AisService,
    private shareService: ShareDataService
  ) {
    this.scaForm = this.formBuilder.group({
      scaMethod: ['', Validators.required],
    });
  }

  get scaMehods(): ScaUserDataTO[] {
    return this.authResponse ? this.authResponse.scaMethods : [];
  }

  ngOnInit() {
    this.shareService.currentData.subscribe((data) => {
      if (data) {
        console.log('response object: ', data);
        this.shareService.currentData.subscribe((authResponse) => {
          this.authResponse = authResponse;
          if (this.authResponse.scaMethods) {
            this.selectedScaMethod = this.authResponse.scaMethods[0];
          }
        });
      }
    });
  }

  public onSubmit(): void {
    if (!this.authResponse || !this.selectedScaMethod) {
      return;
    }

    this.subscriptions.push(
      this.aisService
        .selectScaMethod({
          encryptedConsentId: this.authResponse.encryptedConsentId,
          authorisationId: this.authResponse.authorisationId,
          scaMethodId: this.selectedScaMethod.id,
        })
        .subscribe((authResponse) => {
          this.authResponse = authResponse;
          this.shareService.changeData(this.authResponse);
          if (this.selectedScaMethod.decoupled) {
            this.router.navigate([
              `${RoutingPath.ACCOUNT_INFORMATION}/${RoutingPath.RESULT}`,
            ]);
          } else {
            this.router.navigate([
              `${RoutingPath.ACCOUNT_INFORMATION}/${RoutingPath.TAN_CONFIRMATION}`,
            ]);
          }
        })
    );
  }

  public onCancel(): void {
    this.aisService
      .revokeConsent({
        encryptedConsentId: this.authResponse.encryptedConsentId,
        authorisationId: this.authResponse.authorisationId,
      })
      .subscribe((authResponse) => {
        console.log(authResponse);
        this.router
          .navigate(
            [`${RoutingPath.ACCOUNT_INFORMATION}/${RoutingPath.RESULT}`],
            {
              queryParams: {
                encryptedConsentId: this.authResponse.encryptedConsentId,
                authorisationId: this.authResponse.authorisationId,
              },
            }
          )
          .then(() => {
            this.authResponse = authResponse;
            this.shareService.changeData(this.authResponse);
          });
      });
  }

  handleMethodSelectedEvent(scaMethod: ScaUserDataTO): void {
    this.selectedScaMethod = scaMethod;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
