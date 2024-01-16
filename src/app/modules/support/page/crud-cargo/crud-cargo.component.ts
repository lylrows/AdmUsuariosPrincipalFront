import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Areas } from 'app/data/schema/areas';
import { Cargo, CargoInfo, FilterCargo } from './../../../../data/schema/cargo';
import { Empresa } from './../../../../data/schema/empresa';
import { AreaService } from './../../../../data/service/areas.service';
import { EmpresaService } from './../../../../data/service/empresa.service';
import { egretAnimations } from './../../../../shared/animations/egret-animations';
import { CargoService } from "./../../../../data/service/cargo.service";
import { DialogCargoComponent } from "./dialog-cargo/dialog-cargo.component";
import { AppLoaderService } from "./../../../../shared/services/app-loader/app-loader.service";
import { AppConfirmService } from "./../../../../shared/services/app-confirm/app-confirm.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, ViewChild } from "@angular/core";
import { CargoQueryFilter } from '@app/data/schema/Cargo/CargoQueryFilter';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: "app-crud-cargo",
  templateUrl: "crud-cargo.component.html",
  styleUrls: ['crud-cargo.component.scss'],
  animations: egretAnimations,
})
export class CrudCargoComponent implements OnInit {
  
  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cargoDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public items: Cargo[];
  public empresas: Empresa[];
  filter: FilterCargo = { idEmpresa: null, nombreCargo: '', idArea: null};
  
  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];
  lstAreas: Areas[];

  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  subAreaFC = new FormControl("");

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;

  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  lstEstados:any[]=[
    {value:"A",nombre:'Activo'},
    {value:"I",nombre:'Inactivo'},
  ];
 estadoFC = new FormControl("");

  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  cargoFilter= <CargoQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, idCompany: 0, idArea:0, nombreCargo: '', estado: ''};

  displayedColumns: string[] = [
    'option',
    'id',
    'nameCargo',
    'nameArea',
    'nameSubArea',
    'empresa',
    'active'
  ];

  infoCargo:CargoInfo;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private cargoService: CargoService,
    private empresaService: EmpresaService,
    private areaService: AreaService
  ) {}

  ngOnInit() {
    this.cargoDataSource.paginator = this.paginatorx.matPag;
    this.load();
    this.loadEmpresas();
    //this.loadAreas();
  }

  openPopUp(data: Cargo , isNew?) {
    console.log("🚀 ~ file: crud-cargo.component.ts:92 ~ CrudCargoComponent ~ openPopUp ~ data:", data)
    console.log("🚀 ~ file: crud-cargo.component.ts:92 ~ CrudCargoComponent ~ openPopUp ~ isNew:", isNew)
    
    let title = isNew ? "Agregar Cargo" : "Actualizar Cargo";
    this.infoCargo= { title: title, cargo: data };
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogCargoComponent, {
      width: "720px",
      disableClose: true,
      // data:{ title: title, payload: data },
      data:this.infoCargo
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.cargoService.add(res).subscribe(
          (res) => {
            
            if (res.stateCode == 1) {
              this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
            } else if (res.stateCode == 2) {
              this.snack.open(res.messageError[0], "OK", { duration: 4000 });
            } else {
              this.snack.open("Ocurrio un error en el servidor", "Error", { duration: 4000 });
            }
          },
          (err) => {},
          () => {
            this.load();
          }
        );
      } else {
        this.cargoService.update(res).subscribe(
          (res) => {
            
            if (res.stateCode == 1) {
              this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
            } else {
              this.snack.open("Ocurrio un error en el servidor", "Error", { duration: 4000 });
            }
          },
          (err) => {},
          () => {
            this.load();
          }
        );
      }
    });
  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe(res => this.empresas = res);
  }

  loadAreasOLD() {
    this.areaService.getAll().subscribe((res) => {
      this.lstAreas = res.data;
      this.areas = this.lstAreas;
    });
  }

  resetFilter() {
    
    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    this.estadoFC.setValue('');

    this.cargoFilter = <CargoQueryFilter>{pagination:{
      currentPage:1,
      itemsPerPage:10,
      totalItems:0,
      totalPages:1,
      totalRows:0
    }, 
    idCompany: 0, 
    idGerencia:0, 
    idArea:0, 
    idSubArea:0, 
    nombreCargo: '', 
    estado: ''};

    this.load();

  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Desea eliminar el registro seleccionado?`})
    .subscribe(res => {
      if (res) {
        
        this.cargoService.delete(row.id).subscribe((res) => {
          
          if (res.stateCode == 0) {
            this.snack.open(res.messageError[0], "Error", { duration: 4000 });
          } else {
            this.snack.open("Usuario Desbloqueado correctamente", "Ok", { duration: 4000 });
            this.load();
          }
        });
      }
    })
  }

  changeEmpresa(event) {
    if (event.value != 0) {
      //this.areas = this.lstAreas.filter(x => x.idEmpresa == event.value);
      this.loadGerencia(event.value);
      this.disabledGerencia = false;
    }
    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    this.disabledArea = true;
    this.disabledSubArea = true;
  }


  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }

  load() {

    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
  }

  search(): void {
    this.cargoFilter.idGerencia=Number(this.gerenciaFC.value);
    this.cargoFilter.idArea=Number(this.areaFC.value);
    this.cargoFilter.idSubArea=Number(this.subAreaFC.value);
    this.load();
  } 

  Filtrar() {
    this.cargoService.getPagination(this.cargoFilter).subscribe(res => {
      console.log("🚀 ~ this.cargoService.getPagination ~ res:", res)
      this.items = res.data.list;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  res.data.totalItems;
      });
    },
      (err) => {},
      () => {
        this.cargoDataSource = new MatTableDataSource<any>(this.items);
        setTimeout(() => {
          this.paginatorx.initPageRange();
        });
        this.ngAfterViewInit();
      });
  }

  ngAfterViewInit() {
    this.cargoDataSource.paginator = this.paginatorx.matPag;
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
    this.cargoDataSource.paginator = this.paginatorx.matPag;
    this.Filtrar();
  }

  loadGerencia(idCompany) {

    const payload = {
      IdCompany:idCompany 
    }
    this.areaService.getGerenciasByCompany(payload).subscribe((res) => {
      this.gerencias = res.data;
    });


  }

  changeGerencia(): void {
    this.loadAreas();
    this.disabledArea = false;
    
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    
    this.disabledSubArea = true;
  }

  loadAreas() {
    const payload = {
      IdArea: Number(this.gerenciaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas= res.data;
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
      
      this.subAreas= res.data;
      if(this.subAreas.length==0){
        this.disabledSubArea=true;
      }else{
        this.disabledSubArea=false;
      }
    });
    
  }




}
