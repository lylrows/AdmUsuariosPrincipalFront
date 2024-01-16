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
import { DialogHomeDocument } from './homedocument.component';

export interface DialogData {
    empresa: number;
    category: number;
    nameCategory:string;
  }

@Component({
    selector: 'dialog-home-company',
    templateUrl: 'dialog-company.html',
    styleUrls: ['./home.component.scss']
  })
  export class DialogHomeCompany {

    empresas: Empresa[];

    constructor(
      public dialogRef: MatDialogRef<DialogHomeCompany>,
      @Inject(MAT_DIALOG_DATA) public categoryData: DialogData,
      private empresaService: EmpresaService,
      public dialog: MatDialog
    ) {}
    ngOnInit(): void {
      this.load();
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

    load() {
      this.empresaService.getAll().subscribe(res => {this.empresas = res});
      
    }
    loadDocument(idempresa:number):void{
      const dialogRef = this.dialog.open(DialogHomeDocument, {
        width: '90%',
        maxWidth: '700px',
        data: {empresa:idempresa,
          category: this.categoryData.category,
          nameCategory:this.categoryData.nameCategory},
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }