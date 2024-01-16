import { Routes } from "@angular/router";

import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockscreenComponent } from "./lockscreen/lockscreen.component";
import { SigninComponent } from "./signin/signin.component";
//import { SignupComponent } from "./signup/signup.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ErrorComponent } from "./error/error.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";


export const SessionsRoutes: Routes = [
  {
    path: "",
    children: [
      // {
      //   path: "signup",
      //   component: SignupComponent,
      //   data: { title: "Signup" }
      // },
      {
        path: "signin",
        component: SigninComponent,
        data: { title: "Login" }
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        data: { title: "Forgot password" }
      },
      {
        path: "lockscreen",
        component: LockscreenComponent,
        data: { title: "Lockscreen" }
      },
      {
        path: "404",
        component: NotFoundComponent,
        data: { title: "Not Found" }
      },
      {
        path: "error",
        component: ErrorComponent,
        data: { title: "Error" }
      },
      {
        path: "change-password",
        component: ChangePasswordComponent,
        data: { title: "Change Password" }
      },
    ]
  }
];
