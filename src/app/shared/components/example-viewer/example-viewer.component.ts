import { Component, OnInit, Input, ViewChild, ViewContainerRef, AfterViewInit, ComponentFactoryResolver, OnDestroy, ComponentRef } from "@angular/core";
// import { EXAMPLE_COMPONENTS } from "assets/examples/examples";

@Component({
  selector: "egret-example-viewer",
  templateUrl: "./example-viewer.component.html",
  styleUrls: ["./example-viewer.component.scss"]
})
export class EgretExampleViewerComponent implements OnInit, AfterViewInit, OnDestroy {

  private _exampleId: string;
  exampleViewRef: ComponentRef<any>;
  componentPath: string;

  
  @Input("exampleId")
  set exampleId(exampleId: string) {
    if (exampleId) {
      this._exampleId = exampleId;
    } 
  }
  
  @Input('data') data: any;

  
  @Input('path') path: any;

  get exampleId(): string {
    return this._exampleId;
  }

  @ViewChild('exampleContainer', { read: ViewContainerRef }) exampleContainer: ViewContainerRef

  constructor(
    private cfr: ComponentFactoryResolver
  ) { 

  }

  ngOnInit() {
    this.componentPath = this.path + this.exampleId + '/' + this.exampleId + '.component';
  }
  ngAfterViewInit() {
    if(!this.data) {
      
      return;
    }
    let componentFactory = this.cfr.resolveComponentFactory(this.data.component);
    this.exampleViewRef = this.exampleContainer.createComponent(componentFactory);
  }
  ngOnDestroy() {
    if(this.exampleViewRef) {
      this.exampleViewRef.destroy();
    }
  }


}
