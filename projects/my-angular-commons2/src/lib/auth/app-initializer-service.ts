import { inject } from "@angular/core";
import { AuthService } from "./auth-service";
import { KcConfigService } from "./kc-config-service";

export class AppInitializerService {
    constructor(){}
    
    static initialize(): Promise<unknown> {
        let authService = inject(AuthService);
        let configService = inject(KcConfigService);
        return authService.init(configService.getConfig()).then((result)=>{            
            if(result) {
                let tokenRefreshTimeout = (authService.getTokenExpiresIn() - 10)*1000;
                console.log("Attempting to set interval for refreshing token with timeout ", tokenRefreshTimeout);
                setInterval(()=>{
                    console.log("Trying to refresh access token");
                    authService.getKeycloak().updateToken(10).then((result: any) => console.log("Access token updated with result " + result + " at " + new Date()));
                }, tokenRefreshTimeout);                
                return authService.loadPermissions();
                
            }
            else
                throw "the result of auth service init was false";
        });
    }
}