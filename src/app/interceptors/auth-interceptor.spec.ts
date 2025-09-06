import { AuthInterceptor } from './auth-interceptor';

describe('AuthInterceptor', () => {
  it('should create an instance', () => {
    const storageStub = {} as any; // Provide a stub/mock for Storage
    expect(new AuthInterceptor(storageStub)).toBeTruthy();
  });
});
