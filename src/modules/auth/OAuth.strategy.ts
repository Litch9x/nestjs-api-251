import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') as string;
    const clientSecret = configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    ) as string;

    super({
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { emails: { value: string }[] },
    done: (error: any, user?: any, info?: any) => void,
  ) {
    const { emails } = profile;
    const email: string = emails[0].value;
    const user = await this.authService.validateOAuthUser(email);
    if (!user) {
      return done(new Error('Invalid OAuth user'), null);
    }
  }
}
