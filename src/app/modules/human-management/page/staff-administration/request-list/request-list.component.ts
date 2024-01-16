import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '@app/data/service/employee.service';
import { UtilService } from '@app/data/service/util.service';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { FormControl, FormGroup } from '@angular/forms';
import { EmpresaService } from '@app/data/service/empresa.service';
import { AreaService } from '@app/data/service/areas.service';
import { Empresa } from '@app/data/schema/empresa';
import { Areas } from '@app/data/schema/areas';
import { RequestQueryFilter } from '@app/data/schema/Request/RequestQueryFilter';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
   @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
   requestDT: MatTableDataSource<any> = new MatTableDataSource([]);
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;

  requestList: any[] = [];
  collaborator : string = '';
  nid_employee: number = 0;

  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];

  
  bussineFC = new FormControl("");
  areaFC = new FormControl("");
  gerenciaFC = new FormControl("");
  subAreaFC = new FormControl("");

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;

  estado = new FormControl(0);
  TipoSolicitud = new FormControl(0);
  TipoDocumento = new FormControl(0);
  
  pageSizeOptions: number[] = [5, 10, 25, 100];
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;
  requestFilter= <RequestQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0,
  }, id: 0, idbussines:0, idgerencia: 0,idarea: 0,nidsubarea: 0, nstate: 0, dateStart: '', dateEnd: '', nid_typerequest: 0, ntypeseccion: 0, nid_employee: 0 };

  range = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });
  public empresas: Empresa[];
 

  disabledTipoDocumento: boolean = true;

  displayedColumns: string[] = [
    'option',
    'scollaborator',
    'styperequest',
    'fecha',

    'section',
    'action',
    'sapprover',
    'sstate',
  ];

  
  public id_desde_notificacion: number = 0;
  urlDesdeNotificacion:any="";
  public dataFromNotificacion: any;
  constructor(
    private _serviceEmployee: EmployeeService,
    private _serviceUtil: UtilService,
    public _dialog: MatDialog,
    private empresaService: EmpresaService,
    private areaService: AreaService,
    
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.urlDesdeNotificacion = this.router.parseUrl(this.router.url);
    this.id_desde_notificacion = Number(this.urlDesdeNotificacion.queryParams['id']);
    if (Number.isNaN(this.id_desde_notificacion)) {
      this.id_desde_notificacion = 0;
    }
    console.log("🚀 ~ RequestListComponent ~ this.id_desde_notificacion:", this.id_desde_notificacion)

    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.collaborator = storage.displayName;
    this.nid_employee = storage.nid_employee;
    this.loadEmpresas();

  }

  ngOnInit(): void {
    this.requestDT.paginator =this.paginatorx.matPag;
    this.load();
    if (this.id_desde_notificacion>0) {
      this.getRequestById();
    }
  }

  load() {
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
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
      this.requestFilter.pagination.itemsPerPage = this.pageSize;
      this.requestFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.requestFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.requestDT.paginator = this.paginatorx.matPag;
    this.getListRequest();
  }

  changeEmpresa(): void {
    this.loadGerencia();
    this.disabledGerencia = false;

    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    this.disabledGerencia = false;
    this.disabledArea = true;
    this.disabledSubArea = true;

  }
  changeTipoSolicitud(): void {
    this.TipoDocumento.setValue(0);
    this.disabledTipoDocumento = false;
  }
  loadEmpresas() {
    this.empresaService.getAll().subscribe((res) =>{
      console.log("🚀 ~SDO RequestListComponent ~ this.empresaService.getAll ~ res:", res)

      this.empresas = res;
    });
  }

  loadAreasOLD(idCompany: number) {
    this.areaService.getByCompany(idCompany).subscribe((res) => {
      this.areas = res.data;
    });
  }
  

  export() {
    

    const payload = {
      id: 0,
      idbussines:  Number(this.bussineFC.value),
      idgerencia: Number(this.gerenciaFC.value),
      idarea: Number(this.areaFC.value),
      nidsubarea: Number(this.subAreaFC.value),
      nstate: Number(this.estado.value),
      dateStart: this.range.get('start').value,
      dateEnd: this.range.get('end').value,
      nid_typerequest: Number(this.TipoSolicitud.value),
      ntypeseccion: Number(this.TipoDocumento.value),
      nid_employee: this.nid_employee
    }
    
    this._serviceEmployee.ListRequestPrint(payload).subscribe((res: any) => {
        try {
          const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          const b64Data = res;

          const blob = this.b64toBlob(b64Data, contentType);
          
          const blobUrl = URL.createObjectURL(blob);

          const _afile = document.getElementById('afile') as HTMLAnchorElement;
          _afile.href = blobUrl;
          _afile.download = 'Listado.xlsx';
          _afile.click();
          window.URL.revokeObjectURL(blobUrl);

        } catch (e) {
        }
      }, (error: any) => {
        console.log('error', error)

        
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

  clearDate(event) {
    event.stopPropagation();
    this.range.get('start').setValue('');
    this.range.get('end').setValue('');
  }


  resetFilter(): void {
    this.bussineFC.setValue('');
    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');

    this.estado.setValue(0);
    this.TipoSolicitud.setValue(0);
    this.TipoDocumento.setValue(0);
    this.areas = [];
    
    this.range.get('start').setValue('');
    this.range.get('end').setValue('');

     this.disabledGerencia = true;
    this.disabledArea = true;
    this.disabledSubArea = true;

    this.disabledTipoDocumento = true
    this.load();
  }


  getListRequest(): void
  {
    this.requestFilter.id = 0;
    this.requestFilter.idbussines = Number(this.bussineFC.value);
    this.requestFilter.idgerencia =  Number(this.gerenciaFC.value);
    this.requestFilter.idarea = Number(this.areaFC.value);
    this.requestFilter.nidsubarea =  Number(this.subAreaFC.value);
    this.requestFilter.nstate = Number(this.estado.value);
    this.requestFilter.dateStart = this.range.get('start').value;
    this.requestFilter.dateEnd = this.range.get('end').value;
    this.requestFilter.nid_typerequest = Number(this.TipoSolicitud.value);
    this.requestFilter.ntypeseccion = Number(this.TipoDocumento.value);
    this.requestFilter.nid_employee = this.nid_employee;
    
    this._serviceEmployee.ListrRequestpagination(this.requestFilter).subscribe(resp => {
       console.log("🚀 ~ RequestListComponent ~ this._serviceEmployee.ListrRequestpagination ~ resp:", resp)
       this.requestList= resp.list; 
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  resp.totalItems;
      });
    },(err) => { },
      () => {
        this.requestDT = new MatTableDataSource<any>(this.requestList);
        setTimeout(() => {
          this.paginatorx.initPageRange();
        });
        this.ngAfterViewInit();
      }
    );
  }
  getRequestById(): void
  {
    const payload={
      nid_request:this.id_desde_notificacion
    }
    this._serviceEmployee.getRequestById(payload).subscribe(resp => {
       console.log("🚀 ~ RequestListComponent ~ this._serviceEmployee.ListrRequestpagination ~ resp:", resp)
       this.dataFromNotificacion= resp; 
      //  this.dataFromNotificacion=this.requestList.find(r=>r.nid_request===this.id_desde_notificacion);
       console.log("🚀 ~ RequestListComponent ~ this._serviceEmployee.ListrRequestpagination ~ this.dataFromNotificacion:", this.dataFromNotificacion)
       
       this.showDetail(this.dataFromNotificacion.nid_request, this.dataFromNotificacion.nid_typerequest, this.dataFromNotificacion.nstate, this.dataFromNotificacion.nid_collaborator, this.dataFromNotificacion.dregister);
      
    },(err) => { 
      console.log("🚀 ~ file: request-list.component.ts:313 ~ RequestListComponent ~ err:", err)

    },
    );
  }
  ngAfterViewInit(): void {
    this.requestDT.paginator = this.paginatorx.matPag;
  }
  showDetail(id: number, type: number, nstate: number, nid_collaborator: number, date): void {
    const config = new MatDialogConfig();
    config.disableClose = true,
    config.width = '700px'
    config.data = { request: id, type: type, state: nstate, nid_collaborator, date }
    const modal = this._dialog.open(RequestDetailComponent, config);

    modal.afterClosed().subscribe(resp => {
      this.getListRequest();
    })
  }



  loadGerencia() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;
    const payload = {
      IdUser: idUser,
      IdCompany: Number(this.bussineFC.value)
    }
    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;
    });
  }

  changeGerencia(): void {
    this.loadAreas();

    this.areaFC.setValue('');
    this.subAreaFC.setValue('');

    this.disabledArea = false;
    this.disabledSubArea = true;
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

}
