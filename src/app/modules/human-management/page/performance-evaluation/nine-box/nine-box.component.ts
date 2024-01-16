import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Areas } from '@app/data/schema/areas';
import { Empresa } from '@app/data/schema/empresa';
import { AreaService } from '@app/data/service/areas.service';
import { EmpresaService } from '@app/data/service/empresa.service';
import { PerformanceService } from '@app/data/service/performance.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogDetailComponent } from './dialog-detail/dialog-detail.component';
import { CargoService } from '@app/data/service/cargo.service';
import { MatTooltip } from '@angular/material/tooltip';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from "rxjs/operators";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: 'app-nine-box',
  templateUrl: './nine-box.component.html',
  styleUrls: ['./nine-box.component.scss']
})
export class NineBoxComponent implements OnInit {
  @ViewChild('DetailDialog') DetailDialog: TemplateRef<any>;
  @ViewChild("tooltip") myTooltip: MatTooltip;
  @ViewChild("tooltip1") myTooltip1: MatTooltip;
  @ViewChild("tooltip2") myTooltip2: MatTooltip;
  @ViewChild("tooltip3") myTooltip3: MatTooltip;
  @ViewChild("tooltip4") myTooltip4: MatTooltip;
  @ViewChild("tooltip5") myTooltip5: MatTooltip;
  @ViewChild("tooltip6") myTooltip6: MatTooltip;
  @ViewChild("tooltip7") myTooltip7: MatTooltip;
  @ViewChild("tooltip8") myTooltip8: MatTooltip;
  @ViewChild("tooltip9") myTooltip9: MatTooltip;
  id: number = 0;
  header: any = null;
  nid_employee: number = 0;
  empresas: Empresa[];
  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];
  responsive = false;
  screenWidth: number;
  lstcargo: any[] = [];
  isGlobal: boolean = true;

  conceptosFC = new FormControl("");
  campanaFC = new FormControl("");
  bussineFC = new FormControl("");
  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  subAreaFC = new FormControl("");
  cargoFC = new FormControl("");

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  disabledCargo: boolean = true;

  detail: any[] = [];
  listcampaign : any[] = [];
  listConfigLevelNinebox : any[] = [];
  listconceptos : any[] = [];
  selectconceptos: any[] = [];

  OBJ_ALTO_MAX_GRUPO_1:any[] = [];
  OBJ_MEDIO_MAX_GRUPO_1:any[] = [];
  OBJ_BAJO_MAX_GRUPO_1:any[] = [];
  COMP_ALTO_MAX_GRUPO_2:any[] = [];
  COMP_MEDIO_MAX_GRUPO_2:any[] = [];
  COMP_BAJO_MAX_GRUPO_2:any[] = [];


  TALENTO_MAL_UBICADO: any[] = [];
  LISTO_PARA_NUEVAS_OPORTUNIDADES: any[] = [];
  TOP_TALENT: any[] = [];
  NUEVO_ROL: any[] = [];
  MIEMBRO_CLAVE: any[] = [];
  LIDER_EMERGENTE: any[] = [];
  BAJO_RENDIMIENTO: any[] = [];
  DESEMPENO_SOLIDO: any[] = [];
  DESEMPENO_SOBRESALIENTE: any[] = [];

  TALENTO_MAL_UBICADO_DATA: any[] = [];
  LISTO_PARA_NUEVAS_OPORTUNIDADES_DATA: any[] = [];
  TOP_TALENT_DATA: any[] = [];
  NUEVO_ROL_DATA: any[] = [];
  MIEMBRO_CLAVE_DATA: any[] = [];
  LIDER_EMERGENTE_DATA: any[] = [];
  BAJO_RENDIMIENTO_DATA: any[] = [];
  DESEMPENO_SOLIDO_DATA: any[] = [];
  DESEMPENO_SOBRESALIENTE_DATA: any[] = [];
  
  TALENTO_MAL_UBICADO_TEXT = '';
  LISTO_PARA_NUEVAS_OPORTUNIDADES_TEXT = '';
  TOP_TALENT_TEXT = '';
  NUEVO_ROL_TEXT = '';
  MIEMBRO_CLAVE_TEXT = '';
  LIDER_EMERGENTE_TEXT = '';
  BAJO_RENDIMIENTO_TEXT = '';
  DESEMPENO_SOLIDO_TEXT = '';
  DESEMPENO_SOBRESALIENTE_TEXT = '';
  
  LEYENDA_CTO01_TEXT :any = '';
  LEYENDA_CTO02_TEXT :any= '';
  LEYENDA_CTO03_TEXT :any= '';
  LEYENDA_CTO04_TEXT :any= '';
  LEYENDA_CTO05_TEXT:any= '';
  LEYENDA_CTO06_TEXT :any= '';
  LEYENDA_CTO07_TEXT :any= '';
  LEYENDA_CTO08_TEXT:any= '';
  LEYENDA_CTO09_TEXT :any= '';

  datasourceDT1G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT1G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT2G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT2G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT3G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT3G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT4G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT4G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT5G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT5G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT6G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT6G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT7G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT7G2: MatTableDataSource<any> = new MatTableDataSource([]);

  displayedColumnsG1: string[] = ["jobObjectives", "indicatorOrganizational", "goal", "weight", "startDate", "endDate"];
  displayedColumnsG2: string[] = ["organizationalProficiency", "proficiencyDescription", "idProficiencyLevel", "definitionLevel","qualification"
                                , "actionsToImprove","indicatorOrganizational", "startDate", "endDate"];

    // Campañas
   campanasMultiCtrl: FormControl = new FormControl();
   campanasMultiFilterCtrl: FormControl = new FormControl();
   filteredCampanasMulti: ReplaySubject<any> = new ReplaySubject(1);
   @ViewChild("multiSelectCampana", { static: true }) multiSelectCampana: MatSelect;

   protected _onDestroy = new Subject();

   /**
   * Write code on Method
   *
   * method logical code
   */
  ngAfterViewInit() {
    this.setInitialValue();
  }
  /**
   * Write code on Method
   *
   * method logical code
   */
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
 /**
   * Write code on Method
   *
   * method logical code
   */
 protected setInitialValue() {
    this.filteredCampanasMulti.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(() => {
      this.multiSelectCampana.compareWith = (a: any, b: any) =>
        a && b && a.nid_campaign === b.nid_campaign;
    });  
}
  /**
   * Write code on Method
   *
   * method logical code
   */
  protected filterCampanasMulti() {
    if (!this.listcampaign) {
      return;
    }

    let search = this.campanasMultiFilterCtrl.value;
    if (!search) {
      this.filteredCampanasMulti.next(this.listcampaign.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCampanasMulti.next(
      this.listcampaign.filter(
        (camp) => camp.snamecampaign.toLowerCase().indexOf(search) > -1
      )
    );
  }

  constructor(
    private dialog: MatDialog,
    private empresaService: EmpresaService,
    private areaService: AreaService,
    private route: ActivatedRoute,
    private _performanceService: PerformanceService,
    private chargeService: CargoService
  ) { 

    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_employee = storage.nid_employee;
  }

  close(): void {
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 600){
      this.responsive = true; 
    }

    
     this.getConfigLevelNineBox();

    this.loadEmpresas();
   
    this.route.params.subscribe(params => {
      
      
      this.id = 250;
      if (this.id){
        
      }
      
    });
    this.getListCampanias();

    if (!this.responsive){
      this.search();
    }
    
  }

  getConfigLevelNineBox(): void {
    this._performanceService.GetConfigLevelNineBox().subscribe(resp => {
        
       this.listConfigLevelNinebox=resp.data;
       this.OBJ_ALTO_MAX_GRUPO_1=this.listConfigLevelNinebox.filter(item => item.nid_group==1   && item.scode_config==="O1");
       this.OBJ_MEDIO_MAX_GRUPO_1=this.listConfigLevelNinebox.filter(item => item.nid_group==1  && item.scode_config==="O2");
       this.OBJ_BAJO_MAX_GRUPO_1=this.listConfigLevelNinebox.filter(item => item.nid_group==1   && item.scode_config==="O3");
       this.COMP_ALTO_MAX_GRUPO_2=this.listConfigLevelNinebox.filter(item => item.nid_group==2  && item.scode_config==="C1");
       this.COMP_MEDIO_MAX_GRUPO_2=this.listConfigLevelNinebox.filter(item => item.nid_group==2 && item.scode_config==="C2");
       this.COMP_BAJO_MAX_GRUPO_2=this.listConfigLevelNinebox.filter(item => item.nid_group==2  && item.scode_config==="C3");
       
      this.LEYENDA_CTO01_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO01");
      this.LEYENDA_CTO02_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO02");
      this.LEYENDA_CTO03_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO03");
      this.LEYENDA_CTO04_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO04");
      this.LEYENDA_CTO05_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO05");
      this.LEYENDA_CTO06_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO06");
      this.LEYENDA_CTO07_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO07");
      this.LEYENDA_CTO08_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO08");
      this.LEYENDA_CTO09_TEXT = this.listConfigLevelNinebox.filter(item => item.nid_group==0 && item.scode_config==="CTO09");


      this.listconceptos=this.listConfigLevelNinebox.filter(item => item.nid_group==0);

    })
    
  }

  getConfigDetailLevelNineBoxByCampaign(): void {
    const payload = {
      nid_campaing: Number(this.campanaFC.value)

    }  

    this._performanceService.GetConfigDetailLevelNineBoxByCampaign(payload).subscribe(resp => {
       this.listConfigLevelNinebox=resp.data;
      
      this.OBJ_ALTO_MAX_GRUPO_1=this.listConfigLevelNinebox.filter(item => item.nid_group==1   && item.scode_config==="O1");
      this.OBJ_MEDIO_MAX_GRUPO_1=this.listConfigLevelNinebox.filter(item => item.nid_group==1  && item.scode_config==="O2");
      this.OBJ_BAJO_MAX_GRUPO_1=this.listConfigLevelNinebox.filter(item => item.nid_group==1   && item.scode_config==="O3");
      this.COMP_ALTO_MAX_GRUPO_2=this.listConfigLevelNinebox.filter(item => item.nid_group==2  && item.scode_config==="C1");
      this.COMP_MEDIO_MAX_GRUPO_2=this.listConfigLevelNinebox.filter(item => item.nid_group==2 && item.scode_config==="C2");
      this.COMP_BAJO_MAX_GRUPO_2=this.listConfigLevelNinebox.filter(item => item.nid_group==2  && item.scode_config==="C3");
       
    })
    
  }
  changeCampania(){

    this.getConfigDetailLevelNineBoxByCampaign();

  }
  
  search() {
    
    this.selectconceptos=[];
    if ( this.conceptosFC.value != null && this.conceptosFC.value !== "" && this.conceptosFC.value.length>0) {
      const value = this.conceptosFC.value;
      value.map(e => {
        this.selectconceptos.push({code:e});
      })

    }else{
      this.selectconceptos=[];
    }

    // Campañas
    let arrayCampana = "";
    if (
      this.campanasMultiCtrl.value !== null &&
      this.campanasMultiCtrl.value != []
    ) {
      const value = this.campanasMultiCtrl.value;
      value.map((e) => {
        arrayCampana = arrayCampana + e.nid_campaign + ",";
      });
    }

    let filter = {
      nidcompany: Number(this.bussineFC.value),
      nidgerencia:Number(this.gerenciaFC.value),
      nidarea: Number(this.areaFC.value),
      nidsubarea:Number(this.subAreaFC.value),
      nidcargo: Number(this.cargoFC.value),
      // nidcampana:Number(this.campanaFC.value)
      nidcampana:arrayCampana
    };
    this._performanceService.GetNineBox(filter).subscribe(res => {
          console.log("🚀 ~ NineBoxComponent ~ this._performanceService.GetNineBox ~ res:", res)
          this.detail = res.data;
          if(this.selectconceptos.length>0){
              
              let TALENTO_MAL_UBICADO_FILTER= this.selectconceptos.find(e=>e.code==="CTO01");
              if(TALENTO_MAL_UBICADO_FILTER===undefined){
                this.TALENTO_MAL_UBICADO = [];
                this.TALENTO_MAL_UBICADO_TEXT='';
                this.TALENTO_MAL_UBICADO_DATA=[];
              }else{
                 
                this.TALENTO_MAL_UBICADO = this.detail.filter(item => item.objetivoPorc >= this.OBJ_BAJO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_BAJO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_ALTO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_ALTO_MAX_GRUPO_2[0].nmax_level+1);
                if (this.TALENTO_MAL_UBICADO.length > 5) {
                  this.TALENTO_MAL_UBICADO_TEXT = `+${this.TALENTO_MAL_UBICADO.length - 5} personas`;
                  this.TALENTO_MAL_UBICADO_DATA = this.TALENTO_MAL_UBICADO.slice(0, 5);
                }
                else {
                  this.TALENTO_MAL_UBICADO_TEXT = '';
                  this.TALENTO_MAL_UBICADO_DATA = this.TALENTO_MAL_UBICADO;
                }
              }
  
              let LISTO_PARA_NUEVAS_OPORTUNIDADES_FILTER= this.selectconceptos.find(e=>e.code==="CTO02");
              if(LISTO_PARA_NUEVAS_OPORTUNIDADES_FILTER===undefined){
                this.LISTO_PARA_NUEVAS_OPORTUNIDADES=[];
                this.LISTO_PARA_NUEVAS_OPORTUNIDADES_TEXT='';
                this.LISTO_PARA_NUEVAS_OPORTUNIDADES_DATA=[];
              }else{
                
                this.LISTO_PARA_NUEVAS_OPORTUNIDADES = this.detail.filter(item => item.objetivoPorc >= this.OBJ_MEDIO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_MEDIO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_ALTO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_ALTO_MAX_GRUPO_2[0].nmax_level+1);
                if (this.LISTO_PARA_NUEVAS_OPORTUNIDADES.length > 5) {
                  this.LISTO_PARA_NUEVAS_OPORTUNIDADES_TEXT = `+${this.LISTO_PARA_NUEVAS_OPORTUNIDADES.length - 5} personas`;
                  this.LISTO_PARA_NUEVAS_OPORTUNIDADES_DATA = this.LISTO_PARA_NUEVAS_OPORTUNIDADES.slice(0, 5);
                }
                else {
                  this.LISTO_PARA_NUEVAS_OPORTUNIDADES_TEXT = '';
                  this.LISTO_PARA_NUEVAS_OPORTUNIDADES_DATA = this.LISTO_PARA_NUEVAS_OPORTUNIDADES;
                }
              }
              
              let TOP_TALENT_FILTER= this.selectconceptos.find(e=>e.code==="CTO03");
              if(TOP_TALENT_FILTER===undefined){
                this.TOP_TALENT=[];
                this.TOP_TALENT_TEXT='';
                this.TOP_TALENT_DATA=[];
              }else{
                
                this.TOP_TALENT = this.detail.filter(item => item.objetivoPorc >= this.OBJ_ALTO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_ALTO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_ALTO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_ALTO_MAX_GRUPO_2[0].nmax_level+1);
                if (this.TOP_TALENT.length > 5) {
                  this.TOP_TALENT_TEXT = `+${this.TOP_TALENT.length - 5} personas`;
                  this.TOP_TALENT_DATA = this.TOP_TALENT.slice(0, 5);
                }
                else {
                  this.TOP_TALENT_TEXT = '';
                  this.TOP_TALENT_DATA = this.TOP_TALENT;
                }

              }
              
              let NUEVO_ROL_FILTER= this.selectconceptos.find(e=>e.code==="CTO04");
              if(NUEVO_ROL_FILTER===undefined){
                this.NUEVO_ROL=[];
                this.NUEVO_ROL_TEXT='';
                this.NUEVO_ROL_DATA=[];
              }else{
                   
                  this.NUEVO_ROL = this.detail.filter(item => item.objetivoPorc >= this.OBJ_BAJO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_BAJO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_MEDIO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_MEDIO_MAX_GRUPO_2[0].nmax_level+1);
                  if (this.NUEVO_ROL.length > 5) {
                    this.NUEVO_ROL_TEXT = `+${this.NUEVO_ROL.length - 5} personas`;
                    this.NUEVO_ROL_DATA = this.NUEVO_ROL.slice(0, 5);
                  }
                  else {
                    this.NUEVO_ROL_TEXT = '';
                    this.NUEVO_ROL_DATA = this.NUEVO_ROL;
                  }
              }
             
              let MIEMBRO_CLAVE_FILTER= this.selectconceptos.find(e=>e.code==="CTO05");
              if(MIEMBRO_CLAVE_FILTER===undefined){
                this.MIEMBRO_CLAVE=[];
                this.MIEMBRO_CLAVE_TEXT='';
                this.MIEMBRO_CLAVE_DATA=[];
              }else{
                  
                  this.MIEMBRO_CLAVE = this.detail.filter(item => item.objetivoPorc >= this.OBJ_MEDIO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_MEDIO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_MEDIO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_MEDIO_MAX_GRUPO_2[0].nmax_level+1);
                  if (this.MIEMBRO_CLAVE.length > 5) {
                    this.MIEMBRO_CLAVE_TEXT = `+${this.MIEMBRO_CLAVE.length - 5} personas`;
                    this.MIEMBRO_CLAVE_DATA = this.MIEMBRO_CLAVE.slice(0, 5);
                  }
                  else {
                    this.MIEMBRO_CLAVE_TEXT = '';
                    this.MIEMBRO_CLAVE_DATA = this.MIEMBRO_CLAVE;
                  }
              }

              let LIDER_EMERGENTE_FILTER= this.selectconceptos.find(e=>e.code==="CTO06");
              if(LIDER_EMERGENTE_FILTER===undefined){
                this.LIDER_EMERGENTE=[];
                this.LIDER_EMERGENTE_TEXT='';
                this.LIDER_EMERGENTE_DATA=[];
              }else{
                  
                  this.LIDER_EMERGENTE = this.detail.filter(item => item.objetivoPorc >= this.OBJ_ALTO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_ALTO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_MEDIO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_MEDIO_MAX_GRUPO_2[0].nmax_level+1);
                  if (this.LIDER_EMERGENTE.length > 5) {
                    this.LIDER_EMERGENTE_TEXT = `+${this.LIDER_EMERGENTE.length - 5} personas`;
                    this.LIDER_EMERGENTE_DATA = this.LIDER_EMERGENTE.slice(0, 5);
                  }
                  else {
                    this.LIDER_EMERGENTE_TEXT = '';
                    this.LIDER_EMERGENTE_DATA = this.LIDER_EMERGENTE;
                  }
              }

              let BAJO_RENDIMIENTO_FILTER= this.selectconceptos.find(e=>e.code==="CTO07");
              if(BAJO_RENDIMIENTO_FILTER===undefined){
                this.BAJO_RENDIMIENTO=[];
                this.BAJO_RENDIMIENTO_TEXT='';
                this.BAJO_RENDIMIENTO_DATA=[];
              }else{
                  
                  this.BAJO_RENDIMIENTO = this.detail.filter(item => item.objetivoPorc >= this.OBJ_BAJO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_BAJO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_BAJO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_BAJO_MAX_GRUPO_2[0].nmax_level+1);
                  if (this.BAJO_RENDIMIENTO.length > 5) {
                    this.BAJO_RENDIMIENTO_TEXT = `+${this.BAJO_RENDIMIENTO.length - 5} personas`;
                    this.BAJO_RENDIMIENTO_DATA = this.BAJO_RENDIMIENTO.slice(0, 5);
                  }
                  else {
                    this.BAJO_RENDIMIENTO_TEXT = '';
                    this.BAJO_RENDIMIENTO_DATA = this.BAJO_RENDIMIENTO;
                  }

              } 

              let DESEMPENO_SOLIDO_FILTER= this.selectconceptos.find(e=>e.code==="CTO08");
              if(DESEMPENO_SOLIDO_FILTER===undefined){
                this.DESEMPENO_SOLIDO=[];
                this.DESEMPENO_SOLIDO_TEXT='';
                this.DESEMPENO_SOLIDO_DATA=[];
              }else{
                  
                  this.DESEMPENO_SOLIDO = this.detail.filter(item => item.objetivoPorc >= this.OBJ_MEDIO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_MEDIO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_BAJO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_BAJO_MAX_GRUPO_2[0].nmax_level+1);
                  if (this.DESEMPENO_SOLIDO.length > 5) {
                    this.DESEMPENO_SOLIDO_TEXT = `+${this.DESEMPENO_SOLIDO.length - 5} personas`;
                    this.DESEMPENO_SOLIDO_DATA = this.DESEMPENO_SOLIDO.slice(0, 5);
                  }
                  else {
                    this.DESEMPENO_SOLIDO_TEXT = '';
                    this.DESEMPENO_SOLIDO_DATA = this.DESEMPENO_SOLIDO;
                  }
              }
              
              let DESEMPENO_SOBRESALIENTE_FILTER= this.selectconceptos.find(e=>e.code==="CTO09");
              if(DESEMPENO_SOBRESALIENTE_FILTER===undefined){
                this.DESEMPENO_SOBRESALIENTE=[];
                this.DESEMPENO_SOBRESALIENTE_TEXT='';
                this.DESEMPENO_SOBRESALIENTE_DATA=[];
              }else{
                  
                  this.DESEMPENO_SOBRESALIENTE = this.detail.filter(item => item.objetivoPorc >= this.OBJ_ALTO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_ALTO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_BAJO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_BAJO_MAX_GRUPO_2[0].nmax_level+1);
                  if (this.DESEMPENO_SOBRESALIENTE.length > 5) {
                    this.DESEMPENO_SOBRESALIENTE_TEXT = `+${this.DESEMPENO_SOBRESALIENTE.length - 5} personas`;
                    this.DESEMPENO_SOBRESALIENTE_DATA = this.DESEMPENO_SOBRESALIENTE.slice(0, 5);
                  }
                  else {
                    this.DESEMPENO_SOBRESALIENTE_TEXT = '';
                    this.DESEMPENO_SOBRESALIENTE_DATA = this.DESEMPENO_SOBRESALIENTE;
                  }
              }
              

          }
          else 
          {
            
              this.TALENTO_MAL_UBICADO = this.detail.filter(item => item.objetivoPorc >= this.OBJ_BAJO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_BAJO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_ALTO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_ALTO_MAX_GRUPO_2[0].nmax_level+1);
              
              if (this.TALENTO_MAL_UBICADO.length > 5) {
                this.TALENTO_MAL_UBICADO_TEXT = `+${this.TALENTO_MAL_UBICADO.length - 5} personas`;
                this.TALENTO_MAL_UBICADO_DATA = this.TALENTO_MAL_UBICADO.slice(0, 5);
              }
              else {
                this.TALENTO_MAL_UBICADO_TEXT = '';
                this.TALENTO_MAL_UBICADO_DATA = this.TALENTO_MAL_UBICADO;
              }

              
              this.LISTO_PARA_NUEVAS_OPORTUNIDADES = this.detail.filter(item => item.objetivoPorc >= this.OBJ_MEDIO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_MEDIO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_ALTO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_ALTO_MAX_GRUPO_2[0].nmax_level+1);
              if (this.LISTO_PARA_NUEVAS_OPORTUNIDADES.length > 5) {
                this.LISTO_PARA_NUEVAS_OPORTUNIDADES_TEXT = `+${this.LISTO_PARA_NUEVAS_OPORTUNIDADES.length - 5} personas`;
                this.LISTO_PARA_NUEVAS_OPORTUNIDADES_DATA = this.LISTO_PARA_NUEVAS_OPORTUNIDADES.slice(0, 5);
              }
              else {
                this.LISTO_PARA_NUEVAS_OPORTUNIDADES_TEXT = '';
                this.LISTO_PARA_NUEVAS_OPORTUNIDADES_DATA = this.LISTO_PARA_NUEVAS_OPORTUNIDADES;
              }
              
              this.TOP_TALENT = this.detail.filter(item => item.objetivoPorc >= this.OBJ_ALTO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_ALTO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_ALTO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_ALTO_MAX_GRUPO_2[0].nmax_level+1);
              if (this.TOP_TALENT.length > 5) {
                this.TOP_TALENT_TEXT = `+${this.TOP_TALENT.length - 5} personas`;
                this.TOP_TALENT_DATA = this.TOP_TALENT.slice(0, 5);
              }
              else {
                this.TOP_TALENT_TEXT = '';
                this.TOP_TALENT_DATA = this.TOP_TALENT;
              }

              
              this.NUEVO_ROL = this.detail.filter(item => item.objetivoPorc >= this.OBJ_BAJO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_BAJO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_MEDIO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_MEDIO_MAX_GRUPO_2[0].nmax_level+1);
              if (this.NUEVO_ROL.length > 5) {
                this.NUEVO_ROL_TEXT = `+${this.NUEVO_ROL.length - 5} personas`;
                this.NUEVO_ROL_DATA = this.NUEVO_ROL.slice(0, 5);
              }
              else {
                this.NUEVO_ROL_TEXT = '';
                this.NUEVO_ROL_DATA = this.NUEVO_ROL;
              }

              
              this.MIEMBRO_CLAVE = this.detail.filter(item => item.objetivoPorc >= this.OBJ_MEDIO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_MEDIO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_MEDIO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_MEDIO_MAX_GRUPO_2[0].nmax_level+1);
              if (this.MIEMBRO_CLAVE.length > 5) {
                this.MIEMBRO_CLAVE_TEXT = `+${this.MIEMBRO_CLAVE.length - 5} personas`;
                this.MIEMBRO_CLAVE_DATA = this.MIEMBRO_CLAVE.slice(0, 5);
              }
              else {
                this.MIEMBRO_CLAVE_TEXT = '';
                this.MIEMBRO_CLAVE_DATA = this.MIEMBRO_CLAVE;
              }

              
              this.LIDER_EMERGENTE = this.detail.filter(item => item.objetivoPorc >= this.OBJ_ALTO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_ALTO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_MEDIO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_MEDIO_MAX_GRUPO_2[0].nmax_level+1);
              if (this.LIDER_EMERGENTE.length > 5) {
                this.LIDER_EMERGENTE_TEXT = `+${this.LIDER_EMERGENTE.length - 5} personas`;
                this.LIDER_EMERGENTE_DATA = this.LIDER_EMERGENTE.slice(0, 5);
              }
              else {
                this.LIDER_EMERGENTE_TEXT = '';
                this.LIDER_EMERGENTE_DATA = this.LIDER_EMERGENTE;
              }

              
              this.BAJO_RENDIMIENTO = this.detail.filter(item => item.objetivoPorc >= this.OBJ_BAJO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_BAJO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_BAJO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_BAJO_MAX_GRUPO_2[0].nmax_level+1);
              if (this.BAJO_RENDIMIENTO.length > 5) {
                this.BAJO_RENDIMIENTO_TEXT = `+${this.BAJO_RENDIMIENTO.length - 5} personas`;
                this.BAJO_RENDIMIENTO_DATA = this.BAJO_RENDIMIENTO.slice(0, 5);
              }
              else {
                this.BAJO_RENDIMIENTO_TEXT = '';
                this.BAJO_RENDIMIENTO_DATA = this.BAJO_RENDIMIENTO;
              }

              
              this.DESEMPENO_SOLIDO = this.detail.filter(item => item.objetivoPorc >= this.OBJ_MEDIO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_MEDIO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_BAJO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_BAJO_MAX_GRUPO_2[0].nmax_level+1);
              if (this.DESEMPENO_SOLIDO.length > 5) {
                this.DESEMPENO_SOLIDO_TEXT = `+${this.DESEMPENO_SOLIDO.length - 5} personas`;
                this.DESEMPENO_SOLIDO_DATA = this.DESEMPENO_SOLIDO.slice(0, 5);
              }
              else {
                this.DESEMPENO_SOLIDO_TEXT = '';
                this.DESEMPENO_SOLIDO_DATA = this.DESEMPENO_SOLIDO;
              }

              
              this.DESEMPENO_SOBRESALIENTE = this.detail.filter(item => item.objetivoPorc >= this.OBJ_ALTO_MAX_GRUPO_1[0].nmin_level && item.objetivoPorc<this.OBJ_ALTO_MAX_GRUPO_1[0].nmax_level+1 && item.competenciaPorc >= this.COMP_BAJO_MAX_GRUPO_2[0].nmin_level && item.competenciaPorc<this.COMP_BAJO_MAX_GRUPO_2[0].nmax_level+1);
              if (this.DESEMPENO_SOBRESALIENTE.length > 5) {
                this.DESEMPENO_SOBRESALIENTE_TEXT = `+${this.DESEMPENO_SOBRESALIENTE.length - 5} personas`;
                this.DESEMPENO_SOBRESALIENTE_DATA = this.DESEMPENO_SOBRESALIENTE.slice(0, 5);
              }
              else {
                this.DESEMPENO_SOBRESALIENTE_TEXT = '';
                this.DESEMPENO_SOBRESALIENTE_DATA = this.DESEMPENO_SOBRESALIENTE;
              }

        }
        if (this.responsive){
          this.dialog.open(this.DetailDialog,{
            width: '100%',
            maxWidth: '100hv'
          });
        }
    });
  }


  openPopUp(data: any = {}, type: string) {
    
    let dialogRef: MatDialogRef<any>;
    let list = [];

    switch (type) {
      case "TALENTO_MAL_UBICADO":
        list = this.TALENTO_MAL_UBICADO;
        break;
      case "LISTO_PARA_NUEVAS_OPORTUNIDADES":
        list = this.LISTO_PARA_NUEVAS_OPORTUNIDADES;
        break;
      case "TOP_TALENT":
        list = this.TOP_TALENT;
        break;
      case "NUEVO_ROL":
        list = this.NUEVO_ROL;
        break;
      case "MIEMBRO_CLAVE":
        list = this.MIEMBRO_CLAVE;
        break;
      case "LIDER_EMERGENTE":
          list = this.LIDER_EMERGENTE;
          break;
      case "BAJO_RENDIMIENTO":
        list = this.BAJO_RENDIMIENTO;
        break;
      case "DESEMPENO_SOLIDO":
        list = this.DESEMPENO_SOLIDO;
        break;
      case "DESEMPENO_SOBRESALIENTE":
        list = this.DESEMPENO_SOBRESALIENTE;
        break;        
      default:
        break;
    }

    dialogRef = this.dialog.open(DialogDetailComponent, {
      width: "1200px",
      maxHeight: '650px',
      disableClose: true,
      data: { payload: list },
    });

  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe(res => this.empresas = res);
  }

  loadAreasOLD(idCompany: number) {
    this.areaService.getByCompany(idCompany).subscribe((res) => {
      this.areas = res.data;
    });
  }

  loadCargo(idcompany) {

    this.chargeService.getAll().subscribe((res) => {
      this.lstcargo = res.data.filter((c) => c.idEmpresa === idcompany);
    });
  }

  changeEmpresa(): void {
    this.disabledArea = false;
    this.disabledCargo = false;

    this.loadGerencia();
    this.disabledGerencia=false;

    this.getChargesByCompanyArea();
  }

  resetFilter(): void {
    this.conceptosFC.setValue('');
    this.campanaFC.setValue('');
    this.bussineFC.setValue('');
    this.areaFC.setValue('');
    this.cargoFC.setValue('');

    this.gerenciaFC.setValue('');
    this.subAreaFC.setValue('');
    this.campanasMultiCtrl.setValue("");

    this.disabledArea = true;
    this.disabledCargo = true;
    
    this.disabledGerencia = true;
    this.disabledSubArea = true;
    
    this.search();
  }

  getEvaluationDetail(): void {
    this._performanceService.getEvaluationDetail(Number(this.id)).subscribe(resp => {
      
      this.header = resp.header;
      this.detail = resp.details;

      let nFirstAction = 1;

      let  existsdata =   this.detail.filter(i=>i.numberAction ==50 && i.jobObjectives !== null);

      if (existsdata.length>0){
        nFirstAction = 2
      }



      this.datasourceDT1G1 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === nFirstAction && i.idGroup == 1 && i.jobObjectives !== null ));
      this.datasourceDT1G2 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === nFirstAction && i.idGroup == 2));

      this.datasourceDT2G1 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 3 && i.idGroup == 1 && i.jobObjectives !== null ));
      this.datasourceDT2G2 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 3 && i.idGroup == 2));

      this.datasourceDT3G1 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 4 && i.idGroup == 1 && i.jobObjectives !== null ));
      this.datasourceDT3G2 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 4 && i.idGroup == 2));

      this.datasourceDT4G1 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 7 && i.idGroup == 1 && i.jobObjectives !== null ));
      this.datasourceDT4G2 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 7 && i.idGroup == 2));

      this.datasourceDT5G1 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 8 && i.idGroup == 1 && i.jobObjectives !== null ));
      this.datasourceDT5G2 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 8 && i.idGroup == 2));

      this.datasourceDT6G1 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 10 && i.idGroup == 1 && i.jobObjectives !== null ));
      this.datasourceDT6G2 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 10 && i.idGroup == 2));

      this.datasourceDT7G1 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 11 && i.idGroup == 1 && i.jobObjectives !== null ));
      this.datasourceDT7G2 = new MatTableDataSource(this.detail.filter(i=>i.numberAction === 11 && i.idGroup == 2));

     

      let sum_group1 = 0;
      this.datasourceDT7G1.data.forEach(function (value) {

        let goal = value.goal;
        let weight = value.weight

        sum_group1 += goal * weight;
        
      }); 

      
      let sum_group2 =0 ;
      this.datasourceDT7G2.data.forEach(function (value) {
        let expect  = value.idProficiencyLevel;
        let real = value.qualification;
        
        sum_group2 += ((real*100)/ expect )
      }); 
      
    })
  }

  
  loadGerencia() {
    const payload = {
      IdCompany: Number(this.bussineFC.value)

    }
    this.areaService.getGerenciasByCompany(payload).subscribe((res) => {
      this.gerencias = res.data;
    });
  }

  changeGerencia(): void {
    this.loadAreas();

    this.areaFC.setValue('');
    this.subAreaFC.setValue('');

    this.disabledArea = false;
    this.disabledSubArea = true;

    this.getChargesByCompanyArea();
    
  }

  loadAreas() {
    const payload = {
      IdArea: Number(this.gerenciaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas = res.data;
    });

  }

  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;

    this.getChargesByCompanyArea();
  }

  changeSubArea(): void {
    this.getChargesByCompanyArea();

  }

  loadSubAreas() {
    const payload = {
      IdArea: Number(this.areaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.subAreas = res.data;
      if (this.subAreas.length == 0) {
        this.disabledSubArea = true;

      }
      else {
        this.disabledSubArea = false;

      }

    });

  }

  getChargesByCompanyArea(){
    const payload = {
      nidcompany: Number(this.bussineFC.value),
      nidgerencia: Number(this.gerenciaFC.value),
      nidarea: Number(this.areaFC.value),
      nidsubarea: Number(this.subAreaFC.value)

    }

    this._performanceService.GetChargesByCompanyArea(payload).subscribe((res) => {
      
      this.lstcargo=res;
    });
  }

  getListCampanias(): void {

    this._performanceService.GetCampaingByEvaluation().subscribe(resp => {
      console.log("🚀 ~NineBoxComponent ~ this._performanceService.GetCampaingByEvaluation ~ resp:", resp)
      this.listcampaign=resp.data;
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiCtrl.setValue([this.listcampaign[1]]);
      this.filteredCampanasMulti.next(this.listcampaign.slice());
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCampanasMulti();
      }); 
    })
    
  }

  getRound(valor){
    var res= parseFloat(valor).toFixed(2);

    return res;
  }

  displayTooltip(index, message) {
        
    switch(index) {
      case 1:
        this.myTooltip1.disabled = false;
        this.myTooltip1.message = message;
        this.myTooltip1.show()
        setTimeout(() => {
          this.myTooltip1.disabled = true;
        }, 4000);
        break;
      case 2:
        this.myTooltip2.disabled = false;
        this.myTooltip2.message = message;
        this.myTooltip2.show()
        setTimeout(() => {
          this.myTooltip2.disabled = true;
        }, 4000);
        break;
      case 3:
        this.myTooltip3.disabled = false;
        this.myTooltip3.message = message;
        this.myTooltip3.show()
        setTimeout(() => {
          this.myTooltip3.disabled = true;
        }, 4000);
        break;
      case 4:
        this.myTooltip4.disabled = false;
        this.myTooltip4.message = message;
        this.myTooltip4.show()
        setTimeout(() => {
          this.myTooltip4.disabled = true;
        }, 4000);
        break;
      case 5:
        this.myTooltip5.disabled = false;
        this.myTooltip5.message = message;
        this.myTooltip5.show()
        setTimeout(() => {
          this.myTooltip5.disabled = true;
        }, 4000);
        break;
      case 6:
        this.myTooltip6.disabled = false;
        this.myTooltip6.message = message;
        this.myTooltip6.show()
        setTimeout(() => {
          this.myTooltip6.disabled = true;
        }, 4000);
        break;
      case 7:
        this.myTooltip7.disabled = false;
        this.myTooltip7.message = message;
        this.myTooltip7.show()
        setTimeout(() => {
          this.myTooltip7.disabled = true;
        }, 4000);
        break;
      case 8:
        this.myTooltip8.disabled = false;
        this.myTooltip8.message = message;
        this.myTooltip8.show()
        setTimeout(() => {
          this.myTooltip8.disabled = true;
        }, 4000);
        break;
      case 9:
        this.myTooltip9.disabled = false;
        this.myTooltip9.message = message;
        this.myTooltip9.show()
        setTimeout(() => {
          this.myTooltip9.disabled = true;
        }, 4000);
        break;        
    }
  }

}
