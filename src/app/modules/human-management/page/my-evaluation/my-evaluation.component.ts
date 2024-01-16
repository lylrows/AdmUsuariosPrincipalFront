import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Areas } from '@app/data/schema/areas';
import { AreasByUser } from '@app/data/schema/areas';
import { IDetailEmployee } from '@app/data/schema/employee';
import { Empresa } from '@app/data/schema/empresa';
import { MyEvaluationQueryFilter } from '@app/data/schema/Evaluation/MyEvaluationQueryFilter';
import { AreaService } from '@app/data/service/areas.service';
import { EmployeeService } from '@app/data/service/employee.service';
import { EmpresaService } from '@app/data/service/empresa.service';
import { PerformanceService } from '@app/data/service/performance.service';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-my-evaluation',
  templateUrl: './my-evaluation.component.html',
  styleUrls: ['./my-evaluation.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { 
     provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
   ]
})

export class MyEvaluationComponent implements OnInit {
  
  @ViewChild('picker', { static: false })
  private picker!: MatDatepicker<Date>;  
  selectedYear:number;
  dateForm= new FormControl(""); 
  yearcampanaFC:number=0;

  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  evaluationoDT: MatTableDataSource<any> = new MatTableDataSource([]);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ["view", "campaign","evaluatedName","chargerEvaluated" , "evaluatorName", "chargerEvaluator" , "timePart","numberaction"];

  evaluations: any[] = [];
  listnumberAction: any[] = [];
  inputFiler = new FormControl('');
  
 
  campanaFC = new FormControl('');
  colaboradorFC = new FormControl(null);

  bussineFC = new FormControl("");
  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  subAreaFC = new FormControl("");

  employee: Array<IDetailEmployee> = [];
  listcampaign : any[] = [];
  listemployee: any [] = [];
  loadFinish:boolean=false;
  firstChange:boolean=true;
  idprofile: number = 0;
  nid_employee: number = 0;
  isGlobal: boolean = false;

  listcampaignnew : any[] = [];

  public empresas: Empresa[];
  public empresasSel:Array<any>=[];

  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];
  areasByUser: AreasByUser;

  public areasSel:Array<any>=[];
  public areasSelFinal:Array<any>=[];

  disabledCompany:boolean=true;
  disabledGerencia: boolean = true;
  disabledArea: boolean = true;  
  disabledSubArea: boolean = true;
  nid_position: number = 0;

  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  
  pageSizeOptions: number[] = [5, 10, 25, 100];

  MyEvaluationFilter= <MyEvaluationQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, nidCampana: 0,
    nidEmployee: this.nid_employee,
    flat: this.isGlobal,
    nid_position: this.nid_position,
    nid_profile: this.idprofile,
    companyid: 0,
    gerenciaid: 0,
    areaid: 0,
    subareaid: 0,
    list_employee: '',
    etapa: 0
  };


  constructor(
    private _serviceEmployee: EmployeeService,
    private _service: PerformanceService,
    private _router: Router,
    private empresaService: EmpresaService,
    private areaService: AreaService
  ) {
    this.getListNumberAction();
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.idprofile = storage.nid_profile;
    this.nid_employee = storage.nid_employee;
    this.nid_position = storage.nid_position;
    if ( this.idprofile === 7 ) {
      this.isGlobal = false;
    } else {
      this.isGlobal = true
    }

  }

  ngOnInit(): void {
    this.yearcampanaFC=new Date().getFullYear();
    this.evaluationoDT.paginator =this.paginatorx.matPag;
    
    this.getListCampanias();
    this.load();
    this.getListCollaboratorsByCampaingUser();

     setTimeout(() => {
     this.selectedYear=new Date().getFullYear();
     this.dateForm.setValue(new Date());
     
    });
    

  }
  getDetailtEmployee(nidEmployee): void {
    this._serviceEmployee.getDetailtEmployee(nidEmployee).subscribe(resp => {
      
      this.employee.push(resp);
      this.empresasSel=[];
      this.loadEmpresas();
    })
  }
  
  load() {
    
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    
    this.changedPageNumber(0);
  }
  

  changeEmpresa(): void {
    
    this.getListGerenciasByCampaingUser();
    this.disabledGerencia = false;
  }


  loadEmpresas() {
    
    this.empresaService.getAll().subscribe(res =>{
      this.empresas = res;
      this.empresasSel=[]
      for(let i=0;i<this.empresas.length;i++)
      {
        
        let encontrado = 0;
        for(let j=0;j<this.employee.length;j++)
        {
          if(this.empresas[i].id==this.employee[j].nid_company)
          {
            encontrado++;
          }
        }
        
        if(encontrado!=0)
        {
          this.empresasSel.push(this.empresas[i])
          
        }
        else{}
        
      }

      //this.empresas=this.empresas.filter(e=>e.id==this.areasByUser.idCompania);
      
    });

    
  }

  
  loadAreasOLD(company) {
    this.areasSelFinal=[];
    if(this.firstChange)
    {
      //cargo de todas las areas de empresas disponibles por primera vez
      this.areasSel=[] 
      for(let i=0;i<this.empresasSel.length;i++)
      {     
        
        this.areaService.getByCompany(this.empresasSel[i].id).subscribe((res) => {
          this.areas = res.data;
          //seleccionando areas de las empresas disponibles
          for(let i=0;i<this.areas.length;i++)
          {
            
            let encontrado = 0;
            for(let j=0;j<this.employee.length;j++)
            {
              if(this.areas[i].id==this.employee[j].nid_area)
              {
                encontrado++;
              }
            }
            
            if(encontrado!=0)
              this.areasSel.push(this.areas[i])
            else{}
          }
          //seleccion final de area
          for(let k=0;k<this.areasSel.length;k++)
          {
            if(this.areasSel[k].idEmpresa==company)
            {
              //evitando repetir valores
              let encontrado2=0;
              for(let q=0;q<this.areasSelFinal.length;q++)
              {
                if(this.areasSelFinal[q].id==this.areasSel[k].id)
                  encontrado2++;
              }
              if(encontrado2==0)
                this.areasSelFinal.push(this.areasSel[k])
            }
          }
         
        });
      }
      this.firstChange=false;
    }
    else
    {
      //seleccion final de area cuando no es primer cambio
      for(let k=0;k<this.areasSel.length;k++)
      {
        if(this.areasSel[k].idEmpresa==company)
          this.areasSelFinal.push(this.areasSel[k])
      }

    }
  }
  
  getListNumberAction(): void {
    this.listnumberAction = this._service.getListNumberAction();
  }

  search(): void {
    
    this.getListEvaluations();
  }

  resetFilter(): void {
    this.selectedYear=new Date().getFullYear();
    this.dateForm.setValue(new Date());

    this.picker.close();
    this.yearcampanaFC=new Date().getFullYear();
    this.campanaFC.setValue('');
    this.inputFiler.setValue('');
    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.bussineFC.setValue('');
    this.subAreaFC.setValue('');
    this.colaboradorFC.setValue(null)

    this.disabledCompany = true;
    this.disabledGerencia = true;
    this.disabledArea = true;
    this.disabledSubArea = true;

    this.MyEvaluationFilter= <MyEvaluationQueryFilter>{pagination:{
      currentPage:1,
      itemsPerPage:this.pageSize,
      totalItems:0,
      totalPages:1,
      totalRows:0
    }, nidCampana: 0,
      nidEmployee: this.nid_employee,
      flat: this.isGlobal,
      nid_position: this.nid_position,
      nid_profile: this.idprofile,
      companyid: 0,
      areaid: 0,
      list_employee: '',
      etapa: 0
    };
    
    this.getListCampanias();
    this.load();
    this.getListCollaboratorsByCampaingUser();
  }

  
    getListEvaluations(): void {
    let arraystring = '';
    
      if ( this.colaboradorFC.value != null ) {
      const value = this.colaboradorFC.value;
       
      value.map(e => {
        
        arraystring = arraystring + e + ',';
      })

      arraystring = arraystring.substring(0, arraystring.length - 1)
    }
    let netapa=0;
    let bstatusetapa=0;
    if(this.inputFiler.value==""){
      
      netapa=0;
      bstatusetapa=0;
    }else
    {
    
      netapa=Number(this.inputFiler.value.code);
      bstatusetapa=Number(this.inputFiler.value.bisapproved);
    }
  

    const payload = {
      nyear: Number(this.yearcampanaFC),
      nidCampana: Number(this.campanaFC.value),
      nidEmployee: this.nid_employee,
      flat: this.isGlobal,
      nid_position: this.nid_position,
      nid_profile: this.idprofile,
      companyid: Number(this.bussineFC.value),
      gerenciaid: Number(this.gerenciaFC.value),
      areaid: Number(this.areaFC.value),
      subareaid:Number(this.subAreaFC.value),
      list_employee: arraystring,
      etapa: netapa, //Number(this.inputFiler.value.code),
      statusetapa: bstatusetapa,//Number(this.inputFiler.value.bisapproved),
      currentPage:this.MyEvaluationFilter.pagination.currentPage,
      itemsPerPage:this.MyEvaluationFilter.pagination.itemsPerPage,

    }

    
 
    this._service.GetMyEvaluations(payload).subscribe(resp => {
      
      this.evaluations = resp.list;
    

      setTimeout(() => {
        
        this.paginator.pageIndex = this.currentPage;
         this.paginator.length = resp.totalItems;
         
      });
      
    }, (err) => { }, 
      () => {
        this.evaluationoDT = new MatTableDataSource<any>(this.evaluations);
        
        setTimeout(() => {
          this.paginatorx.initPageRange();
          
        });
        this.ngAfterViewInit();
    })
    this.loadFinish=true;
  }

  ngAfterViewInit(): void {
    this.evaluationoDT.paginator = this.paginatorx.matPag;
    
  }

  detail(row): void {
    this._router.navigate(['/humanmanagement/campaing-evaluation-detail', row.idEvaluation], {
      skipLocationChange: true
    })
  }
  resume(row): void {
    this._router.navigate(['/humanmanagement/evaluation-resume', row.idEvaluation], {
      skipLocationChange: true
    })
  }


  
    changedPageSize(event: PageEvent) {
    this.setPage(event.pageSize, event.pageIndex);
  }

  
    changedPageNumber(pagina: number) {
    this.setPage(this.pageSize, pagina);
  }


  
    setPage(pageSize: number, pageIndex: number) {
    if (this.pageSize !== pageSize){
      this.pageSize = pageSize;  
      this.MyEvaluationFilter.pagination.itemsPerPage = this.pageSize;
      this.MyEvaluationFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.MyEvaluationFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.evaluationoDT.paginator = this.paginatorx.matPag;
    
    this.getListEvaluations();
  }

  loadGerencia() {
    
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser =storage.id;
    const payload = {
      IdUser: idUser,
      IdCompany: Number(this.bussineFC.value)
    }
    this.areaService.getGerenciasByUserEvaluation(payload).subscribe((res) => {
      this.gerencias = res.data;
    });
  }

  changeGerencia(): void {

    this.getListAreasByCampaingUser();
    this.disabledArea = false;

  }

  loadAreas() {
    
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser =storage.id;
    const payload = {
      IdUser: idUser,
      IdArea: Number(this.gerenciaFC.value)
    }
    this.areaService.getAreasbyGerenciaEvaluation(payload).subscribe((res) => {
      this.areasSelFinal= res.data;
 
    });

  }

  changeArea(): void {
    this.getListSubAreasByCampaingUser();

  }

  loadSubAreas() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser =storage.id;
    const payload = {
      IdUser: idUser,
      IdArea: Number(this.areaFC.value)
    }
    this.areaService.getSubAreasbyAreaEvaluation(payload).subscribe((res) => {
      
      this.subAreas= res.data;
      if(this.subAreas.length==0)
        this.disabledSubArea = true;
      else
        this.disabledSubArea = false;
    });
  }

  changeCampania(){
    this.getListCompanyByCampaingUser();
    this.disabledCompany=false;
    this.getListCollaboratorsByCampaingUser();

  }


  getListCampanias(): void {

    const payload = {
      nyear: Number(this.yearcampanaFC),
      nidCampana: Number(this.campanaFC.value),
      nidEmployee: this.nid_employee,
      companyid: Number(this.bussineFC.value),
      etapa: Number(this.inputFiler.value)

    }

    this._service.GetCampaingByUserMyEvaluations(payload).subscribe(resp => {
      this.listcampaign=resp.data;
    })
    
  }

  getListCompanyByCampaingUser(): void {
    const payload = {
      nidCampaing: Number(this.campanaFC.value),
      nidEmployee: this.nid_employee

    }

    this._service.GetCompanyByCampaingUserMyEvaluations(payload).subscribe(resp => {
      this.empresasSel=resp.data;
      
    })
    
  }

  getListGerenciasByCampaingUser(): void {
    const payload = {
      nidCampaing: Number(this.campanaFC.value),
      nidEmployee: this.nid_employee,
      nidCompany: Number(this.bussineFC.value)

    }

    this._service.GetGerenciasByCampaingUserMyEvaluations(payload).subscribe(resp => {
      this.gerencias=resp.data;
      
    })
    
  }

  getListAreasByCampaingUser(): void {
    const payload = {
      nidCampaing: Number(this.campanaFC.value),
      nidEmployee: this.nid_employee,
      nidCompany: Number(this.bussineFC.value),
      nidGerencia: Number(this.gerenciaFC.value),

    } 

    this._service.GetAreasByCampaingUserMyEvaluations(payload).subscribe(resp => {
      this.areasSelFinal=resp.data;
      if(this.subAreas.length==0){
        this.disabledArea = true;

      }
      else{
          this.disabledArea = false;

      }
        
    })
    
  }

  getListSubAreasByCampaingUser(): void {
    const payload = {
      nidCampaing: Number(this.campanaFC.value),
      nidEmployee: this.nid_employee,
      nidCompany: Number(this.bussineFC.value),
      nidGerencia: Number(this.gerenciaFC.value),
      nidArea: Number(this.areaFC.value),

    } 


    this._service.GetSubAreasByCampaingUserMyEvaluations(payload).subscribe(resp => {
      if(resp.data[0].snamearea!=null){
        this.subAreas=resp.data;
        if(this.subAreas.length==0)
          this.disabledSubArea = true;
        else
          this.disabledSubArea = false;
        }

        
      })
    
  }

  getListCollaboratorsByCampaingUser(): void {
    const payload = {
      nidCampaing: Number(this.campanaFC.value),
      nidEmployee: this.nid_employee

    } 

    this._service.GetCollaboratorsByCampaingUserMyEvaluations(payload).subscribe(resp => {

      this.listemployee=resp.data;
      
    })
    
  }
  
  chosenYearHandler(ev, input){
    this.yearcampanaFC=ev._i.year;
    let { _d } = ev;
    this.selectedYear = _d;
    this.picker.close()
    
    this.getListCampanias();
  }



}
