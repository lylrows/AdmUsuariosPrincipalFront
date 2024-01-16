import { egretAnimations } from './../../../../../shared/animations/egret-animations';
import { HomeOrganizationService } from "./../../../../../data/service/home-organization.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder,Validators,FormControl,FormGroupDirective, NgForm } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { Organization } from "app/data/schema/organization";
import { DomSanitizer } from '@angular/platform-browser';
import {ErrorStateMatcher} from '@angular/material/core';
import { environment } from "environments/environment";
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-organization',
  templateUrl: './dialog-organization.component.html',
  styleUrls: ['./dialog-organization.component.css'],
  animations: egretAnimations,
})
export class DialogOrganizationComponent implements OnInit {

  public itemForm: FormGroup;
  items: Organization[];
  organization:Organization;
  displayFileName = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogOrganizationComponent>,
  private fb: FormBuilder,
  private organizationService: HomeOrganizationService,
  private sanitizer: DomSanitizer,
  private snack: MatSnackBar,
  private dialog: MatDialogModule,) { }

  imagenPrevia: "";
  archivoCapturado:any;
  editorOptions= {
    toolbar: [
      [{ 'list': 'bullet' }],
      [ 'bold', 'italic', 'underline'],
    ],
  };
  
  ngOnInit(): void {
    this.buildItemForm(this.data.payload);
    this.load();
  }

  load() {
    this.organizationService.getAll().subscribe((res) => {
      this.items = res;
    });
  }

  submit() {
    //this.dialogRef.close(this.itemForm.value);
    try {
      if(this.itemForm.controls['id'].value ==0 && (this.imagenPrevia=="" || !this.archivoCapturado) ){
        this.snack.open('Tiene que ingresar una imagen', 'OK',{ duration: 4000 });
        return;
      }
      if(this.items.filter(x=>x.active==true && x.id!=this.itemForm.controls['id'].value && x.title==this.itemForm.controls['title'].value).length>0 ){
        this.snack.open('El título ingresado ya existe', 'OK',{ duration: 4000 });
        return;
      }
      if(!(this.itemForm.controls['description'].value.length>0) ){
        this.snack.open('Ingrese una descripción', 'OK',{ duration: 4000 });
        return;
      }

      const formData = new FormData();
      formData.append('files', this.archivoCapturado);
      this.organization ={
        id: this.itemForm.controls['id'].value,
        filename: "",
        filenamefolder: "",
        title: this.itemForm.controls['title'].value,
        description: this.itemForm.controls['description'].value,
        active: this.itemForm.controls['active'].value,
        idUserRegister: 1,
        idUserUpdate:1
    };
      formData.append('dtoRequest', JSON.stringify(this.organization));
      this.dialogRef.close(formData);
      
    } catch (e) {
      console.log('ERROR', e);

    }
  }

  capturarFile(event):any{
    this.archivoCapturado=event.target.files[0];
    this.displayFileName = "<span>" + this.archivoCapturado.name + "</span>";

    if (parseInt((event.target.files[0].size / 1024 / 1024).toFixed(1)) > environment.MaxFileSizeMB) {
      this.archivoCapturado = "";
      this.displayFileName = "";
      this.snack.open('El tamaño máximo permitido es: ' + environment.MaxFileSizeMB + "MB", 'OK',{ duration: 4000 });

      return;
    }
    this.blobFile(this.archivoCapturado).then((res: any) => {
      this.imagenPrevia = res.base;

    })
  }



  buildItemForm(item) {
    this.itemForm = this.fb.group({
      title: [item.title || "",[Validators.required]],
      description: [item.description || ""],
      active: [item.active==undefined?true:item.active],
      id: [item.id || 0],
    });
    this.imagenPrevia=item.filenamefolder + item.filename;
  }

  blobFile = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          blob: $event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  getErrorMessage(id:number) {
    if (id==1 && this.itemForm.controls['title'].hasError('required')) {
      return 'Debes ingresar un título';
    }
    if (id==2 && this.itemForm.controls['description'].hasError('required')) {
      return 'Debes ingresar una descripción';
    }

    return this.itemForm.controls['title'].hasError('email') ? 'Datos invalidos' : 'Datos invalidos';
  }

  deletefile() {
    this.archivoCapturado = "";
    this.imagenPrevia = "";
    this.displayFileName = "";
    return false;
  }
  loadImages = () => {
    try {
      const formData = new FormData();
      formData.append('files', this.archivoCapturado);
      formData.append('dtoRequest', this.archivoCapturado);
      this.dialogRef.close(formData);
    } catch (e) {
      console.log('ERROR', e);

    }
  }

  

}
