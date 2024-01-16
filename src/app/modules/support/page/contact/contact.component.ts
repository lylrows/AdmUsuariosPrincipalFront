import { ContactService } from "@data/service/contact.service";
import { DialogContactComponent } from "./dialog-contact/dialog-contact.component";
import { AppLoaderService } from "@shared/services/app-loader/app-loader.service";
import { AppConfirmService } from "@shared/services/app-confirm/app-confirm.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ContactQueryFilter } from "@app/data/schema/contact/ContactQueryFilter";
import { StylePaginatorDirective } from "@app/shared/directives/style-paginator.directive";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public items: any[];
  contactDataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private contactService: ContactService
  ) {}

  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'id',
    'name',
    'position',
    'phone',
    'reason',
    'active'
  ];
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;
  
  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  contactFilter= <ContactQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }};
   

  ngOnInit() 
  {
    this.contactDataSource.paginator = this.paginatorx.matPag;
    this.load();
  }
 


  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Contacto" : "Actualizar Contacto";
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogContactComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        this.load();
        return;
      }
    
    
    });
  }



  deleteItem(row) {
    this.confirmService.confirm({message: `Desea eliminar el registro seleccionado?`})
    .subscribe(res => {
      if (res) {
        this.loader.open();
        this.contactService.delete(row.id).subscribe((res) => {
          this.loader.close();
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


  
  load() {
      this.paginatorx._rangeStart = 0;
      this.paginatorx._rangeEnd = 2;
      this.changedPageNumber(0);
  }

  
  Filtrar() {
    this.contactService.getListPagination(this.contactFilter).subscribe(res => {
      this.items = res.data.list;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  res.data.totalItems;
      });
    },
      (err) => {},
      () => {
        this.contactDataSource = new MatTableDataSource<any>(this.items);
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
    // this.areaDataSource.paginator = this.paginator;
    this.contactDataSource.paginator = this.paginatorx.matPag;
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
      this.contactFilter.pagination.itemsPerPage = this.pageSize;
      this.contactFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.contactFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.contactDataSource.paginator = this.paginatorx.matPag;
    this.Filtrar();
  }


  
}
