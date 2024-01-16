import { EvaluationPostulantInternalService } from '@app/data/service/evaluation-postulant-internal.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { JobQueryFilter } from './../../../../data/schema/Job/JobQueryFilter';
import { JobService } from './../../../../data/service/job.service';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JwtAuthService } from '@app/shared/services/auth/jwt-auth.service';
import { JobInternalService } from '@app/data/service/jobs-internal.service';
import { RecruitmentLoadMasiveComponent } from './recruitment-load-masive/recruitment-load-masive.component';
import { EvaluationPostulantService } from '@app/data/service/evaluation-postulant.service';
import { RecruitMentPersonnelService } from '@app/data/service/recruitment-personnel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileCode } from '@app/modules/human-management/page/recruitment/enums/cargo.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '@app/data/service/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild('paginatorinternal') paginatorinternal: MatPaginator;

  formFilter: FormGroup;
  flowDT: MatTableDataSource<any> = new MatTableDataSource([]);
  flowInternal: MatTableDataSource<any> = new MatTableDataSource([]);
  user: any;
  displayedColumns: string[] = [
    "action",
    "idrequest",
    "title",
    "state",
    "datefinish",
    "fullName",
    "visits",
    "cvEntry",
    "cvNotRead",
    "type"
  ];

  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  totalRowsIn = 0;
  pageSizeIn = 10;
  currentPageIn= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  filter= <JobQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:10,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, idUser: 0, type: ''};

  filterIntern= <JobQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:10,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, idUser: 0};

  getApplicant = null;
  storage = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
  public sinceDate:any;
  public date = new Date();
  public toDate = new Date();
  typeRequest: any;
  solPendienteExterna:number = 0;
  solPendienteInterna:number = 0;

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
      type: [0],
      nuserregister: [0],
      CurrentPage: [1],
      ItemsPerPage: this.pageSize,// [0],
      TotalItems: [0],
      TotalPages: [1],
      TotalRows: [0],
    });
    
  }

  constructor(private _router: Router, 
              private jobService: JobService, 
              private jwtAuth: JwtAuthService,
              private jobInternalService: JobInternalService,
              private evaluation: EvaluationPostulantService,
              private evaluationIntern: EvaluationPostulantInternalService,
              private _dialog: MatDialog,
              private _service: RecruitMentPersonnelService,
              private snack: MatSnackBar,
              private notificationService: NotificationService,
              private _fs: FormBuilder) { 

                this.initForm();
                this.sinceDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
              }

  ngOnInit(): void {
    this.user = this.jwtAuth.getUser();
    this.loadJobs();
    // this.loadJobsInternal();
    this.GetEmployeeChargeByUser();
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

  getRecruitment(applicant: number): void {
    
    const nid_position = this.storage.nid_profile;
    let flat: number = 0;
    if (nid_position === ProfileCode.APPLICANT ) {
      flat = 2;
      this.formFilter.get('flat').setValue(flat);
      
    }
    this.typeRequest = 1; //1 externa, 2 interna

    this.formFilter.get('type').setValue(this.typeRequest);
    this.formFilter.get('nid_applicant').setValue(applicant);
    this.formFilter.get('dateStart').setValue(this.sinceDate)
    this.formFilter.get('dateEnd').setValue(this.toDate)
    this.formFilter.get('State').setValue(0);
    
    this._service.getRecruitMentPersonnel(this.formFilter.value).subscribe(
      (resp) => {
        
        for(let i=0; i< resp.list.length;i++)
          {
            switch(resp.list[i].state){
              case 2:
                this.solPendienteExterna++;
                break;
            }
          }
      },
      (err) => {},
      () => {
      }
    );

    this.typeRequest = 2; //1 externa, 2 interna

    this.formFilter.get('type').setValue(this.typeRequest);
    
    this._service.getRecruitMentPersonnel(this.formFilter.value).subscribe(
      (resp) => {
        
        for(let i=0; i< resp.list.length;i++)
          {
            switch(resp.list[i].state){
              case 2:
                this.solPendienteInterna++;
                break;
            }
          }
      },
      (err) => {},
      () => {
      }
    );
  }


  loadMasivePostulants(id) {
    let job = id;
    let title = 'Carga Masiva de Postulantes';
    const config = new MatDialogConfig();
    config.width = "800px";
    config.height = "600px";
    config.disableClose = true;
    config.data = {
      title,
      job,
    }

    const modal = this._dialog.open(RecruitmentLoadMasiveComponent, config);
  }

  viewPostulantes(row) {
    if (row.type == "Externa") {
      this._router.navigate([`humanmanagement/recruitment-postulants/${row.id}`], {
        skipLocationChange: true
      })
    } else {
      this._router.navigate([`humanmanagement/postulants-internal/${row.id}`], {
        skipLocationChange: true
      })
    }
  }

  recruitpersonNewExternal(): void {
    this._router.navigate(['humanmanagement/recruitment-person-external/1'], {
      skipLocationChange: true
    })
  }

  recruitpersonNewInternal(): void {
    this._router.navigate(['humanmanagement/recruitment-person-internal/2'], {
      skipLocationChange: true
    })
  }

  loadEvaluationExtern(row) {
    if (row.type == "Externa") {
      this.evaluation.getIdEvaluation(row.id).subscribe(res => {
        this._router.navigate([`humanmanagement/recruitment-evaluation/${res.data}`], {
          skipLocationChange: true
        })
      });
    } else {
      this.evaluationIntern.getIdEvaluation(row.id).subscribe(res => {
        this._router.navigate([`humanmanagement/evaluation-postulants/${res.data}`], {
          skipLocationChange: true
        })
      });
    }
  }

  loadEvaluationIntern(id) {
    this.evaluationIntern.getIdEvaluation(id).subscribe(res => {
      this._router.navigate([`humanmanagement/evaluation-postulants/${res.data}`], {
        skipLocationChange: true
      })
    });
  }

  loadJobs() {
    this.filter.idUser = this.user.id;    
    this.jobService.getJobsUser(this.filter).subscribe(res => {
      
         this.flowDT.data = res.data.list;
         setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length =  res.data.totalItems;
        });
    })
  }

  getInforme() {
    this.evaluation.getJson().subscribe(res => {
      
    })
  
  }



  pageChanged(event: PageEvent) {
    if (this.pageSize !== event.pageSize){
      this.pageSize = event.pageSize;  
      this.filter.pagination.itemsPerPage= this.pageSize;
      this.filter.pagination.currentPage = 1;
      this.currentPage=0;
    }else{
      this.filter.pagination.currentPage = event.pageIndex+1;
      this.currentPage =event.pageIndex;

    }
    this.loadJobs();
  }

  NotificacionNoSeleccionado(row) {
    const _objNotification = {
      idEvaluation: row.idEvaluation,
      type: row.type
    };
    this.notificationService.AddNotificationNotSselected(_objNotification).subscribe((res: any) => {
      Swal.fire({
        icon: 'success',
        text: res.messageError
      });
    }, (err) => {

    },
    () => {});
  }
}
