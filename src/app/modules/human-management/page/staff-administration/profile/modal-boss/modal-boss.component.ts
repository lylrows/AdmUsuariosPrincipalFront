import { Component, OnInit,Inject} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AreaService } from '@app/data/service/areas.service';
import { Areas } from 'app/data/schema/areas';
import { Empresa } from "@app/data/schema/empresa";
 
@Component({
  selector: 'app-modal-boss',
  templateUrl: './modal-boss.component.html',
  styleUrls: ['./modal-boss.component.scss']
})
export class ModalBossComponent implements OnInit {
  public empresas: Empresa[];
 
  gerencias:[]; // Areas[];
  areas: Areas[];
  subAreas: Areas[];
  
  boss : any[] = [];

  bussineFC = new FormControl("");
  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  subAreaFC = new FormControl("");
  bossFC = new FormControl("");

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  disabledBoss: boolean = true;


  constructor( public dialogRef: MatDialogRef<ModalBossComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private areaService: AreaService

  ) { }

  ngOnInit(): void {
    this.loadEmpresas();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadEmpresas() {
    //this.empresaService.getAll().subscribe(res => this.empresas = res);
    
    //const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser =0; //storage.id;
    const payload = {
      IdUser: idUser

    }
    this.areaService.getCompanyByUser(payload).subscribe((res) => {
      this.empresas = res.data;
    });


  }
  changeEmpresa(): void {
    //const company = Number(this.bussineFC.value);
    // this.loadAreas(company);

    this.loadGerencia();
    this.disabledGerencia = false;

    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    this.bossFC.setValue('');

    this.disabledGerencia = false;
    this.disabledArea = true;
    this.disabledSubArea = true;
    this.disabledBoss = false;

  }

  getGerencia(idCompany){
    // const payload = {
    //   IdCompany:idCompany 

    // }
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;

    const payload = {
      IdCompany:idCompany,
      IdUser:idUser

    }




    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;
     
    });

  }
  
  loadGerencia() {


    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;

    const payload = {
      IdCompany: Number(this.bussineFC.value),
      IdUser:idUser

    }
    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;
    });
  }

  changeGerencia(): void {
    this.loadAreas();

    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    this.bossFC.setValue('');
    
    this.disabledArea = false;
    this.disabledSubArea = true;
    //this.disabledBoss=true ;

    this.loadBossByArea(Number(this.gerenciaFC.value));
  }

  loadAreas() {
    const payload = {
      IdArea: Number(this.gerenciaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas= res.data;
    });

  }

  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;
    
    this.bossFC.setValue('');
    //this.disabledBoss=true;

    this.loadBossByArea(Number(this.areaFC.value));
  }

  changeSubArea(): void {
    this.bossFC.setValue('');
    //this.disabledBoss=false;

    this.loadBossByArea(Number(this.subAreaFC.value));
  }

  loadSubAreas() {
    const payload = {
      IdArea: Number(this.areaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.subAreas= res.data;
      if(this.subAreas.length==0){
        this.disabledSubArea = true;

      }
      else{
        this.disabledSubArea = false;

      }

    });

  }

  loadBossByArea(id){
    // this.disabledBoss=false;
    this.boss=[];
    const payload = {
      IdGerencia:Number(this.gerenciaFC.value),
      IdArea:Number(this.areaFC.value),
      IdSubArea:Number(this.subAreaFC.value)
    }
    this.areaService.getJefesByArea(payload).subscribe((res) => {
        this.boss= res.data;
    });
  }

  changeBoss( event:any): void {
    this.loadSubAreas();
    this.disabledSubArea = false;
    this.data.idBossArea=Number(this.bossFC.value);

    

    let jefeseleccionado =this.boss.filter(item => item.nid_employee === this.data.idBossArea);
    if (jefeseleccionado.length>0){
      this.data.nameBoss = jefeseleccionado[0].sfullname;
    }else{
      this.data.nameBoss ='';
    }
    

  }

  resetFilter(): void {
    this.bussineFC.setValue('');
    // this.areaFC.setValue('');

    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    this.bossFC.setValue('');

    this.disabledGerencia = true;
    this.disabledArea = true;
    this.disabledSubArea = true;
    this.disabledBoss = true;
   
  }

}

export interface DialogData {
  message: string;
  result: boolean;
  idBossArea:number;
  textButton:string;
  comment:string;
  nameBoss:string;
}
