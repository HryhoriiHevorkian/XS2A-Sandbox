import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConsentAuthorizeResponse} from "../../api/models/consent-authorize-response";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AisService} from "../../common/services/ais.service";
import {ShareDataService} from "../../common/services/share-data.service";
import {RoutingPath} from "../../common/models/routing-path.model";
import {AccountDetailsTO} from "../../api/models/account-details-to";

@Component({
  selector: 'app-grant-consent',
  templateUrl: './grant-consent.component.html',
  styleUrls: ['./grant-consent.component.scss']
})
export class GrantConsentComponent implements OnInit, OnDestroy {

  public authResponse: ConsentAuthorizeResponse = {
    "psuMessages": [],
    "encryptedConsentId": "e5nrDmqUJHzp9v28MkZxnb7ItZhCULlZBLQpIgPF0bHKDHnIh3ueFr3W2z92MLLRuWhWk2-WNYnbWdFPTsl_Ig==_=_bS6p6XvTWI",
    "scaMethods": [
      {
        "id": "YNJjHF67TRgt2Gty9Pj1XU",
        "scaMethod": "EMAIL",
        "methodValue": "12345678_defaultPsu.private@mail.de"
      }
    ],
    "authorisationId": "a2906505-ea43-4c2a-a9f4-adcc111b0dc7",
    "scaStatus": "psuIdentified",
    "accounts": [
      {
        "id": "L7eoFzGpQEwu0sgYFR0u9w",
        "iban": "DE38760700241234567801",
        "bban": null,
        "pan": null,
        "maskedPan": null,
        "msisdn": null,
        "currency": "EUR",
        "name": "AcctPsuDefPriv1",
        "product": "Cash24",
        "accountType": "CASH",
        "accountStatus": "ENABLED",
        "bic": null,
        "linkedAccounts": null,
        "usageType": "PRIV",
        "details": "Private PSU that is used to trigger default behaviour of the ASPSP",
        "balances": [
          {
            "amount": {
              "currency": "EUR",
              "amount": 190.55
            },
            "balanceType": "INTERIM_AVAILABLE",
            "lastChangeDateTime": "2019-05-15T10:09:19.815",
            "referenceDate": "2019-05-15",
            "lastCommittedTransaction": null
          }
        ]
      },
      {
        "id": "BvitSBedTDglLy-8XLib-A",
        "iban": "DE11760700241234567802",
        "bban": null,
        "pan": null,
        "maskedPan": null,
        "msisdn": null,
        "currency": "EUR",
        "name": "AcctPsuDefPriv2",
        "product": "Cash24",
        "accountType": "CASH",
        "accountStatus": "ENABLED",
        "bic": null,
        "linkedAccounts": null,
        "usageType": "PRIV",
        "details": "Private PSU that is used to trigger default behaviour of the ASPSP",
        "balances": [
          {
            "amount": {
              "currency": "EUR",
              "amount": 382.64
            },
            "balanceType": "INTERIM_AVAILABLE",
            "lastChangeDateTime": "2019-05-15T10:09:19.924",
            "referenceDate": "2019-05-15",
            "lastCommittedTransaction": null
          }
        ]
      },
      {
        "id": "yXLpZZKmQGcr5T7ofUEjfk",
        "iban": "DE81760700241234567803",
        "bban": null,
        "pan": null,
        "maskedPan": null,
        "msisdn": null,
        "currency": "EUR",
        "name": "AcctPsuDefPriv3",
        "product": "Cash24",
        "accountType": "CASH",
        "accountStatus": "ENABLED",
        "bic": null,
        "linkedAccounts": null,
        "usageType": "PRIV",
        "details": "Private PSU that is used to trigger default behaviour of the ASPSP",
        "balances": [
          {
            "amount": {
              "currency": "EUR",
              "amount": 231.67
            },
            "balanceType": "INTERIM_AVAILABLE",
            "lastChangeDateTime": "2019-05-15T10:09:20.034",
            "referenceDate": "2019-05-15",
            "lastCommittedTransaction": null
          }
        ]
      },
      {
        "id": "UJ-Wm5EqRR8vEpJYZwu_vA",
        "iban": "DE54760700241234567804",
        "bban": null,
        "pan": null,
        "maskedPan": null,
        "msisdn": null,
        "currency": "EUR",
        "name": "AcctPsuDefPriv4",
        "product": "Cash24",
        "accountType": "CASH",
        "accountStatus": "ENABLED",
        "bic": null,
        "linkedAccounts": null,
        "usageType": "PRIV",
        "details": "Private PSU that is used to trigger default behaviour of the ASPSP",
        "balances": [
          {
            "amount": {
              "currency": "EUR",
              "amount": 650.88
            },
            "balanceType": "INTERIM_AVAILABLE",
            "lastChangeDateTime": "2019-05-15T10:09:20.133",
            "referenceDate": "2019-05-15",
            "lastCommittedTransaction": null
          }
        ]
      }
    ],
    "consent": {
      "id": "1f734e5a-9727-4421-96b5-89a208156d43",
      "userId": "12345678_Default-PSU-Private",
      "tppId": "PSDDE-FAKENCA-87B2AC",
      "frequencyPerDay": 5,
      "access": {
        "accounts": [],
        "balances": [],
        "transactions": [],
        "availableAccounts": null,
        "allPsd2": "ALL_ACCOUNTS"
      },
      "validUntil": "2019-10-10",
      "recurringIndicator": true
    },
    "authMessageTemplate": null
  };
  public encryptedConsentId: string;
  public authorisationId: string;
  public bankOfferedForm: FormGroup;
  public bankOffered: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private aisService: AisService,
    private shareService: ShareDataService) {
    this.bankOfferedForm = this.formBuilder.group({});
  }

  get accounts(): Array<AccountDetailsTO> {
    return this.authResponse ? this.authResponse.accounts : [];
  }

  get consentAccounts(): Array<string> {
    return this.authResponse.consent.access.accounts;
  }

  get consentBalances(): Array<string> {
    return this.authResponse.consent.access.balances;
  }

  get consentTransactions(): Array<string> {
    return this.authResponse.consent.access.transactions;
  }

  get bankOfferedConsentFormValid(): boolean {
    return this.consentAccounts.length > 0 || this.consentBalances.length > 0 || this.consentTransactions.length > 0
  }

  public ngOnInit(): void {
    console.log(this.isBankOfferedConsent());
    this.bankOffered = this.isBankOfferedConsent();
    // this.shareService.currentData.subscribe(data => {
    //   if (data) {
    //     this.shareService.currentData.subscribe(authResponse => {
    //       this.authResponse = authResponse;
    //       this.bankOffered = this.isBankOfferedConsent();
    //     });
    //   }
    // });
  }

  public onSubmit() {
    if (!this.authResponse) {
      console.log('Missing application data');
      return;
    }
    this.subscriptions.push(
      this.aisService.startConsentAuth({
        encryptedConsentId: this.authResponse.encryptedConsentId,
        authorisationId: this.authResponse.authorisationId,
        aisConsent: this.authResponse.consent,
      }).subscribe(authResponse => {
        this.authResponse = authResponse;
        this.shareService.changeData(this.authResponse);
        this.router.navigate([`${RoutingPath.ACCOUNT_INFORMATION}/${RoutingPath.SELECT_SCA}`]);
      })
    );
  }

  public onCancel(): void {
    this.subscriptions.push(
      this.aisService.revokeConsent({
        encryptedConsentId: this.authResponse.encryptedConsentId,
        authorisationId: this.authResponse.authorisationId
      }).subscribe(authResponse => {
        console.log(authResponse);
        this.router.navigate([`${RoutingPath.ACCOUNT_INFORMATION}/${RoutingPath.RESULT}`], {
          queryParams: {
            encryptedConsentId: this.authResponse.encryptedConsentId,
            authorisationId: this.authResponse.authorisationId
          }
        }).then(() => {
          this.authResponse = authResponse;
          this.shareService.changeData(this.authResponse);
        });
      })
    );
  }

  handleObjectSelectedEvent(value, container): void {
    const idx = container.indexOf(value);
    if (idx > -1) { // is currently selected
      container.splice(idx, 1);
    } else { // is newly selected
      container.push(value);
    }
  }

  public accountsChecked(account): boolean {
    return this.authResponse.consent.access.accounts.indexOf(account.iban) > -1
  }

  public balancesChecked(account): boolean {
    return this.authResponse.consent.access.balances.indexOf(account.iban) > -1;
  }

  public transactionsChecked(account): boolean {
    return this.authResponse.consent.access.transactions.indexOf(account.iban) > -1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private isBankOfferedConsent() {
    return this.isEmptyAccountAccess() && this.isEmptyBalancesAccess() && this.isEmptyTransactionsAccess();
  }

  private isEmptyAccountAccess(): boolean {
    return this.authResponse.consent.access.accounts == null ||
      this.authResponse.consent.access.accounts.length == 0;
  }

  private isEmptyBalancesAccess(): boolean {
    return this.authResponse.consent.access.balances == null ||
      this.authResponse.consent.access.balances.length == 0;
  }

  private isEmptyTransactionsAccess(): boolean {
    return this.authResponse.consent.access.transactions == null ||
      this.authResponse.consent.access.transactions.length == 0;
  }

}
