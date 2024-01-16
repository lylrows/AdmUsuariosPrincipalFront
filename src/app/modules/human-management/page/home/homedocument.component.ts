import { Component, OnInit,Inject,ViewEncapsulation,PipeTransform, Pipe  } from '@angular/core';
import { SliderService } from './../../../../data/service/slider.service';
import { Slider } from "app/data/schema/slider";
import { Mastertable } from "app/data/schema/mastertable";
import { egretAnimations } from '../../../../shared/animations/egret-animations';
import { MastertableService } from './../../../../data/service/mastertable.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmpresaService } from '@app/data/service/empresa.service';
import { HomeDocumentosService } from '@app/data/service/home-documentos.service';
import { HomeOrganizationService } from '@app/data/service/home-organization.service';
import { Empresa } from 'app/data/schema/empresa';
import { Documento } from 'app/data/schema/documentos';
import { Organization } from 'app/data/schema/organization';

export interface DialogData {
    empresa: number;
    category: number;
    nameCategory:string;
  }

@Component({
    selector: 'dialog-home-document',
    templateUrl: 'dialog-document.html',
    styleUrls: ['./home.component.scss']
  })
  
  export class DialogHomeDocument {

    documents: Documento[];
    distinctSubCategory:Documento[];
    documentSelect: string="";
    empresaCategoria:DialogData;

    constructor(
      public dialogRef: MatDialogRef<DialogHomeDocument>,
      @Inject(MAT_DIALOG_DATA) public dataEmpresaCategoria: DialogData,
      private homeDocumentosService: HomeDocumentosService,
      
    ) {}
    ngOnInit(): void {
      this.load();
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

    load() {
      this.documents = [];
      this.empresaCategoria=this.dataEmpresaCategoria;
      this.homeDocumentosService.getAll().subscribe(res => {this.documents = res},
        (err) => {},
      () => {
        this.documents=this.documents.filter(x => x.active===true && x.idCategory==this.dataEmpresaCategoria.category && x.idCompany==this.dataEmpresaCategoria.empresa);
        
        this.distinctSubCategory = this.documents.filter(
          (thing, i, arr) => arr.findIndex((t) => thing.idSubCategory>0 && t.idSubCategory === thing.idSubCategory) === i
        );
        
        
    });
      
    }
    downloadDocument(url:string){
      if(url=="" && this.documents.length>0){
        if(this.getListDocumentSubcategory(null).length>0){
          url=this.getListDocumentSubcategory(null)[0].filenamefolder + this.getListDocumentSubcategory(null)[0].filename;
        }else{
          url=this.documents.filter(x=>x.idSubCategory>0)[0].filenamefolder + this.documents[0].filename;
        }
        
      }
      window.open(url, '_blank');
    }
    getListDocumentSubcategory(id){
      return this.documents.filter(x=>x.idSubCategory==id);
    }
    
  }