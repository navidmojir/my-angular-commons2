import { inject } from "@angular/core";
import { AuthService } from "./auth-service";
import { KcConfigService } from "./kc-config-service";

export class AppInitializerService {
    constructor(){}
    
    static initialize(): Promise<unknown> {
        let authService = inject(AuthService);
        let configService = inject(KcConfigService);
        return authService.init(configService.getConfig()).then((result)=>{
            console.log("auth service initialized with " + result);
            if(result)
                return authService.loadPermissions();
            else
                throw "the result of auth service init was false";
        });
    }
}