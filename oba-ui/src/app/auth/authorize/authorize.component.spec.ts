import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthorizeComponent } from './authorize.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { InfoModule } from '../../common/info/info.module';
import { OauthService } from '../services/oauth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OnlineBankingOauthAuthorizationService } from '../../api/services/online-banking-oauth-authorization.service';
import OauthCodeUsingPOSTParams = OnlineBankingOauthAuthorizationService.OauthCodeUsingPOSTParams;

describe('AuthorizeComponent', () => {
  let component: AuthorizeComponent;
  let fixture: ComponentFixture<AuthorizeComponent>;
  let oAuthService: OauthService;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
          InfoModule,
          HttpClientTestingModule,
        ],
        declarations: [AuthorizeComponent],
        providers: [OauthService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeComponent);
    component = fixture.componentInstance;
    oAuthService = TestBed.inject(OauthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  const correctOauthParams: OauthCodeUsingPOSTParams = {
    redirectUri: 'https://adorsys.de',
    pin: 'pin',
    login: 'login',
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Customise Service', () => {
    expect(component.customizeService).toBeTruthy();
  });

  // TODO fix this line and add removed tests https://git.adorsys.de/adorsys/xs2a/psd2-dynamic-sandbox/issues/475
  // it('should call oAuthService on submit', () => {
  //   expect(oAuthService).toBeTruthy();
  //   spyOn(oAuthService, 'authorize').and.returnValue(of(correctOauthParams));
  //   let registerSpy = spyOn(router, 'navigate').and.callFake(() => of());
  //
  //   component.onSubmit();
  //   expect(oAuthService.authorize).toHaveBeenCalledTimes(1);
  //   expect(registerSpy).toHaveBeenCalledTimes(1);
  // });
  //
  // it('should check that the functions are defined', () => {
  //   expect(component).toBeTruthy();
  //   expect(component.onSubmit).not.toBeNull();
  // });
});
