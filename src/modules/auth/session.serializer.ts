// src/auth/session.serializer.ts
import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: any, id?: any) => void) {
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: any, user?: any) => void) {
    done(null, payload);
  }
}
