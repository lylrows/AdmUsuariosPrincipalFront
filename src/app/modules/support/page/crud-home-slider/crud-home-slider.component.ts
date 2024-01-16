import { DialogSliderComponent } from './dialog-slider/dialog-slider.component';
import { egretAnimations } from '../../../../shared/animations/egret-animations';
import { AppLoaderService } from './../../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from './../../../../shared/services/app-confirm/app-confirm.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit,AfterViewInit, ChangeDetectorRef,ViewChild} from '@angular/core';
import { SliderService } from './../../../../data/service/slider.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator,MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import { Slider } from "app/data/schema/slider";
import { MatSort } from '@angular/material/sort';
import { SliderQueryFilter } from './../../../../data/schema/Home/SliderQueryFilter';
import { MastertableService } from './../../../../data/service/mastertable.service';
import { Mastertable } from './../../../../data/schema/mastertable';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';

@Component({
  selector: 'app-crud-home-slider',
  templateUrl: './crud-home-slider.component.html',
  styleUrls: ['./crud-home-slider.component.scss'],
  animations: egretAnimations
})
export class CrudHomeSliderComponent implements AfterViewInit  {

  public items: Slider[]=[];
  selectedOption;
  slider:Slider;
  public types: Mastertable[];
  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'id',
    'nametype',
    'filename',
    'order',
    'image',
    'active'
  ];
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  sliderFilter= <SliderQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  },idType:0};//, idCompany: 0, nombreArea: ""};

  dataSource = new MatTableDataSource<any>(this.items);
  


  constructor( private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private sliderService: SliderService,
    private cdr: ChangeDetectorRef,
    paginatorIntl:MatPaginatorIntl,
    private mastertableService:MastertableService) { 
      
    }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginatorx.matPag;
    this.load();
    //this.paginatorIntl.itemsPerPageLabel = "Registros por página";
  }

  load() {
    this.sliderService.getListPagination(this.sliderFilter).subscribe(res => {
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
        this.ngAfterViewInit();
      });
      this.loadType();
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  deleteItem(row) {
    /*const formSlider = new FormData();
    this.slider ={
      id: row.id,
      filename: "",
      filenamefolder: "",
      order: row.order,
      active: false,
      idUserRegister: 1,
      idUserUpdate:1
    };*/
    this.sliderService.delete(row.id).subscribe(
      data => {
      },
      (err) => {},
      () => {
        this.load();
      }
      );
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
  

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Slider' : 'Actualizar Slider';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogSliderComponent, {
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
          this.sliderService.add(res)
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
          this.sliderService.update(res)
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

  changedPageSize(event: PageEvent) {
    this.setPage(event.pageSize, event.pageIndex);
  }

  changedPageNumber(pagina: number) {
    this.setPage(this.pageSize, pagina);
  }

  setPage(pageSize: number, pageIndex: number) {
    if (this.pageSize !== pageSize){
      this.pageSize = pageSize;  
      this.sliderFilter.pagination.itemsPerPage = this.pageSize;
      this.sliderFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.sliderFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.load();
  }


  loadType(){
    this.mastertableService.getByIdFather(25).subscribe(res => {this.types = res},
      (err) => {},
      () => {
        this.types=this.types.filter(o => o.active===true);
    });
  }
  Filtrar(){
    this.sliderService.getListPagination(this.sliderFilter).subscribe(res => {
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
  resetFilter(){
    this.sliderFilter= <SliderQueryFilter>{pagination:{
      currentPage:1,
      itemsPerPage:10,
      totalItems:0,
      totalPages:1,
      totalRows:0
    },idType:0};
    this.load();
  }
}
