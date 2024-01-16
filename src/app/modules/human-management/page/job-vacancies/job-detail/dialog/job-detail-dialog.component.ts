import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { JwtAuthService } from '@app/shared/services/auth/jwt-auth.service';
import { JobInternalService } from '@app/data/service/jobs-internal.service';
import { FileDto } from '@app/data/schema/File/FileDto';

@Component({
    selector: 'app-job-detail-dialog',
    templateUrl: 'job-detail-dialog.component.html',
    styleUrls: ['job-detail-dialog.component.scss']
})

export class JobDetailDialogComponent implements OnInit {
    itemForm: FormGroup;
    archivo: any;
    filename: any;
    title: any;
    idjob: any; 
    user: any;
    file: FileDto;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<JobDetailDialogComponent>,
                private jwtService: JwtAuthService,
                private fb: FormBuilder,
                private jobService: JobInternalService,
                private snack: MatSnackBar) {
                    this.user = this.jwtService.getUser();
                    this.title = this.data.title;
                    this.idjob = this.data.idjob;
                    this.initForm();
                 }

    initForm() {
        this.itemForm = this.fb.group({
            id: [null],
            idjob: [this.idjob],
            IdPostulant: [this.user?.id],
            commentTimeWork: ['',  Validators.required],
            commentExperienceWork: ['', Validators.required],
            salaryPreference: ['', Validators.required]
        })
    }             

    ngOnInit() {
       this.jobService.getCv().subscribe(res => {
           this.file = res.data;
           
       })
     }

    submit() {
      if (this.itemForm.invalid) {
        return Object.values(this.itemForm.controls).forEach((controls) => {
          controls.markAllAsTouched();
        });
      }

          this.jobService.addJobPostulant(this.itemForm.value).subscribe(res => {
              if (res.stateCode == 200) {
                this.dialogRef.close(true);
              } else {
                this.snack.open(res.messageError[0], "Advertencia", { duration: 4000 });
              }
          })
    }

    changeFileCertificado(event) {
      this.archivo = event.target.files[0];
      this.filename = this.archivo.name;

      this.loadCv(this.archivo);
    }

    valideKeyAmount(evt) {
      
      var code = evt.which ? evt.which : evt.keyCode;
      var salario = this.itemForm .get('salaryPreference').value;
      if(salario.indexOf('.') > -1 && code == 46) return false;
  
      if (code == 8) {
          
          return true;
      } else if (code >= 48 && code <= 57 || code == 46) {
          
          return true;
      } else {
          
          return false;
      }
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
        b64Data = b64Data.replace(/\s/g, "");
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


      loadCv(archivo) {
        const formdata = new FormData();
        formdata.append('file', archivo);
          this.jobService.loadCv(formdata).subscribe(res => {
             if (res.stateCode == 200) {
               
                 this.file = res.data;
             }
          })
      }


      deleteCv() {
        this.jobService.deleteCv().subscribe(res => {
          if (res.stateCode == 200) {
             this.file.contentType = null;
             this.file.file = null;
             this.file.fileName = null;
             this.file.fileUrl = null;
          }
        })
      }
}