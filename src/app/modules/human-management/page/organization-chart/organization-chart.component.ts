import { MatSnackBar } from "@angular/material/snack-bar";
import { AppLoaderService } from "./../../../../shared/services/app-loader/app-loader.service";
import { OrganigramService } from "./../../../../data/service/organigram.service";
import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from "@angular/core";
import { TreeNode } from "primeng/api";
import { number } from "ngx-custom-validators/src/app/number/validator";
// import OrgChart from '@balkangraph/orgchart.js';
// import OrgChart from '@balkangraph/orgchart.js';
import OrgChart from "../../../../../assets/balkanapp/orgchart";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-organization-chart",
  templateUrl: "./organization-chart.component.html",
  styleUrls: ["./organization-chart.component.scss"],
})
export class OrganizationChartComponent implements OnInit {
  organigram: TreeNode[];

  selectedNode: TreeNode;
  showAreas: boolean = true;
  ocultar: boolean = false;
  contadorZomm: number = 1.1;
  contadorPosition: number = 1;
  contadorLeft: number = 5;
  responsive = false;
  screenWidth: number;
  @ViewChild('DetailDialog') DetailDialog: TemplateRef<any>;
  constructor(
    private organigramService: OrganigramService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private el: ElementRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 600){
      this.responsive = true;
    }
  }

  close(): void {
    this.dialog.closeAll();
  }

  loadOrganigram(idEmpresa) {
    if (this.responsive){
      this.dialog.open(this.DetailDialog,{
        width: '100%',
        maxWidth: '100hv'
      });
    }
    localStorage.setItem("empresa", idEmpresa);
    this.setColor(idEmpresa);
    

    this.organigramService.getOrganigramV2(idEmpresa).subscribe((res) => {
      
      // OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.rony);
      //  OrgChart.templates.myTemplate.size = [250, 300];
      //  OrgChart.templates.myTemplate.node = '<rect x="0" y="0" height="300" width="250" fill="#4f66a8" stroke-width="0" rx="7" ry="7"  ></rect>'
      //  OrgChart.templates.myTemplate.field_0 = '<text data-width="200"   style="font-size: 14px;font-weight: 600;" data-text-overflow="multiline"  fill="#ffffff" x="122" y="165" text-anchor="middle">{val}</text>';
      //  OrgChart.templates.myTemplate.field_1 = '<text data-width="200"   style="font-size: 12px;" data-text-overflow="multiline"  fill="#ffffff" x="122" y="225" text-anchor="middle">{val}</text>';
      //  OrgChart.templates.myTemplate.field_2 = '<text data-width="200"   style="font-size: 12px;" data-text-overflow="multiline"  fill="#ffffff" x="122" y="270" text-anchor="middle">{val}</text>';
      //  OrgChart.templates.myTemplate.img_0 = '<clipPath id="{randId}"><circle cx="126" cy="80" r="60"></circle></clipPath>'
      //  +'<image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="66" y="20" width="120" height="120"></image>';
      // #039BE5  aeaeae
       OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.rony);
       OrgChart.templates.myTemplate.size = [245, 253];
      //  OrgChart.templates.myTemplate.node = '<rect x="0" y="150" height="150" width="250" fill="#4472C4" stroke-width="0" rx="25" ry="25"  ></rect> <circle cx="126" cy="80" r="62" fill="#5B9BD5" stroke-width="1" stroke="#5B9BD5"></circle>'
       OrgChart.templates.myTemplate.node = '<rect x="23" y="140" height="114" width="200" fill="#4472C4" stroke-width="0" rx="25" ry="25"  ></rect> <circle cx="126" cy="70" r="62" fill="#5B9BD5" stroke-width="1" stroke="#5B9BD5"></circle>'
      //  OrgChart.templates.myTemplate.node = '<rect x="23" y="185" height="115" width="200" fill="#4472C4" stroke-width="1" stroke="#039BE5" rx="25" ry="25"  ></rect> <circle cx="126" cy="100" r="62" fill="#5B9BD5" stroke-width="1" stroke="#5B9BD5"></circle>'
      //  OrgChart.templates.myTemplate.node = '<rect x="23" y="140" height="115" width="200" fill="#4472C4" stroke-width="1" stroke="#039BE5" rx="25" ry="25"  ></rect> <circle cx="126" cy="60" r="62" fill="#5B9BD5" stroke-width="1" stroke="#5B9BD5"></circle>'
       OrgChart.templates.myTemplate.field_0 = '<text data-width="180"   style="font-size: 14px;font-weight: 600;" data-text-overflow="multiline"  fill="#ffffff" x="122" y="165" text-anchor="middle">{val}</text>';
       OrgChart.templates.myTemplate.field_1 = '<text data-width="180"   style="font-size: 12px;font-weight: 600;" data-text-overflow="multiline"  fill="#ffffff" x="122" y="205" text-anchor="middle">{val}</text>';
       OrgChart.templates.myTemplate.field_2 = '<text data-width="180"   style="font-size: 9px;" data-text-overflow="multiline"  fill="#ffffff" x="122" y="220" text-anchor="middle">{val}</text>';
       OrgChart.templates.myTemplate.img_0 = '<clipPath id="{randId}"> <circle cx="126" cy="70" r="60" fill="#f90505" stroke-width="1" stroke="#f90505"></circle></clipPath>'
       +'<image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="66" y="10" width="120" height="120"></image>';

      const tree = document.getElementById('tree');
      if (tree) {
        var chart = new OrgChart(tree, {
          template: "myTemplate",//template: "isla",//
          enableSearch:false,
          levelSeparation: 120, //Espacio linea
          // minPartnerSeparation: 10,
          // mixedHierarchyNodesSeparation: 10,
          // partnerChildrenSplitSeparation: 10,
          // partnerNodeSeparation: 0,
          // siblingSeparation: 10,
          // subtreeSeparation: 10,
          nodeMouseClick:OrgChart.action.none,
          //keyNavigation: true,
          // enableSearch: true,
          // mouseScrool: OrgChart.none,
          align: OrgChart.ORIENTATION,
          toolbar: {
              layout: false,
              zoom: true,
              fit: false,
              expandAll: false
          },
          nodeBinding: {
            img_0: 'img',
            field_0:'snamearea' ,
            field_1: 'name',
            field_2:'title',
            
            
          },collapse:{level:2,allChildren:true}
           
    
          
        });
        
        
      
      chart.load(res.data);
  
    }
    
    });







  }

  setColor(idEmpresa) {
    switch (idEmpresa) {
      case "1":
        let myTag = this.el.nativeElement.querySelector("#empresa_" + 1);
        myTag.classList.add("selected");
        let myTag2 = this.el.nativeElement.querySelector("#empresa_" + 2);
        myTag2.classList.remove("selected");
        let myTag3 = this.el.nativeElement.querySelector("#empresa_" + 3);
        myTag3.classList.remove("selected");
        let myTag4 = this.el.nativeElement.querySelector("#empresa_" + 4);
        myTag4.classList.remove("selected");
        // let myTag5 = this.el.nativeElement.querySelector("#empresa_" + 5);
        // myTag5.classList.remove("selected");
        break;
      case "2":
        let myTag_1 = this.el.nativeElement.querySelector("#empresa_" + 1);
        myTag_1.classList.remove("selected");
        let myTag_2 = this.el.nativeElement.querySelector("#empresa_" + 2);
        myTag_2.classList.add("selected");
        let myTag_3 = this.el.nativeElement.querySelector("#empresa_" + 3);
        myTag_3.classList.remove("selected");
        let myTag_4 = this.el.nativeElement.querySelector("#empresa_" + 4);
        myTag_4.classList.remove("selected");
        // let myTag_5 = this.el.nativeElement.querySelector("#empresa_" + 5);
        // myTag_5.classList.remove("selected");
        break;
      case "3":
        let myTag__1 = this.el.nativeElement.querySelector("#empresa_" + 1);
        myTag__1.classList.remove("selected");
        let myTag__2 = this.el.nativeElement.querySelector("#empresa_" + 2);
        myTag__2.classList.remove("selected");
        let myTag__3 = this.el.nativeElement.querySelector("#empresa_" + 3);
        myTag__3.classList.add("selected");
        let myTag__4 = this.el.nativeElement.querySelector("#empresa_" + 4);
        myTag__4.classList.remove("selected");
        // let myTag__5 = this.el.nativeElement.querySelector("#empresa_" + 5);
        // myTag__5.classList.remove("selected");
        break;
        case "4":
          let myTag___1 = this.el.nativeElement.querySelector("#empresa_" + 1);
          myTag___1.classList.remove("selected");
          let myTag___2 = this.el.nativeElement.querySelector("#empresa_" + 2);
          myTag___2.classList.remove("selected");
          let myTag___3 = this.el.nativeElement.querySelector("#empresa_" + 3);
          myTag___3.classList.remove("selected");
          let myTag___4 = this.el.nativeElement.querySelector("#empresa_" + 4);
          myTag___4.classList.add("selected");
          // let myTag___5 = this.el.nativeElement.querySelector("#empresa_" + 5);
          // myTag___5.classList.remove("selected");
          break;
        // case "5":
        //     let myTag____1 = this.el.nativeElement.querySelector("#empresa_" + 1);
        //     myTag____1.classList.remove("selected");
        //     let myTag____2 = this.el.nativeElement.querySelector("#empresa_" + 2);
        //     myTag____2.classList.remove("selected");
        //     let myTag____3 = this.el.nativeElement.querySelector("#empresa_" + 3);
        //     myTag____3.classList.remove("selected");
        //     let myTag____4 = this.el.nativeElement.querySelector("#empresa_" + 4);
        //     myTag____4.classList.remove("selected");
        //     let myTag____5 = this.el.nativeElement.querySelector("#empresa_" + 5);
        //     myTag____5.classList.add("selected");
        //     break;        
      default:
        break;
    }
  }

  onNodeSelect(event) {
    this.ocultar = true;
    this.organigramService
      .getOrganigramCargo(
        event.node.id,
        event.node.idEmpresa,
        event.node.idCargo
      )
      .subscribe((res) => {
        if (res[0].children.length > 0) {
          this.organigram = [...res];
        } else {
          this.snack.open(
            "El área seleccionada ya no tiene más subniveles",
            "Aviso",
            { duration: 4000 }
          );
        }
      });
  }

  back() {
    let empresa = localStorage.getItem("empresa");
    this.organigramService.getOrganigram(empresa).subscribe((res) => {
      this.organigram = res;
    });
    this.ocultar = false;
  }

  zoomOut() {
    var screenWidth = window.innerWidth;
    
    let myTag = this.el.nativeElement.querySelector(
      ".p-organizationchart"
    ) as HTMLElement;
    myTag.style.overflow = "inherit";
    
    if (this.contadorZomm > 0.4) {
      this.contadorLeft = this.contadorLeft + 5;
      this.contadorZomm = this.contadorZomm - 0.2;
      this.contadorPosition = this.contadorPosition - 7;
      myTag.style.transform = "scale(" + this.contadorZomm + ")";
      myTag.style.position = "relative";
      myTag.style.top = ""+ this.contadorPosition +"%";
      
    }

    setTimeout(() => {
      if (screenWidth >= 1920) {
        if (this.contadorZomm < 0.4) {
          myTag.style.right = "75%";
          myTag.style.width = "3920px";
        }
        else if (this.contadorZomm >= 0.4 && this.contadorZomm < 0.6) {
          myTag.style.right = "40%";
          myTag.style.width = "3020px";
        }
        else if (this.contadorZomm >= 0.6 && this.contadorZomm < 0.8) {
          myTag.style.right = "20%";
          myTag.style.width = "2320px";
        }
        else if (this.contadorZomm >= 0.8 && this.contadorZomm < 1) {
          myTag.style.right = "5%";
          myTag.style.width = "1800px";
        }
      }
      else if (screenWidth >= 1366 && screenWidth < 1920) {
        if (this.contadorZomm < 0.4) {
          myTag.style.right = "95%";
          myTag.style.width = "3220px";
        }
        else if (this.contadorZomm >= 0.4 && this.contadorZomm < 0.6) {
          myTag.style.right = "40%";
          myTag.style.width = "2020px";
        }
        else if (this.contadorZomm >= 0.6 && this.contadorZomm < 0.8) {
          myTag.style.right = "20%";
          myTag.style.width = "1520px";
        }
        else if (this.contadorZomm >= 0.8 && this.contadorZomm < 1) {
          myTag.style.right = "5%";
          myTag.style.width = "1200px";
        }
      }
      
      myTag.style.overflow = "auto";
    }, 500);

  }

  zoomIn() {
    var screenWidth = window.innerWidth;
    this.contadorLeft = 0;
    this.contadorZomm = this.contadorZomm + 0.1;
    
    let myTag = this.el.nativeElement.querySelector(
      ".p-organizationchart"
    ) as HTMLElement;

    
    if (this.contadorZomm < 1.1) {
      
      if (this.contadorZomm < 1) {
        this.contadorPosition = this.contadorPosition + 4;
        myTag.style.position = "relative";
        myTag.style.top = ""+ this.contadorPosition +"%";
        myTag.style.right = ""+ this.contadorLeft +"%";
        myTag.style.transform = "scale(" + this.contadorZomm + ")";
      }

      if (this.contadorZomm == 1.1000000000000003) {
        this.contadorZomm = 1.1;
        this.contadorPosition = 1;
        myTag.style.top = ""+ this.contadorPosition +"%";
      }
    } else {
      let myTag = this.el.nativeElement.querySelector(
        ".p-organizationchart"
      ) as HTMLElement;
      myTag.style.overflow = "auto";
    }




    
    setTimeout(() => {
      if (screenWidth >= 1920) {
        if (this.contadorZomm < 0.5) {
          myTag.style.right = "70%";
          myTag.style.width = "3920px";
        }
        else if (this.contadorZomm >= 0.5 && this.contadorZomm < 0.6) {
          myTag.style.right = "40%";
          myTag.style.width = "3020px";
        }
        else if (this.contadorZomm >= 0.6 && this.contadorZomm < 0.8) {
          myTag.style.right = "20%";
          myTag.style.width = "2320px";
        }
        else if (this.contadorZomm >= 0.8 && this.contadorZomm < 1) {
          myTag.style.right = "5%";
          myTag.style.width = "1800px";
        }
      }
      else if (screenWidth >= 1366 && screenWidth < 1920) {
        if (this.contadorZomm < 0.5) {
          myTag.style.right = "95%";
          myTag.style.width = "3220px";
        }
        else if (this.contadorZomm >= 0.5 && this.contadorZomm < 0.6) {
          myTag.style.right = "40%";
          myTag.style.width = "2020px";
        }
        else if (this.contadorZomm >= 0.6 && this.contadorZomm < 0.8) {
          myTag.style.right = "20%";
          myTag.style.width = "1520px";
        }
        else if (this.contadorZomm >= 0.8 && this.contadorZomm < 1) {
          myTag.style.right = "5%";
          myTag.style.width = "1200px";
        }
      }
      
      myTag.style.overflow = "auto";
    }, 500);

    


  }



  reestablecerZoom() {
    let myTag = this.el.nativeElement.querySelector(
      ".p-organizationchart"
    ) as HTMLElement;
    myTag.style.transform = "scale(1)";
    this.contadorZomm = 1.1;
    this.contadorPosition = 1;
    this.contadorLeft = 5;
    myTag.style.position = "relative";
    myTag.style.top = "0%";
    myTag.style.right = "0%";
    myTag.style.overflow = "auto";
  }


  

}
