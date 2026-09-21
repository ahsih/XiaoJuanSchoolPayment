import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SchoolCommissionPolicyService } from './school-commission-policy.service';

describe('SchoolCommissionPolicyService', () => {
  let service: SchoolCommissionPolicyService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(SchoolCommissionPolicyService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('token');
  });

  it('requests the manager-only API with the bearer token', () => {
    localStorage.setItem('token', 'test-manager-token');
    let received = false;
    service.getAll().subscribe(policies => received = policies.length === 0);

    const request = http.expectOne('/internal-commission-policies');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-manager-token');
    request.flush([]);
    expect(received).toBeTrue();
  });
});
