import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PerformanceService } from '@app/data/service/performance.service';
import * as _moment from "moment";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ModalObjectiveComponent} from "./modal-objective/modal-objective.component";
import {ModalCompetitionComponent} from "./modal-competition/modal-competition.component";
import { ContactQueryFilter } from "@app/data/schema/contact/ContactQueryFilter";
import { StylePaginatorDirective } from "@app/shared/directives/style-paginator.directive";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-campaign-evaluation-detail',
  templateUrl: './campaign-evaluation-detail.component.html',
  styleUrls: ['./campaign-evaluation-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CampaignEvaluationDetailComponent implements OnInit {
  
  @ViewChild('drawer') drawer: TemplateRef<any> ;
  @ViewChild('drawerCompt') drawerCompt: TemplateRef<any> ;
  @ViewChild('DetailDialog') DetailDialog: TemplateRef<any>;
  @ViewChild('DetalleEvaluacion') DetalleEvaluacion: TemplateRef<any>;
  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  id: number = 0;
  header: any = null;
  object: any[] = [];
  competencias: any[] = [];
  detail: any[] = [];
  campaign:any={};
  timePart: number = 0;
  numberAction: number = 0;
  idEvaluated: number = 0;
  idEvaluator: number = 0;

  idUser: number = 0;

  isObjectiveNew =false;
  form: FormGroup;
  
  isRead: boolean = true;
  stringButton = '';
  isAceptep: boolean = false;
  noEdit: boolean = false;

  
  objectFC: any = [];
  indicadorFC: any = [];
  metaFC: any = [];
  metaFCText:any=[];
  weightFC: any = [];
  avanceFC: any = [];
  fechainiFC: any = [];
  fechafinFC: any = [];

  objective:any;
  listObjectiveNew:any=[];

  selIdObject: any;
  selObjectFC: any;
  selIndicadorFC: any;
  selMetaFCText:any;
  selMetaFC: any;
  selWeightFC: any;
  selAvanceFC: any;
  selFechainiFC = new FormControl('');
  selFechafinFC= new FormControl('');



  qualificationFC: any = [];
  numberActionFC: any = [];
  indicatorCompeFC: any = [];
  fechainiCompeFC: any = [];
  fechafinCompeFC: any = [];
  dateIngreso = new FormControl(new Date());
  commentInput = new FormControl('');
  fechaFin: Date;
  public fechaArmadaFIN:any;
  public fechaArmadaINI:any;
  fechaIni: Date;
  competencia:string = "";
  competition:any;

  anchoPopup: number = 100;

  selqualificationFC: any;
  selindicatorCompeFC: any;
  selnumberActionFC: any;
  selfechainiCompeFC = new FormControl('');
  selfechafinCompeFC= new FormControl('');
  listQualificationDATA:any=[];

  
  hideComment: boolean = true;

  endDateGlobal = null;

  objectDT: MatTableDataSource<any> = new MatTableDataSource([]);
  competenciasDT: MatTableDataSource<any> = new MatTableDataSource([]);

  displayedColumns: string[] = ["clean","fechainicio", "fechafin", "object", "indicador", "meta","goalstring", "peso","resultado"];

  
  displayedColumnsCompetencias: string[] = ["clean","competencias", 'acciones','indicador', 'fechainicio', 'fechafin','calificacion'];

  columnsToDisplayWithExpand = [...this.displayedColumnsCompetencias,'expandir'];
  expandedElement:CompetenciasElemet | null;

  stringAddObjetive ="Agregar Objetivo";
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  contactFilter= <ContactQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }};
  idprofileuser : string ="0";
  perfileseditores=["20","21","23"]



 resumencompetencias1=[];
 resumencompetencias2=[];
 resumencompetencias3=[];
 resumencompetencias4=[];

 public enableDelete:boolean = true;
 public enableAdd:boolean = true;
 public enableEdit:boolean = true;

 public disableObjetiveFields:boolean = false;
 tempdisableObjetiveFields:boolean=false;
 disableWeight :boolean= false;


 public disableCompFields:boolean= false;
 screenWidth: number;
 detalleDialog: any;
 responsive = false;
 selectedIndex = 0;


  constructor(
    private _route: ActivatedRoute,
    private _fs: FormBuilder,
    private _router: Router,
    private _service: PerformanceService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.id = this._route.snapshot.params.id;
    console.log("🚀 ~ CampaignEvaluationDetailComponent ~ this.id:", this.id)
    const user = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
    this.idUser = user.id;
    this.fechaIni = new Date();

    this.idprofileuser = user.nid_profile.toString();
  }

  ngOnInit(): void {
    this.getEvaluationDetail();

    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 600){
      this.responsive = true; 
    } 

    if (this.screenWidth <= 700 )
      this.anchoPopup = 100;
    else if (this.screenWidth > 700 && this.screenWidth <= 1000)
      this.anchoPopup = 70;
    else if (this.screenWidth > 1000)
      this.anchoPopup = 50;

    
    this.getListQualification();
  }
  initForm(): void {
    this.form = this._fs.group({
      dateInit: ["", [Validators.required]],
      dateEnd: ["", [Validators.required]],
    });
  }
  changeFecIni(event, i) {
    this.fechaFin = event.value;
  }

  valideKey(evt) {

    if(Number(this.qualificationFC.value)>4){
      return false;
    }else{
      return true;
    }   
}

  getEvaluationDetail(): void {
    this.stringButton="";
    this.weightFC = [];
    this.object = [];
    this.competencias = [];
    this._service.getEvaluationDetail(Number(this.id)).subscribe(resp => {
      console.log("🚀 ~ CampaignEvaluationDetailComponent ~ this._service.getEvaluationDetail ~ resp:", resp)
      this.getCampaign(resp.header.idCampaign);
      this.header = resp.header;
      this.dateIngreso = new FormControl(new Date(this.header.admissionDate));

      this.timePart = this.header.timePart;
      this.numberAction = this.header.numberAction;
      this.idEvaluated = this.header.idUserEvaluated;
      this.idEvaluator = this.header.idUserEvaluator;
      this.endDateGlobal = this.header.endDate;


      
      

      // let stepsvalids =["1","3","7","11"]
      let stepsvalids =["1","4","7","11"]

      
      this.resumencompetencias1 = resp.details.filter(x => x.idGroup === 2 && x.qualification>=0.5 && x.qualification<=1.5 && stepsvalids.indexOf(x.numberAction.toString()) !== -1);

      
      this.resumencompetencias2 = resp.details.filter(x => x.idGroup === 2 && x.qualification>=2 && x.qualification<=2.5  && stepsvalids.indexOf(x.numberAction.toString()) !== -1);

      
      this.resumencompetencias3 = resp.details.filter(x => x.idGroup === 2 && x.qualification>=3 && x.qualification<=3.5  && stepsvalids.indexOf(x.numberAction.toString()) !== -1);
      
      this.resumencompetencias4 = resp.details.filter(x => x.idGroup === 2 && x.qualification=== 4  && stepsvalids.indexOf(x.numberAction.toString()) !== -1);



      if ( this.numberAction != 1 ) {
        this.noEdit = true;
      } else {
        this.noEdit = false;
      }


      switch (this.timePart) {
        case 0:

          this.displayedColumns = ["clean","fechainicio", "fechafin", "object", "indicador","goalstring" ,"meta", "peso"];
          if (this.numberAction === 1) { 
            this.stringButton = 'Finalizar';
            this.isAceptep = false;
            if(this.idUser == this.idEvaluated ) 
              this.isRead = false;
            else
              this.isRead = true;

            if (this.idUser == this.idEvaluator && this.perfileseditores.indexOf(this.idprofileuser) === -1){
              this.stringButton ='' 
            }

          } else if (this.numberAction === 2) {

            this.isAceptep = false;
            this.stringButton = 'Terminar y Concensuar';
            if(this.idUser === this.idEvaluator){
              this.isRead = false;
            }else{
              this.isRead = true;

            }

          } else if (this.numberAction === 3) {
            this.isAceptep = false;
            this.stringButton = 'Concensuar'
            if (this.idUser === this.idEvaluator) {
              this.isRead = false;
            } else {
              this.isRead = true;
            }
          } else if (this.numberAction === 4) {
            if (this.idUser === this.idEvaluated) {
              this.isRead = true;
              this.isAceptep = true;
            } else {
              this.isRead = true;
              this.isAceptep = false;
            }
            if (this.perfileseditores.indexOf(this.idprofileuser) !== -1){
              this.isAceptep = true;
            }
          }
          break;
        case 1:

          this.displayedColumns = ["clean","fechainicio", "fechafin", "object", "indicador","goalstring", "meta", "peso","resultado"];
          if (this.numberAction === 4) {
            this.isRead = true;
            this.isAceptep = false;


          }

          if (this.numberAction === 5) {
            if (this.idUser === this.idEvaluator) {
              this.isRead = false;
              this.isAceptep = false;
              this.stringButton = 'Finalizar y Concensuar'
              this.disableObjetiveFields= true;
              this.enableDelete=false;
            } else {
              this.isRead = true;
              this.isAceptep = false;
            }
            if (this.perfileseditores.indexOf(this.idprofileuser) !== -1){
              this.isAceptep = false;
              this.stringButton = 'Finalizar y Concensuar'
            }
          }

          if (this.numberAction === 6) {
            if (this.idUser === this.idEvaluator) {
              this.isRead = true;
              this.isAceptep = false;
              this.stringButton = 'Concesuar'
            } else {
              this.isRead = true;
              this.isAceptep = true;
            }
          }

          if (this.numberAction === 7) {
            if (this.idUser === this.idEvaluator &&  this.perfileseditores.indexOf(this.idprofileuser) === -1) {
              this.isRead = true;
              this.isAceptep = false;
              this.disableObjetiveFields= true;
            } else {
              this.isRead = true;
              this.isAceptep = true;
            }
          }

          break;
        case 2:


          this.displayedColumns = ["clean","fechainicio", "fechafin", "object", "indicador","goalstring", "meta", "peso","resultado"];
          if (this.numberAction === 7) {
            this.isRead = true;
            this.isAceptep = false;
          }

          if (this.numberAction === 8) {
            this.stringButton = 'Finalizar'
            this.isAceptep = false;
            if (this.idUser === this.idEvaluated) { 
              this.isRead = false;
            } else {
              this.isRead = true;
            }
          }

          if (this.numberAction === 9) {
            this.isAceptep = false;
            this.stringButton = 'Terminar'
            if (this.idUser === this.idEvaluator) {
              this.isRead = false;
            } else {
              this.isRead = true;
            }
          }

          if (this.numberAction === 10) {
            this.isAceptep = false;
            this.stringButton = 'Finalizar y Concensuar'
            if (this.idUser === this.idEvaluator) {
              this.isRead = false;
              this.isAceptep = false;
              this.disableObjetiveFields= true;
              this.disableWeight= true;
              this.disableCompFields= true;
              this.enableDelete = false;
            } else {
              this.isRead = true;
              this.isAceptep = false;
            }
          }

          if (this.numberAction === 11 && !this.header.isApproved2) {
            if (this.idUser === this.idEvaluated) {
              this.isRead = true;
              this.isAceptep = true;

              this.disableObjetiveFields= true;
              this.disableWeight= true;
              this.disableCompFields= true;


            } else {
              this.isRead = true;
              this.isAceptep = false;
              this.disableObjetiveFields= true;
              this.disableWeight= true;
              this.disableCompFields= true;

              if (this.perfileseditores.indexOf(this.idprofileuser) !== -1){
                this.isAceptep=true;
              }
            }


          }

          if (this.numberAction === 11 && this.header.isApproved2) {
            this.isRead = true;
            this.isAceptep = false;

            this.disableObjetiveFields= true;
            this.disableWeight= true;
            this.disableCompFields= true;

          }
   

          break;
        default:
      }
      
      if (this.perfileseditores.indexOf(this.idprofileuser) !== -1){
        this.enableAdd = true;
        this.enableDelete = true;
        this.enableEdit = true;
        this.isRead =false;


        this.disableObjetiveFields=false;
        this.disableWeight=false;
        this.disableCompFields=false;


      }
   

      let arrayDelete = [];
      resp.details.map((e, i) => {
        if (e.idGroup === 1) {
          if (this.isRead) {
            if (e.jobObjectives === null) {
              arrayDelete.push(e);
            }
          }
        }
      })
      

      arrayDelete.map(e => {
        const index = resp.details.findIndex(v => v === e);
        resp.details.splice(index, 1);
      })
      

      resp.details.map((e, i) => {
        
        if (e.idGroup === 1) {
          if (e.goal > 0) {
            e.goal = e.goal
          } else {
            e.goal = null;
          }

          if (e.weight > 0) {
            e.weight = e.weight
          } else {
            e.weight = null;
          }
        }
        

        
        if (e.startDate != null) {

          const fechaDate = this.GetDateFormat(e.startDate)

          e.startDate = fechaDate;
        }

        if (e.endDate != null) {

          const fechaDate = this.GetDateFormat(e.endDate)

          e.endDate = fechaDate;
        }
        

        switch (this.header.numberAction) {
          case 1:
            if (e.numberAction === 1) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 2:
            if (e.numberAction === 2) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 3:
            if (e.numberAction === 3) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 4:
            if (e.numberAction === 4) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 5:
            if (e.numberAction === 5) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 6:
            if (e.numberAction === 6) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 7:
            if (e.numberAction === 7) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 8:
            if (e.numberAction === 8) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 9:
            if (e.numberAction === 9) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 10:
            if (e.numberAction === 10) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          case 11:
            if (e.numberAction === 11) {
              if (e.idGroup === 1) {
                this.object.push(e);
              } else {
                this.competencias.push(e);
              }
            }
            break;
          default:
            break;
        }
      })



      this.object.map(v => {
        this.weightFC.push(v.weight)
        this.avanceFC.push(v.progress)
        this.objectFC.push(v.jobObjectives);
        this.indicadorFC.push(v.indicatorOrganizational);
        this.metaFC.push(v.goal);

        this.metaFCText.push(v.goalString);

        this.fechainiFC.push(new FormControl(v.startDate))
        this.fechafinFC.push(new FormControl(v.endDate))
      })


      this.competencias.map(v => {
        this.qualificationFC.push(new FormControl(v.qualification, [Validators.required]))
        this.numberActionFC.push(new FormControl(v.actionsToImprove, [Validators.required]));
        this.indicatorCompeFC.push(new FormControl(v.indicatorOrganizational, [Validators.required]));
        this.fechainiCompeFC.push(new FormControl(v.startDate, [Validators.required]));
        this.fechafinCompeFC.push(new FormControl(v.endDate, [Validators.required]))
      })




      this.objectDT = new MatTableDataSource(this.object.filter(x => x.jobObjectives !== null));
      this.competenciasDT = new MatTableDataSource(this.competencias);
    })
  }

  GetDateFormat(value): Date {
    const fecha = value.split('/');

    const day = Number(fecha[0]);
    const month = Number(fecha[1]);
    const year = Number(fecha[2]);
    const fechaDate = new Date(year, month - 1, day);
    return fechaDate
  }

  back(): void {
    this._router.navigate(['/humanmanagement/campaing-evaluation', this.header.idCampaign], {
      skipLocationChange: true
    })
  }

  deleteSpaceObject(value, index: number): void {
    if (value != null) {
      this.objectFC[index] = value.trimLeft();
    }
  }

  save(IsCompleted: boolean): void {

    let DateToday = new Date();

    if (IsCompleted) {

      let isValidForm: boolean = false;
      let isValidCalificacion: boolean = false;
      let isNumberActionFC: boolean = false;
      let isIndicatorCompeFC: boolean = false;
      let IsfechainiCompeFC: boolean = false;
      let IsfechafinCompeFC: boolean = false;



      

      this.objectFC.map((e, i) => {
        if (e != null && e != '') {


          if (this.indicadorFC[i] != null && this.indicadorFC[i] != '') {


            if (this.metaFC[i] != null && this.metaFC[i] > 0) {


              if ( (this.weightFC[i] != null && this.weightFC[i] > 0) || this.weightFC[i] != undefined ) {
                

                if (this.avanceFC[i] != null || this.avanceFC[i] != undefined) {


                  if (this.fechainiFC[i].value != null) {

                    if (this.fechafinFC[i].value != null) {
                      isValidForm = true;

                    } else {

                      isValidForm = false;
                      return;
                    }

                  } else {

                    isValidForm = false;
                    return;
                  }

                } else {

                  isValidForm = false;
                  return;
                }



              } 

            } else {

              isValidForm = false;
              return;
            }

          } else {
            isValidForm = false;
            return;
          }

        }
      })
      

      
      this.qualificationFC.map(e => {
        if (e.invalid) {
          isValidCalificacion = false
          return e.markAllAsTouched();
        } else {
          isValidCalificacion = true;
        }
      })
      

      
      this.numberActionFC.map((e,i) => {
        if (e.invalid) {
          isNumberActionFC = false
          return e.markAllAsTouched();
        } else {
          isNumberActionFC = true;
        }
      })
      
      let count = 0;
      this.weightFC.map(e => {
        if (e === null) {
          count = count + 0;
        } else {
          count = count + e;
        }

      })

      
        if ( count != 100 ) {
          this.snack.open("Es necesario que la suma de todos los pesos sea siempre igual a 100", "OK", {
            duration: 4000,
          });
          return;
        }
      

      this.indicatorCompeFC.map(e => {
        if (e.invalid) {
          isIndicatorCompeFC = false
          return e.markAllAsTouched();
        } else {
          isIndicatorCompeFC = true;
        }
      })

      this.fechainiCompeFC.map(e => {

        if (e.invalid) {
          IsfechainiCompeFC = false
          return e.markAllAsTouched();
        } else {
          IsfechainiCompeFC = true;
        }

      })

      this.fechafinCompeFC.map(e => {

        if (e.invalid) {
          IsfechafinCompeFC = false
          return e.markAllAsTouched();
        } else {
          IsfechafinCompeFC = true;
        }

      });
      if(this.object.filter(x => x.jobObjectives !== null).length<3){
        this.snack.open('Tiene que registrar como mínimo 3 objetivos', "OK", {
          duration: 4000,
        });
        return;
      }


      if (!isValidForm || !isValidCalificacion || !isNumberActionFC || !isIndicatorCompeFC || !IsfechainiCompeFC || !IsfechafinCompeFC) {

        this.snack.open('Al formulario le faltan datos por completar', "OK", {
          duration: 4000,
        });
      } else {

        let list_detail: any[] = [];

        let nObjetivosSinResultado  : number=0;
        let nObjetivosVencidosSinResultado:number=0;
        this.object.map((e, i) => {

          list_detail.push({
            IdEvaluationDetail: e.idEvaluationDetail,
            Qualification: e.qualification,
            ActionsToImprove: e.actionsToImprove,
            Indicator: 0,
            StartDate: this.fechainiFC[i].value,
            EndDate: this.fechafinFC[i].value,
            JobObjectives: this.objectFC[i],
            IndicatorOrganizational: this.indicadorFC[i],
            goalString: this.metaFCText[i],
            Goal: Number(this.metaFC[i]),
            Weight: Number(this.weightFC[i]),
            Progress: Number(this.avanceFC[i])
          });

          if ( this.timePart== 1){
            if (this.fechafinFC[i].value !== null){
              if ( DateToday >this.fechafinFC[i].value  )
              {

                
                if (Number(this.avanceFC[i]) ===0){
                  nObjetivosVencidosSinResultado++;
                }
              }
            }
          }

          
          if ( this.timePart== 2){

            if (Number(this.avanceFC[i]) ===0 && this.objectFC[i]!== null){
              nObjetivosSinResultado++;
            }
          }
        })

        let nCompetenciasSinCalificacion :number=0;
        let nCompetenciasVencidasSinResultado:number=0;


        this.competencias.map((e, i) => {
          list_detail.push({
            IdEvaluationDetail: e.idEvaluationDetail,
            Qualification: Number(this.qualificationFC[i].value),
            ActionsToImprove: this.numberActionFC[i].value,
            Indicator: 0,
            StartDate: this.fechainiCompeFC[i].value,
            EndDate: this.fechafinCompeFC[i].value,
            JobObjectives: e.jobObjectives,
            IndicatorOrganizational: this.indicatorCompeFC[i].value,
            Goal: Number(e.goal),
            Weight: Number(e.weight),
            Progress: 0 
          });


          if ( this.timePart== 1){
            if (this.fechafinCompeFC[i].value !== null){
              if ( DateToday >this.fechafinCompeFC[i].value  )
              {

                
                if (Number(this.qualificationFC[i].value) ===0){
                  nCompetenciasVencidasSinResultado++;
                }
              }
            }
          }


        })

        if (nObjetivosVencidosSinResultado>0 || nCompetenciasVencidasSinResultado>0){
          this.snack.open("Todos los objetivos y competencias deben tener un resultado o calificación cuando su Fecha Fin ya venció.", "OK", { duration: 4000 });
          return;

        }


        const payload = {
          IdEvaluation: this.header.idEvaluation,
          IsCompleted: IsCompleted,
          list_detail: list_detail
        }

        if ( nObjetivosSinResultado >0  || nCompetenciasSinCalificacion>0){

          this.snack.open("Todos los objetivos deben tener resultado mayor a 0.", "OK", { duration: 4000 });
          return;
        }
        
        this._service.UpdateEvaluatioons(payload).subscribe(resp => {

          if (this.numberAction === 1) {
            this.snack.open("Tu evaluación ha sido enviada a tu jefe de manera exitosa. ¡Gracias por tu participación!", "OK", {
              duration: 4000,
            });
          }

     
          
          this.getEvaluationDetail();
          this.snack.open(resp.messageError[0], "OK", {
            duration: 4000,
          });
        })
      }


    } else {
      let list_detail: any[] = [];
      let nObjetivosSinResultado  : number=0;
      let nObjetivosVencidosSinResultado:number=0;

      let count = 0;
      this.weightFC.map(e => {
        if (e === null) {
          count = count + 0;
        } else {
          count = count + e;
        }

      })

      if (this.timePart > 0) {
        if ( count != 100 ) {
          this.snack.open("Es necesario que la suma de todos los pesos sea siempre igual a 100", "OK", {
            duration: 4000,
          });
          return;
        }
      }


      this.object.map((e, i) => {
        list_detail.push({
          IdEvaluationDetail: e.idEvaluationDetail,
          Qualification: e.qualification,
          ActionsToImprove: e.actionsToImprove,
          Indicator: 0,
          StartDate: this.fechainiFC[i].value,
          EndDate: this.fechafinFC[i].value,
          JobObjectives: this.objectFC[i],
          IndicatorOrganizational: this.indicadorFC[i],
          GoalString: this.metaFCText[i],
          Goal: Number(this.metaFC[i]),
          Weight: Number(this.weightFC[i]),
          Progress: Number(this.avanceFC[i])
        });



        if ( this.timePart== 1){
          if (this.fechafinFC[i].value !== null){
            if ( DateToday >this.fechafinFC[i].value  )
            {

              if (Number(this.avanceFC[i]) ===0){
                nObjetivosVencidosSinResultado++;
              }
            }
          }
        }

     

        if ( this.timePart== 2 && this.numberAction>7){
          if (Number(this.avanceFC[i]) ===0 && this.objectFC[i]!== null){
            nObjetivosSinResultado++;
          }
        }
      });

      let nCompetenciasSinCalificacion :number=0;
      let nCompetenciasVencidasSinResultado:number=0;

      this.competencias.map((e, i) => {
        list_detail.push({
          IdEvaluationDetail: e.idEvaluationDetail,
          Qualification: Number(this.qualificationFC[i].value),
          ActionsToImprove: this.numberActionFC[i].value,
          Indicator: 0,
          StartDate: this.fechainiCompeFC[i].value,
          EndDate: this.fechafinCompeFC[i].value,
          JobObjectives: e.jobObjectives,
          IndicatorOrganizational: this.indicatorCompeFC[i].value,
          Goal: Number(e.goal),
          Weight: Number(e.weight),
          Progress: 0 
        });





        if ( this.timePart== 1){
          if (this.fechafinCompeFC[i].value !== null){
            if ( DateToday >this.fechafinCompeFC[i].value  )
            {

              
              if (Number(this.qualificationFC[i].value) ===0){
                nCompetenciasVencidasSinResultado++;
              }
            }
          }
        }


      });

      if (nObjetivosVencidosSinResultado>0 || nCompetenciasVencidasSinResultado>0){
        this.snack.open("Todos los objetivos y competencias deben tener un resultado o calificación cuando su Fecha Fin ya venció.", "OK", { duration: 4000 });
        return;

      }

    


      const payload = {
        IdEvaluation: this.header.idEvaluation,
        IsCompleted: IsCompleted,
        list_detail: list_detail
      }

      this._service.UpdateEvaluatioons(payload).subscribe(resp => {

        this.getEvaluationDetail();
        this.snack.open(resp.messageError[0], "OK", {
          duration: 4000,
        });
      })
    }



  }



  aceptcomemntorno(): void {
    if (this.hideComment) {

      if (this.commentInput.invalid) {
        this.snack.open("Es necesario ingresar un comentario", "OK", {
          duration: 4000,
        });
        return
      } else {
        this.aceptwithcomment();
      }


    } else {
      this.acept();
    }
  }

  acept(): void {


    const payload = {
      IdEvaluation: this.header.idEvaluation,
      IsCompleted: true,
      IsApproved: true,
      Observation: null,
      list_detail: [],

    }

    this._service.UpdateEvaluatioons(payload).subscribe(resp => {
      this.getEvaluationDetail();
      this.snack.open(resp.messageError[0], "OK", {
        duration: 4000,
      });
    })
  }

  aceptwithcomment(): void {

    const payload = {
      IdEvaluation: this.header.idEvaluation,
      IsCompleted: true,
      IsApproved: true,
      Observation: this.commentInput.value,
      list_detail: []
    }

    this._service.UpdateEvaluatioons(payload).subscribe(resp => {

      this.getEvaluationDetail();
      this.snack.open(resp.messageError[0], "OK", {
        duration: 4000,
      });
    })
  }

  clearInputs(i: number): void {
    this.objectFC[i] = null;
    this.indicadorFC[i] = null;
    this.metaFC[i] = null;
    this.weightFC[i] = null;
    this.avanceFC[i] = null;
    this.fechainiFC[i] = new FormControl('');
    this.fechafinFC[i] = new FormControl('');
  }

  validEndDateOne(index) {
    const valueStart = this.fechainiFC[index].value;
    const valueEnd = this.fechafinFC[index].value;
    if (valueStart != null) {

      const valueStartDate = new Date(valueStart);
      const valueEndDate = new Date(valueEnd);

      const valid = valueEndDate > valueStartDate;

      if (!valid) {
        this.snack.open("¡Es necesario que la fecha fin sea mayor a la fecha inicio!", "OK", { duration: 4000 });
        this.fechafinFC[index].setValue(null);
        this.selFechafinFC.setValue(null);
        return false;
      } else {
        const valueEndGlobal = new Date(this.endDateGlobal);

        if ( valueEnd  > valueEndGlobal ) {
          this.snack.open("¡La fecha Fin de este objetivo no puede ser mayor a la fecha fin de la campaña!", "OK", { duration: 4000 });
          this.fechafinFC[index].setValue(null);
          this.selFechafinFC.setValue(null);
          return false;
        }
      }
      return true;

    } else {
      this.snack.open("¡Es necesario primero seleccionar una fecha inicio!", "OK", { duration: 4000 });
      this.fechafinFC[index].setValue(null);
      this.selFechafinFC.setValue(null);
      return false;
    }

  }

  validEndDate(index): void {
    const valueStart =  this.selfechainiCompeFC.value;
    const valueEnd = this.selfechafinCompeFC.value;

    if (valueStart != null) {

      const valueStartDate = new Date(valueStart);
      const valueEndDate = new Date(valueEnd);

      const valid = valueEndDate > valueStartDate;

      if (!valid) {
        this.snack.open("¡Es necesario que la fecha fin sea mayor a la fecha inicio!", "OK", { duration: 4000 });
        this.fechafinCompeFC[index].value = null;
        this.selfechafinCompeFC.setValue('')
      } 

    } else {
      this.snack.open("¡Es necesario primero seleccionar una fecha inicio!", "OK", { duration: 4000 });
      this.fechafinCompeFC[index].value = null;
      this.selfechafinCompeFC.setValue('')
    }

  }
  addObjetive(){
    this.stringAddObjetive="Agregar objetivo";
    let objectFirst= this.object.find(x => x.jobObjectives === null);
    if(objectFirst == undefined){
      this.snack.open("¡Solo se permite un máximo de 5 objetivos!", "OK", { duration: 4000 });
      return;
    }
    this.isObjectiveNew=true;
    this.objective=this.object.indexOf(objectFirst);
    this.listObjectiveNew.push(this.objective);
    this.selObjectFC = this.objectFC[this.objective];
    this.selIndicadorFC = this.indicadorFC[this.objective];
    this.selMetaFCText = this.metaFCText[this.objective];
    this.selMetaFC = this.metaFC[this.objective];
    this.selWeightFC = this.weightFC[this.objective];
    this.selAvanceFC = this.avanceFC[this.objective];



    this.selFechainiFC = this.fechainiFC[this.objective];
    this.selFechafinFC = this.fechafinFC[this.objective];

   let  bdisableObjetiveFields =this.disableObjetiveFields;
    this.tempdisableObjetiveFields = bdisableObjetiveFields;
    this.disableObjetiveFields=false;

    this.dialog.open(this.drawer);
  }
  editObjective(index){
    let  bdisableObjetiveFields =this.disableObjetiveFields ;
     this.tempdisableObjetiveFields = bdisableObjetiveFields;

    this.isObjectiveNew=false;
    this.objective=index;
    this.stringAddObjetive="Guardar Cambios";
    if(this.timePart>0 && this.listObjectiveNew.find(x=>x ===this.objective)>0){
      this.isObjectiveNew=true;
    }
    
    this.selObjectFC = this.objectFC[index];
    this.selIndicadorFC = this.indicadorFC[index];
    this.selMetaFCText = this.metaFCText[index];
    this.selMetaFC = this.metaFC[index];
    this.selWeightFC = this.weightFC[index];
    this.selAvanceFC = this.avanceFC[index];



    this.selFechainiFC = this.fechainiFC[index];
    this.selFechafinFC = this.fechafinFC[index];
    this.dialog.open(this.drawer);
  }
  closeSidebar(){
    this.selFechainiFC = new FormControl(null);
    
    this.selFechafinFC = new FormControl(null);
    
    
    this.dialog.closeAll();
    if (this.responsive) {
      this.selectedIndex = 0;
      this.dialog.open(this.DetalleEvaluacion,{
        width: '100%',
        maxWidth: '100hv'
      });
    }
    this.isObjectiveNew=false;

    this.disableObjetiveFields = this.tempdisableObjetiveFields;
  }
  valideKeyCode(evt) {
      console.log("🚀 ~ CampaignEvaluationDetailComponent ~ valideKeyAmount ~ evt:", evt)
      
    var code = evt.which ? evt.which : evt.keyCode;
    if (code===36 || code===38 || code===64 || evt.key === "@"  || evt.key === "$"  || evt.key === "&" ) {
      return false;
    }else{
      return true;
    }
    
  }
  
  saveObjetive(){
    if(this.selObjectFC===null || this.selObjectFC.trim()===""){
      this.snack.open("¡Ingrese un objetivo!", "OK", { duration: 4000 });
      return;
    }
    if(this.selIndicadorFC===null || this.selIndicadorFC.trim()===""){
      this.snack.open("¡Ingrese el indicador!", "OK", { duration: 4000 });
      return;
    }
    if(this.selMetaFCText===null || this.selMetaFCText.trim()===""){
      this.snack.open("¡Ingrese la meta (texto)!", "OK", { duration: 4000 });
      return;
    }
    if(this.selMetaFC===null || this.selMetaFC === 0 ){
      this.snack.open("¡Ingrese la meta!", "OK", { duration: 4000 });
      return;
    }

    if (this.selWeightFC === 0 || this.selWeightFC  === null){
      this.snack.open("¡Debe ingresar un Peso mayor a 0 y menor o igual a 100!", "OK", { duration: 4000 });
          return;
    }

    if (this.selWeightFC > 100 ){
      this.snack.open("¡El peso no puede ser mayor a 100!", "OK", { duration: 4000 });
          return;
    }

    if(this.selFechainiFC.value==null )
     {
       this.snack.open("¡Ingrese fecha inicio válida!", "OK", { duration: 4000 });
       return;
     }

     if(this.selFechafinFC.value==null )
      {
        this.snack.open("¡Ingrese fecha fin válida!", "OK", { duration: 4000 });
        return;
      }else if(this.selFechafinFC.value<this.selFechainiFC.value )
      {
        this.snack.open("¡La fecha fin debe ser mayor y/o igual a la fecha inicio!", "OK", { duration: 4000 });
        return;
      }


    this.objectFC[this.objective]= this.selObjectFC;
    this.indicadorFC[this.objective] = this.selIndicadorFC;

    this.metaFCText[this.objective] = this.selMetaFCText;
    this.metaFC[this.objective] = this.selMetaFC;
    this.weightFC[this.objective] = this.selWeightFC;
    this.avanceFC[this.objective] = this.selAvanceFC;

    this.object[this.objective].jobObjectives =this.selObjectFC;
    this.object[this.objective].indicatorOrganizational =this.selIndicadorFC;
    this.object[this.objective].goal =this.selMetaFC;

    this.object[this.objective].goalString =this.selMetaFCText;



    this.object[this.objective].weight =this.selWeightFC;
    this.object[this.objective].progress =this.selAvanceFC;

    this.object[this.objective].startDate =this.formatDatetext( this.selFechainiFC.value );
    this.object[this.objective].endDate = this.formatDatetext( this.selFechafinFC.value );

    this.fechainiFC[this.objective] =  this.selFechainiFC;
    this.fechafinFC[this.objective] = this.selFechafinFC ;


    this.objectDT = new MatTableDataSource(this.object.filter(x=>x.jobObjectives !== null));

    this.closeSidebar();
  }

  formatDatetext(pDate :string){
    let fecha = new Date(pDate)
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())

    return fecha;
  }



  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDateMax(pdate: Date) {

    if (pdate === null){
      return '';
    }
    return [
      this.padTo2Digits(pdate.getDate()),
      this.padTo2Digits(pdate.getMonth() + 1),
      pdate.getFullYear(),
    ].join('/');
  }



  onChangeFechaIni(e){
    this.selFechainiFC =new FormControl(e.value.format("YYYY-MM-DD"));
  }
  onChangeFechaFin(e){

    this.selFechafinFC = new FormControl(e.value.format("YYYY-MM-DD"));
  }
  
  editCompetencia(indexC,row){

    this.competencia = row.organizationalProficiency;

    this.competition=indexC;

    this.selqualificationFC = this.qualificationFC[indexC].value;
    this.selindicatorCompeFC = this.indicatorCompeFC[indexC].value;
    this.selnumberActionFC = this.numberActionFC[indexC].value;
    this.selfechainiCompeFC = this.fechainiCompeFC[indexC];
    this.selfechafinCompeFC = this.fechafinCompeFC[indexC];
    this.dialog.open(this.drawerCompt);
  }
  closeSidebarCompt(){
    this.dialog.closeAll();
    if (this.responsive) {
      this.selectedIndex = 1;
      this.dialog.open(this.DetalleEvaluacion,{
        width: '100%',
        maxWidth: '100hv'
      });
    }
    this.selfechainiCompeFC = new FormControl(null);
    this.selfechafinCompeFC = new FormControl(null);
  }
  onChangeFechaIniCompt(e){
    this.selfechainiCompeFC =new FormControl(e.value.format("YYYY-MM-DD"));
  }
  onChangeFechaFinCompt(e){
    this.selfechafinCompeFC = new FormControl(e.value.format("YYYY-MM-DD"));
    this.validEndDate(this.competition);
  }
  addCompetition(){
    if(this.selfechafinCompeFC.value==null )
     {
       this.snack.open("¡Ingrese fecha fin válida!", "OK", { duration: 4000 });
       return;
     }

     if (this.selqualificationFC>4){
      this.snack.open("La calificación no puede ser mayor a 4.", "OK", { duration: 4000 });
       return;
     }



    this.qualificationFC[this.competition]= new FormControl(this.selqualificationFC);
    this.indicatorCompeFC[this.competition] =new FormControl(`${this.selindicatorCompeFC}`);
    this.numberActionFC[this.competition] = new FormControl(this.selnumberActionFC);

    this.competencias[this.competition].qualification =Number(this.selqualificationFC);
    this.competencias[this.competition].indicatorOrganizational =this.selindicatorCompeFC;
    this.competencias[this.competition].actionsToImprove =this.selnumberActionFC;


    this.competencias[this.competition].startDate =this.formatDatetext(this.selfechainiCompeFC.value); 
    this.competencias[this.competition].endDate = this.formatDatetext(this.selfechafinCompeFC.value);  

    this.fechainiCompeFC[this.competition] = this.selfechainiCompeFC;
    this.fechafinCompeFC[this.competition] = this.selfechafinCompeFC;


    this.competenciasDT = new MatTableDataSource(this.competencias);
    this.closeSidebarCompt();
  }
  changedPageNumber(pagina: number) {
    this.setPage(this.pageSize, pagina);
  }
  setPage(pageSize: number, pageIndex: number) {
    if (this.pageSize !== pageSize){
      this.pageSize = pageSize;
      this.contactFilter.pagination.itemsPerPage = this.pageSize;
      this.contactFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.contactFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.competenciasDT.paginator = this.paginatorx.matPag;
    this.getEvaluationDetail();
  }
  
  deleteObjective(index)
  {
    
    let idObject = this.objectDT.filteredData[index].idEvaluationDetail;
    let indexObject;
    for(let i = 0;i<this.object.length;i++)
    {
      if(this.object[i].idEvaluationDetail==idObject)
        indexObject = i;
    }

    
    this.object[indexObject].weightFC=null;
    this.object[indexObject].avanceFC=null;
    this.object[indexObject].objectFC=null;
    this.object[indexObject].indicadorFC=null;
    this.object[indexObject].metaFC=null;

    this.object[indexObject].metaFCText=null;

    this.object[indexObject].fechainiFC=null;
    this.object[indexObject].fechafinFC=null;


    this.object[indexObject].jobObjectives=null;

    this.objectDT = new MatTableDataSource(this.object.filter(x => x.jobObjectives !== null));

    this.fechainiFC.splice(indexObject,1,new FormControl(null))
    this.fechafinFC.splice(indexObject,1,new FormControl(null))

    this.objectFC.splice(indexObject,1,null)

    this.indicadorFC.splice(indexObject,1,null)
    this.metaFCText.splice(indexObject,1,null)
    this.metaFC.splice(indexObject,1,'0')
    this.weightFC.splice(indexObject,1,null);
    this.avanceFC.splice(indexObject,1,'0')

  }
  load() {
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
}
  getCampaign(id): void {
    this._service.getCampaign(id).subscribe((resp) => {
      this.campaign = resp;

      this.fechaArmadaFIN=this.StringToDate(this.campaign.endDate);
      this.fechaArmadaFIN = new Date(this.fechaArmadaFIN.getTime() + (1000 * 60 * 60 * 24));
      this.fechaArmadaFIN.setDate(this.fechaArmadaFIN.getDate());
      this.fechaArmadaINI=this.StringToDate(this.campaign.startDate);
    });
  }
  StringToDate(string)
  {
    let aux = string.split("/");
    let fechaArmadaString = "";
    for(let i=2;i>-1;i--)
    {
      if(i == 2)
        fechaArmadaString = aux[i] + "-"
      else if(i==1)
        fechaArmadaString += aux[i] + "-"
      else
      fechaArmadaString += aux[i]
    }
    return new Date(fechaArmadaString);
  }


  filter(itemList: any,idproficiency : number) {
    // console.log("🚀 ~ CampaignEvaluationDetailComponent ~ filter ~ itemList:", itemList)
    console.log("🚀 ~ CampaignEvaluationDetailComponent ~ filter ~ idproficiency:", idproficiency)
    
    let result = [];
    itemList.map((e, i) => {
      if (e.idProficiency === idproficiency) {
        result.push(e);

      }
    })

    return result;
  }

  printEvaluationDetail(){
    
    this._service.getPrintEvaluationDetail(Number(this.id)).subscribe(resp => {
      
      this.downLoad(resp.file, "application/pdf",'Detalle_Evaluacion_'+ this.header?.evaluatedName+".pdf");
    });
  }

  downLoad(archivo, contentType, name) {
    let link = document.createElement("a");
    let blobArchivo = this.base64ToBlob(archivo, contentType);
    let blob = new Blob([blobArchivo], { type: contentType });
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ""); 
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  getRound(valor){
    var res= parseFloat(valor).toFixed(2);

    return res;
  }

  
  getListQualification(){
    let list=[
      {  code:0.5,name:"0.5"},
      {  code:1,name:"1"},
      {  code:1.5,name:"1.5"},
      {  code:2,name:"2"},
      {  code:2.5,name:"2.5"},
      {  code:3,name:"3"},
      {  code:3.5,name:"3.5"},
      {  code:4,name:"4"},
    ]
    
    this.listQualificationDATA=list;
   
  }

  openDialog(element: any){
    this.detalleDialog = element;
    this.dialog.open(this.DetailDialog);
  }

  opnDialogEvaluacionDEtalle() {
    this.dialog.open(this.DetalleEvaluacion,{
      width: '100%',
      maxWidth: '100hv'
    });
  }

}

export interface CompetenciasElemet {
  decripcion: string;
  nivel: number;
  definicion: number;
}
