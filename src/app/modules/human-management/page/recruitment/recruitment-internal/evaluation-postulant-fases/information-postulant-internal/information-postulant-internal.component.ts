import { PostulantInternalDto, PostulantInternalInfoDto } from './../../../../../../../data/schema/PostulantInternal/postulantInternal';
import { PostulantInfoDto } from './../../../../../../../data/schema/Postulant/postulant';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-information-postulant-internal',
    templateUrl: 'information-postulant-internal.component.html',
    styleUrls: ['./information-postulant-internal.component.scss']
})

export class InformationPostulantInternalComponent implements OnInit {
    @Input() person: PostulantInternalInfoDto;
    constructor(private router: Router) { }

    ngOnInit() { }

    downLoad(archivo, contentType, name) {
        let link = document.createElement("a");
        let blobArchivo = this.base64ToBlob(archivo, contentType);
        let blob = new Blob([blobArchivo], { type: contentType });
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
      }
    
      public base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
        b64Data = b64Data.replace(/\s/g, ""); //IE compatibility...
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);
    
          let byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
      }

    RedirectByURL() {
      this.router.navigate([`humanmanagement/evaluation-postulants/${this.person.idEvaluation}`], {
            skipLocationChange: true
          });
    }
}