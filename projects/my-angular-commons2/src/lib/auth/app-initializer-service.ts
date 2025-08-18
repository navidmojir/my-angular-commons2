import { inject } from "@angular/core";
import { AuthService } from "./auth-service";
import { KcConfigService } from "./kc-config-service";

export class AppInitializerService {
    constructor(){}
    
    static initialize(): Promise<unknown> {
        let authService = inject(AuthService);
        let configService = inject(KcConfigService);
        return authService.init(configService.getConfig());
    }
}