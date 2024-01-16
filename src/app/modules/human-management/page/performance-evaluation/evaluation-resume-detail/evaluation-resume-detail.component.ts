import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PerformanceService } from "@app/data/service/performance.service";

@Component({
  selector: "app-evaluation-resume-detail",
  templateUrl: "./evaluation-resume-detail.component.html",
  styleUrls: ["./evaluation-resume-detail.component.scss"],
})
export class EvaluationResumeDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private _performanceService: PerformanceService
  ) {}

  idevaluation = 0;
  idaction = 0;
  title = "Detalle de Evaluación";
  header: any = {
    evaluatedName: "",
    evaluatedDNI: "",
    evaluatorName: "",
    evaluatorDNI: "",
    chargeName: "",
    areaName: "",
  };
  detail: any[] = [];
  idEvaluated: number = 0;
  idEvaluator: number = 0;
  objetivos: any = [];
  competencias: any = [];
  comentario = "";

  trafficSourcesChart: any;
  optionCompetencias: any;
  ponderadoobjetivoslogrado = "0";
  ponderadocompetencialogrado = "0";
  colorrojo = "#FF0000";
  colorverde = "#219653";
  colorazul = "#6366F1";

  obj_colorprimario = "";
  obj_colorsecundario = "";

  comp_colorprimario = "";
  comp_colorsecundario = "";

  objetivoslist = [];
  competenciaslist = [];
  stylecolorprimario_comp = "#6366F1 !important";

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let nidevaluation = params["idevaluation"];

      if (nidevaluation) {
        this.idevaluation = Number(nidevaluation);
      }
      let nidaction = params["idaction"];
      if (nidaction) {
        this.idaction = Number(nidaction);
      }

      this.getEvaluationDetail();
      //this.getAllJobs();
    });
  }
  getEvaluationDetail(): void {
    this._performanceService
      .getEvaluationDetail(Number(this.idevaluation))
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

        let objEvaluation = this.detail.filter(
          (i) => i.numberAction === this.idaction
        );

        let objetivos = objEvaluation.filter(
          (i) => i.idGroup === 1 && i.jobObjectives !== null
        );
        let competencias = objEvaluation.filter((i) => i.idGroup === 2);

        this.objetivoslist = objetivos;
        this.competenciaslist = competencias;

        this.calcularObjetivos(objetivos);
        this.calcularCompetencias(competencias);

        if (this.idaction == 3) this.comentario = this.detail[0].observation0;
        if (this.idaction == 7) this.comentario = this.detail[0].observation1;
        if (this.idaction == 11) this.comentario = this.detail[0].observation2;
        this.comentario = this.comentario == "" ? "Ninguno" : this.comentario;
      });
  }

  calcularCompetencias(competencias) {
    let sumaponderadometa = 0;
    let sumaponderadoreal = 0;

    let nweight = 100 / competencias.length;

    competencias.forEach((element) => {
      let porcentaje =
        (element.qualification / element.idProficiencyLevel) * 100;

      element.percent = porcentaje;
      if (element.percent > 100) {
        element.bexceeded = true;

        element.percent = (100 / element.percent) * 100;
      } else {
        element.bexceeded = false;
      }



      try {
        let dateString = element.endDate; // Oct 23
        let dateParts = dateString.split("/");
        let dateSent = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        let currentDate = new Date();
  
        let diasrestantes = Math.floor(
          (Date.UTC(
            dateSent.getFullYear(),
            dateSent.getMonth(),
            dateSent.getDate()
          ) -
            Date.UTC(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate()
            )) /
            (1000 * 60 * 60 * 24)
        );
  
        element.daysleft = diasrestantes;
      } catch (error) {
        element.daysleft = 0;
      }



      let nponderadometa = element.idProficiencyLevel * nweight;
      let nponderadoreal = element.qualification * nweight;

      sumaponderadometa += nponderadometa;
      sumaponderadoreal += nponderadoreal;
    });

    let ponderadototal = (sumaponderadoreal / sumaponderadometa) * 100;

    let ponderadorestante = 100 - ponderadototal;

    this.competencias = competencias;
    this.ponderadocompetencialogrado = parseFloat(
      ponderadototal.toString()
    ).toFixed(2);

    let datapiecompetencias = [
      {
        value: parseFloat(ponderadorestante.toString()).toFixed(2),
        name: "Meta de Competencias",
      },
      {
        value: parseFloat(ponderadototal.toString()).toFixed(2),
        name: "Competencias Logradas",
      },
    ];
    if (ponderadototal>100)
    {
      datapiecompetencias = [
        {
          value: "0.00",
          name: "Meta de Competencias",
        },
        {
          value: "100.00",
          name: "Competencias Logradas",
        },
      ];
    }

    let pcolor = this.colorazul;

    if (ponderadototal <= 70) {
      pcolor = this.colorrojo;
      this.comp_colorprimario = pcolor;
      this.comp_colorsecundario = "rgba(255,0,0,0.4)";
    } else if (ponderadototal > 70 && ponderadototal <= 100) {
      pcolor = this.colorverde;
      this.comp_colorprimario = pcolor;
      this.comp_colorsecundario = "rgba(33, 150, 83,0.4)";
    } else if (ponderadototal > 100) {
      pcolor = this.colorazul;
      this.comp_colorprimario = pcolor;
      this.comp_colorsecundario = "rgba(99, 102, 241,0.4)";
    }

    this.stylecolorprimario_comp = this.comp_colorprimario + " !important";

    this.setdataPieCompetencias(
      datapiecompetencias,
      this.comp_colorprimario,
      this.comp_colorsecundario
    );
  }

  calcularObjetivos(objetivos) {
    let sumaponderadometa = 0;
    let sumaponderadoreal = 0;

    objetivos.forEach((element) => {
      let porcentaje = (element.progress / element.goal) * 100;

      element.percent = porcentaje;

      if (element.percent > 100) {
        element.bexceeded = true;

        element.percent = (100 / element.percent) * 100;
      } else {
        element.bexceeded = false;
      }

      try {
        let dateString = element.endDate; // Oct 23
        let dateParts = dateString.split("/");
        let dateSent = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        let currentDate = new Date();

        let diasrestantes = Math.floor(
          (Date.UTC(
            dateSent.getFullYear(),
            dateSent.getMonth(),
            dateSent.getDate()
          ) -
            Date.UTC(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate()
            )) /
            (1000 * 60 * 60 * 24)
        );

        element.daysleft = diasrestantes;
      } catch (error) {
        element.daysleft = 0;
      }

      let nponderadometa = element.goal * element.weight;
      let nponderadoreal = element.progress * element.weight;

      sumaponderadometa += nponderadometa;
      sumaponderadoreal += nponderadoreal;
    });

    let ponderadototal = (sumaponderadoreal / sumaponderadometa) * 100;

    let ponderadorestante = 100 - ponderadototal;

    this.objetivos = objetivos;
    this.ponderadoobjetivoslogrado = parseFloat(
      ponderadototal.toString()
    ).toFixed(2);

    let datapieobjetivos = [
      {
        value: parseFloat(ponderadorestante.toString()).toFixed(2),
        name: "Meta de Objetivos",
      },
      {
        value: parseFloat(ponderadototal.toString()).toFixed(2),
        name: "Objetivos Logrados",
      },
    ];

    if (ponderadototal>100)
    {
      datapieobjetivos = [
        {
          value: "0.00",
          name: "Meta de Objetivos",
        },
        {
          value: "100.00",
          name: "Objetivos Logrados",
        },
      ];
    }



    let pcolor = this.colorazul;

    if (ponderadototal <= 70) {
      pcolor = this.colorrojo;
      this.obj_colorprimario = pcolor;
      this.obj_colorsecundario = "rgba(255,0,0,0.4)";
    } else if (ponderadototal > 70 && ponderadototal <= 100) {
      pcolor = this.colorverde;
      this.obj_colorprimario = pcolor;
      this.obj_colorsecundario = "rgba(33, 150, 83,0.4)";
    } else if (ponderadototal > 100) {
      pcolor = this.colorazul;
      this.obj_colorprimario = pcolor;
      this.obj_colorsecundario = "rgba(99, 102, 241,0.4)";
    }

    let elem_prim_circulo = document.querySelector("#obj_circuloprimario");
    //let elem_segu_circulo = document.querySelector("#obj_circulosecundario");

    elem_prim_circulo.setAttribute(
      "style",
      "background-color:" + this.obj_colorprimario
    );
    // elem_segu_circulo.setAttribute(
    //   "style",
    //   "background-color:" + this.obj_colorsecundario
    // );

    let elem_obj_porc = document.querySelector("#obj_porc");
    elem_obj_porc.setAttribute(
      "style",
      "background-color:" + this.obj_colorprimario + " !important"
    );

    this.setdataPieObjetivos(
      datapieobjetivos,
      this.obj_colorprimario,
      this.obj_colorsecundario
    );
  }

  setdataPieObjetivos(pdata, pcolorprimario, pcolorsecundario) {
    this.trafficSourcesChart = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      color: [pcolorsecundario, pcolorprimario, "#FDB118"],
      tooltip: {
        show: false,
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },

      xAxis: [
        {
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],

      series: [
        {
          name: "Sessions",
          type: "pie",
          radius: ["65%", "95%"],
          center: ["50%", "50%"],
          markPoint: {
            tooltip: {
              show: false,
            },
            label: {
              show: true,
              formatter: "{b}",
              color: pcolorprimario,
              fontSize: 30,
            },
            data: [
              {
                name: this.ponderadoobjetivoslogrado + "%",
                value: "-",
                symbol: "circle",
                itemStyle: {
                  color: "transparent",
                },
                x: "50%",
                y: "50%",
              },
            ],
          },
          avoidLabelOverlap: false,
          hoverOffset: 5,
          stillShowZeroSum: false,
          label: {
            normal: {
              show: false,
              position: "center",
              textStyle: {
                fontSize: "13",
                fontWeight: "normal",
              },
              formatter: "{a}",
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: "15",
                fontWeight: "normal",
                color: "rgba(15, 21, 77, 1)",
              },
              formatter: "{b} \n{c} ({d}%)",
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: pdata,
          itemStyle: {
            emphasis: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }
  setdataPieCompetencias(pdata, pcolorprimario, pcolorsecundario) {
    this.optionCompetencias = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      color: [pcolorsecundario, pcolorprimario, "#FDB118"],
      tooltip: {
        show: false,
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      xAxis: [
        {
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],

      series: [
        {
          name: "Sessions",
          type: "pie",
          radius: ["65%", "95%"],
          center: ["50%", "50%"],
          markPoint: {
            tooltip: {
              show: false,
            },
            label: {
              show: true,
              formatter: "{b}",
              color: pcolorprimario,
              fontSize: 35,
            },
            data: [
              {
                name: this.ponderadocompetencialogrado + "%",
                value: "-",
                symbol: "circle",
                itemStyle: {
                  color: "transparent",
                },
                x: "50%",
                y: "50%",
              },
            ],
          },
          avoidLabelOverlap: false,
          hoverOffset: 5,
          stillShowZeroSum: false,
          label: {
            normal: {
              show: false,
              position: "center",
              textStyle: {
                fontSize: "13",
                fontWeight: "normal",
              },
              formatter: "{a}",
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: "15",
                fontWeight: "normal",
                color: "rgba(15, 21, 77, 1)",
              },
              formatter: "{b} \n{c} ({d}%)",
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: pdata,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }

  getCompColor(pnumbercolor) {
    let styles = {};
    if (pnumbercolor === 1) {
      styles = {
        "background-color": this.comp_colorprimario,
      };
    } else if (pnumbercolor === 2) {
      styles = {
        "background-color": this.comp_colorsecundario,
      };
    } else if (pnumbercolor === 3) {
      styles = {
        "background-color": this.comp_colorprimario + " !important",
      };
    }

    return styles;
  }
}
