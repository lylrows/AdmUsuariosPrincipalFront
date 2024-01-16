import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Areas } from "@app/data/schema/areas";
import { Empresa } from "@app/data/schema/empresa";
import { AreaService } from "@app/data/service/areas.service";
import { EmpresaService } from "@app/data/service/empresa.service";
import { PerformanceService } from "@app/data/service/performance.service";
import { EChartsOption } from "echarts";
import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-my-team-resume",
  templateUrl: "./my-team-resume.component.html",
  styleUrls: ["./my-team-resume.component.scss"],
})
export class MyTeamResumeComponent implements OnInit {
  @ViewChild("DetailDialog") DetailDialog: TemplateRef<any>;
  responsive = false;
  screenWidth: number;

  constructor(
    private empresaService: EmpresaService,
    private _performanceService: PerformanceService,
    private areaService: AreaService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {
    const user = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.idprofileuser = user.nid_profile.toString();
    this.iduser = Number(user.id);
    this.nid_employee = Number(user.nid_employee);

    if (this.iduser === 744 || this.iduser === 7) {
      this.bUsuarioDobleEmpresa = true;
    } else {
      this.bUsuarioDobleEmpresa = false;
    }
  }
  idprofileuser: string = "0";
  iduser: number = 0;
  bUsuarioDobleEmpresa = false;

  conceptosFC = new FormControl("");
  campanaFC = new FormControl("");
  bussineFC = new FormControl("");
  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  etapaFC = new FormControl("");
  subAreaFC = new FormControl("");
  cargoFC = new FormControl("");
  colaboradorFC = new FormControl("");
  empresas: Empresa[];
  lstcargo: any[] = [];
  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];
  listcampaign: any[] = [];

  disabledEmpresa: boolean = true;
  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  disabledCargo: boolean = true;
  _chartOptionComp: EChartsOption;
  _chartOptionObj: EChartsOption;
  nid_position: number = 0;

  perfileseditores = ["1", "20", "21"];
  nid_employee: number = 0;

  // VALORES DE ETAPAS PARA EL GRAFICO
  INICIO = "3";
  VERIFICACION = "7";
  EVALUACION = "11";

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 600) {
      this.responsive = true;
    }
    // this.getListCampanias();
    this.loadEmpresas();

    debugger;
    if (this.perfileseditores.indexOf(this.idprofileuser) === -1) {
      this.disabledEmpresa = true;
      this.disabledGerencia = true;

      if (this.bUsuarioDobleEmpresa === true) {
        this.disabledEmpresa = false;
        this.disabledGerencia = false;
      }
      this.getCampaingByUser();
    } else {
      this.disabledEmpresa = false;
      this.disabledGerencia = false;
      this.getListCampanias();
    }

    this.websiteMultiCtrl.setValue(this.lstcargo[1]);
    this.filteredWebsitesMulti.next(this.lstcargo.slice());

    this.websiteMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterWebsiteMulti();
      });

    // Campañas
    this.campanasMultiCtrl.setValue(this.listcampaign[1]);
    this.filteredCampanasMulti.next(this.listcampaign.slice());

    this.campanasMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCampanasMulti();
      });
  }

  loadEmpresas() {
    this.empresaService.getCompanybyUser().subscribe((res) => {
      this.empresas = res;
      if (this.empresas.length > 0) {
        if (this.perfileseditores.indexOf(this.idprofileuser) === -1) {
          if (this.bUsuarioDobleEmpresa !== true) {
            this.disabledEmpresa = true;
            this.disabledGerencia = true;
            this.bussineFC.setValue(this.empresas[0].id);
            this.changeEmpresa();
          }
        }
      }
    });
  }
  changeSubArea(): void {
    this.getChargesByCompanyArea();
  }
  getChargesByCompanyArea() {
    /* TODO */

    let arraystring = "";
    if (this.areaFC.value != null && this.areaFC.value != []) {
      const value = this.areaFC.value;

      value.map((e) => {
        arraystring = arraystring + e + ",";
      });

      arraystring = arraystring.substring(0, arraystring.length - 1);
    }

    let arraySubarea = "";
    if (this.subAreaFC.value != null && this.subAreaFC.value != []) {
      const value = this.subAreaFC.value;

      value.map((e) => {
        arraySubarea = arraySubarea + e + ",";
      });

      arraySubarea = arraySubarea.substring(0, arraySubarea.length - 1);
    }

    const payload = {
      nidcompany: Number(this.bussineFC.value),
      nidgerencia: Number(this.gerenciaFC.value),
      nidarea: arraystring,
      nidsubarea: arraySubarea,
    };

    this._performanceService
      .GetChargesByCompanyAreaMulti(payload)
      .subscribe((res) => {
        this.lstcargo = res;
        this.websiteMultiCtrl.setValue([]);
        this.websiteMultiCtrl.setValue([this.lstcargo[1]]);
        this.filteredWebsitesMulti.next(this.lstcargo.slice());
        this.websiteMultiCtrl.setValue([]);

        this.websiteMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterWebsiteMulti();
          });
      });
  }
  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;

    this.getChargesByCompanyArea();
  }
  loadSubAreas() {
    let arraystring = "";
    if (this.areaFC.value != null && this.areaFC.value != []) {
      const value = this.areaFC.value;

      value.map((e) => {
        arraystring = arraystring + e + ",";
      });

      arraystring = arraystring.substring(0, arraystring.length - 1);
    }

    const payload = {
      IdArea: arraystring,
    };
    this.cargoFC.setValue("");
    this.areaService.getSubAreasByAreaMultiple(payload).subscribe((res) => {
      this.subAreas = res.data;
      if (this.subAreas.length == 0) {
        this.disabledSubArea = true;
      } else {
        this.disabledSubArea = false;
      }
    });
  }
  changeGerencia(): void {
    this.loadAreas();

    this.areaFC.setValue("");
    this.subAreaFC.setValue("");
    this.cargoFC.setValue("");

    this.disabledArea = false;
    this.disabledSubArea = true;

    this.getChargesByCompanyArea();
  }
  loadAreas() {
    const payload = {
      IdArea: Number(this.gerenciaFC.value),
    };
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas = res.data;
    });
  }
  changeEmpresa(): void {
    this.disabledArea = false;
    this.disabledCargo = false;
    this.areas = [];
    this.areaFC.setValue("");
    this.subAreaFC.setValue("");
    this.cargoFC.setValue("");
    this.lstcargo = [];

    this.loadGerencia();
    this.disabledGerencia = false;

    if (this.perfileseditores.indexOf(this.idprofileuser) === -1) {
      this.disabledEmpresa = true;
      this.disabledGerencia = true;

      if (this.bUsuarioDobleEmpresa === true) {
        this.disabledEmpresa = false;
        this.disabledGerencia = false;
      }
    } else {
      this.disabledEmpresa = false;
      this.disabledGerencia = false;
    }

    this.getChargesByCompanyArea();
  }

  loadGerencia() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;
    const payload = {
      IdUser: idUser,
      IdCompany: Number(this.bussineFC.value),
    };
    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;

      if (this.gerencias.length > 0) {
        this.gerenciaFC.setValue(this.gerencias[0].nid_area);
        this.changeGerencia();
      }
    });
  }

  changeCampania() {
    this.getConfigDetailLevelNineBoxByCampaign();
  }
  getConfigDetailLevelNineBoxByCampaign(): void {
    const payload = {
      nid_campaing: Number(this.campanaFC.value),
    };
  }
  private CompetenciasChartOptions(
    indicators,
    data,
    legends,
    compdata_initial,
    compdata_verification,
    compdata_evaluation
  ) {
    debugger;
    const value = this.etapaFC.value;
    console.log(
      "🚀 ~ MyTeamResumeComponent ~ ShowCompetencias ~ value:",
      value
    );
    const option_grafico: any[] = [];
    if (value !== "") {
      value.map((e) => {
        option_grafico.push(e);
      });
    }

    // INICIO - TODOS LOS GRAFICOS  - DESPUES SIMPLIFICAR ESTE BLOQUE DE CODIGO
    if (option_grafico.length === 0 || option_grafico.length === 3) {
      this._chartOptionComp = {
        title: [
          {
            text: "Inicio",
            left: "50%",
            top: "4%",
            textAlign: "center",
          },
          {
            text: "Verificación",
            left: "50%",
            top: "36%",
            textAlign: "center",
          },
          {
            text: "Evaluación",
            left: "50%",
            top: "68%",
            textAlign: "center",
          },
        ],
        legend: {
          data: legends,
          type: "scroll",
          pageButtonItemGap: 20,
        },
        radar: [
          {
            indicator: indicators,
            center: ["50%", "21%"],
            radius: 100,
          },
          {
            indicator: indicators,
            radius: 100,
            center: ["50%", "53%"],
          },
          {
            indicator: indicators,
            center: ["50%", "85%"],
            radius: 100,
          },
        ],
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "axis",
            },
            areaStyle: {},
            data: compdata_initial,
          },
          {
            type: "radar",
            radarIndex: 1,
            areaStyle: {},
            data: compdata_verification,
          },
          {
            type: "radar",
            radarIndex: 2,
            areaStyle: {},
            data: compdata_evaluation,
          },
        ],
      };
      
    } else {
      if (option_grafico.length === 1) {
        // INICIO
        if (option_grafico.includes(this.INICIO)) {
          this._chartOptionComp = {
            title: [
              {
                text: "Inicio",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_initial,
              },
            ],
          };

          return;
        }

        // VERIFICACION
        if (option_grafico.includes(this.VERIFICACION)) {
          this._chartOptionComp = {
            title: [
              {
                text: "Verificación",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_verification,
              },
            ],
          };
          return;
        }
        // EVALUACION
        if (option_grafico.includes(this.EVALUACION)) {
          this._chartOptionComp = {
            title: [
              {
                text: "Evaluación",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_evaluation,
              },
            ],
          };
          return;
        }
      
       
      }
      if (option_grafico.length === 2) {
        // INICIO  - VERIFICACION
        if (
          option_grafico.includes(this.INICIO) &&
          option_grafico.includes(this.VERIFICACION)
        ) {
          this._chartOptionComp = {
            title: [
              {
                text: "Inicio",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
              {
                text: "Verificación",
                left: "50%",
                top: "36%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
              {
                indicator: indicators,
                radius: 100,
                center: ["50%", "53%"],
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_initial,
              },
              {
                type: "radar",
                radarIndex: 1,
                areaStyle: {},
                data: compdata_verification,
              },
            ],
          };

          return;
        }

        // INICIO  - EVALUACION
        if (
          option_grafico.includes(this.INICIO) &&
          option_grafico.includes(this.EVALUACION)
        ) {
          this._chartOptionComp = {
            title: [
              {
                text: "Inicio",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
              {
                text: "Evaluación",
                left: "50%",
                top: "36%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
              {
                indicator: indicators,
                center: ['50%', '53%'],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_initial,
              },
              {
                type: "radar",
                radarIndex: 1,
                areaStyle: {},
                data: compdata_evaluation,
              },
            ],
          };

          return;
        }

        // VERIFICACION  - EVALUACION
        if (
          option_grafico.includes(this.VERIFICACION) &&
          option_grafico.includes(this.EVALUACION)
        ) {
          this._chartOptionComp = {
            title: [
              {
                text: "Verificación",
                left: "50%",
                top: '4%',
                textAlign: "center",
              },
              {
                text: "Evaluación",
                left: "50%",
                top: "36%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                radius: 100,
                center: ['50%', '21%'],
              },
              {
                indicator: indicators,
                center: ["50%", "53%"],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                radarIndex: 0,
                areaStyle: {},
                data: compdata_verification,
              },
              {
                type: "radar",
                radarIndex: 1,
                areaStyle: {},
                data: compdata_evaluation,
              },
            ],
          };
          return;
        }
      }
    }

    // FIN - TODOS LOS GRAFICOS

    /* 
    this._chartOptionComp= {
      title: [{
        text: 'Inicio',
        left: '50%',
        top: '4%',
        textAlign: 'center'
      },
      {
        text: 'Verificación',
        left: '50%',
        top: '36%',
        textAlign: 'center'
      },
      {
        text: 'Evaluación',
        left: '50%',
        top: '68%',
        textAlign: 'center'
      }],
      legend: {
        data: legends,
        type:'scroll',
        pageButtonItemGap:20
        
      },
      radar: [
        {
          indicator: indicators,
          center: ['50%', '21%'],
          radius: 100
        },
        {
          indicator: indicators,
          radius: 100,
          center: ['50%', '53%']
        },
        {
          indicator: indicators,
          center: ['50%', '85%'],
          radius: 100
        }
      ],
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'axis'
          },
          areaStyle: {},
          data: compdata_initial
        },
        {
          type: 'radar',
          radarIndex: 1,
          areaStyle: {},
          data: compdata_verification
        },
        {
          type: 'radar',
          radarIndex: 2,
          areaStyle: {},
           data: compdata_evaluation
        }
      ]
    };
    */
  }

  private ObjetivosChartOptions(legendsobj, categoriesobj, dataobj) {
    const seriesLabel = {
      show: true,
    };

    if (this.responsive) {
      this._chartOptionObj = {
        title: {
          text: "Objetivos",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        legend: {
          data: legendsobj,
          left: "2%",
          top: "5%",
          type: "scroll",
          pageButtonItemGap: 20,
        },
        grid: {
          bottom: "10%",
          top: "20%",
        },
        xAxis: {
          type: "value",
          name: "Resultado",
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: categoriesobj,
        },
        series: dataobj,
      };
    } else {
      this._chartOptionObj = {
        title: {
          text: "Objetivos",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        legend: {
          data: legendsobj,
          orient: "vertical",
          height: "600",
          width: "200",
          left: "2%",
          top: "5%",
          type: "scroll",
          pageButtonItemGap: 20,
        },
        grid: {
          left: 600,
        },
        xAxis: {
          type: "value",
          name: "Resultado",
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: categoriesobj,
        },
        series: dataobj,
      };
    }
  }

  ShowCompetencias() {
    // if (Number(this.campanaFC.value)===0){
    //   this.snack.open("Es necesario que seleccione una campaña.", "OK", { duration: 4000 });
    //   return
    // }
    if (Number(this.gerenciaFC.value) === 0) {
      this.snack.open("Es necesario que seleccione una gerencia.", "OK", {
        duration: 4000,
      });
      return;
    }

    //Campania
    // let arrayCampana = "";
    // if (this.campanaFC.value != null && this.campanaFC.value != []) {
    //   const value = this.campanaFC.value;

    //   value.map((e) => {
    //     arrayCampana = arrayCampana + e + ",";
    //   });

    //   arrayCampana = arrayCampana.substring(0, arrayCampana.length - 1);
    // }

    // GERENCIA
    // AREA
    let arraystring = "";
    if (this.areaFC.value != null && this.areaFC.value != []) {
      const value = this.areaFC.value;

      value.map((e) => {
        arraystring = arraystring + e + ",";
      });

      arraystring = arraystring.substring(0, arraystring.length - 1);
    }

    // SUBAREA
    let arraySubarea = "";
    if (this.subAreaFC.value != null && this.subAreaFC.value != []) {
      const value = this.subAreaFC.value;

      value.map((e) => {
        arraySubarea = arraySubarea + e + ",";
      });

      arraySubarea = arraySubarea.substring(0, arraySubarea.length - 1);
    }

    let arrayCargos = "";
    if (
      this.websiteMultiCtrl.value !== null &&
      this.websiteMultiCtrl.value != []
    ) {
      const value = this.websiteMultiCtrl.value;
      value.map((e) => {
        arrayCargos = arrayCargos + e.nid_charge + ",";
      });
    }

    // Campañas
    let arrayCampana = "";
    if (
      this.campanasMultiCtrl.value !== null &&
      this.campanasMultiCtrl.value != []
    ) {
      const value = this.campanasMultiCtrl.value;
      value.map((e) => {
        arrayCampana = arrayCampana + e.nid_campaign + ",";
      });
    }

    let arrayEtapas = "";
    if (this.etapaFC.value != null && this.etapaFC.value != []) {
      const value = this.etapaFC.value;
      console.log(
        "🚀 ~ MyTeamResumeComponent ~ ShowCompetencias ~ value:",
        value
      );

      value.map((e) => {
        arrayEtapas = arrayEtapas + e + ",";
      });
      console.log(
        "🚀 ~ MyTeamResumeComponent ~ ShowCompetencias ~ arrayEtapas:",
        arrayEtapas
      );

      arrayEtapas = arrayEtapas.substring(0, arrayEtapas.length - 1);
    }

    const payload = {
      nidCampana: arrayCampana, //Number(this.campanaFC.value),

      nidcargo: arrayCargos,

      companyid: Number(this.bussineFC.value),
      gerenciaid: Number(this.gerenciaFC.value),
      areaid: arraystring,
      subareaid: arraySubarea,
      etapas: arrayEtapas,
    };

    this._performanceService.GetMyTeamResumeComp(payload).subscribe((res) => {
      console.log(
        "🚀 ~ MyTeamResumeComponent ~ this._performanceService.GetMyTeamResumeComp ~ res:",
        res
      );
      if (res.stateCode === 200) {
        this.CompetenciasChartOptions(
          res.data.indicator,
          res.data.data,
          res.data.legends,
          res.data.compdata_initial,
          res.data.compdata_verification,
          res.data.compdata_evaluation
        );
        this.ObjetivosChartOptions(
          res.data.objlegend,
          res.data.objcategories,
          res.data.objdata
        );

        if (this.responsive) {
          this.dialog.open(this.DetailDialog, {
            width: "100%",
            maxWidth: "100hv",
          });
        }
      } else {
        this.snack.open("¡Ocurrió un error!", "ERROR", { duration: 4000 });
        return;
      }
    });
  }

  getListCampanias(): void {
    this._performanceService.GetCampaingByEvaluation().subscribe((resp) => {
      console.log(
        "🚀 ~ this._performanceService.GetCampaingByEvaluation ~ resp:",
        resp
      );
      this.listcampaign = resp.data;
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiCtrl.setValue([this.listcampaign[1]]);
      this.filteredCampanasMulti.next(this.listcampaign.slice());
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCampanasMulti();
      });  
    });
  }

  getCampaingByUser() {
    const payload = {
      nidEmployee: this.nid_employee,
    };
    this._performanceService.getCampaingByUser(payload).subscribe((resp) => {
      console.log("🚀 ~ this._performanceService.getCampaingByUser ~ resp:",resp);
      this.listcampaign = resp.data;
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiCtrl.setValue([this.listcampaign[1]]);
      this.filteredCampanasMulti.next(this.listcampaign.slice());
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCampanasMulti();
      });  

    });
  }
  selectedTabValue(event) {
    if (event.index === 0) {
    } else if (event.index === 1) {
    }
  }
  resetFilter() {
    this.disabledArea = false;
    this.disabledCargo = false;
    this.areas = [];
    this.areaFC.setValue("");
    this.subAreaFC.setValue("");
    this.cargoFC.setValue("");
    this.lstcargo = [];
    this.websiteMultiCtrl.setValue("");
    this.campanasMultiCtrl.setValue("");
    this.gerenciaFC.setValue("");
    this.etapaFC.setValue("");

    if (this.perfileseditores.indexOf(this.idprofileuser) === -1) {
      
      if (this.bUsuarioDobleEmpresa !== true) {
        this.disabledEmpresa = true;
        this.disabledGerencia = true;
        // this.getListCampanias();
        // this.loadEmpresas();
      }
      this.getCampaingByUser();
    } else {
      this.disabledEmpresa = false;
      this.disabledGerencia = false;
      this.getListCampanias();
    }
  }

  public websiteMultiCtrl: FormControl = new FormControl();
  public websiteMultiFilterCtrl: FormControl = new FormControl();
  public filteredWebsitesMulti: ReplaySubject<any> = new ReplaySubject(1);

  // Campañas
  public campanasMultiCtrl: FormControl = new FormControl();
  public campanasMultiFilterCtrl: FormControl = new FormControl();
  public filteredCampanasMulti: ReplaySubject<any> = new ReplaySubject(1);

  @ViewChild("multiSelect", { static: true }) multiSelect: MatSelect;
  @ViewChild("multiSelectCampana", { static: true }) multiSelectCampana: MatSelect;

  protected _onDestroy = new Subject();

  /**
   * Write code on Method
   *
   * method logical code
   */
  ngAfterViewInit() {
    this.setInitialValue();
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  protected setInitialValue() {
    this.filteredWebsitesMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: any, b: any) =>
          a && b && a.nid_charge === b.nid_charge;
      });

      this.filteredCampanasMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelectCampana.compareWith = (a: any, b: any) =>
          a && b && a.nid_campaign === b.nid_campaign;
      });  
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  protected filterWebsiteMulti() {
    if (!this.lstcargo) {
      return;
    }

    let search = this.websiteMultiFilterCtrl.value;
    if (!search) {
      this.filteredWebsitesMulti.next(this.lstcargo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsitesMulti.next(
      this.lstcargo.filter(
        (bank) => bank.snamecharge.toLowerCase().indexOf(search) > -1
      )
    );
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  protected filterCampanasMulti() {
    if (!this.listcampaign) {
      return;
    }

    let search = this.campanasMultiFilterCtrl.value;
    if (!search) {
      this.filteredCampanasMulti.next(this.listcampaign.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCampanasMulti.next(
      this.listcampaign.filter(
        (camp) => camp.snamecampaign.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
