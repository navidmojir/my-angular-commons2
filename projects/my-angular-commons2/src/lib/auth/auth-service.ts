import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import KeycloakAuthorization from 'keycloak-js/authz';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private userPermissions: any[] = [];

    private keycloak?: Keycloak;

    keycloakConfig: any;
    
    init(config: any): Promise<boolean> {
        try {
            console.log("begin init auth service");
            this.keycloakConfig = config;
            this.keycloak = new Keycloak(config);
            return this.keycloak.init({
                onLoad: 'login-required'
            });
        } catch (error) {
            console.error('Failed to initialize adapter:', error);
            throw error;
        }
    }

    isAuthenticated(): boolean {
        if(this.keycloak == undefined)
            throw "Keycloak is not initialized";
        return this.keycloak.authenticated == true ? true: false;
    }

    getUserInfo() {
        if(this.keycloak == undefined)
            throw "Keycloak is not initialized";
        return this.keycloak.idTokenParsed;
    }

    getAccessToken(): string {
        if(this.keycloak == undefined)
            throw "Keycloak is not initialized";
        return this.keycloak.token ? this.keycloak.token : "";
    }

    logout() {
        if(this.keycloak == undefined)
            throw "Keycloak is not initialized";
        this.keycloak.logout();
    }

    loadPermissions(): Promise<unknown> {
        console.log("starting to load permissions");
        if(this.keycloak == undefined)
            throw "Keycloak is not initialized";
        let authorization = new KeycloakAuthorization(this.keycloak);
        let promises: Promise<unknown>[] = [];
        for(let resourceClientId of this.keycloakConfig.resourceServersClientIds) {
            promises.push(this.loadResourcePermissions(authorization, resourceClientId));
        }
        return Promise.all(promises);
    }

    private loadResourcePermissions(authorization: KeycloakAuthorization, resourceClientId: string): Promise<unknown> {
        console.log("starting to load permissions for resource with client id " + resourceClientId);
        return new Promise((resolve, reject) => {
            authorization.entitlement(resourceClientId).then(
                (rpt) => {
                    this.loadRpt(rpt);
                    resolve(true);
                    console.log("loading permissions for resource with client id " + resourceClientId + " was succeeded")
                },
                ()=> {
                    console.log("denied when loading permissions");
                    reject(false);
                },
                () => {
                    console.log("error occured when loading permissions");
                    reject(false);
                }
            );
        })
        
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
    // console.log(this.userPermissions);
    for(let perm of this.userPermissions) {
      if(perm.rsname == scope + " - " + resource)        
          return true;
    }
    
    return false;
  }
}