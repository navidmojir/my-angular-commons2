import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import KeycloakAuthorization from 'keycloak-js/authz';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private userPermissions: any[] = [];

    private keycloak: any;
    
    init(config: any): Promise<boolean> {
        try {
            this.keycloak = new Keycloak(config);
            return this.keycloak.init({
                onLoad: 'login-required'
            });
        //     if (authenticated) {
        //         console.log(this.keycloak.token);
        //     } else {
        //         console.log('User is not authenticated');
        //     }
        } catch (error) {
            console.error('Failed to initialize adapter:', error);
            throw error;
        }
    }

    isAuthenticated(): boolean {
        return this.keycloak.authenticated == true ? true: false;
    }

    getUserInfo() {
        return this.keycloak.idTokenParsed;
    }

    getAccessToken(): string {
        return this.keycloak.token;
    }

    logout() {
        this.keycloak.logout();
    }

    loadPermissions() {
        let authorization = new KeycloakAuthorization(this.keycloak);
        authorization.entitlement("demo").then(
            (rpt) => this.loadRpt(rpt),
            ()=> console.log("deny"),
            () => console.log("error")
        )
    }

    private loadRpt(rpt: string) {
    let decodedRpt = this.decodeToken(rpt);

    this.userPermissions = this.userPermissions.concat(decodedRpt.authorization.permissions);

    // console.log(this.userPermissions);
  }

    private decodeToken(str: string) {
      str = str.split('.')[1];

      str = str.replace(/-/g, '+');
      str = str.replace(/_/g, '/');
      switch (str.length % 4) {
          case 0:
              break;
          case 2:
              str += '==';
              break;
          case 3:
              str += '=';
              break;
          default:
              throw 'Invalid token';
      }

      str = decodeURIComponent(escape(atob(str)));

      return JSON.parse(str);
  }

  hasPermission(resource: string, scope: string) {
    
    for(let perm of this.userPermissions) {
      if(perm.rsname == scope + " - " + resource)        
          return true;
    }
    
    return false;
  }
}