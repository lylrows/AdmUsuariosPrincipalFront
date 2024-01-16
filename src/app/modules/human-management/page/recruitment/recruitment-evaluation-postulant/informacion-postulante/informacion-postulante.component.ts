import { PostulantService } from './../../../../../../data/service/job-postulant.service';
import { PostulantInfoDto } from './../../../../../../data/schema/Postulant/postulant';
import { Component, OnInit, Input } from '@angular/core';
import { PostulantDto } from '@app/data/schema/Postulant/postulant';
import { Router } from '@angular/router';

@Component({
    selector: 'app-information-postulant',
    templateUrl: 'informacion-postulante.component.html',
    styleUrls: ['informacion-postulante.component.scss']
})

export class InformacionPostulanteComponent implements OnInit {
    @Input() person: PostulantInfoDto;
    constructor(private postulanService: PostulantService,
      private router: Router) { }

    ngOnInit() { }

    getCv(idperson, idjob, iduser) {
      this.postulanService.getCv(idperson, idjob, iduser).subscribe((res) => {
        if (res.stateCode == 200) {
          let date = new Date();
          this.downLoad(res.data, "application/pdf", this.person.informationPersonal.lastName + '_' + this.person.informationPersonal.firstName + '_' + date.toLocaleDateString());
        }
      });
    }


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
        this.router.navigate([`humanmanagement/recruitment-evaluation/${this.person.idEvaluation}`], {
              skipLocationChange: true
        });
      }
}