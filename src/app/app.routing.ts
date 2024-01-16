import { RecruitmentInformationPostulantComponent } from './modules/human-management/page/recruitment/recruitment-information-postulant/recruitment-information-postulant.component';
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'others/blank',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session'}
      }
    ]
  },
  {
    path: 'register-information-postulant/:id/:idEvaluation',
    component: RecruitmentInformationPostulantComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'others',
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule),
        data: { title: 'Others', breadcrumb: 'OTHERS'}
      },
      {
        path: 'search',
        loadChildren: () => import('./views/search-view/search-view.module').then(m => m.SearchViewModule)
      },
      {
        path: 'humanmanagement',
        loadChildren: () => import('./modules/human-management/humanmanagement.module').then(m => m.HumanManagementModule),
        data: { title: 'Gestión Humana', breadcrumb: 'Gestión Humana'}
      },
      {
        path: 'support',
        loadChildren: () => import('./modules/support/support.module').then(m => m.SupportModule),
        data: { title: 'Gestión CMS', breadcrumb: 'Gestión CMS'}
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

