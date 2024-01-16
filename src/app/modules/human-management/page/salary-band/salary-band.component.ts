import { O } from "@angular/cdk/keycodes";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Areas } from "@app/data/schema/areas";
import { FilterCargo } from "@app/data/schema/cargo";
import { Empresa, ICompanyList } from "@app/data/schema/empresa";
import { SALARY_BAND_HEADER_EXPORT, ISalaryBandExport } from "@app/data/schema/salary-band";
import { SalaryStructureFilter } from "@app/data/schema/salaryband/SalaryStructureFilter";
import { AreaService } from "@app/data/service/areas.service";
import { CargoService } from "@app/data/service/cargo.service";
import { EmployeeService } from "@app/data/service/employee.service";
import { ExportarService } from "@app/data/service/excel.service";
import { PerformanceService } from "@app/data/service/performance.service";
import { SalaryBandService } from "@app/data/service/salaryband.service";

@Component({
  selector: "app-salary-band",
  templateUrl: "./salary-band.component.html",
  styleUrls: ["./salary-band.component.scss"],
})
export class SalaryBandComponent implements OnInit {
  @ViewChild('DetailDialog') DetailDialog: TemplateRef<any>;
  title = "Estructura Salarial";
  detail: any[] = [];
  responsive = false;
  screenWidth: number;

  datasourceDT1G1: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumnsG1: string[] = [
    "jobObjectives",
    "indicatorOrganizational",
    "goal",
    "weight",
    "startDate",
    "endDate",
  ];
  displayedColumnsG2: string[] = [
    "organizationalProficiency",
    "proficiencyDescription",
    "idProficiencyLevel",
    "definitionLevel",
    "qualification",
    "actionsToImprove",
    "indicatorOrganizational",
    "startDate",
    "endDate",
  ];

  header: any = null;

  Filter = <SalaryStructureFilter>{
    IdCompany: 0,
    Period: 0,
    IdArea:0,
    IdCargo:0,
    Month:1
  };
  listdata = [];
  isSelectedRow=[];

  currentPeriod = 0;
  previousPeriod = 0;
  companies: ICompanyList[] = [];
  areas: any[] = [];
  cargos:any[]=[];
  cargoFilter=<FilterCargo>{
    idArea:0,
    idEmpresa:0,
    nombreCargo:''
  }
  monthPeriod=1;
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
  ];

  gerencias: Areas[];
  
  subAreas: Areas[];
  subAreaFC='';

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  areaFC = '';
  gerenciaFC='';
  public empresas: Empresa[];
  bussineFC = '';
  areascc=[];
  areaCCFC='';

  private headerExport: ISalaryBandExport[];

  constructor(
    private salarybandService: SalaryBandService,
    private _serviceEmployee: EmployeeService,
    private areaService: AreaService,
    public cargoService: CargoService,
    private exporService: ExportarService,
    private dialog: MatDialog
  ) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 600){
      this.responsive = true; 
    } 
    this.headerExport = SALARY_BAND_HEADER_EXPORT;
  }

  ngOnInit(): void {
    this.Filter.Period = new Date().getFullYear()+1;

    this.getListCompany();
    
    this.Filter.IdCompany = 1;

    this.getAreas();
    this.getCargos();

    this.loadEmpresas();

  }

  changecompany() {
    this.getAreas();
  }



   getAreas(): void {
    this.areaService.getByCompany(this.Filter.IdCompany).subscribe((resp) => {

      this.areas = resp.data;
      this.Filter.IdArea =  0;
      this.getCargos();
    });
  }

  getCargos():void{

    this.cargoFilter.idArea= parseInt(this.Filter.IdArea.toString()) ;
    this.cargoFilter.idEmpresa = this.Filter.IdCompany;

    this.cargoService.getComboCargo(this.cargoFilter).subscribe((resp) => {
      this.Filter.IdCargo =  0;
      this.cargos = resp.data;
    });

  }

  getListCompany(): void {
    this._serviceEmployee
      .getListCompany()
      .subscribe((resp) => {
          this.companies = resp
          this.Filter.IdCompany=1;
          this.getAreas();
        });
  }

  getList(): void {
    this.Filter.IdCompany= Number(this.bussineFC);
    this.Filter.IdGerencia= Number(this.gerenciaFC);

    this.Filter.IdArea= Number(this.areaFC);
    this.Filter.IdSubArea= Number(this.subAreaFC);
    this.Filter.AreaCC= this.areaCCFC;

    this.salarybandService.getSalaryStructure(this.Filter).subscribe((resp) => {
      this.currentPeriod = this.Filter.Period;
      this.previousPeriod = this.Filter.Period - 1;
      this.monthPeriod =  this.Filter.Month;
      this.listdata = resp.data;
    });
    
    if (this.responsive){
      this.dialog.open(this.DetailDialog,{
        width: '100%',
        maxWidth: '100hv'
      });
    }
  }
  printXls(){

    this.Filter.IdArea = parseInt(this.Filter.IdArea.toString());
    this.Filter.IdCargo= parseInt(this.Filter.IdCargo.toString());


    this.salarybandService.getSalaryStructureExportXls(this.Filter).subscribe((resp) => {
      
      
      let title ="Estructura Salarial "  + this.listmonth.filter(i=>i.code=== this.Filter.Month)[0].name  + " - "+ this.Filter.Period;


      this.exporService.exportSalaryBandAsExcelFile(this.headerExport, 'Listado de Estructura Salarial', 'Listado', resp.data,this.Filter.Period,title);

    });

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

  resetFilter(){



    this.Filter.IdCompany= 1;
    this.Filter.Period = new Date().getFullYear()+1;
    this.Filter.IdCargo=0;
    this.Filter.ChargeName='';



    this.Filter.IdGerencia= 0;

    this.Filter.IdArea= 0;
    this.Filter.IdSubArea= 0;

    this.bussineFC ='';
    this.gerenciaFC='';
    this.areaFC='';
    this.subAreaFC='';

    this.disabledGerencia = true;
    this.disabledArea = true;
    this.disabledSubArea = true;

  }

  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }

  selectedRow(row){
    this.isSelectedRow=row;

  }


  changeGerencia(): void {
    this.loadAreas();

    this.areaFC='';
    this.subAreaFC='';
    this.areaCCFC ='';

    this.disabledArea = false;
    this.disabledSubArea = true;
  }

  loadAreas() {
    this.salarybandService.getareaccbygerencia(Number(this.gerenciaFC)).subscribe((res) => {
      
      this.areascc = res.data;
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
    
    let idUser = 0; 
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

}
