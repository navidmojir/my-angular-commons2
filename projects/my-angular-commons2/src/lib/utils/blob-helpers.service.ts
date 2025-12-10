import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { fromEvent, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BlobHelper {
    constructor(private domSanitizer: DomSanitizer) {}

    public createImageFromBlob(image: any, callback: any) {
        let reader = new FileReader();
        
        reader.addEventListener("load", () => {
            callback(this.domSanitizer.bypassSecurityTrustResourceUrl(reader.result as any));
        }, false);
    
        
        if (image) {
          reader.readAsDataURL(image);
        }

        // return fromEvent(reader, 'load');
      }

      /**
       * when calling http client get with { responseType: 'blob' as 'json' }
       * response will have "size" and "type" fields
       * This function creates a link 
       */
      public triggerDownload(response: any, filename: string = "") {
        let dataType = response.type;
            let binaryData = [];
            binaryData.push(response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            if (filename)
                downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
      }
    
}