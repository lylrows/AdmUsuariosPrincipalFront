import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { environment } from "environments/environment";
import {Slider} from '../../../data/schema/slider';
import {SliderQueryFilter} from '../../../data/schema/Home/SliderQueryFilter';
import { SliderService } from "./../../../data/service/slider.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  signinForm: FormGroup;
  errorMsg = '';
  public items: Slider[]=[];
  imgFondo:String;
  imgFilter= <SliderQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:10,
    totalItems:0,
    totalPages:1,
    totalRows:0
  },idType:2};
  // return: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private jwtAuth: JwtAuthService,
    private egretLoader: AppLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private sliderService: SliderService,
  ) {
    this._unsubscribeAll = new Subject();
    localStorage.clear();
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(true)
    });
    //this.loadImg();
    // this.route.queryParams
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(params => this.return = params['return'] || '/');
  }

  ngAfterViewInit() {
    //this.autoSignIn();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  signin() {
    const signinData = this.signinForm.value

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
    
    this.jwtAuth.signin(signinData.username, signinData.password)
    .subscribe(response => {
      
      if(response.stateCode==200){
        if (response.data && response.data.isLoginOk){

          if( response.data.user.changedPassword){
             window.location.href = environment.localhost;
          }else{
            this.router.navigateByUrl("/sessions/change-password")
          }
  
          
        }else{
          this.errorMsg = "Usuario y/o Contraseña incorrrecto.";  
        }
      }else{
        if (response.stateCode==500) {
            this.errorMsg = response.messageError[0]; 
        }else{
          this.errorMsg = "Usuario y/o Contraseña incorrrecto."; 
        }
      }
      
      this.progressBar.mode = 'determinate';
      this.submitButton.disabled = false;
      
    }, err => {
      
      this.submitButton.disabled = false;
      this.progressBar.mode = 'determinate';
      this.errorMsg = err.message;
      
      
    })
  }

  autoSignIn() {    
    if(this.jwtAuth.return === '/') {
      return
    }
    this.egretLoader.open(`Automatically Signing you in! \n Return url: ${this.jwtAuth.return.substring(0, 20)}...`, {width: '320px'});
    setTimeout(() => {
      this.signin();
      
      this.egretLoader.close()
    }, 2000);
  }
  loadImg(){
    
    this.sliderService.getListPagination(this.imgFilter).subscribe(res => {
      this.items = res.data.list;},
      (err) => {},
      () => {
        let item=this.items.filter(x=>x.active==true)[0];
        this.imgFondo=item.filenamefolder+item.filename;
      });
    
  }
  getUrlImg(){
    return "url('"+ this.imgFondo+"')";
  }

}
