import { PageEvent } from '@angular/material/paginator';
import { AreaQueryFilter } from './../../../../data/schema/Areas/AreaQueryFilter';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FilterArea } from './../../../../data/schema/areas';
import { Empresa } from './../../../../data/schema/empresa';
import { EmpresaService } from './../../../../data/service/empresa.service';
import { AreaService } from "./../../../../data/service/areas.service";
import { DialogAreaComponent } from "./dialog-organigram/dialog-areas.component";
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Areas } from "app/data/schema/areas";
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "app-crud-area",
  templateUrl: "crud-area.component.html",
  styleUrls: ["crud-area.component.scss"],
  animations: egretAnimations,
})
export class CrudAreaComponent implements OnInit {

  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  areaDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public items: Areas[];
  public empresas: Empresa[];
  filter: FilterArea = { idEmpresa: null, nombreArea: ''};
  displayedColumns: string[] = [
    'option',
    'id',
    'nameArea',
    'areaPadre',
    'empresa',
    'active'
  ];

  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  areaFilter= <AreaQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, idCompany: 0, nombreArea: ""};

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private areaService: AreaService,
    private empresaService: EmpresaService
  ) {
  }

  ngOnInit() {
    this.areaDataSource.paginator = this.paginatorx.matPag;
    this.load();
    this.loadEmpresas();
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Área" : "Actualizar Área";
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogAreaComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
       
      if (isNew) {
        this.areaService.add(res).subscribe(
          (res) => {
            //this.items = data;
            
            if (res.stateCode == 1) {
              this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
            } else if (res.stateCode == 2) {
              this.snack.open(res.messageError[0], "Advertencia", { duration: 4000 });
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
        this.areaService.update(res).subscribe(
          (res) => {
            //this.items = data;
            
            if (res.stateCode == 1) {
              this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
            } else if (res.stateCode == 2) {
              this.snack.open(res.messageError[0], "Advertencia", { duration: 4000 });
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

  resetFilter() {
    this.areaFilter = <AreaQueryFilter>{pagination:{
      currentPage:1,
      itemsPerPage:this.pageSize,
      totalItems:0,
      totalPages:1,
      totalRows:0
    }, idCompany: 0, nombreArea: ""};
    this.load();
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Desea eliminar el registro seleccionado?`})
    .subscribe(res => {
      if (res) {
        
        this.areaService.delete(row.id).subscribe((res) => {
          
          if (res.stateCode == 0) {
            this.snack.open(res.messageError[0], "Error", { duration: 4000 });
          } else {
            this.snack.open("Registro eliminado correctamente", "Ok", { duration: 4000 });
            this.load();
          }
        });
      }
    })
  }

   lettersOnly(event) {
    // if ([160, 130, 161, 162, 163, 181, 144, 214, 224, 233].findIndex(x => x == event.charCode) > -1) return true;
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }


  changeEmpresa(event) {

  }

  
  
  load() {
   

    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);

  }
  
  Filtrar() {
    this.areaService.getPagination(this.areaFilter).subscribe(res => {
      
      this.items = res.data.list;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  res.data.totalItems;
      });
    },
      (err) => {},
      () => {
        this.areaDataSource = new MatTableDataSource<any>(this.items);
        setTimeout(() => {

          this.paginatorx.initPageRange();

        });
        this.ngAfterViewInit();
      });
  }

  ngAfterViewInit() {
    
    this.areaDataSource.paginator = this.paginatorx.matPag;
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
      this.areaFilter.pagination.itemsPerPage = this.pageSize;
      this.areaFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.areaFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.areaDataSource.paginator = this.paginatorx.matPag;
    this.Filtrar();
  }




}
