import { EvaluationPostulantInternalService } from './../../../../../../data/service/evaluation-postulant-internal.service';
import { FileDto } from './../../../../../../data/schema/File/FileDto';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { PostulantService } from './../../../../../../data/service/job-postulant.service';
import { PostulantQueryFilter } from './../../../../../../data/schema/Postulant/PostulantQueryFilter';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { JobService } from '@app/data/service/job.service';

@Component({
    selector: 'app-postulants-job',
    templateUrl: 'postulants-job.component.html',
    styleUrls: ['./postulants-job.component.scss']
})

export class PostulantsJobComponent implements OnInit {
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
      idJob: 0, estudios: '', universidad: '', 
      experiencia: '', edadMinima : '', edadMaxima : '',
      salarioMinimo : '', salarioMaximo: '',
      genero:'',isWorking:'',keyWords:'',levelStudy:''

    };
    displayedColumns: string[] = [
      "check",
      "skill",
      "fullName",
      "documentNumber",
      "email",
      "cellPhone",
      "cvAttached",
      "state",
      "dateRegister",
    ];
    position: string = '';
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    keyWords: any[];

    constructor(private jobPostulantService: PostulantService,
        private route: ActivatedRoute,
        private router: Router,
        private jobService: JobService,
        private evaluationService: EvaluationPostulantInternalService,
        private snack: MatSnackBar) { }

    ngOnInit() {
        this.route.paramMap.subscribe((params: any) => {
            if (params) {
              this.filter.idJob = parseFloat(params.get("id"));
              this.getPostulants(true);
              this.getKeyWords();
            }
          });
     }

    add(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();
      
      if (value) {
        const obj = {
          id: 0,
          idJob: this.filter.idJob,
          idPostulant: 0,
          keyWord: value
        }
        this.jobService.createKeyWord(obj).subscribe(res => {
          this.keyWords = [];
          this.getPostulants(true);
          this.getKeyWords();
        });      
      }
      
      event.chipInput!.clear();
    }

    remove(fruit: any): void {
      const index = this.keyWords.indexOf(fruit);
      if (index >= 0) {
        this.jobService.deleteKeyWord(this.keyWords[index]).subscribe(res => {
          this.keyWords = [];
          this.getPostulants(false);
          this.getKeyWords();
        }); 
      }
    }

    getKeyWords() {
      this.jobService.getkeyWord(this.filter.idJob).subscribe((res) => {
        if (res.stateCode == 200) {
          this.keyWords = res.data;
          
        }
      });
    }

    getPostulants(incluirParams: boolean) {
        if (incluirParams) this.filter.includeFilterQuery = 1
        else  this.filter.includeFilterQuery = 0
        this.jobPostulantService.getPostulantsInternal(this.filter).subscribe((res) => {
          this.flowDT.data = res.data.list;
          
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = res.data.totalItems;
          });
    
          if (this.filter.idJob != 0) {
               this.position = this.flowDT.data.find(x => x.position).position;
          } 
        });
      }

      getFile(url, id) {
        const dto: FileDto = {
          contentType: "",
          file: null,
          fileName: null,
          fileUrl: url,
          id: id
        };
        this.jobPostulantService.getFileInternal(dto).subscribe((res) => {
          if (res.stateCode == 200) {
            let file = res.data;
            this.downLoad(file.file, file.contentType, file.fileName);
          }
        });
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
    
        this.getPostulants(true);
      }

      downLoad(archivo, contentType, name) {
        let link = document.createElement("a");
        let blobArchivo = this.base64ToBlob(archivo, contentType);
        let blob = new Blob([blobArchivo], { type: contentType });
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
      }
    
      public base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
        b64Data = b64Data.replace(/\s/g, ""); 
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);
    
          let byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
      }

      createEvaluation() {

        this.selection.selected.forEach((element) => {
          let found = this.listPostulants.find(
            (e) => e.idJob == element.idJob && e.idPostulant==element.idPerson
          );
          if (found === undefined) {
           
            this.listPostulants.push({
              id: null,
              idEvaluation: null,
              idPostulant: element.idPerson,
              position: element.position,
              state: 907,
              idJob: element.idJob, 
              idPositionCurrently: element.idPositionCurrently,
            });

          }
        });
        
        if(this.listPostulants.length===0){
          this.snack.open("ERROR: Debe seleccionar al menos un registro.", "Error", { duration: 4000 });  
          return;
        }

        this.evaluationService
          .createEvaluation(this.listPostulants)
          .subscribe((res) => {
            if (res.stateCode == 200) {
              if (res.messageError.length > 0) {
                this.snack.open(res.messageError.join('\n'), "Advertencia", { duration: 4000 });
              }
              this.router.navigate([`/humanmanagement/evaluation-postulants/${res.data.id}`], {
                skipLocationChange: true
              });
              this.listPostulants = [];
            }
          });
      }
  
      exportar(): void {
            this.jobPostulantService.getPostulantsInternalExport(this.filter).subscribe(
             (res: any) => {
              
              try {
              const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
              const b64Data = res;
              
              const blob = this.b64toBlob(b64Data, contentType);
              
              const blobUrl = URL.createObjectURL(blob);
              
              const _afile = document.getElementById('afile') as HTMLAnchorElement;
              _afile.href = blobUrl;
              _afile.download = 'Reporte de Postulantes Interno.xlsx'
              _afile.click();
              window.URL.revokeObjectURL(blobUrl);
            } catch (e) {
            }
          }, (error: any) => {
    
            var obj = error;
          }
        );
      }
    
      b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }

      selectToggleFlag = false;
      toggleSelectIsWorking() {
    
        this.selectToggleFlag = !this.selectToggleFlag;
        if(this.selectToggleFlag){
          this.filter.isWorking='1'
        }else{
          this.filter.isWorking=''
        }
        
      }
    
}