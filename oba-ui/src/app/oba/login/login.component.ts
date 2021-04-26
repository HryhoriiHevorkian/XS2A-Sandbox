import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';

import { RoutingPath } from '../../common/models/routing-path.model';
import { AuthService } from '../../common/services/auth.service';
import { CustomizeService } from '../../common/services/customize.service';

import LoginUsingPOST1Params = OnlineBankingAuthorizationProvidesAccessToOnlineBankingService.LoginUsingPOST1Params;
import { OnlineBankingAuthorizationProvidesAccessToOnlineBankingService } from '../../api/services/online-banking-authorization-provides-access-to-online-banking.service';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBar,
} from '@angular/material/snack-bar';
import browser from 'browser-detect';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 4;

  private subscriptions: Subscription[] = [];

  constructor(
    public customizeService: CustomizeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const result = browser();
    if (
      result.name !== 'chrome' &&
      result.name !== 'edge' &&
      result.name !== 'safari' &&
      result.name !== 'firefox'
    ) {
      this._snackBar.open(
        'You are using an old browser. This can lead to broken views.',
        'Close',
        {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: this.durationInSeconds * 1000,
        }
      );
    }
    this.initLoginForm();

    this.loginForm.valueChanges.subscribe((val) => {
      this.errorMessage = null;
    });
  }

  public onSubmit(): void {
    this.subscriptions.push(
      this.authService
        .login({ ...this.loginForm.value } as LoginUsingPOST1Params)
        .subscribe(
          (success) => {
            if (success) {
              this.router.navigate([`${RoutingPath.ACCOUNTS}`]);
            }
          },
          (error) => {
            if (error.status === 401) {
              this.errorMessage = 'Invalid credentials';
            } else {
              this.errorMessage = error.error
                ? error.error.message
                : error.message;
            }
            return throwError(error);
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      pin: ['', Validators.required],
    });
  }
}
