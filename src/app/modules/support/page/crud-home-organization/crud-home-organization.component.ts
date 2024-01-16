import { DialogOrganizationComponent } from './dialog-organization/dialog-organization.component';
import { egretAnimations } from '../../../../shared/animations/egret-animations';
import { AppLoaderService } from './../../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from './../../../../shared/services/app-confirm/app-confirm.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import { Component, OnInit,AfterViewInit,ChangeDetectorRef,ViewChild } from '@angular/core';
import { HomeOrganizationService } from './../../../../data/service/home-organization.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator,MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import { Organization } from "app/data/schema/organization";
import { MatSort } from '@angular/material/sort';
import { OrganizationQueryFilter } from './../../../../data/schema/Home/OrganizationQueryFilter';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';


@Component({
  selector: 'app-crud-home-organization',
  templateUrl: './crud-home-organization.component.html',
  styleUrls: ['./crud-home-organization.component.css'],
  animations: egretAnimations
})
export class CrudHomeOrganizationComponent implements OnInit {

  public items: Organization[]=[];
  selectedOption;
  filter:"";
  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'id',
    'title',
    'description',
    'nameArchivo',
    'imagen',
    'active'
  ];
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  organizationFilter= <OrganizationQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, description:  ""};
  dataSource = new MatTableDataSource<any>(this.items);

  constructor(private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private homeOrganizationService: HomeOrganizationService,
    private cdr: ChangeDetectorRef,
    paginatorIntl:MatPaginatorIntl) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginatorx.matPag;
    this.load();
  }

  confirmarDelete(row) {
    this.confirmService.confirm({title: "Confirmación", message: "¿Esta seguro de anular el registro?"})
      .subscribe((result) => {
        this.selectedOption = result;
        if(result){
          this.deleteItem(row);
        }
        this.cdr.markForCheck();
      });
  }
  deleteItem(row) {
    this.homeOrganizationService.delete(row.id).subscribe(
      (res) => res
      ,
      (err) => {},
      () => {
        this.load();
      }
      );
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Item' : 'Actualizar Item';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogOrganizationComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        
        if (isNew) {
          this.homeOrganizationService.add(res)
            .subscribe(
              data => {
              //this.items = data;
              
              this.snack.open('¡Registro Agregado!', 'OK', { duration: 4000 })
            },
            (err) => {},
            () => {
              this.load();
            })
        } else {
          this.homeOrganizationService.update(res)
            .subscribe(
              data => {
              //this.items = data;
              
              this.snack.open('¡Registro Actualizado!', 'OK', { duration: 4000 })
              },
              (err) => {},
              () => {
                this.load();
              }
            )
          }
        
      })
  }

 lettersOnly(event) {
   if (event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
 }




  resetFilter(){
    this.organizationFilter= <OrganizationQueryFilter>{pagination:{
      currentPage:1,
      itemsPerPage:10,
      totalItems:0,
      totalPages:1,
      totalRows:0
    }, description:  ""};
    this.load();
  }



  

 load() {
  this.paginatorx._rangeStart = 0;
  this.paginatorx._rangeEnd = 2;
  this.changedPageNumber(0);
}

Filtrar() {
  //
  this.homeOrganizationService.getListPagination(this.organizationFilter).subscribe(res => {
    this.items = res.data.list;
    
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length =  res.data.totalItems;
    });
  },
    (err) => {},
    () => {
      this.dataSource = new MatTableDataSource<any>(this.items);
      setTimeout(() => {
        // this.paginatorx._curPageObj.pageIndex = 0;
        // this.paginatorx.loadPageRange();
        this.paginatorx.initPageRange();
        // this.setPage(this.paginator.length, this.paginator.pageIndex);
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
    this.organizationFilter.pagination.itemsPerPage = this.pageSize;
    this.organizationFilter.pagination.currentPage = 1;
    this.currentPage = 0;
  }else{
    this.organizationFilter.pagination.currentPage = pageIndex + 1;
    this.currentPage = pageIndex;
  }
  this.dataSource.paginator = this.paginatorx.matPag;
  this.Filtrar();
}




}
