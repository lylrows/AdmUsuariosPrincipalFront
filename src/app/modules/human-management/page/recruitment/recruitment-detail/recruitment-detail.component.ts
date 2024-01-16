import { environment } from 'environments/environment';
import { ProfileCode } from '@app/modules/human-management/page/recruitment/enums/cargo.enum';
import { Component, DebugElement, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormControl,FormGroup, } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Acciones, RecruitMentPersonnelService } from "@app/data/service/recruitment-personnel.service";
import { ConfigurationRecruitment } from "../models/configuration";
import { CargoService } from '@app/data/service/cargo.service';
import Swal from 'sweetalert2';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { SalaryBandService } from "@app/data/service/salaryband.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotificationService } from "@app/data/service/notification.service";

@Component({
  selector: "app-recruitment-detail",
  templateUrl: "./recruitment-detail.component.html",
  styleUrls: ["./recruitment-detail.component.scss"],
})
export class RecruitmentDetailComponent implements OnInit {
  id: number;
  form: FormGroup;
  flow: any[] = [];
  detail = null;
  flowDT: MatTableDataSource<any> = new MatTableDataSource([]);
  PregradoDT: MatTableDataSource<any> = new MatTableDataSource([]);
  PostgradoDT: MatTableDataSource<any> = new MatTableDataSource([]);
  CompetenciasDTO: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumnsPregrado:string[]=[
    "carrera",
    "grado"
  ]
  displayedColumnsPostgrado:string[]=[
    "carrera",
    "grado"
  ]
  displayedColumns1: string[] = [
    "NameCompetence",
    "Level1",
    "Level2",
    "Level3",
    "Level4",
  ];

  displayedColumns: string[] = [
    "nro",
    "origen",
    "destino",
    "inicio",
    "fin",
    "tiempo",
    "estado",
    "comentario",
  ];

  permiss: Acciones = null;
  storage = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
  positionApplicant: number = 0;
  jefe: number = 0;
  commentInput = new FormControl('');

  state: number = 0;
  level: number = 0;
  configuration: ConfigurationRecruitment = null;
  idprofile: number;
  textoCompetencias: string = '';
  competencias: any[] = [];
  
  lstcategorias: any[] = [];
  categoriasFC = new FormControl("");
  groosssalaryFC = new FormControl('');
  subjectEmail: String='';
  idAreaNotify: number;
  IdRequest: number;
  buttonpublicar: string = '';
  profileLiderTalento: any[] = [];
  perfilSelectAreaPosition: any[] = [];
  mostrarCategoria: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _service: RecruitMentPersonnelService,
    private _router: Router,
    private cargoService: CargoService,
    public dialog: MatDialog,
    private salaryBandService: SalaryBandService,
    private snack: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.id = this._route.snapshot.params.id;
    this.IdRequest=this._route.snapshot.params.id;
    this.profileLiderTalento = environment.perfilTalento;
    this.perfilSelectAreaPosition = environment.perfilSelectAreaPosition;
    this.GetrequestById();
  }

  ngOnInit(): void {
    this.GetRequestFlow();
    this.GetEmployeeChargeByUser();
    this.getListGroupSalary();
  }

  GetRequestFlowConfiguration(origen: number, nivel: number): void {
    this._service.GetRequestFlowConfiguration(origen,nivel).subscribe(resp => {
      
      this.configuration = resp;
      this.permiss = this._service.getPermissByRol(this.configuration );
    })
  }

  GetEmployeeChargeByUser(): void {
    this._service.GetEmployeeChargeByUser().subscribe(resp => {
      
      this.positionApplicant = resp.idApplicant;

      this.cargoService.getJefeByCargo(this.positionApplicant).subscribe(res => {
        
           this.jefe = res.data;
      })
    })
  }

  GetRequestFlow(): void {
    this._service.GetRequestFlow(this.id).subscribe((resp) => {
      
      this.flow = resp;
      this.flowDT = new MatTableDataSource(this.flow);
    });
  }

  GetrequestById(): void {
    
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    
    const idposition: number = storage.nid_profile;
    this._service.getrequestById(this.id).subscribe((resp) => {
      
      const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
      this.idprofile = storage.nid_profile;
      
      this.buttonpublicar = resp.publicado !== 0 ? 'Editar Anuncio' : 'Publicar Anuncio'
      this.detail = resp;
      this.PregradoDT = new MatTableDataSource(this.detail.lstPregrado);
      this.PostgradoDT = new MatTableDataSource(this.detail.lstPostgrado);
      this.state = this.detail.state;
      this.level = this.detail.nid_nivel;
      
      this.GetRequestFlowConfiguration(idposition, this.detail.nid_nivel);        
      this.loadCompetenciaByCargo(this.detail.chargerequired);
      this.mostrarCategoria = this.perfilSelectAreaPosition.indexOf(this.idprofile) > -1 && this.detail.nid_profile_aprovver == 20;
    });
  }

  update() {
    const payload = {
      Id: this.detail.nid_request,
      State: 2,
      ContractTime: this.detail.contractTime,
      Vacancy: this.detail.vacancy,
      UserRegister: this.detail.userRegister,
      Employment: this.detail.employment,
      DescriptionEmployment: this.detail.descriptionEmployment,
      Requirements: this.detail.requirements,
      Functions: this.detail.functions,
      Salary: this.detail.salary
    }
    this._service.Update(payload).subscribe(resp => {
      this._router.navigate([`humanmanagement/recruitment-person-external/${this.detail.ntype}`], {
        skipLocationChange: true
      });
    })
  }

  save(option: boolean): void {
    let state: number;

    let level: number;
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idposition: number = storage.nid_profile;
    
    switch (idposition) {
      case ProfileCode.APPLICANT:
        level = 1
        break;
      case ProfileCode.AREA:
        state = option ? 2 : 4;
        level = 3;
        this.jefe = 49;
        break; 
      case ProfileCode.RRHH:
        level = 4;
        if( option === true ) {
          state = 3;
        } else {
          state = 4;
        }
          break;   
        default:
        break;
    }

    if(environment.perfilTalento.indexOf(idposition) > -1) {
      if( option === true ) {
        state = 3;
      } else {
        state = 4;
      }
    }

    let id_group = this.categoriasFC.value;
    let grooss_salary = this.groosssalaryFC.value;
    const payload = {
      Id: this.detail.nid_request,
      State: state,
      ContractTime: this.detail.contractTime,
      Vacancy: this.detail.vacancy,
      UserRegister: this.detail.userRegister,
      Employment: this.detail.employment,
      DescriptionEmployment: this.detail.descriptionEmployment,
      Requirements: this.detail.requirements,
      Functions: this.detail.functions,
      Salary: this.detail.salary,
      Level: level,
      IdGroup:Number(id_group),
      GroossSalary:Number(grooss_salary),
      IdProfile:Number(this.idprofile),
      IdCharge:Number(this.detail.chargerequired),
      IdAreaPosition:Number(this.detail.nid_area_position),
      IdCompany:Number(this.detail.nid_company)
    }
    
    this._service.Update(payload).subscribe(resp => {
      const payloadFlow = {
        Id: this.detail.nid_request,
        IdOriginArea: storage.nid_position,
        IdDestinationArea: this.jefe,
        State: state,
        Comment: this.commentInput.value,
        UserRegister: this.storage.id
      }
      
      
      this._service.CreateFlow(payloadFlow).subscribe(resp2 => {
       
        this.SendEmailNotification(storage.nid_profile,this.jefe);
      });

    })
  }

  loadCompetenciaByCargo(_id: number) {
    this.cargoService.getCompetenciaByCargo(this.IdRequest, _id, 1).subscribe(
      (resp) => {
      
        this.competencias = resp.data;
        this.CompetenciasDTO = new MatTableDataSource(this.competencias);
        this.competencias.forEach((competencia: any) => {
          if(competencia.nidSelected == 1) {
            this.textoCompetencias += competencia.nameProficiency + ' - Nivel: ' + competencia.idLevel + '<br>';
          }
      });
      },
      (err) => {},
      () => {}
    );
  }

  onCreate(){
    
  }
  message: string;
 resultConfirm: boolean;
  textoBoton: string;

  
  openDialogAprobar(): void {
    let idgroup = this.categoriasFC.value;
    
    if(this.mostrarCategoria) {
      if(idgroup===null || idgroup===0 || idgroup===''){
        this.snack.open("¡Debe seleccionar la Categoria!", "OK", { duration: 4000 });
        return;
      }
      let groosssalary = this.groosssalaryFC.value;
    }

    this.message="¿Estás seguro de aprobar?";
    this.resultConfirm=true;
    this.textoBoton="Aprobar";
    let _textoAdicional = '';
    let _textoAdicional2 = '';
    let _altoDialog = '182px';
    if (this.mostrarCategoria) {
      // _altoDialog = '255px',
      _altoDialog = '270px',
      _textoAdicional = 'Antes de aprobar, recuerda editar el campo ';
      _textoAdicional2 = ' para asignar la Banda Salarial del puesto y su Salario Bruto';
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '656px',
      height: _altoDialog,
      data:{message: this.message, 
            messageAditional: _textoAdicional,
            messageAditional2: _textoAdicional2,
            result: this.resultConfirm,
            textButton:this.textoBoton},
    });

    dialogRef.afterClosed().subscribe(resp => {
      
      if(resp.result){
        
        this.save(true);
      }
      

    });

  }

  openDialogRechazar(): void {
    this.message="¿Estás seguro de rechazar?";
    this.resultConfirm=false;
    this.textoBoton="Rechazar";
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '656px',
      height:'346px',
      data:{message: this.message, result:this.resultConfirm,textButton:this.textoBoton},
    });

    dialogRef.afterClosed().subscribe(resp => {
      if(resp.result==false){
        if((resp.comment == "" || resp.comment == null || resp.comment == 'undefined')){
          Swal.fire({
            icon: 'info',
            text: 'El comentario es obligatorio'
          });
          this.openDialogRechazar();
          return;
        }
        this.commentInput.setValue(resp.comment);
        
        this.save(false);
      }

    });

  }
  getListGroupSalary() {
    this.salaryBandService.getListGroupSalary().subscribe((resp) => {
      this.lstcategorias = resp.data;
    });
  }

  public transform(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
  }

  SendEmailNotification(idArea,idReceptor){
   
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idposition: number = storage.nid_profile;
    let isOption=0;
    switch (idposition) {
      case ProfileCode.APPLICANT:
       
        break;
      case ProfileCode.AREA:
        isOption=1;
        break; 
      case ProfileCode.CONTROLLER:
          break;
      case ProfileCode.RRHH:
        isOption=2;
          break;   
      default:
        break;
    }
    const storageUser = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    
    let isApprovatedRRHH=false;
    this.subjectEmail="";
    if(storageUser.nid_profile == 20){
      idArea=19;
      this.subjectEmail="Solicitud Aprobada";
      idReceptor=0;
      isApprovatedRRHH=true;
    }else{
      idArea=idArea;
      this.subjectEmail="Solicitud Pendiente Por Aprobar";
      idReceptor=idReceptor;
    }

    const payloadEmail = {
      Id: Number(this.IdRequest),
      IdArea: idArea,
      IdCompany:this.detail.nid_company,
      IdPerson:storageUser.nid_person,
      Subject:this.detail.sname,
      Body: "",
      SendDate:new Date(),
      Active: true,
      IdReceptor: idReceptor,
      IsApprovedRRHH:isApprovatedRRHH,
      IdUser:storageUser.id,
      IsOption:isOption 
    }

    this.notificationService.addNotificationApproved(payloadEmail).subscribe(
      (res) => {
        if (res.stateCode == 200) {
          this.snack.open("¡Notificación enviada!", "OK", { duration: 4000 });
        } else if (res.stateCode == 2) {
          this.snack.open(res.messageError[0], "OK", { duration: 4000 });
        } else {
          this.snack.open("Ocurrio un error en el servidor, al momento de enviar la notificación.", "Error", { duration: 4000 });
        }
      },
      (err) => {console.error(err);},
      () => {
        
        this._router.navigate([`humanmanagement/recruitment-person-external/${this.detail.ntype}`], {
          skipLocationChange: true
        });
      }
    );

    
  }


}
