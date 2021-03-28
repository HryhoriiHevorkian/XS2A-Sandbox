import { TestBed } from '@angular/core/testing';

import { CertificateService } from './certificate.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory, LanguageService } from './language.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('CertificateService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        HttpClientModule,
      ],
      providers: [LanguageService, TranslateService],
    })
  );

  it('should be created', () => {
    const service: CertificateService = TestBed.inject(CertificateService);
    expect(service).toBeTruthy();
  });
});
