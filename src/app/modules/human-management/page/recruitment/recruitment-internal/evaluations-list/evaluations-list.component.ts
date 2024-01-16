import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { PostulantQueryFilter } from './../../../../../../data/schema/Postulant/PostulantQueryFilter';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EvaluationPostulantInternalService } from '@app/data/service/evaluation-postulant-internal.service';

@Component({
    selector: 'app-evaluations-list',
    templateUrl: 'evaluations-list.component.html',
    styleUrls: ['./evaluations-list.component.scss']
})

export class EvaluationsListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    flowDT: MatTableDataSource<any> = new MatTableDataSource([]);
    selection = new SelectionModel<any>(true, []);
    listPostulants: any[] = [];
    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
  
    pageSizeOptions: number[] = [5, 10, 25, 100];
  
    filter = <PostulantQueryFilter>{
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1,
        totalRows: 0,
      },
      idJob: 0,
    };
    displayedColumns: string[] = [
      "action",
      "id",
      "codReq",
      "positionRequired",
      "dateRegister",
      "state",
    ];
    constructor(private evaluationService: EvaluationPostulantInternalService, 
      private router: Router,
      private route: ActivatedRoute ) { }


    ngOnInit() { 
        this.route.paramMap.subscribe((params: any) => {
            if (params) {
              this.filter.idJob = parseFloat(params.get("id"));
              this.getEvaluations();
            }
          });
    }

    getEvaluations() {
        this.evaluationService.getEvaluationList(this.filter).subscribe(res => {
           this.flowDT.data = res.data.list;
           setTimeout(() => {
             this.paginator.pageIndex = this.currentPage;
             this.paginator.length = res.data.totalItems;
           });
        })
    }

    pageChanged(event: PageEvent) {
       if (this.pageSize !== event.pageSize) {
         this.pageSize = event.pageSize;
         this.filter.pagination.itemsPerPage = this.pageSize;
         this.filter.pagination.currentPage = 1;
         this.currentPage = 0;
       } else {
         this.filter.pagination.currentPage = event.pageIndex + 1;
         this.currentPage = event.pageIndex;
       }
   
       this.getEvaluations();
     }

     getDetailPath(id: number): void {
      this.router.navigate(['/humanmanagement/evaluation-postulants',id], {
        skipLocationChange: true
      })
    }
}