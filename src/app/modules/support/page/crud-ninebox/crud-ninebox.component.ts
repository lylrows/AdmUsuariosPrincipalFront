import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Cargo, FilterCargo } from './../../../../data/schema/cargo';
import { Empresa } from './../../../../data/schema/empresa';
import { EmpresaService } from './../../../../data/service/empresa.service';
import { egretAnimations } from './../../../../shared/animations/egret-animations';
import { CargoService } from "./../../../../data/service/cargo.service";
import { AppLoaderService } from "./../../../../shared/services/app-loader/app-loader.service";
import { AppConfirmService } from "./../../../../shared/services/app-confirm/app-confirm.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { CargoQueryFilter } from '@app/data/schema/Cargo/CargoQueryFilter';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NineBoxService } from '@app/data/service/ninebox.service';
import { DialogNineboxComponent } from "./dialog-ninebox/dialog-ninebox.component";
import { NineBoxQueryFilter } from '@app/data/schema/NineBox/NineBoxQueryFilter';

@Component({
  selector: 'app-crud-ninebox',
  templateUrl: './crud-ninebox.component.html',
  styleUrls: ['./crud-ninebox.component.scss'], 
  animations: egretAnimations,
})
export class CrudNineboxComponent implements OnInit {

  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cargoDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public items: Cargo[];
  filter: FilterCargo = { idEmpresa: null, nombreCargo: '', idArea: null};
  
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  nineBoxFilter= <NineBoxQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }};

  displayedColumns: string[] = [
    'option',
    'id',
    'nameCargo',
    'nameArea',
    'minlevel',
    'maxlevel',
    'active'
  ];

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private cargoService: CargoService,
    private nineBoxService: NineBoxService,
  ) {}

  ngOnInit() {
    this.cargoDataSource.paginator = this.paginatorx.matPag;
    this.load();
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Nine Box" : "Actualizar Configuración Nine Box";
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogNineboxComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
       
        return;
      }
      
      if (isNew) {
        
      } else {
        
        this.nineBoxService.update(res).subscribe(
          (res) => {
            
            if (res.stateCode == 200) {
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

  load() {
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
  }

  Filtrar() {
    
    this.nineBoxService.getAll(this.nineBoxFilter).subscribe(res => {
      
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
      this.nineBoxFilter.pagination.itemsPerPage = this.pageSize;
      this.nineBoxFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.nineBoxFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.cargoDataSource.paginator = this.paginatorx.matPag;
    this.Filtrar();
  }



}
