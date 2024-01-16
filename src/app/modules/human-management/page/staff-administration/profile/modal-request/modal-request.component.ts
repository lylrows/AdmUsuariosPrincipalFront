import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CargoQueryFilter } from '@app/data/schema/Cargo/CargoQueryFilter';
import { EmployeeService } from '@app/data/service/employee.service';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { ModalCommentComponent } from '../../modal-comment/modal-comment.component';
import { RequestDetailComponent } from '../../request-list/request-detail/request-detail.component';

@Component({
  selector: 'app-modal-request',
  templateUrl: './modal-request.component.html',
  styleUrls: ['./modal-request.component.scss']
})
export class ModalRequestByEmployeeComponent implements OnInit {

  idEmployee: number = 0;
  idPerson: number = 0;

  requestList: any[] = [];
  collaborators: string = '';

  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  requestDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'styperequest',
    'fecha',
    'section',
    'action',
    'sstate',
  ];
  totalRows = 0;
  pageSize = 5;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25];

  cargoFilter= <CargoQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  } };

  constructor(
    private dialogRef: MatDialogRef<ModalRequestByEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    public _dialog: MatDialog,
  ) {
    this.idEmployee = this.data.employee;
    this.collaborators = this.data.colaborador;
  }

  ngOnInit(): void {
    this.requestDT.paginator = this.paginatorx.matPag;
    this.load();
    
  }



  showDetail(id: number, type: number, nstate: number, nid_collaborator: number): void {
    const config = new MatDialogConfig();
    config.disableClose = true,
    config.width = '700px'
    config.data = { request: id, type: type, state: 0, nid_collaborator }
    // this.dialogRef.close();
    const modal = this._dialog.open(RequestDetailComponent, config);

  }

  showComment(comment: string): void {
    const payload = {
      lectura: true,
      scomment: comment
    }

    const config = new MatDialogConfig();
    config.disableClose = true,
    config.width = '700px'
    config.data = { request: payload }

    const modal = this._dialog.open(ModalCommentComponent, config);
  }

  cancel(): void {
    this.dialogRef.close();
  }






  
  load() {
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
  }

  Filtrar() {
    const payload = {
      id: Number(this.idEmployee)
    }

    this._serviceEmployee.ListRequest(payload).subscribe(res => {
      this.requestList = res;
      
      this.requestDT = new MatTableDataSource(this.requestList);
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  res.data.totalItems;
      });
    },
      (err) => {},
      () => {
        setTimeout(() => {
          this.paginatorx.initPageRange();
        });
        this.ngAfterViewInit();
      });
  }

  ngAfterViewInit() {
    this.requestDT.paginator = this.paginatorx.matPag;
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
      this.cargoFilter.pagination.itemsPerPage = this.pageSize;
      this.cargoFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.cargoFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.requestDT.paginator = this.paginatorx.matPag;
    this.Filtrar();
  }





}
