import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class KcConfigService {
    config: any = {};

    getConfig() {
        return this.config;
    }

    setConfig(config: any) {
        this.config = config;
    }
}