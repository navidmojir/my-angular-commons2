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
                // let tokenRefreshTimeout = (authService.getTokenExpiresIn() - 10)*1000;
                let tokenRefreshTimeout = 300*1000;
                setInterval(()=>{
                    authService.getKeycloak().updateToken(10);
                }, tokenRefreshTimeout);                
                return authService.loadPermissions();
                
            }
            else
                throw "the result of auth service init was false";
        });
    }
}
