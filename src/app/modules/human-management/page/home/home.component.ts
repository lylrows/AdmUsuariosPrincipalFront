import { Component, OnInit, Inject, ViewEncapsulation, PipeTransform, Pipe, Renderer2 } from '@angular/core';
import { SliderService } from './../../../../data/service/slider.service';
import { Slider } from "app/data/schema/slider";
import { Mastertable } from "app/data/schema/mastertable";
import { egretAnimations } from '../../../../shared/animations/egret-animations';
import { MastertableService } from './../../../../data/service/mastertable.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaService } from '@app/data/service/empresa.service';
import { HomeDocumentosService } from '@app/data/service/home-documentos.service';
import { HomeOrganizationService } from '@app/data/service/home-organization.service';
import { Empresa } from 'app/data/schema/empresa';
import { Documento } from 'app/data/schema/documentos';
import { Organization } from 'app/data/schema/organization';
import { MatRadioModule } from '@angular/material/radio';
import { DialogHomeCompany } from './homecompany.component';
import { ModalCampaignComponent } from './modal-campaign/modal-campaign.component';
import { ModalEvaluationComponent } from './modal-evaluation/modal-evaluation.component';

export interface DialogData {
  empresa: number;
  category: number;
  nameCategory: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: egretAnimations,
})
export class HomeComponent implements OnInit {

  public slides: Slider[];
  public categories: Mastertable[];
  organizations: Organization[];
  campaing: any[] = [];
  evaluations: any[] = [];
  screenwidth: number;
  nid_employee: number = 0;
  hidearrows = false;
  constructor(
    private sliderService: SliderService,
    private mastertableService: MastertableService,
    public dialog: MatDialog,
    private homeOrganizationService: HomeOrganizationService,
    private render: Renderer2) {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_employee = storage.nid_employee;
  }

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;

    if (this.screenwidth < 600){
      this.hidearrows = true;
    }

    this.load();
    this.loadCampaing();    
  }

  

  stopVideos() {
    this.slides.filter(x => !(x.isImage)).forEach(function (item) {
      var myVideo: any = document.getElementById(item.id + "");
      if (myVideo) {
        myVideo.pause();
      }

    });
  }
  load() {
    this.sliderService.getAll().subscribe(res => { this.slides = res },
      (err) => { },
      () => {
        this.slides = this.slides.filter(o => o.active === true && o.idType == 1);

        const classArr: any = document.querySelectorAll('.ng-star-inserted');
        classArr.forEach(element => {
          this.render.listen(element, 'click', (target) => {
            this.stopVideos();
          })
        });

        //Play al primer video
        setTimeout(() => {
          let firstVideo = this.slides.filter(x => !(x.isImage))[0];
          if (undefined !== undefined){
            let myVideo: any = document.getElementById(firstVideo.id + "");
                    
            myVideo.muted = true;
            myVideo.play();
          }
          
        }, 2000);



      });
  debugger;
    this.mastertableService.getByIdFather(1, 1).subscribe(res => { this.categories = res },
      (err) => { },
      () => {
        this.categories = this.categories.filter(o => o.active === true);
      });
    this.homeOrganizationService.getAll().subscribe(res => {
      this.organizations = res;
      
        this.organizations = this.organizations.filter(o => o.active === true);

    });

  }
  viewCompany(id: number, name: string): void {

    const dialogRef = this.dialog.open(DialogHomeCompany, {
      width: '50%',
      data: { category: id, nameCategory: name }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  loadUrlSlider(url): void {
    if (url != "") {
      window.open(url, '_blank');
    }

  }

  loadCampaing(): void {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_employee = storage.nid_employee;
    
    
    this.homeOrganizationService.GetCampaingEvaluationAlert(this.nid_employee).subscribe(resp => {
      this.evaluations = resp.data;

      this.homeOrganizationService.getCampaingBorrador(this.nid_employee).subscribe(resp => {
        this.campaing = resp.data;
        if (this.evaluations.length > 0|| this.campaing.length > 0 ) {
          let dialogRef: MatDialogRef<any>;
  
          dialogRef = this.dialog.open(ModalCampaignComponent, {
            disableClose: true,
            maxHeight:'600px',
            data: { datos: this.campaing, datosEvaluations:this.evaluations },
          });
        }
  
      })
    });
  }

}


