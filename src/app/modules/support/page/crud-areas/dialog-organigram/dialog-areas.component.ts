import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLoaderService } from './../../../../../shared/services/app-loader/app-loader.service';
import { Empresa } from './../../../../../data/schema/empresa';
import { AreaService } from './../../../../../data/service/areas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Areas } from 'app/data/schema/areas';
import { EmpresaService } from '@app/data/service/empresa.service';

@Component({
    selector: 'app-dialog-area',
    templateUrl: 'dialog-areas.component.html',
    styleUrls: ['dialog-areas.component.scss']
})


export class DialogAreaComponent implements OnInit {
    public itemForm: FormGroup;
    items: Areas[];
    empresas: Empresa[];
    areas: Areas[];
    checkSuperior: boolean = false;
    disabledGerencia: boolean = true;
    gerencias: Areas[];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAreaComponent>,
    private fb: FormBuilder,
    private areaService: AreaService,
    private empresaService: EmpresaService,
    private loader: AppLoaderService,
    private snack: MatSnackBar) { }

    ngOnInit() {
        this.buildItemForm(this.data.payload);
        // this.load();
        this.loadEmpresas();
     }

     buildItemForm(item) {
        this.itemForm = this.fb.group({
          idUpperArea: [item.idUpperArea || 0],
          idEmpresa: [item.idEmpresa || null, Validators.required],
          idGerencia: [item.idGerencia || null,Validators.required],
          nameArea: [item.nameArea || '', Validators.required],
          active: [item.active == undefined ? true : item.active],
          id: [item.id || 0],
        });
        if (item.idUpperArea == null || item.idUpperArea == 0) {
          this.itemForm.controls['idUpperArea'].disable();
          this.checkSuperior = false;
        } else {
          this.checkSuperior = true;
        }
        this.loadGerencia(item.idEmpresa);    
        
        //ver si es gerencia o upper area
        this.areaService.getAll().subscribe(res => {
          const area = res.data.find(x => x.id == item.idUpperArea);
          if (area.idUpperArea == 0) {
            this.checkSuperior = false;
            this.itemForm.controls['idUpperArea'].disable();
            this.itemForm.controls['idUpperArea'].setValue(0);
            this.itemForm.controls['idGerencia'].setValue(item.idUpperArea);
            this.loadAreas(item.idUpperArea);
          } else {
            this.checkSuperior = true;
            this.itemForm.controls['idGerencia'].setValue(area.idUpperArea);
            this.loadAreas(area.idUpperArea);
            this.itemForm.controls['idUpperArea'].setValue(item.idUpperArea);
          }
        });
      }
    
      submit() {
        if (this.itemForm.controls['idUpperArea'].value == 0) {
          var idGerencia = this.itemForm.controls['idGerencia'].value;
          this.itemForm.controls['idUpperArea'].setValue(Number(idGerencia));
          this.itemForm.controls['idUpperArea'].enable();
        }

        if (this.itemForm.value.id != 0) {
          this.areaService.validar(this.itemForm.value.id, this.itemForm.value.active).subscribe(res => 
            {
                 if (res.stateCode == 1) {
                  this.dialogRef.close(this.itemForm.value);
                 } else {
                  this.snack.open(res.messageError[0], "Advertencia", { duration: 4000 });
                 }
            },
            err => {
  
            })
        } else {
          this.dialogRef.close(this.itemForm.value);
        }
      }

      // load() {
      //  this.areaService.getAll().subscribe(res => {
      //     this.items = res.data;
      //     this.items = this.items.filter(x => x.id != this.data.payload.id);
      //     if (this.data.payload.idEmpresa != null) {
      //       this.items = this.items.filter(x => x.idEmpresa == this.data.payload.idEmpresa);
      //     }
      //     this.areas = this.items;
      //   });
      // }

      loadEmpresas() {
        this.empresaService.getAll().subscribe(res => this.empresas = res);
      }

      check(event) {
        if (event == true) {
          this.itemForm.controls['idUpperArea'].enable();
        } else {
          this.itemForm.controls['idUpperArea'].disable();
          this.itemForm.controls['idUpperArea'].patchValue(0);
        }
      }

      changeEmpresa(event) {
        // this.areas = this.items.filter(x => x.idEmpresa == event.value);
        this.loadGerencia(event.value);
      }

      loadGerencia(idCompany) {
        const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
        let idUser = storage.id;
        const payload = {
          IdCompany:idCompany,
          IdUser:idUser
        }
        // this.areaService.getGerenciasByUser(payload).subscribe((res) => {
        //   this.gerencias = res.data;
        //   this.disabledGerencia=false;
        // });
        this.areaService.getGerenciasByCompany(payload).subscribe((res) => {
          this.gerencias = res.data;
          this.disabledGerencia=false;          
        });
      }

      changeGerencia(event): void {
        this.loadAreas(event.value);
      }
      
      loadAreas(idGerencia:number) {
        const payload = {
          // IdArea:this.itemForm.controls['idGerencia'].value
          IdArea:idGerencia
        }
        this.areaService.getSubAreasByArea(payload).subscribe((res) => {
          console.log("🚀 ~ this.areaService.getSubAreasByArea ~ res:", res)
          this.areas= res.data;
        });
      
      }
      lettersOnly(event) {
        if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
      }
}