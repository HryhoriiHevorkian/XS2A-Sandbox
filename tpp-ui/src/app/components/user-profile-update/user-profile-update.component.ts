import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TppUserService } from '../../services/tpp.user.service';
import { TppManagementService } from '../../services/tpp-management.service';
import { User } from '../../models/user.model';
import { ADMIN_KEY } from '../../commons/constant/constant';
import { PageNavigationService } from '../../services/page-navigation.service';
import { InfoService } from '../../commons/info/info.service';

@Component({
  selector: 'app-user-profile-update',
  templateUrl: './user-profile-update.component.html',
  styleUrls: ['./user-profile-update.component.scss'],
})
export class UserProfileUpdateComponent implements OnInit {
  user: User;
  tppId: string;
  userForm: FormGroup;
  submitted: boolean;
  admin: string;

  constructor(
    public pageNavigationService: PageNavigationService,
    private authService: AuthService,
    private userInfoService: TppUserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private tppManagementService: TppManagementService,
    private infoService: InfoService,
    private router: Router,
    private tppUserService: TppUserService
  ) {}

  ngOnInit() {
    this.admin = localStorage.getItem(ADMIN_KEY);
    this.setupEditUserFormControl();
    this.getUserDetails();

    this.tppId = this.route.snapshot.params['id'];
    if (this.tppId) {
      this.getUserInfoForAdmin(this.tppId);
    }
  }

  get formControl() {
    return this.userForm.controls;
  }

  getUserDetails(): void {
    if (this.authService.isLoggedIn()) {
      this.userInfoService.getUserInfo().subscribe((user: User) => {
        this.user = user;

        this.userForm.patchValue({
          email: this.user.email,
          username: this.user.login,
          pin: this.user.pin,
        });
      });
    }
  }

  setupEditUserFormControl(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      pin: ['', Validators.minLength(5)],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    const updatedUser: User = {
      ...this.user,
      branchLogin: undefined,
      email: this.userForm.get('email').value,
      login: this.userForm.get('username').value,
      pin: this.userForm.get('pin').value.trim()
        ? this.userForm.get('pin').value
        : this.user.pin,
    };
    if (this.admin === 'true') {
      this.tppManagementService
        .updateUserDetails(updatedUser, this.tppId)
        .subscribe(() => this.getUserDetails());
      this.router.navigate(['/users/all']);
      this.infoService.openFeedback(
        'The information has been successfully updated'
      );
      this.getUserDetails();
    } else if (this.admin === 'false') {
      this.userInfoService
        .updateUserInfo(updatedUser)
        .subscribe(() => this.getUserDetails());
      this.infoService.openFeedback(
        'The information has been successfully updated'
      );
      this.router.navigate(['/profile']);
    }
  }

  createLastVisitedPageLink(id: string): string {
    if (this.admin === 'true') {
      return `/profile/${id}`;
      this.pageNavigationService.setLastVisitedPage('/management');
    } else if (this.admin === 'false') {
      this.pageNavigationService.setLastVisitedPage('/accounts');
      return `/profile`;
    }
  }

  private getUserInfoForAdmin(tppId: string) {
    if (this.admin === 'true') {
      this.tppManagementService.getTppById(tppId).subscribe((user: User) => {
        if (user) {
          this.user = user;
          this.userForm.patchValue({
            email: this.user.email,
            username: this.user.login,
          });
        }
      });
    }
  }

  resetPasswordViaEmail(login: string) {
    this.tppUserService.resetPasswordViaEmail(login).subscribe(() => {
      this.infoService.openFeedback('Link for password reset was sent, check email.', {
        severity: 'info',
      });
    });
  }
}
