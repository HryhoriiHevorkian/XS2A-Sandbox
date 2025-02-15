import { TestBed } from '@angular/core/testing';

import { JsonService } from './json.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('JsonService', () => {
  let service: JsonService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JsonService],
    });
    service = TestBed.inject(JsonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
