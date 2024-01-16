import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { JobInternalService } from '@app/data/service/jobs-internal.service';
import { JobDto } from './../../../../../data/schema/Job/job';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobDetailDialogComponent } from './dialog/job-detail-dialog.component';
import { JwtAuthService } from '@app/shared/services/auth/jwt-auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-job-detail',
    templateUrl: 'job-detail.component.html',
    styleUrls: ['./job-detail.component.scss']
})

export class JobDetailComponent implements OnInit {

    textoHeader:string = "";
    job: JobDto;
    idjob: number;
    isPostulant: boolean = false;
    user: any;
    constructor(private jobService: JobInternalService, 
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private snack: MatSnackBar,
                private jwtService: JwtAuthService) { 
                    this.user = this.jwtService.getUser();
                }

    ngOnInit() { 
        this.route.paramMap.subscribe((params: any) => {
            if (params) {
                this.idjob = parseFloat(params.get('id'));
                this.loadJob(this.idjob);
                this.validateJobPostulant();
            }
        })
    }

    validateJobPostulant() {
        this.jobService.validateJobPostulant(this.user?.id, this.idjob).subscribe(res => {
            if (res.stateCode == 200) {
                this.isPostulant = res.data;
            }
        })
    }


    loadJob(idjob) {
        this.jobService.getJobById(idjob).subscribe(res => {
            this.job = res.data;
            //get company jobs
            
            switch(res.data.idcompany) {
                case 1://Campo Fe
                    this.textoHeader = "En el momento más difícil, usted no estará solo";
                    break;
                    case 2://Prestafe
                    this.textoHeader = "Pendiente";
                      break;
                    case 3://Fesalud
                    this.textoHeader = "Salud familiar digna al alcance de todos";
                      break;
                    case 4://Grupo Fe
                    this.textoHeader = "Contribuimos positivamente con la vida de las personas";
                      break;
              }
        })
    }


    postular() {
        Swal.fire({ 
            icon: 'info',
            text: 'Recuerde informar a su Jefe inmediato antes de finalizar el proceso de Postulación'
          }).then(result => {
                let title = 'Informacion adicional'
                let dialogRef: MatDialogRef<any> = this.dialog.open(JobDetailDialogComponent, {
                    width: "720px",
                    disableClose: true,
                    data: { title: title, payload: null, idjob: this.idjob },
                });

                dialogRef.afterClosed().subscribe(res => {
                    if (res == true) {
                        this.isPostulant = res;
                        this.snack.open('Postulado correctamente', "Ok", { duration: 4000 });
                    }
                })
          });
    }
}