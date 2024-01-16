import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { PerformanceService } from "@app/data/service/performance.service";
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { EmpresaService } from '@app/data/service/empresa.service';

import {
  AsignEmployee,
  AssignEmployeeDetailDto,
} from "../models/asign-employee.model";
import { AppConfirmService } from "../../../../../shared/services/app-confirm/app-confirm.service";
import { EmployeAsignQueryFilter } from "@app/data/schema/employee/EmployeAsignQueryFilter";
import { Areas } from '@app/data/schema/areas';
import { Empresa } from '@app/data/schema/empresa';
import { AreaService } from '@app/data/service/areas.service';

@Component({
  selector: "app-asign-employee",
  templateUrl: "./asign-employee.component.html",
  styleUrls: ["./asign-employee.component.scss"],
})
export class AsignEmployeeComponent implements OnInit {
  id: number = 0;
  
  listemployee: any[] = [];
  selectedOption;
  campaign;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  employeeDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ["check", "code", "name", "company", "position", "area"];

  listFilter: any[] = [
    { code: 1, name: "Empleados Asignados" },
    { code: 2, name: "Empleados Disponibles" },
  ];

  isDisponible: boolean = true;

  inputFiler = new FormControl("");

  searchCode = new FormControl("");
  searchName = new FormControl("");

  empresas: Empresa[];
  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];

  bussineFC = new FormControl("");
  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  subAreaFC = new FormControl("");
  cargoFC = new FormControl("");

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  disabledCargo: boolean = true;


  totalRows = 0;
  pageSize = 10;
  currentPage = 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  employeAsignFilter = <EmployeAsignQueryFilter>{
    pagination: {
      currentPage: 1,
      itemsPerPage: this.pageSize,
      totalItems: 0,
      totalPages: 1,
      totalRows: 0
    }, nidCampana: 0,
    nidArea: 0,
    Dni: '',
    Name: '',
    Position: 0,
    nflagSearch: 2
  };


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fs: FormBuilder,
    private _service: PerformanceService,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private cdr: ChangeDetectorRef,    
    private areaService: AreaService,
    private empresaService: EmpresaService
  ) {
    this.id = this._route.snapshot.params.id;
    
  }

  ngOnInit(): void {

    this.loadEmpresas();
    this.getCampaign();
   
    
    this.employeeDT.paginator = this.paginatorx.matPag;
    this.load();
  }

  getCampaign(): void {
    this._service.getCampaign(this.id).subscribe((resp) => {
      this.campaign = resp;
    });
  }

  getListEmployee(): void {
    
    
    this.employeAsignFilter.nidCampana = Number(this.id);
    this.employeAsignFilter.nidcompany=Number(this.bussineFC.value);
    this.employeAsignFilter.nidgerencia=Number(this.gerenciaFC.value);
    this.employeAsignFilter.nidArea=Number(this.areaFC.value);
    this.employeAsignFilter.nidsubarea=Number(this.subAreaFC.value);
   
    const payload = {
      nidCampana: this.employeAsignFilter.nidCampana,
      Dni: this.employeAsignFilter.Dni,
      Name: this.employeAsignFilter.Name,
      Position: this.employeAsignFilter.Position,
      nidcompany: this.employeAsignFilter.nidcompany,
      nidgerencia: this.employeAsignFilter.nidgerencia,
      nidArea: this.employeAsignFilter.nidArea,
      nidsubarea: this.employeAsignFilter.nidsubarea,
      nflagSearch: this.employeAsignFilter.nflagSearch,
      CurrentPage: this.employeAsignFilter.pagination.currentPage,
      ItemsPerPage: this.employeAsignFilter.pagination.itemsPerPage,
      TotalItems: this.employeAsignFilter.pagination.totalItems,
      TotalPages: this.employeAsignFilter.pagination.totalPages,
      TotalRows: this.employeAsignFilter.pagination.totalRows

    }

    
    this._service.getListAsignEmployee(payload).subscribe((resp) => {
        this.listemployee = resp.list;
        
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = resp.totalItems;
        });
      },
      (err) => { },
      () => {
        this.employeeDT = new MatTableDataSource(this.listemployee);
        setTimeout(() => {
          this.paginatorx.initPageRange();
        });
        this.ngAfterViewInit();
      }
    );
  }

  ngAfterViewInit(): void {
    
    this.employeeDT.paginator = this.paginator;
  }

  

  asign(): void {
    if (this.selection.selected.length > 0) {
      let listemployee: AssignEmployeeDetailDto[] = [];

      this.selection.selected.map((e) => {
        listemployee.push({
          IdEmployee: e.idEmployee,
          IdPosition: e.idPosition,
          Active: true, 
        });
      });

      const payload: AsignEmployee = {
        IdCampaign: Number(this.id),
        Employelist: listemployee,
      };

      this._service.AsignEmployee(payload).subscribe((resp) => {
        this.getCampaign(); 
        
        this.load();
        this.snack.open(resp.messageError, "OK", { duration: 4000 });
      });
    } else {
      this.snack.open("Debes de seleccionar almenos un empleado", "OK", {
        duration: 4000,
      });
    }
  }

  deleteAsing(): void {
    if (this.selection.selected.length > 0) {
      let listemployee: AssignEmployeeDetailDto[] = [];

      this.selection.selected.map((e) => {
        listemployee.push({
          IdEmployee: e.idEmployee,
          IdPosition: e.idPosition,
          Active: false, 
        });
      });

      const payload: AsignEmployee = {
        IdCampaign: Number(this.id),
        Employelist: listemployee,
      };

      this._service.AsignEmployee(payload).subscribe((resp) => {
        this.getCampaign();
        
        this.load();
        this.snack.open(resp.messageError, "OK", { duration: 4000 });
      });
    } else {
      this.snack.open("Debes de seleccionar almenos un empleado", "OK", {
        duration: 4000,
      });
    }
  }

  filterEmployee(event): void {
    this.selection.clear();
    const value: number = Number(event.value);
    if (value === 2) {
      
      this.isDisponible = true;
      
      this.employeAsignFilter.nflagSearch = value;
      
      this.load();
    } else {
      this.isDisponible = false;
      
      this.employeAsignFilter.nflagSearch = value;
      
      this.load();
    }
  }

  searchFn(): void {
    const code = this.searchCode.value;
    const name = this.searchName.value;

    this.employeAsignFilter.Dni = code;
    this.employeAsignFilter.Name = name;

    this.load();
  }

  resetFilter(): void {
    this.inputFiler.setValue("");
    this.employeAsignFilter.nflagSearch=0;

    this.searchCode.setValue("");
    this.searchName.setValue("");

    this.employeAsignFilter.Dni="";
    this.employeAsignFilter.Name="";

    this.bussineFC.setValue('');
    this.areaFC.setValue('');
    this.cargoFC.setValue('');

    this.gerenciaFC.setValue('');
    this.subAreaFC.setValue('');

    this.disabledArea = true;
    this.disabledCargo = true;
    
    this.disabledGerencia = true;
    this.disabledSubArea = true;
    
    this.load();
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
    if (this.pageSize !== pageSize) {
      this.pageSize = pageSize;
      this.employeAsignFilter.pagination.itemsPerPage = this.pageSize;
      this.employeAsignFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    } else {
      this.employeAsignFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.employeeDT.paginator = this.paginatorx.matPag;
    this.getListEmployee();
  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe(res => this.empresas = res);
  }

  changeEmpresa(): void {
   
    this.disabledArea = false;
    this.disabledCargo = false;

    this.loadGerencia();
    this.disabledGerencia=false;

  }

  loadGerencia() {
    const payload = {
      IdCompany: Number(this.bussineFC.value)

    }
    this.areaService.getGerenciasByCompany(payload).subscribe((res) => {
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

  changeSubArea(): void {

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
