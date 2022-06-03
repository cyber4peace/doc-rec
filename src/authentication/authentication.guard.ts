import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { UnauthorizedException } from './unauthorized.exception';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {

  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const authorization = request?.headers?.authorization;

    console.log(`AuthenticationGuard`);

    if (!authorization) {
      throw new UnauthorizedException('Authorization: <tokenType> <accessToken> header missing');
    }

    const authorizations = authorization.split(' ');
    if (authorizations.length !== 2) {
      throw new UnauthorizedException('Authorization: <tokenType> <accessToken> header invalid');
    }

    try {
      await this.authenticationService.authenticate(authorization);
      return true;
    } catch (e: any) {
      console.error(e);
      throw new UnauthorizedException(e.message);
    }
  }
}