import { filter } from 'rxjs/operators';
import { CargoService } from './../../../../../data/service/cargo.service';
import { Empresa } from './../../../../../data/schema/empresa';
import { EmpresaService } from '@app/data/service/empresa.service';
import { egretAnimations } from './../../../../../shared/animations/egret-animations';
import { AreaService } from "./../../../../../data/service/areas.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { Areas } from "app/data/schema/areas";
import { Cargo, CargoInfo } from '@app/data/schema/cargo';

@Component({
  selector: "app-dialog-cargo",
  templateUrl: "dialog-cargo.component.html",
  styleUrls: ['dialog-cargo.component.scss'],
  animations: egretAnimations,
})
export class DialogCargoComponent implements OnInit {
  public itemForm: FormGroup;
  items: Areas[];
  empresas: Empresa[];
  areas: Areas[];
  cargos: Cargo[];
  checkSuperior: boolean = false;
  cargosSelected: Cargo[];

  gerencias: Areas[];
  subAreas: Areas[];
  // gerenciaFC = new FormControl("");
  // areaFC = new FormControl("");
  // subAreaFC = new FormControl("");
  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  infoCargo: CargoInfo;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CargoInfo,
    public dialogRef: MatDialogRef<DialogCargoComponent>,
    private fb: FormBuilder,
    private areaService: AreaService,
    private empresaService: EmpresaService,
    private cargoService: CargoService
  ) {
  }

ngOnInit() {
    this.infoCargo=this.data;
    this.buildItemForm(this.infoCargo.cargo);
    this.loadEmpresas();
    // this.load();
    this.loadCargos();
}



buildItemForm(item) {
  console.log("🚀 ~ DialogCargoComponent ~ buildItemForm ~ item:", item)
  this.itemForm = this.fb.group({
    id: [item.id || 0],
    nameCargo: [item.nameCargo || "", Validators.required],
    idEmpresa: [item.idEmpresa || null, Validators.required],
    idGerenciaCombo: [item.idGerenciaCombo || null,Validators.required],
    idAreaCombo: [item.idAreaCombo || 0 ],
    idSubAreaCombo: [item.idSubAreaCombo || 0 ],
    idUpperCargo: [item.idUpperCargo || null],
    active: [item.active == undefined ? true : item.active],
  });

  this.loadGerencia(item.idEmpresa);
  if(item.idGerenciaCombo !==null && item.idGerenciaCombo !==0 && item.idGerenciaCombo !==undefined){
    this.loadAreas(item.idGerenciaCombo);
    this.loadSubAreas(item.idAreaCombo);

    this.itemForm.controls['idAreaCombo'].setValue(item.idAreaCombo);
    this.itemForm.controls['idSubAreaCombo'].setValue(item.idSubAreaCombo);

  }else{
    this.itemForm.controls['idGerenciaCombo'].setValue(null);
    this.itemForm.controls['idAreaCombo'].setValue(0);
    this.itemForm.controls['idSubAreaCombo'].setValue(0);
  }

  if (item.idUpperCargo == null || item.idUpperCargo == 0) {
    this.itemForm.controls['idUpperCargo'].disable();
    this.checkSuperior = false;
  } else {
    this.checkSuperior = true;
  }
}

loadEmpresas() {
  this.empresaService.getAll().subscribe(res => this.empresas = res);
}

changeEmpresa(event) {
  // this.areas = this.items.filter(x => x.idEmpresa == event.value);
  this.gerencias=[];
  this.areas=[];
  this.subAreas=[];
  this.itemForm.controls['idGerenciaCombo'].setValue(null);
  this.itemForm.controls['idAreaCombo'].setValue(0);
  this.itemForm.controls['idSubAreaCombo'].setValue(0);

  this.loadGerencia(event.value);
  this.cargosSelected = this.cargos.filter(x => x.idEmpresa == event.value);

  this.disabledGerencia=false;
  this.disabledArea=true;
  this.disabledSubArea=true;
}

loadGerencia(idCompany) {
  const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
  let idUser = storage.id;
  const payload = {
    IdCompany:idCompany,
    IdUser:idUser
  };

  this.areaService.getGerenciasByCompany(payload).subscribe((res) => {
    this.gerencias = res.data;
      this.disabledGerencia=false;
    
  });
  // this.areaService.getGerenciasByUser(payload).subscribe((res) => {
  //   this.gerencias = res.data;
  //   this.disabledGerencia=false;
  // });
}

loadAreas(idGerencia:number) {
  const payload = {
    // IdArea:this.itemForm.controls['idGerencia'].value
    IdArea:idGerencia
  }
  this.areaService.getSubAreasByArea(payload).subscribe((res) => {
    console.log("🚀 ~ this.areaService.getSubAreasByArea ~ res:", res)
    this.areas= res.data;
    this.disabledArea=false;
  });

}

loadSubAreas(idarea:number) {
  const payload = {
    // IdArea: Number(this.itemForm.controls['idArea'].value)
    IdArea: idarea
  }
  this.areaService.getSubAreasByArea(payload).subscribe((res) => {
    console.log("🚀 ~ this.areaService.getSubAreasByArea ~ res:", res)
    this.subAreas= res.data;
    this.disabledSubArea=false;
  });

}

changeGerencia(event): void {
  this.areas=[];
  this.subAreas=[];
  this.itemForm.controls['idAreaCombo'].setValue(0);
  this.itemForm.controls['idSubAreaCombo'].setValue(0);

  this.loadAreas(event.value);

  // this.areaFC.setValue('');
  // this.subAreaFC.setValue('');
  this.disabledArea = false;
  this.disabledSubArea=true;
}

changeArea(event) {
  this.subAreas=[];
  this.itemForm.controls['idSubAreaCombo'].setValue(0);

  this.loadSubAreas(event.value);
  this.disabledSubArea = false;
}

changeSubArea(event){
  
}

  submit() {
    this.disabledGerencia=true;
    this.disabledArea=true;
    this.disabledSubArea=true;
    
    this.dialogRef.close(this.itemForm.value);
  }

  // load() {
  //   this.areaService.getAll().subscribe((res) => {
  //     this.items = res.data;
  //     if (this.data.payload.idEmpresa != null) {
  //       this.items = this.items.filter(x => x.idEmpresa == this.data.payload.idEmpresa);
  //     }
  //     this.areas = this.items.filter(x => x.idEmpresa == this.itemForm.controls['idEmpresa'].value);
  //   });
  // }

  loadCargos() {
    this.cargoService.getAll().subscribe(res => {
      this.cargos = res.data;
      this.cargosSelected = this.cargos;
      if (this.data.cargo.idEmpresa != null) {
        this.cargosSelected = this.cargos.filter(x => x.idEmpresa == this.itemForm.controls['idEmpresa'].value);
      }
    });
  }


  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }

  check(event) {
    if (event == true) {
      this.itemForm.controls['idUpperCargo'].enable();
    } else {
      this.itemForm.controls['idUpperCargo'].disable();
    }
  }
}
