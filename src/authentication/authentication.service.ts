import axios from 'axios';
import { Injectable } from '@nestjs/common';

import { KeycloakUserInfoResponse } from './keycloak.model';
import { User } from './user.model';
import { AuthenticationError } from './authentication.error';
import keycloakConfig from '../keycloak.json';

@Injectable()
export class AuthenticationService {
  private readonly serviceUrl: string;
  private readonly keycloakUserInfo: string;

  constructor() {
    this.serviceUrl = process.env.REACT_APP_KEYCLOAK_SERVICE_URL!;
    this.keycloakUserInfo = `${this.serviceUrl}/auth/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`;
  }

  async authenticate(authorization: string): Promise<User> {
    console.log(`AuthenticationService: ${this.keycloakUserInfo}`);
    try {
      const userInfo = await axios.get<KeycloakUserInfoResponse>(this.keycloakUserInfo, { headers: { authorization } }).then(({ data }) => data);
      const ret = {
        id: userInfo.sub!,
        username: userInfo.preferred_username!,
      };
      console.log(`AuthenticationService: ${JSON.stringify(ret)}`);
      return ret;
    } catch (e: any) {
      console.error(e);
      throw new AuthenticationError(e.message);
    }
  }
}
