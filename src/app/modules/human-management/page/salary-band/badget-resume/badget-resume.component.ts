import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Areas } from "@app/data/schema/areas";
import { FilterCargo } from "@app/data/schema/cargo";
import { Empresa, ICompanyList } from "@app/data/schema/empresa";
import { IBudgetResumeExport, SALARY_BAND_HEADER_EXPORT } from "@app/data/schema/salaryband/BudgetResumeExport";
import { BudgetResumeFilter } from "@app/data/schema/salaryband/BudgetResumeFilter";
import { AreaService } from "@app/data/service/areas.service";
import { CargoService } from "@app/data/service/cargo.service";
import { EmployeeService } from "@app/data/service/employee.service";
import { SalaryBandService } from "@app/data/service/salaryband.service";
import { SBBudgetResumeExportService } from "@app/data/service/salayband/sbbudgetresumeexport.service";
//SBBudgetResumeExportService


@Component({
  selector: "app-badget-resume",
  templateUrl: "./badget-resume.component.html",
  styleUrls: ["./badget-resume.component.scss"],
})
export class BadgetResumeComponent implements OnInit {
  @ViewChild('DetailDialog') DetailDialog: TemplateRef<any>;
  private headerExport: IBudgetResumeExport[];
  constructor(
    private _salaryBandService: SalaryBandService,
    private _serviceEmployee: EmployeeService,
    private areaService: AreaService,
    private cargoService: CargoService,
    private snack: MatSnackBar,
    public  exportService:SBBudgetResumeExportService,
    private dialog: MatDialog
  ) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 600){
      this.responsive = true; 
    }
    this.headerExport = SALARY_BAND_HEADER_EXPORT;
  }
  title = "Resumen Presupuesto";
  currentPeriod =0;
  previousPeriod =0;
  variationPeriod =0;
  companyname='';

  listdata=[];
  listDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  areas: any[] = [];
  cargos: any[] = [];
  companies: ICompanyList[] = [];
  Filter = <BudgetResumeFilter>{
    // IdArea: 0,
    // IdCompany: 0,
    Period: 0,
    //IdCargo:0,
    Month:1
  };
  cargoFilter=<FilterCargo>{
    idArea:0,
    idEmpresa:0,
    nombreCargo:''
  }
  displayedColumns: string[] = ["nameArea", "previousAmount", "currentAmount"];
  monthPeriod = 1;
  listmonth = [
    { code: 1, name: "Enero" },
    { code: 2, name: "Febrero" },
    { code: 3, name: "Marzo" },
    { code: 4, name: "Abril" },
    { code: 5, name: "Mayo" },
    { code: 6, name: "Junio" },
    { code: 7, name: "Julio" },
    { code: 8, name: "Agosto" },
    { code: 9, name: "Setiembre" },
    { code: 10, name: "Octubre" },
    { code: 11, name: "Noviembre" },
    { code: 12, name: "Diciembre" },
  ]


  gerencias: Areas[];
  //  areas: Areas[];
  subAreas: Areas[];
  subAreaFC='';
  
  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  areaFC = '';
  gerenciaFC='';
  public empresas: Empresa[];
  bussineFC = '';

  nid_areagroup: number=0;
  
  public  areagroups:[]=[];
  sareascentercost:[];

  public areascentercost:[]=[];



  total_1 =0;
  total_2 =0;
  total_3 =0;
  total_4 =0;
  total_5 =0;
  total_6 =0;
  total_7 =0;
  total_8 =0;
  titletab ='Resumen de Presupuesto';
  responsive = false;
  screenWidth: number;


  ngOnInit(): void {    
    this.Filter.Period = new Date().getFullYear()+1;
    this.Filter.PeriodVariation =this.Filter.Period-1;
    this.getComboAreaGroup();
    this.loadEmpresas();
    // this.getList(); 
  }

  resetFilter() {

    this.Filter.Period = new Date().getFullYear()+1;
    this.Filter.PeriodVariation = this.Filter.Period -1;
  

    this.nid_areagroup =0;
    this.sareascentercost=[];


    this.bussineFC ='';
    this.gerenciaFC='';
    this.areaFC='';
    this.subAreaFC='';

    this.disabledGerencia = true;
    this.disabledArea = true;
    this.disabledSubArea = true;


  }


  getAreasCenterCost(){
    this.sareascentercost =[];

    this._salaryBandService.getareacentercost(this.nid_areagroup).subscribe((resp) => {
    
      this.areascentercost = resp.data;
     
      
    });

  }


  getList() { 
    let nminimunyear = this.Filter.Period -3;
    if (this.Filter.PeriodVariation=== null){
      this.snack.open("Debe ingresar un Periodo de Variación para poder realizar el cálculo","OK", {
        duration: 4000,
      });
      return;
    }

    if (this.Filter.PeriodVariation < nminimunyear ||  (this.Filter.PeriodVariation >= this.Filter.Period)){

      this.snack.open("El Periodo de Variación no puede ser menor a " + nminimunyear +" o mayor a " + (this.Filter.Period-1), "OK", {
        duration: 4000,
      });
      return;
    }
    this.Filter.IdAreaGroup = parseInt(this.nid_areagroup.toString());
    this.Filter.AreaCenterCosts="";
    if ( this.sareascentercost != null && this.sareascentercost.length>0) {    
      this.Filter.AreaCenterCosts= this.sareascentercost.join(',');
    }
    this.total_1 = 0 ;
    this.total_2 = 0 ;
    this.total_3 = 0 ;
    this.total_4 = 0 ;
    this.total_5 = 0 ;
    this.total_6 = 0 ;
    this.total_7 = 0 ;
    this.total_8 = 0 ;

    let title ="Resumen de Presupuesto "  + this.listmonth.filter(i=>i.code=== this.Filter.Month)[0].name  + " - "+ this.Filter.Period;
    this.titletab = title;
    this._salaryBandService.getResumeBudget(this.Filter).subscribe((resp) => {      
      this.currentPeriod =this.Filter.Period;
      this.previousPeriod = this.Filter.Period -1;
      this.variationPeriod = this.Filter.PeriodVariation;
      this.listdata = resp.data;
      this.listdata.forEach(element => {          
      if (element.isGroup ===false ){
        this.total_1 += element.previousExecAmount2;
        this.total_2 += element.previousExecAmount1;
        this.total_3 += element.previousExecAmount;
        this.total_4 += element.currentExecAmount;
        this.total_5 += element.previousAmount;
        this.total_6 += element.currentAmount;
        this.total_7 += element.variationPorc;
        this.total_8 += element.variationAmount;
      }        
      });
      this.total_7 =  ((this.total_6 / this.total_3) - 1)*100
    });

    if (this.responsive){
      this.dialog.open(this.DetailDialog,{
        width: '100%',
        maxWidth: '100hv'
      });
    }  
  }
  printXls(){


    let nminimunyear = this.Filter.Period -3

    if (this.Filter.PeriodVariation=== null){
      this.snack.open("Debe ingresar un Periodo de Variación para poder realizar el cálculo","OK", {
        duration: 4000,
      });

      return;
    }



    if (this.Filter.PeriodVariation < nminimunyear ||  (this.Filter.PeriodVariation >= this.Filter.Period)){

      this.snack.open("El Periodo de Variación no puede ser menor a " + nminimunyear +" o mayor a " + (this.Filter.Period-1), "OK", {
        duration: 4000,
      });

      return;
    }


    this.Filter.IdAreaGroup = parseInt(this.nid_areagroup.toString());
    this.Filter.AreaCenterCosts="";
    if ( this.sareascentercost != null && this.sareascentercost.length>0) {
    
      this.Filter.AreaCenterCosts= this.sareascentercost.join(',');
    }

    this._salaryBandService.getResumeBudget(this.Filter).subscribe((resp) => {
      
    
      let title ="Resumen de Presupuesto "  + this.listmonth.filter(i=>i.code=== this.Filter.Month)[0].name  + " - "+ this.Filter.Period;

      this.exportService.export( this.headerExport, 'Resumen de Presupuesto', 'Listado', resp.data,this.Filter.Period,title);
      
    });


  }
  isGroup(index, item): boolean{
    
    return item.isGroup;
  }
  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  
  changeGerencia(): void {
    this.loadAreas();

    this.areaFC='';
    this.subAreaFC='';

    this.disabledArea = false;
    this.disabledSubArea = true;
  }

  loadAreas() {
    const payload = {
      IdArea: Number(this.gerenciaFC)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas = res.data;
    });

  }

  changeEmpresa(): void {

    this.loadGerencia();
    this.disabledGerencia = false;

    this.gerenciaFC='';
    this.areaFC='';
    this.subAreaFC='';
    this.disabledGerencia = false;
    this.disabledArea = true;
    this.disabledSubArea = true;
  }

  loadGerencia() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;
    const payload = {
      IdUser: idUser,
      IdCompany: Number(this.bussineFC)

    }
    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;
    });
  }
  
  loadEmpresas() {

    let idUser = 0; //storage.id;
    const payload = {
      IdUser: idUser

    }
    this.areaService.getCompanyByUser(payload).subscribe((res) => {
      this.empresas = res.data;
    });

  }
  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;
  }
  loadSubAreas() {
    const payload = {
      IdArea: Number(this.areaFC)

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
  getComboAreaGroup() {
    this._salaryBandService.getAreaGroupCombo().subscribe((resp) => {
      
      this.areagroups = resp.data;

    });
  }
}
