import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IPositionList } from '@app/data/schema/cargo';
import { ICompanyList } from '@app/data/schema/empresa';
import { EmployeeService } from '@app/data/service/employee.service';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@app/shared/services/app-loader/app-loader.service';
import { DialogEmpleadoComponent } from './dialog-empleado/dialog-empleado.component';

@Component({
  selector: 'app-crudempleado',
  templateUrl: './crudempleado.component.html',
  styleUrls: ['./crudempleado.component.scss']
})
export class CrudempleadoComponent implements OnInit {

  employee: any[] = [];
  company: ICompanyList[] = [];
  position: IPositionList[] = [];
  formFilter: FormGroup;
 
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  employeeDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'sidentification',
    'sfullname',
    'semail',
    'snamecharge',
    'scompany',
    'scostcenter',
    'scodpayroll',
    'sstate'
  ];

  initForm(): void {
    this.formFilter = this._fs.group({
      nid_company : [0],
      nid_position: [0],
      sidentification: [''],
      sfullname: [''],
      currentPage: [1],
      itemsPerPage:[10],
      totalItems:[0],
      totalPages:[1],
      totalRows:[0],
      nid_state:[0]

    })
  }

  listCorreo:any[]=[];
  constructor(
    public _dialog: MatDialog,
    private _fs: FormBuilder,
    private _snack: MatSnackBar,
    private _confirmService: AppConfirmService,
    private _loader: AppLoaderService,
    private _serviceEmployee: EmployeeService,
    private router: Router
  ) {
    this.initForm();
    this.formFilter.get('nid_position').disable();
  }

  ngOnInit(): void {
    this.getEmployee();
    this.getListCompany();
  }

  getEmployee(): void {
    console.log("🚀 ~ getEmployee ~ this.formFilter.value:", this.formFilter.value)
    this._serviceEmployee.getAll(this.formFilter.value).subscribe(resp => {
      this.employee = resp.data.list;
      
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = resp.data.totalItems;
      })
    }, (err) => {},
      () => {
        this.employeeDT = new MatTableDataSource(this.employee);
        this.ngAfterViewInit()
        
      }
    )
  }

  ngAfterViewInit(): void {
    this.employeeDT.sort = this.sort;
    this.employeeDT.paginator = this.paginator;
  }

  getListCompany(): void {
    this._serviceEmployee.getListCompany().subscribe(resp => this.company = resp);
  }

  getListPosition(id_company: number ): void {
    this._serviceEmployee.getListPosition(id_company).subscribe(resp => this.position = resp);
  }

  changeCompany(id: number): void {
    this.getListPosition(id);
    this.formFilter.get('nid_position').enable();
  }

  Filter(): void {
    this.getEmployee();
  }

  resetFilter(): void {
    this.formFilter.reset({
      nid_company : 0,
      nid_position: 0,
      sidentification: '',
      nid_state:0,
      sfullname: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      totalRows: 0
    });
    this.formFilter.get('nid_position').disable();
    this.getEmployee();
  }

  managementEmployee(id: number, idemploye: number ,isedit: boolean): void {
    let title = '';
    isedit ? title = 'Editar el Empleado' : title = 'Detalle del Empleado';
    
    const config = new MatDialogConfig();
    config.width = '860px',
    config.height = '550px'
    config.disableClose = true,
    config.data = {
      title,
      id,
      idemploye,
      isedit
    }

    /*const modal = this._dialog.open(DialogEmpleadoComponent, config);

    modal.afterClosed().subscribe(resp => {
      if (resp === true) {
        this.getEmployee();
        this._snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
      }
    })*/

    this.router.navigate(['humanmanagement/profile',idemploye ], {
      skipLocationChange: true
    })
  }

  pageChanged(event: PageEvent) {
    
    if (this.pageSize !== event.pageSize){
      this.pageSize = event.pageSize;  
      this.formFilter.get('itemsPerPage').setValue(this.pageSize);
      this.formFilter.get('currentPage').setValue(1);
      //this.organizationFilter.pagination.itemsPerPage= this.pageSize;
      //this.organizationFilter.pagination.currentPage = 1;
      this.currentPage=0;
    }else{
      this.formFilter.get('currentPage').setValue(event.pageIndex + 1);
      //this.organizationFilter.pagination.currentPage = event.pageIndex+1;
      this.currentPage =event.pageIndex;
  
    }
  
    this.getEmployee();
  }

  splitTexto(cadena:string=''){
    this.listCorreo=[];
    if(cadena!==null && cadena!==''){
      let correos=cadena.split(',');
      this.listCorreo=correos;
    }
    return this.listCorreo;
  }
}
