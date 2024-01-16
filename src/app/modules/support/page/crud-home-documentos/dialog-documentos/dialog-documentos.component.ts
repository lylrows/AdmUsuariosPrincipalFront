import { egretAnimations } from './../../../../../shared/animations/egret-animations';
import { HomeDocumentosService } from "./../../../../../data/service/home-documentos.service";
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from "@angular/material/dialog";
import { FormGroup, FormBuilder,Validators,FormControl,FormGroupDirective, NgForm } from "@angular/forms";
import { Component, OnInit, Inject,ChangeDetectorRef } from "@angular/core";
import { Documento } from "app/data/schema/documentos";
import { DomSanitizer } from '@angular/platform-browser';
import { MastertableService } from '.././../../../../data/service/mastertable.service';
import { Empresa } from '.././../../../../data/schema/empresa';
import { Mastertable } from '.././../../../../data/schema/mastertable';
import { EmpresaService } from '.././../../../../data/service/empresa.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { environment } from "environments/environment";
import { MatSnackBar } from '@angular/material/snack-bar';
import {TooltipPosition} from '@angular/material/tooltip';
import { DialogCategoryComponent } from './dialog-category/dialog-category.component';
import { AppConfirmService } from '../../../../../shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-dialog-documentos',
  templateUrl: './dialog-documentos.component.html',
  styleUrls: ['./dialog-documentos.component.css'],
  animations: egretAnimations,
})
export class DialogDocumentosComponent implements OnInit {

  public itemForm: FormGroup;
  items: Documento[];
  document:Documento;
  displayFileName = '';
  idCategoryMasterTable= 0;
  public empresas: Empresa[];
  public categories: Mastertable[];
  public subcategories: Mastertable[];
  public requestCategory: Mastertable;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogDocumentosComponent>,
  private fb: FormBuilder,
  private documentService: HomeDocumentosService,
  private sanitizer: DomSanitizer,
  private empresaService: EmpresaService,
  private mastertableService:MastertableService,
  private snack: MatSnackBar,
  private dialog: MatDialog,
  private confirmService: AppConfirmService,
  private cdr: ChangeDetectorRef,) { }

  archivoCapturado:any;

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);
    this.load();
  }

  load() {
    this.documentService.getAll().subscribe((res) => {
      this.items = res;
    },(err) => {},
    () => {
      this.loadEmpresas();
      this.loadCategory();
      
  });
    
    
  }

  submit() {
    //this.dialogRef.close(this.itemForm.value);
    try {
      if(!this.ValidarFile()){
        return;
      }
      if(this.items.filter(x=>x.active==true && x.id!=this.itemForm.controls['id'].value && x.description==this.itemForm.controls['description'].value).length>0 ){
        this.snack.open('El título ingresado ya existe', 'OK',{ duration: 4000 });
        return;
      }
      debugger;
      const formData = new FormData();
      formData.append('files', this.archivoCapturado);
      this.document ={
        id: this.itemForm.controls['id'].value,
        filename: "",
        filenamefolder: "",
        nameCompany:"",
        nameCategory:"",
        nameSubCategory:"",
        idCompany: this.itemForm.controls['idCompany'].value,
        idCategory: this.itemForm.controls['idCategory'].value,
        idSubCategory: this.itemForm.controls['idSubCategory'].value,
        description: this.itemForm.controls['description'].value,
        active: this.itemForm.controls['active'].value,
        idUserRegister: 1,
        idUserUpdate:1
    };
      formData.append('dtoRequest', JSON.stringify(this.document));
      this.dialogRef.close(formData);
    } catch (e) {
      console.log('ERROR', e);

    }
  }
  cancel(){
    this.dialogRef.close(false);
    this.dialogRef.close(null);
    
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      idCompany: [item.idCompany || "",[Validators.required]],
      idCategory: [item.idCategory || "",[Validators.required]],
      idSubCategory: [item.idSubCategory || ""],
      description: [item.description || "",[Validators.required]],
      active:  [item.active==undefined?true:item.active],
      id: [item.id || 0],
    });
    this.displayFileName=item.filename;
  }

  
  loadEmpresas() {
    this.empresaService.getAll().subscribe(res => this.empresas = res);
  }
  loadCategory(){
    this.mastertableService.getByIdFather(1).subscribe(res => {this.categories = res},
      (err) => {},
      () => {
        this.categories=this.categories.filter(o => o.active===true);
        if(this.data.payload.idCategory>0){
          this.loadSubCategory(this.data.payload.idCategory);
        }
    });
    
  }
  changeEmpresa(event) {
    
  }
  capturarFile(event):any{
    this.archivoCapturado=event.target.files[0];
    this.displayFileName = "<span>" + this.archivoCapturado.name + "</span>";

    if (parseInt((event.target.files[0].size / 1024 / 1024).toFixed(1)) > environment.MaxFilePDFSizeMB) {
      this.archivoCapturado = "";
      this.displayFileName = "";
      this.snack.open('El tamaño máximo permitido es: ' + environment.MaxFilePDFSizeMB + "MB", 'OK',{ duration: 4000 });

      return;
    }
  }
  deletefile() {
    this.archivoCapturado = "";
    this.displayFileName = "";
    return false;
  }

  ValidarFile(){
    if (this.displayFileName=="" || this.displayFileName==undefined){
      this.snack.open('Es necesario la carga de un documento', 'OK',{ duration: 4000 });
      return false;
    }
    if (this.archivoCapturado=="" || this.archivoCapturado==undefined){
      return true;
    }
    if (parseInt((this.archivoCapturado.size / 1024 / 1024).toFixed(1)) > environment.MaxFilePDFSizeMB) {
      this.archivoCapturado = "";
      this.displayFileName = "";
      this.snack.open('El tamaño máximo permitido es: ' + environment.MaxFilePDFSizeMB + "MB", 'OK',{ duration: 4000 });

      return false;
    }
    return true;
  }
  getErrorMessage(id:number) {
    if (id==1 && this.itemForm.controls['idCompany'].hasError('required')) {
      return 'Debe seleccionar una empresa';
    }
    if (id==2 && this.itemForm.controls['idCategory'].hasError('required')) {
      return 'Debe seleccionar una categoría';
    }
    if (id==3 && this.itemForm.controls['description'].hasError('required')) {
      return 'Debe ingresar una descripción';
    }

    return this.itemForm.controls['idCompany'].hasError('idCompany') ? '' : 'Datos invalidos';
  }

  changeSubCategory(event){
    this.loadSubCategory(event.value);
  }
  loadSubCategory(id:number){
    this.idCategoryMasterTable=this.categories.filter(x=>x.idType==id)[0].id;
    this.mastertableService.getByIdFather(this.idCategoryMasterTable).subscribe(res => {this.subcategories = res},
      (err) => {},
      () => {
        this.subcategories=this.subcategories.filter(o => o.active===true);
    });
  }
  openPopUp(isCategory?) {
    let title = isCategory ? 'Agregar Categoría' : 'Agregar Sub Categoría';
    let data: any;
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogCategoryComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        
        if (isCategory) {
          this.requestCategory=({
            id:0,
            idType:this.categories.length>0? (this.categories.reduce((op, item) => op = op > item.idType ? op : item.idType, 0)+1):1,
            idfather:1,
            shortvalue:"",
            descriptionvalue: res,
            comment: "",
            order:this.categories.length>0?(this.categories.reduce((op, item) => op = op > item.order ? op : item.order, 0)+1):1,
            active: true,
            idUserRegister:1,
            idUserUpdate:1
          });
          
        } else {
          this.requestCategory=({
            id:0,
            idType:this.subcategories.length>0? (this.subcategories.reduce((op, item) => op = op > item.idType ? op : item.idType, 0)+1):1,
            idfather:this.idCategoryMasterTable,
            shortvalue:"",
            descriptionvalue: res,
            comment: "",
            order:this.subcategories.length>0?(this.subcategories.reduce((op, item) => op = op > item.order ? op : item.order, 0)+1):1,
            active: true,
            idUserRegister:1,
            idUserUpdate:1
          });
          
          }
          this.mastertableService.add(this.requestCategory).subscribe(
          (res) => {
            
            if (res.stateCode == 1) {
              this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
            } else if (res.stateCode == 2) {
              this.snack.open(res.messageError[0], "OK", { duration: 4000 });
            } else {
              this.snack.open("Ocurrio un error en el servidor", "Error", { duration: 4000 });
            }
          },
            (err) => {},
            () => {
              
              if(isCategory){
                this.load();
              }else{
                this.loadSubCategory(this.itemForm.controls['idCategory'].value);
              }
            })
        
      })
  }

  confirmDelete(isCategory,idType) {
    this.confirmService.confirm({title: "Confirmación", message: isCategory ?"¿Esta seguro de eliminar la categoría?":"¿Esta seguro de eliminar la sub categoría?"})
      .subscribe((result) => {
         
        if(result){
          let id=isCategory ? this.categories.filter(x=>x.idType==idType)[0].id:this.subcategories.filter(x=>x.idType==idType)[0].id;
          this.deleteItem(id,isCategory);
        }
        this.cdr.markForCheck();
      });
  }
  deleteItem(id:number,isCategory:boolean) {
    this.mastertableService.delete(id).subscribe(
      (res) => res
      ,
      (err) => {},
      () => {
        
        this.snack.open(isCategory?"Categoría eliminada!":"SubCategoría eliminada", "OK", { duration: 4000 });
        if(isCategory){
          this.load();
        }
        else{
          this.loadSubCategory(this.itemForm.controls['idCategory'].value);
        }
      }
      );
  }

}
