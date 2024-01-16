import { egretAnimations } from './../../../../../shared/animations/egret-animations';
import { SliderService } from "./../../../../../data/service/slider.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder,Validators,FormControl,FormGroupDirective, NgForm } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { Slider } from "app/data/schema/slider";
import { DomSanitizer } from '@angular/platform-browser';
import {ErrorStateMatcher} from '@angular/material/core';
import { environment } from "environments/environment";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MastertableService } from '../../../../../data/service/mastertable.service';
import { Mastertable } from '../../../../../data/schema/mastertable';

@Component({
  selector: 'app-dialog-slider',
  templateUrl: './dialog-slider.component.html',
  styleUrls: ['./dialog-slider.component.css'],
  animations: egretAnimations,
})
export class DialogSliderComponent implements OnInit{/*,ErrorStateMatcher 
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }*/

  public itemForm: FormGroup;
  items: Slider[];
  slider:Slider;
  displayFileName = '';
  fileName="";
  public isImage:boolean=true;
  public types: Mastertable[];

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogSliderComponent>,
  private fb: FormBuilder,
  private sliderService: SliderService,
  private sanitizer: DomSanitizer,
  private snack: MatSnackBar,
  private mastertableService:MastertableService) { }
  
  imagenPrevia: "";
  archivoCapturado:any;

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);
    this.load();
  }

  load() {
    this.sliderService.getAll().subscribe((res) => {
      this.items = res;
    });
    this.loadType();
  }
  buildItemForm(item) {
    this.imagenPrevia=item.filenamefolder + item.filename;
    if((this.imagenPrevia || "") !=""){
      this.checkImage(this.imagenPrevia);
    }
    this.itemForm = this.fb.group({
      filenamefolder:[this.imagenPrevia,[Validators.required]],
      orden: [item.order || "",[Validators.required]],
      urlImage: [item.urlImage || ""],
      active: [item.active==undefined?true:item.active],
      idType:[item.idType || "",[Validators.required]],
      id: [item.id || 0],
    });
    
  }

  getErrorMessage(id:number) {
    if (id==1 && this.itemForm.controls['idType'].hasError('required')) {
      return 'Debe seleccionar una ventana';
    }
    if (id==2 && this.itemForm.controls['orden'].hasError('required')) {
      return 'Debes ingresar un valor en orden';
    }

    return this.itemForm.controls['orden'].hasError('idType') ? 'Datos invalidos' : '';
  }
  submit() {

    try {

      if(this.itemForm.controls['id'].value ==0 && (this.imagenPrevia=="" || !this.archivoCapturado) ){
        this.snack.open('Tiene que ingresar una imagen', 'OK',{ duration: 4000 });
        return;
      }
      if(this.items.filter(x=>x.active==true && x.id!=this.itemForm.controls['id'].value && x.idType==this.itemForm.controls['idType'].value && x.order==this.itemForm.controls['orden'].value).length>0 ){
        this.snack.open('El orden ingresado ya existe', 'OK',{ duration: 4000 });
        return;
      }
      
      if (this.itemForm.valid){
        
        
        const formData = new FormData();
        formData.append('files', this.archivoCapturado);
        this.slider ={
          id: this.itemForm.controls['id'].value,
          idType:this.itemForm.controls['idType'].value,
          nameType:"",
          filename: "",
          filenamefolder: "",
          order: this.itemForm.controls['orden'].value,
          isImage: this.isImage,
          urlImage: this.itemForm.controls['urlImage'].value,
          active: this.itemForm.controls['active'].value,
          idUserRegister: 1,
          idUserUpdate:1
        };
        formData.append('dtoRequest', JSON.stringify(this.slider));
        this.dialogRef.close(formData);      
      }
    } catch (e) {
      console.log('ERROR', e);
    }
  }
  capturarFile(event):any{
    this.archivoCapturado=event.target.files[0];
    this.fileName=this.archivoCapturado.name;
    this.checkImage(this.fileName);   
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
  loadType(){
    this.mastertableService.getByIdFather(25).subscribe(res => {this.types = res},
      (err) => {},
      () => {
        this.types=this.types.filter(o => o.active===true);
    });
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

  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }
  checkImage(fileName){
    let ext=this.getFileExtension(fileName);
    if(!(ext=="png" || ext=="gif" || ext=="webp" || ext=="jpeg" || ext=="jpg")){
      this.isImage=false;
    }
    else{
      this.isImage=true;
    }
  }

}
