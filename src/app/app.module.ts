import { ChartModule } from 'primeng/chart';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { NgModule, ErrorHandler } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { GestureConfig } from '@angular/material/core';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';


import { rootRouterConfig } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { HumanManagementModule } from './modules/human-management/humanmanagement.module';
import { SupportModule } from './modules/support/support.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { TokenMultitestInterceptor } from './shared/interceptors/token-multitest';
import { HttpErrorInterceptor } from './shared/interceptors/httpErrorInterceptor';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    PerfectScrollbarModule,
    HumanManagementModule,
    SupportModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxSpinnerModule,

    RouterModule.forRoot(rootRouterConfig, { useHash: true, relativeLinkResolution: 'legacy', preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'enabled' })
  ],
  declarations: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    // { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    // REQUIRED IF YOU USE JWT AUTHENTICATION
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }