import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NavbarComponent} from './navbar.component';
import {RouterTestingModule} from "@angular/router/testing";
import {IconModule} from "../icon/icon.module";
import {AuthService} from "../../services/auth.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let router: Router;
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                IconModule,
            ],
            providers: [TestBed.overrideProvider(AuthService, {useValue: authServiceSpy})],
            declarations: [NavbarComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        authServiceSpy.isLoggedIn.and.returnValue(true);
        fixture.detectChanges();
        router = TestBed.get(Router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    });
});
