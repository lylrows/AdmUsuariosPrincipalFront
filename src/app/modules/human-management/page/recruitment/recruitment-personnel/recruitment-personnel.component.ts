import { environment } from 'environments/environment';
import { ProfileCode } from '@app/modules/human-management/page/recruitment/enums/cargo.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecruitmentAddInternalComponent } from './../recruitment-add-internal/recruitment-add-internal.component';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Acciones, RecruitMentPersonnelService } from "@app/data/service/recruitment-personnel.service";
import { ConfigurationRecruitment } from "../models/configuration";
import { RecruitmentAddComponent } from "../recruitment-add/recruitment-add.component";
import { EmpresaService } from '@app/data/service/empresa.service';
import { Empresa } from '@app/data/schema/empresa';
import { EmployeeService } from '@app/data/service/employee.service';
import { AreaService } from '@app/data/service/areas.service';

@Component({
  selector: "app-recruitment-personnel",
  templateUrl: "./recruitment-personnel.component.html",
  styleUrls: ["./recruitment-personnel.component.scss"],
})
export class RecruitmentPersonnelComponent implements OnInit {
  recruitment: any[] = [];
  recruitmentBorradores: any[] = [];
  totalRows = 1;
  pageSize = 10;
  currentPage = 0;
  totalPages = 1;
  infoRequest: any;
  title: string;
  mostrarBorrador:boolean = false;
  solPendiente:number = 0;
  solAprobada:number = 0;
  solRechazada:number = 0;
  public empresas: Empresa[];
  public empresaSel:any;
  public date = new Date();
  public sinceDate:any;
  public toDate = new Date();
  public busqueda:string = "";
  public requestFilter:any;
  public estadoSel:any;
  nid_employee: number = 0;
  nid_userRegister: number = 0;
  public firstTime:number = 0;
  public disabledArea:boolean = true;
  public areas:any;
  public areaSel:any;
  public permisoDuplicado:boolean = true;
  public indexTab: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  screenwidth: number;
  
  @ViewChild("selectedAll") selectedAll: ElementRef;
  @ViewChild("selectedPendiente") selectedPendiente: ElementRef;
  @ViewChild("selectedAceptadas") selectedAceptadas: ElementRef;
  @ViewChild("selectedRechazada") selectedRechazada: ElementRef;

  formFilter: FormGroup;

  configuration: ConfigurationRecruitment = null;
  typeRequest: any;

  recruitmentDT: MatTableDataSource<any> = new MatTableDataSource([]);
  borradorDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "nro",
    "fecha",
    "empresa",
    "solicitante",
    "puesto",
    
    "puestoSolicitante",
    "dias",
    "estado",
    "solicitud",
    "duplicar",
    "publicado"
  ];

  displayedColumnsBorrador: string[] = [
    "nro",
    "fecha",
    "empresa",
    "solicitante",    
    "tipoSolicitud",
    "puestoSolicitante",
    "solicitud"
  ];

  permiss: Acciones = {
    boolNew: true,
    boolView: true,
    boolClone: false,
    boolSAcceptorDecline: true
  };

  initForm(): void {
    
    this.formFilter = this._fs.group({
      State: [0],
      nidbussines:[0],
      dateStart:this.sinceDate,
      dateEnd:this.toDate,
      nidarea:[0],
      scharge:'',
      flat: [1],
      nid_applicant: [0],
      ntype_filter: [0],
      type: [0],
      nuserregister: [0],
      CurrentPage: [1],
      ItemsPerPage: this.pageSize,
      TotalItems: [0],
      TotalPages: [1],
      TotalRows: [0],
    });
    
  }
  formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      this.sinceDate = [year, month, day].join('-');
  }
  getApplicant = null;
  permiteEditarEspecial = false;
  storage = JSON.parse(localStorage.getItem('GRUPOFE_USER'));

  constructor(
    private _serviceEmployee: EmployeeService,
    private _fs: FormBuilder,
    private _service: RecruitMentPersonnelService,
    private renderer: Renderer2,
    public _dialog: MatDialog,
    private router: ActivatedRoute,
    private rout: Router,
    private snack: MatSnackBar,
    private empresaService: EmpresaService,
    private areaService: AreaService
  ) {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    
    if(this.storage.nid_profile !== 8 && this.storage.nid_profile !== 2 && this.storage.nid_profile !== 24){
      
      this.displayedColumns = [
        "nro",
        "fecha",
        "empresa",
        "solicitante",
        "puesto",
        "puestoSolicitante",
        "dias",
        "estado",
        "solicitud",
        "publicado",
      ];
      
      this.permisoDuplicado = false
    }
    
    if(environment.perfilTalento.indexOf(this.storage.nid_profile) > -1)
      this.permiteEditarEspecial = true;

    this.nid_employee = storage.nid_employee;
    this.nid_userRegister=storage.id;
    this.loadEmpresas();
    this.sinceDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    
    this.initForm();
    this.GetRequestFlowConfiguration();
  }

  GetEmployeeChargeByUser(): void {
    this._service.GetEmployeeChargeByUser().subscribe(resp => {
      if (resp == null) {
        this.snack.open("No puede realizar solicitudes ya que usted no es un empleado de Grupo Fe", "Error", { duration: 4000 });
      } else {
        this.getApplicant = resp;
        this.getRecruitment(this.getApplicant.idApplicant);
        
      }
    }, err => {
       console.log(err);
    })
  }

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    this.router.paramMap.subscribe((params: any) => {
      if (params) {
        this.typeRequest = parseFloat(params.get("id"));
        this.title = this.typeRequest == 1 ? 'Panel de Reclutamiento de Personal Externo' : 'Panel de Reclutamiento de Personal Interno';
        this.GetEmployeeChargeByUser();
      }
    });
    
  }

  GetRequestFlowConfiguration(): void {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idposition: number = storage.nid_profile;
    

    this._service.GetRequestFlowConfiguration(idposition,1).subscribe(resp => {
      this.configuration = resp;
      const permisos = this._service.getPermissByRol(this.configuration);
      if(permisos != null) this.permiss = permisos;
    })
  }
  setCards()
  {
    this.solAprobada = 0;
    this.solPendiente = 0;
    this.solRechazada = 0;
  }
  getRecruitment(applicant: number): void {
    
    const nid_position = this.storage.nid_profile;
    let flat: number = 0;
    if (nid_position === ProfileCode.APPLICANT ) {
      flat = 2;
      this.formFilter.get('flat').setValue(flat);
      
    }
    this.formFilter.get('type').setValue(this.typeRequest);
    this.formFilter.get('nid_applicant').setValue(applicant);
    this.formFilter.get('ntype_filter').setValue(1);
    this.formFilter.get('dateStart').setValue(this.sinceDate);
    this.formFilter.get('dateEnd').setValue(this.toDate);
    
    this._service.getRecruitMentPersonnel(this.formFilter.value).subscribe(
      (resp) => {       
            this.setCards();
            this.totalRows = resp.totalItems;      
            this.totalPages = resp.totalPages;
            for(let i=0; i< resp.list.length;i++)
            {
              switch(resp.list[i].state){
                case 2:
                  this.solPendiente++;
                  break;
                case 3:
                  this.solAprobada++;
                  break;
                case 4:
                  this.solRechazada++;
                  break;
              }
            }
      },
      (err) => {},
      () => {}
    );
    
    
    this.formFilter.get('ntype_filter').setValue(0);
    this._service.getRecruitMentPersonnel(this.formFilter.value).subscribe(
      (resp) => {
          
          this.recruitment = resp.list;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = resp.totalItems;  
      },
      (err) => {},
      () => {
        this.recruitmentDT = new MatTableDataSource(this.recruitment);
        
      }
    );

    
    const payload = this.formFilter.value
    
    this._service.getRecruitMentPersonnel(payload).subscribe(
      (resp) => {
        this.recruitmentBorradores = resp.list;
      },
      (err) => {},
      () => {
        this.borradorDT = new MatTableDataSource(this.recruitmentBorradores);
      }
    );
  }

  getRecruitmentBorradores(idApplicant: number): void {
    
    const nid_position = this.storage.nid_profile;
    let flat: number = 0;
    if ( nid_position === ProfileCode.AREA || nid_position === ProfileCode.APPLICANT ) {
      this.formFilter.get('flat').setValue(2);
      flat = 2;
    }

    const payload = {
      State: 1,
      flat,
      nid_applicant: idApplicant,
      ntype_filter: 0,
      CurrentPage: 1,
      ItemsPerPage: 10,
      TotalItems: 0,
      TotalPages: 1,
      TotalRows: 0,
    }
    this._service.getRecruitMentPersonnel(payload).subscribe(
      (resp) => {
        this.recruitmentBorradores = resp.list;
      },
      (err) => {},
      () => {
        this.borradorDT = new MatTableDataSource(this.recruitmentBorradores);
      }
    );
  }


  pageChanged(event: PageEvent) {
    if (this.pageSize !== event.pageSize) {
      this.pageSize = event.pageSize;
      this.formFilter.get("ItemsPerPage").setValue(this.pageSize);
      this.formFilter.get("CurrentPage").setValue(1);
      this.currentPage = 0;
    } else {
      this.formFilter.get("CurrentPage").setValue(event.pageIndex + 1);
      this.currentPage = event.pageIndex;
    }

    this.getRecruitment(this.getApplicant.idApplicant);
  }

  showModalAdd(titulo: string, objData: any, esNuevo: boolean): void {
    let title = titulo;
    let type: 53;
    let typereq = this.typeRequest;
    

    const config = new MatDialogConfig();
    if (this.screenwidth <= 500){
      config.width = "100%";
      config.maxWidth = "100%";
      config.height = "100%";
    }else{
      config.width = "850px";
      config.height = "550px";
    }
    config.disableClose = true;
    config.data = {
      title,
      type,
      typereq,
      objData,
      esNuevo
    }

    if (this.typeRequest == 1) {
      
      
      const modal = this._dialog.open(RecruitmentAddComponent, config);
      modal.afterClosed().subscribe((resp) => {
        if (resp.enviarNotificacion === true) {
          this.snack.open("¡Ha sido registrado correctamente!", "OK", {
            duration: 4000,
          }); 
          this.SendEmailNotification(resp.idRequest, resp.nombrePuesto);
          
        }
        this.filter(0);
      });
    } else {
      
      const modal = this._dialog.open(RecruitmentAddInternalComponent, config);
      modal.afterClosed().subscribe((resp) => {
        
        if (resp.enviarNotificacion === true) {
         this.snack.open("¡Ha sido registrado correctamente!", "OK", {
            duration: 4000,
          });
          this.SendEmailNotification(resp.idRequest, resp.nombrePuesto);
          
        }
        this.filter(0);
      });
    }
  }

  filter(option: number): void {
    this.indexTab = option;
    option++;
    this.mostrarBorrador=false;
    
    switch (option) {
      case 1:
       
        this.formFilter.get('scharge').setValue('');
        this.formFilter.get('nidarea').setValue(0);
        this.formFilter.get('nidbussines').setValue(0);
        this.formFilter.get('State').setValue(0);
        this.formFilter.get('nuserregister').setValue(0);
        this.getRecruitment(this.getApplicant.idApplicant);
        break;
      case 2:

        this.formFilter.get('scharge').setValue('');
        this.formFilter.get('nidarea').setValue(0);
        this.formFilter.get('nidbussines').setValue(0);
        this.formFilter.get('State').setValue(2);
        this.formFilter.get('nuserregister').setValue(0);
        this.getRecruitment(this.getApplicant.idApplicant);
        break;
      case 3:

        this.formFilter.get('scharge').setValue('');
        this.formFilter.get('nidarea').setValue(0);
        this.formFilter.get('nidbussines').setValue(0);
        this.formFilter.get('State').setValue(3);
        this.formFilter.get('nuserregister').setValue(0);
        this.getRecruitment(this.getApplicant.idApplicant);
        break;
      case 4:

        this.formFilter.get('scharge').setValue('');
        this.formFilter.get('nidarea').setValue(0);
        this.formFilter.get('nidbussines').setValue(0);
        this.formFilter.get('State').setValue(4);
        this.formFilter.get('nuserregister').setValue(0);
        this.getRecruitment(this.getApplicant.idApplicant);
        break;
        case 5:

          this.mostrarBorrador = true;
          this.formFilter.get('scharge').setValue('');
          this.formFilter.get('nidarea').setValue(0);
          this.formFilter.get('nidbussines').setValue(0);
          this.formFilter.get('State').setValue(1);
          this.formFilter.get('nuserregister').setValue(0);
          this.getRecruitment(this.getApplicant.idApplicant);
          break;   
          case 6:
            
            this.formFilter.get('scharge').setValue('');
            this.formFilter.get('nidarea').setValue(0);
            this.formFilter.get('nidbussines').setValue(0);
            this.formFilter.get('State').setValue(1);
            this.formFilter.get('nuserregister').setValue(this.nid_userRegister);
            
            this.getRecruitment(this.getApplicant.idApplicant);
            break;             
      default:
     
        this.formFilter.get('scharge').setValue(this.busqueda);
        this.formFilter.get('nidarea').setValue(this.areaSel);
        this.formFilter.get('nidbussines').setValue(this.empresaSel);
        this.formFilter.get('nuserregister').setValue(0);
        this.getRecruitment(this.getApplicant.idApplicant);
        break;
    }
  }

  EditarDuplicar(row, _esNuevo: boolean): void {
    this.GetInfoRequest(row.id, _esNuevo);
  }

  GetInfoRequest(_id: number, _esNuevo: boolean) {
    
    this._service.getrequestById(_id).subscribe(res => {
      this.infoRequest = res;
        this.showModalAdd(_esNuevo ? 'Duplicar Solicitud' : 'Editar Solicitud', this.infoRequest, _esNuevo);
    });
  }
  changedPageSize(event: PageEvent) {
    this.setPage(event.pageSize, event.pageIndex);
  }
  changedPageNumber(pagina: number) {
    this.setPage(this.pageSize, pagina);
  }
  changeEmpresa(): void {
    const company = Number(this.empresaSel);

    this.loadAreas(company);
    this.disabledArea = false;
  }
  setPage(pageSize: number, pageIndex: number) {
    if (this.pageSize !== pageSize){
      this.pageSize = pageSize;  
      this.formFilter.get("CurrentPage").setValue(1);
      this.currentPage = 0;
    }else{
      this.formFilter.get("CurrentPage").setValue(pageIndex + 1);
      this.currentPage = pageIndex;
    }
  }

  MostrarBorrador()
  {
    this.mostrarBorrador = true;
  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe(res => this.empresas = res);
  }
  
  loadAreas(idCompany: number) {
    this.areaService.getByCompany(idCompany).subscribe((res) => {
      this.areas = res.data;
    });
  }

  SendEmailNotification(idRequest: number, nombrePuesto: string){
    const storageUser = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const payloadEmail = {
      Id: idRequest,
      IdArea: 0,
      IdCompany:0,
      IdPerson:storageUser.nid_person,
      Subject: nombrePuesto,
      Body: "",
      SendDate:new Date(),
      Active: true,
      IdReceptor: 0,
      IsApprovedRRHH:false,
      IdUser:storageUser.id,
      IsOption:0
    }

    this._service.addNotificationApproved(payloadEmail).subscribe(
      (res) => {
        if (res.stateCode == 200) {
          
        } else if (res.stateCode == 2) {
          this.snack.open(res.messageError[0], "OK", { duration: 4000 });
        } else {
          this.snack.open("Ocurrio un error en el servidor, al momento de enviar la notificación.", "Error", { duration: 4000 });
        }
      },
      (err) => {},
      () => {
        
      }
    );
  
  }

  getDetailPath(id: number): void {
    this.rout.navigate(['/humanmanagement/recruitment-detail',id], {
      skipLocationChange: true
    })
  }
}
