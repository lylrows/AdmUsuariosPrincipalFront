import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TypeStaffRequestQueryFilter } from "@app/data/schema/StaffRequest/TypeStaffRequestQueryFilter";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "@app/shared/services/app-loader/app-loader.service";
import { StaffRequestService } from "@app/data/service/staff-request.service";
import { reduce } from "rxjs/operators";
import { StaffRequestQueryFilter } from "@app/data/schema/StaffRequest/StaffRequestFQueryFilter";
import { TypeStaffRequestService } from "@app/data/service/typestaffrequest.service";
import { DialogSelectTypeStaffRequestComponent } from "./Dialog/dialog-select-type-staff-request/dialog-select-type-staff-request.component";
import { DialogStaffRequestVacationApproverComponent } from "./Dialog/dialog-staff-request-approver/dialog-staff-request-vacation-approver.component";
import { DialogStaffRequestAdvancementComponent } from "./Dialog/dialog-staff-request-advancement/dialog-staff-request-advancement.component";
import { DialogStaffRequestSalaryComponent } from "./Dialog/dialog-staff-request-salary/dialog-staff-request-salary.component";
import { DialogStaffRequestSepelioComponent } from "./Dialog/dialog-staff-request-sepelio/dialog-staff-request-sepelio.component";
import { DialogStaffRequestMedicalComponent } from "./Dialog/dialog-staff-request-medical/dialog-staff-request-medical.component";
import { DialogStaffRequestPermitEvaluateComponent } from "./Dialog/dialog-staff-request-permit-evaluate/dialog-staff-request-permit-evaluate.component";
import { DialogStaffRequestAccountChangeCtsEvaluateComponent } from "./Dialog/dialog-staff-request-account-change-cts-evaluate/request-account-change-cts-evaluate.component";
import { DialogStaffRequestLoanEvaluateComponent } from "./Dialog/dialog-staff-request-loan-evaluate/dialog-staff-request-loan-evaluate.component";
import { StaffRequestVacationService } from "@app/data/service/staff-request-vacation.service";
import { StaffRequestDownloadPdfService } from "@app/data/service/staff-request-download-pdf.service";
import { DialogStaffRequestAbsenceEvaluateComponent } from "./Dialog/dialog-staff-request-absence-evaluate/dialog-staff-request-absence-evaluate.component";
import { DialogStaffRequestSureComponent } from "./Dialog/dialog-request-sure/dialog-staff-request-sure.component";
import { DialogStaffRequestPlanComponent } from "./Dialog/dialog-staff-request-plan/dialog-staff-request-plan.component";
import { DialogStaffRequestHourExtraComponent } from "./Dialog/dialog-staff-request-hour-extra/dialog-staff-request-hour-extra.component";
import { DialogStaffRequestTrainingNewComponent } from "./Dialog/dialog-staff-request-training-new/dialog-staff-request-training-new.component";
import { DialogStaffRequestTrainingExtraComponent } from "./Dialog/dialog-staff-request-training-extra/dialog-staff-request-training-extra.component";
import { DialogCategoryRequestComponent } from "./Dialog/dialog-category-request/dialog-category-request.component";
import { StylePaginatorDirective } from "@app/shared/directives/style-paginator.directive";
import { ICompanyList } from "@app/data/schema/empresa";
import { EmployeeService } from "@app/data/service/employee.service";
import { AreaService } from "@app/data/service/areas.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-staff-request",
  templateUrl: "staff-request.component.html",
  styleUrls: ['./staff-request.component.scss']
})
export class StaffRequestComponent implements OnInit {
  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public items: any[];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  lstTypeStaffRequest: any[];
  companies: ICompanyList[] = [];
  areas: any[] = [];

  pageSizeOptions: number[] = [5, 10, 25, 100];
  listStatus: any[] = [
    {
      id: 1,
      description: 'Pendiente'
    },
    {
      id: 2,
      description: 'En Proceso'
    },{
      id: 3,
      description: 'Aceptado'
    },{
      id: 4,
      description: 'Rechazado'
    },
  ]

  staffRequestFilter = <StaffRequestQueryFilter>{
    idCompany: 0,
    idArea: 0,
    idStatus: 0,
    idStatusApprove: 2,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      totalRows: 0
    }, idTypeStaffRequest: 0
  };

  displayedColumns: string[] = [
    'option',
    'requestNumber',
    'typeStaffRequest',
    'fullNameEmployee',
    'dateIssue',
    'charge',
    'area',
    'company',
    'stateName',
    'download',
    'approver',
    "deleted"
  ];
  
  public id_desde_notificacion: number = 0;
  urlDesdeNotificacion:any="";
  public dataFromNotificacion: any[];
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private staffRequestService: StaffRequestService,
    private typestaffRequestService: TypeStaffRequestService,
    private staffRequestVacationService: StaffRequestVacationService,
    private _serviceEmployee: EmployeeService,
    private areaService: AreaService,
    private staffRequestDownloadPdfService: StaffRequestDownloadPdfService,
    
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.urlDesdeNotificacion = this.router.parseUrl(this.router.url);
    const user = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    console.log("🚀 ~ StaffRequestComponent ~ user:", user)
    this.id_desde_notificacion = Number(this.urlDesdeNotificacion.queryParams['id']);
    if (Number.isNaN(this.id_desde_notificacion)) {
      this.id_desde_notificacion = 0;
    }
    console.log("🚀 ~ StaffRequestComponent ~ this.id_desde_notificacion:", this.id_desde_notificacion)
    
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginatorx.matPag;
    this.load();
    this.staffRequestService.refresh.subscribe(resp => {
      this.load();
    });
    if (this.id_desde_notificacion>0) {
      this.FiltrarFromNotificacion();
    }
     this.Filtrar();
   
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Solicitud de Vacaciones" : "Actualizar Solicitud de Vacaciones";
    let dialogRef: MatDialogRef<any>;

    if (isNew) {
      dialogRef = this.dialog.open(DialogCategoryRequestComponent, {
        disableClose: true,
        data: { title: title },
      });

      dialogRef.afterClosed().subscribe(resp => {
        this.Filtrar();
      })
    }
    else {
      this.staffRequestService.getemployee().subscribe((res) => {
        dialogRef = this.dialog.open(DialogCategoryRequestComponent, {
          disableClose: true,
          data: { title: title, payload: res.data },
        });

        dialogRef.afterClosed().subscribe(resp => {
          this.Filtrar();
        })
      });
    }

  }

  // load() {
  //   this.loadTypeStaffRequest();
  //   this.loadDateCurrent();
  //   this.Filtrar();
  // }

  pageChanged(event: PageEvent) {

    if (this.pageSize !== event.pageSize) {
      this.pageSize = event.pageSize;
      this.staffRequestFilter.pagination.itemsPerPage = this.pageSize;
      this.staffRequestFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    } else {
      this.staffRequestFilter.pagination.currentPage = event.pageIndex + 1;
      this.currentPage = event.pageIndex;

    }

    this.Filtrar();
  }

  loadDateCurrent() {
    let currentDate = new Date();
    let initialIssueDate = new Date(currentDate.getFullYear(),
      currentDate.getMonth(), currentDate.getDate())
    this.staffRequestFilter.initialIssueDate = initialIssueDate;
    this.staffRequestFilter.finalIssueDate = initialIssueDate;
  }


  loadTypeStaffRequest() {

    this.typestaffRequestService.getForSelect().subscribe(res => {
      this.lstTypeStaffRequest = this.addItemAllToSelect(res.data)
    });
  }

  addItemAllToSelect(list: any[]) {
    let item = {
      id: 0,
      description: 'Todos'
    };
    list.splice(0, 0, item);

    return list;
  }

  openApproval(data: any = {}) {
    data.readOnlyView = false;
    console.log("🚀 ~ StaffRequestComponent ~ openApproval ~ data:", data)
    this.openDialog(data);
  }

  downloadPdf(data) {
    

    if ( data.idTypeStaffRequest === 17 ) {

      this.typestaffRequestService.getCampañaNuevabyid(data.id).subscribe(resp => {
        if (resp.data != null) {
          this.staffRequestDownloadPdfService.getPdf(data.id, data.idTypeStaffRequest, true).subscribe((res) => {
            if (res.stateCode == 200) {
              let file = res.data;
              this.downLoad(file.file, file.contentType, file.fileName);
            }
          });
       } else {
        this.staffRequestDownloadPdfService.getPdf(data.id, data.idTypeStaffRequest, false).subscribe((res) => {
          if (res.stateCode == 200) {
            let file = res.data;
            this.downLoad(file.file, file.contentType, file.fileName);
          }
        });
       }
      })

    } else {
      this.staffRequestDownloadPdfService.getPdf(data.id, data.idTypeStaffRequest).subscribe((res) => {
        if (res.stateCode == 200) {
          let file = res.data;
          this.downLoad(file.file, file.contentType, file.fileName);
        }
      });
    }

    
  }

  downLoad(archivo, contentType, name) {
    let link = document.createElement("a");
    let blobArchivo = this.base64ToBlob(archivo, contentType);
    let blob = new Blob([blobArchivo], { type: contentType });
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  public base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ""); //IE compatibility...
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

  openReadJustView(data) {
    data.readOnlyView = true;
    this.openDialog(data);
  }

  openDialog(data) {
    let dialogRef: MatDialogRef<any>;
    console.log("🚀 ~ StaffRequestComponent ~ openDialog ~ data:", data)
    switch (data.idTypeStaffRequest) {
      case 1:
      case 2: {
        dialogRef = this.dialog.open(DialogStaffRequestVacationApproverComponent, {
          width: "720px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data },
        });

        break;
      }
      case 3:
      case 4: {
        dialogRef = this.dialog.open(DialogStaffRequestLoanEvaluateComponent, {
          width: "850px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data },
        });
        break;
      }
      case 5: {
        dialogRef = this.dialog.open(DialogStaffRequestPermitEvaluateComponent, {
          width: "720px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data },
        });
        break;
      }
      case 6:
      case 7: {
        dialogRef = this.dialog.open(DialogStaffRequestAbsenceEvaluateComponent, {
          width: "720px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data },
        });
        break;
      }
      case 8: {
        dialogRef = this.dialog.open(DialogStaffRequestMedicalComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data, isEdit: true },
        });
        break;
      }
      case 9: { // ADELANTO DE SUELDO
        dialogRef = this.dialog.open(DialogStaffRequestAdvancementComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data, isEdit: true },
        });
        break;
      }
      case 10: {
        dialogRef = this.dialog.open(DialogStaffRequestSureComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data, isEdit: true },
        });
        break;
      }
      case 11: { // SERVICIO DE SEPELIO

        dialogRef = this.dialog.open(DialogStaffRequestSepelioComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data, isEdit: true },
        });
        break;
      }
      case 12: { // CAMBIO DE CUENTA SUELDO

        dialogRef = this.dialog.open(DialogStaffRequestSalaryComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data, isEdit: true },
        });
        break;
      }
      case 13: {
        dialogRef = this.dialog.open(DialogStaffRequestAccountChangeCtsEvaluateComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data },
        });
        break;
      }
      case 14: { // CAMBIO DE EPS

        dialogRef = this.dialog.open(DialogStaffRequestPlanComponent, {
          maxWidth: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data, isEdit: true },
        });
        break;
      }
      case 17: {

        this.typestaffRequestService.getCampañaNuevabyid(data.id).subscribe(resp => {
          if (resp.data != null) {
            dialogRef = this.dialog.open(DialogStaffRequestTrainingNewComponent, {
              maxWidth: "720px",
              maxHeight: "650px",
              disableClose: true,
              data: { title: data.typeStaffRequest, payload: data, isEdit: true },
            });
            dialogRef.afterClosed().subscribe(resp => {
              this.Filtrar();
            });
          } else {
            dialogRef = this.dialog.open(DialogStaffRequestTrainingExtraComponent, {
              maxWidth: "720px",
              maxHeight: "650px",
              disableClose: true,
              data: { title: data.typeStaffRequest, payload: data, isEdit: true },
            });
            dialogRef.afterClosed().subscribe(resp => {
              this.Filtrar();
            });
          }
        })
        break;
      }
      case 18: {

        dialogRef = this.dialog.open(DialogStaffRequestHourExtraComponent, {
          maxHeight: "650px",
          disableClose: true,
          data: { title: data.typeStaffRequest, payload: data, isEdit: true },
        });
        break;
      }
    }

    dialogRef.afterClosed().subscribe(resp => {
      this.Filtrar();
    });
  }



  
  load() {
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
    this.loadTypeStaffRequest();
    this.getListCompany();
    this.loadDateCurrent();
  }

  Filtrar() {
    
    this.staffRequestFilter.idArea = this.staffRequestFilter.idArea == 0 ? 0 : this.staffRequestFilter.idArea;
    console.log("🚀 ~ StaffRequestComponent ~ this.staffRequestService.getAll ~ this.staffRequestFilter:", this.staffRequestFilter)

    this.staffRequestService.getAll(this.staffRequestFilter).subscribe(res => {
      console.log("🚀 ~ StaffRequestComponent ~ this.staffRequestService.getAll ~ res:", res)
      if (res.stateCode === 200){
        this.items = res.data.list;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length =  res.data.totalItems;
        });
      }

      
    },
      (err) => {},
      () => {
        this.dataSource = new MatTableDataSource<any>(this.items);
        setTimeout(() => {
          this.paginatorx.initPageRange();
        });
        this.ngAfterViewInit();
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorx.matPag;
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
      this.staffRequestFilter.pagination.itemsPerPage = this.pageSize;
      this.staffRequestFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.staffRequestFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.dataSource.paginator = this.paginatorx.matPag;
    this.Filtrar();
  }

  // Filtrar() {

  //   this.staffRequestService.getAll(this.staffRequestFilter).subscribe(res => {
  //     this.dataSource.data = res.data.list;
  //     setTimeout(() => {
  //       this.paginator.pageIndex = this.currentPage;
  //       this.paginator.length = res.data.totalItems;
  //     });
  //   });
  // }
  getListCompany(): void {
    this._serviceEmployee
      .getListCompany()
      .subscribe((resp) => {
          this.companies = resp
          console.log("🚀 ~ERO ~ StaffRequestComponent ~ .subscribe ~ resp:", resp)
          // this.Filter.IdCompany=1;
          // this.getAreas();
        });
  }

  changecompany() {
    this.getAreas();
  }

  getAreas(): void {
    this.areaService.getByCompany(this.staffRequestFilter.idCompany).subscribe((resp) => {      
      console.log("🚀 ~ StaffRequestComponent ~ this.areaService.getByCompany ~ resp:", resp)
      this.areas = resp.data;
    });
  }

  exportar(): void {
    if(this.staffRequestFilter.idTypeStaffRequest == 0){
      this.snack.open("¡Debe seleccionar un tipo de Solicitud!", "OK", { duration: 4000 });
      return;
    }
    this.staffRequestFilter.idArea = this.staffRequestFilter.idArea == 0 ? 0 : this.staffRequestFilter.idArea;
    this.staffRequestService.getPrint(this.staffRequestFilter).subscribe(
      (res: any) => {
        try {
          const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          const b64Data = res;
          
          const blob = this.b64toBlob(b64Data, contentType);
          const blobUrl = URL.createObjectURL(blob);
          
          const _afile = document.getElementById('afile') as HTMLAnchorElement;
          _afile.href = blobUrl;
          _afile.download = 'Reporte de Solicitud.xlsx'
          _afile.click();
          window.URL.revokeObjectURL(blobUrl);
        } catch (e) {
        }
      }, (error: any) => {

        var obj = error;
      }
    );
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

  openDelete(row) {
    debugger;
    this.confirmService
    .confirm({
      title: "Confirmación",
      message: "¿Esta seguro de eliminar la solicitud?",
    })
    .subscribe((result) => {
      if (result) {

        const payload = {
          nid_request: Number(row.id)
        }

        this.staffRequestService.deleteSolicitud(payload).subscribe(resp => {
          this.Filtrar();
          this.snack.open("Se elimino la solicitud correctamente", "OK", { duration: 4000 });
        })
      }
    });
  }

  FiltrarFromNotificacion() {
    console.log("🚀 ~ FiltrarFromNotificacion:")
    const payload={
      nid_staff_request:this.id_desde_notificacion
    }
    this.staffRequestService.getStaffRequestFromNotificacionById(payload).subscribe(res => {
      console.log("🚀 ~ this.staffRequestService.getStaffRequestFromNotificacionById ~ res:", res)
      if (res.stateCode === 200){
        // this.items = res.data;
        if (this.id_desde_notificacion>0) {
        debugger;
          // Obteniendo data segùn la notificaciòn
          // this.dataFromNotificacion=this.items.find(s=>s.id===this.id_desde_notificacion);
          // this.dataFromNotificacion.readOnlyView = true;
          // res.data.readOnlyView= true;
          // this.dataFromNotificacion=res.data;
          // res.data.readOnlyView= false;
          // this.openDialog(res.data);
          // this.openReadJustView(res.data);
          this.openApproval(res.data);
        }
        // setTimeout(() => {
        //   this.paginator.pageIndex = this.currentPage;
        //   this.paginator.length =  res.data.totalItems;
        // });
      }

      
    },
      (err) => {
        console.log("🚀 ~ FiltrarFromNotificacion ~ err:", err)
        
      });
  }
}