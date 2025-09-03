import { inject } from "@angular/core";
import { AuthService } from "./auth-service";
import { KcConfigService } from "./kc-config-service";

export class AppInitializerService {
    constructor(){}
    
    static initialize(): Promise<unknown> {
        let authService = inject(AuthService);
        let configService = inject(KcConfigService);
        return authService.init(configService.getConfig()).then((result)=>{
            console.log("auth service initialized with result " + result);
            if(result) {
                setInterval(()=>{
                    authService.getKeycloak().updateToken(10).then((result: any) => console.log("Access token updated with result " + result));
                }, (authService.getTokenExpiresIn() - 10)*1000);                
                return authService.loadPermissions();
                
            }
            else
                throw "the result of auth service init was false";
        });
    }
}