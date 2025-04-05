import { AuthGuard } from '@nestjs/passport';
import { GoogleOAuthGuard } from '../../../src/modules/auth/guards/google-oauth.guard';

describe('GoogleOAuthGuard', () => {
  let guard: GoogleOAuthGuard;

  beforeEach(() => {
    guard = new GoogleOAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with "google" strategy', () => {
    expect(GoogleOAuthGuard.prototype).toBeInstanceOf(AuthGuard('google'));
  });
});
