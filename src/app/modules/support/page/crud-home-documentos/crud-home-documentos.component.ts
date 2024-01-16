import { DialogDocumentosComponent } from './dialog-documentos/dialog-documentos.component';
import { egretAnimations } from '../../../../shared/animations/egret-animations';
import { AppLoaderService } from './../../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from './../../../../shared/services/app-confirm/app-confirm.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit,AfterViewInit,ChangeDetectorRef,ViewChild } from '@angular/core';
import { HomeDocumentosService } from './../../../../data/service/home-documentos.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator,MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import { Documento,FilterDocumento } from "app/data/schema/documentos";
import { MastertableService } from './../../../../data/service/mastertable.service';
import { Empresa } from './../../../../data/schema/empresa';
import { Mastertable } from './../../../../data/schema/mastertable';
import { EmpresaService } from './../../../../data/service/empresa.service';
import { MatSort } from '@angular/material/sort';
import { DocumentQueryFilter } from './../../../../data/schema/Home/DocumentQueryFilter';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';

@Component({
  selector: 'app-crud-home-documentos',
  templateUrl: './crud-home-documentos.component.html',
  styleUrls: ['./crud-home-documentos.component.css'],
  animations: egretAnimations
})
export class CrudHomeDocumentosComponent implements OnInit {
  public items: Documento[]=[];
  selectedOption;
  public empresas: Empresa[];
  public categories: Mastertable[];
  public subcategories: Mastertable[];
  filter: FilterDocumento = { idEmpresa: null, idCategory: null};
  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'id',
    'company',
    'category',
    'subcategory',
    'description',
    'nameFile',
    'document',
    'active'
  ];
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  documentFilter= <DocumentQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage: this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, idCompany: 0, idCategory:0,idSubCategory:0};

  dataSource = new MatTableDataSource<any>(this.items);
  constructor(private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private homeDocumentosService: HomeDocumentosService,
    private cdr: ChangeDetectorRef,
    paginatorIntl:MatPaginatorIntl,
    private empresaService: EmpresaService,
    private mastertableService:MastertableService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginatorx.matPag;
    this.load();
  }

  load() {
    this.homeDocumentosService.getListPagination(this.documentFilter).subscribe(res => {
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
          this.paginatorx.initPageRange();
        });
        // this.dataSource.paginator = this.paginator.matPag;
        this.ngAfterViewInit();
      });
      
      this.loadEmpresas();
      this.loadCategory();

    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
    this.homeDocumentosService.delete(row.id).subscribe(
      (res) => res
      ,
      (err) => {},
      () => {
        this.load();
      }
      );
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Documento' : 'Actualizar Documento';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogDocumentosComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
      console.log("🚀 ~ CrudHomeDocumentosComponent ~ openPopUp ~ res:", res)
      debugger;
        if(!res) {
       
          return;
        }
        
        if (isNew) {
          this.homeDocumentosService.add(res)
            .subscribe(
              data => {
             
              
              this.snack.open('¡Registro Agregado!', 'OK', { duration: 4000 })
            },
            (err) => {},
            () => {
              this.load();
            })
        } else {
          this.homeDocumentosService.update(res)
            .subscribe(
              data => {
            
              
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
  changeEmpresa(event) {
    if (event.value != 0) {
      this.items = this.items.filter(x => x.idCompany == event.value);
    }
  }
  loadEmpresas() {
    this.empresaService.getAll().subscribe(res => this.empresas = res);
  }
  loadCategory(){
    this.mastertableService.getByIdFather(1).subscribe(res => {this.categories = res},
      (err) => {},
      () => {
        this.categories=this.categories.filter(o => o.active===true);
    });
  }
  Filtrar() {
    this.homeDocumentosService.getListPagination(this.documentFilter).subscribe(res => {
      this.items = res.data.list;
      
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  res.data.totalItems;
      });
    },
      (err) => {},
      () => {
        this.dataSource = new MatTableDataSource<any>(this.items);
        this.ngAfterViewInit();
      });
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
      this.documentFilter.pagination.itemsPerPage = this.pageSize;
      this.documentFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.documentFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.load();
  }

  resetFilter(){
    this.documentFilter= <DocumentQueryFilter>{pagination:{
      currentPage:1,
      itemsPerPage:10,
      totalItems:0,
      totalPages:1,
      totalRows:0
    }, idCompany:  0,
      idCategory:0,
      idSubCategory:0};
    this.load();
  }

  changeSubCategory(event){
    let idCategoryMasterTable=this.categories.filter(x=>x.idType==event.value)[0].id;
    this.mastertableService.getByIdFather(idCategoryMasterTable).subscribe(res => {this.subcategories = res},
      (err) => {},
      () => {
        this.subcategories=this.subcategories.filter(o => o.active===true);
    });
  }

}
