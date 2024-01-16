import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { PerformanceService } from "@app/data/service/performance.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-evaluation-resume",
  templateUrl: "./evaluation-resume.component.html",
  styleUrls: ["./evaluation-resume.component.scss"],
})
export class EvaluationResumeComponent implements OnInit {
  id: number = 0;
  header: any = {
    evaluatedName: "",
    evaluatedDNI: "",
    evaluatorName: "",
    evaluatorDNI: "",
    chargeName: "",
    areaName: "",
  };
  idUser = 0;
  iduserEmployee = 0;
  iduserprofile = 0;
  resaltado = '';
  profilesRRHH=[4,20,21,23];

  constructor(
    private route: ActivatedRoute,
    private _performanceService: PerformanceService,
    private snack: MatSnackBar,
    private _router: Router
  ) {
    
    const user = JSON.parse(localStorage.getItem('GRUPOFE_USER'));

    this.idUser = user.id;
    this.iduserEmployee = user.nid_employee;
    this.iduserprofile = user.nid_profile;
    
  }

  title = "Detalle de Evaluación";
  detail: any[] = [];
  neje_x = 0;
  neje_y = 0;

  datasourceDT1G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT1G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT2G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT2G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT3G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT3G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT4G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT4G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT5G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT5G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT6G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT6G2: MatTableDataSource<any> = new MatTableDataSource([]);

  datasourceDT7G1: MatTableDataSource<any> = new MatTableDataSource([]);
  datasourceDT7G2: MatTableDataSource<any> = new MatTableDataSource([]);

  displayedColumnsG1: string[] = [
    "jobObjectives",
    "indicatorOrganizational",
    "goal",
    "weight",
    "startDate",
    "endDate",
  ];
  displayedColumnsG2: string[] = [
    "organizationalProficiency",
    "proficiencyDescription",
    "idProficiencyLevel",
    "definitionLevel",
    "qualification",
    "actionsToImprove",
    "indicatorOrganizational",
    "startDate",
    "endDate",
  ];

  dateTextInicio = "";
  dateTextRevision = "";
  dateTextCierre = "";
  idEvaluated = 0;
  idEvaluator = 0;
  dateStartText = "";
  dateEndText = "";

  bIsEvaluated = false;
  bIsEvaluator = false;
  bIsManager = false;
  arProfilesAllowed = [2, 9, 10, 11, 20, 21];

  statusInicio = 0;
  statusRevision = 0;
  statusCierre = 0;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params["id"];

      if (this.id) {
        
        
        this.getEvaluationDetail();
      }
    });
  }

  getEvaluationDetail(): void {
    this._performanceService
      .getEvaluationDetail(Number(this.id))
      .subscribe((resp) => {
        
        this.header = resp.header;
        this.detail = resp.details;

        let nFirstAction = 1;

        let existsdata = this.detail.filter(
          (i) => i.numberAction == 50 && i.jobObjectives !== null
        );

        if (existsdata.length > 0) {
          nFirstAction = 2;
        }

        this.idEvaluated = this.header.idUserEvaluated;
        this.idEvaluator = this.header.idUserEvaluator;

        this.datasourceDT1G1 = new MatTableDataSource(this.detail.filter(i => i.numberAction === nFirstAction && i.idGroup == 1 && i.jobObjectives !== null));
        this.datasourceDT1G2 = new MatTableDataSource(this.detail.filter(i => i.numberAction === nFirstAction && i.idGroup == 2));

        this.datasourceDT2G1 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 3 && i.idGroup == 1 && i.jobObjectives !== null));
        this.datasourceDT2G2 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 3 && i.idGroup == 2));
        
        this.datasourceDT3G1 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 4 && i.idGroup == 1 && i.jobObjectives !== null));
        this.datasourceDT3G2 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 4 && i.idGroup == 2));

        this.datasourceDT4G1 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 7 && i.idGroup == 1 && i.jobObjectives !== null));
        this.datasourceDT4G2 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 7 && i.idGroup == 2));

        this.datasourceDT5G1 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 8 && i.idGroup == 1 && i.jobObjectives !== null));
        this.datasourceDT5G2 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 8 && i.idGroup == 2));

        this.datasourceDT6G1 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 10 && i.idGroup == 1 && i.jobObjectives !== null));
        this.datasourceDT6G2 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 10 && i.idGroup == 2));

        this.datasourceDT7G1 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 11 && i.idGroup == 1 && i.jobObjectives !== null));
        this.datasourceDT7G2 = new MatTableDataSource(this.detail.filter(i => i.numberAction === 11 && i.idGroup == 2));


        let pasoInicio = this.detail.filter((i) => i.numberAction === 3 && i.idGroup == 2)[0];
        let pasoRevision = this.detail.filter((i) => i.numberAction === 7 && i.idGroup == 2)[0];
        let pasoCierre = this.detail.filter((i) => i.numberAction === 11 && i.idGroup == 2)[0];
        
        if (pasoInicio !== undefined) {
          this.dateTextInicio = pasoInicio.registerDateText;
          this.statusInicio = 1;
        } else {
          this.dateTextInicio = "Pendiente";
          this.resaltado = 'Inicio';
          this.statusInicio = 0;
        }

        if (pasoRevision !== undefined) {
          this.dateTextRevision = pasoRevision.registerDateText;
          this.statusRevision = 1;
        } else {
          this.dateTextRevision = "Pendiente";
          this.statusRevision = 0;
          if (this.resaltado == '')
            this.resaltado = 'Revision';
        }

        if (pasoCierre !== undefined) {
          this.dateTextCierre = pasoCierre.registerDateText;
          this.statusCierre = 1;
        } else {
          this.dateTextCierre = "Pendiente";
          this.statusCierre = 0;
          if (this.resaltado == '')
            this.resaltado = 'Cierre';
        }


        if (this.idUser === this.idEvaluator) {
          this.bIsEvaluator = true;
        }

        if (this.idUser === this.idEvaluated) {
          this.bIsEvaluated = true;
        }

        
        var a = this.arProfilesAllowed.indexOf(this.iduserprofile);

        if (a > -1) {
          this.bIsManager = true;
        }


        let sum_group1 = 0;
        this.datasourceDT7G1.data.forEach(function (value) {
          let goal = value.goal;
          let weight = value.weight;

          sum_group1 += goal * weight;
        });

        this.neje_x = sum_group1 / 100;

        let sum_group2 = 0;
        this.datasourceDT7G2.data.forEach(function (value) {
          let expect = value.idProficiencyLevel;
          let real = value.qualification;

          sum_group2 += (real * 100) / expect;
        });

        this.neje_y = sum_group2 / this.datasourceDT7G2.data.length;
      });
  }

  aumentar_x() {
    this.neje_x = this.neje_x + 1;
  }
  aumentar_y() {
    this.neje_y = this.neje_y + 1;
  }
  restar_x() {
    this.neje_x = this.neje_x - 1;
  }
  restar_y() {
    this.neje_y = this.neje_y - 1;
  }

  showdetail(actionnumber): void {
    switch (actionnumber) {
      case 3:
        if (this.statusInicio == 0) {
          this.snack.open("¡La Evaluación Inicio se encuentra PENDIENTE!", "OK", { duration: 4000 });
          return;
        }
        break;
      case 7:
        if (this.statusRevision == 0) {
          this.snack.open("¡La Evaluación Seguimiento se encuentra PENDIENTE!", "OK", { duration: 4000 });
          return;
        }
        break;
      case 11:
        if (this.statusCierre == 0) {
          this.snack.open("¡La Evaluación Cierre se encuentra PENDIENTE!", "OK", { duration: 4000 });
          return;
        }
        break;
      default:
        return;
        break;
    }

    this._router.navigate([`humanmanagement/evaluation-resume-detail/${Number(this.id)}/${actionnumber}`], {
      skipLocationChange: true
    });
  }
  showninebox() {
    this._router.navigate([`humanmanagement/nine-box`], {
      skipLocationChange: true
    });
  }

}
