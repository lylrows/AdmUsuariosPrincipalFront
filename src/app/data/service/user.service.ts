import { Injectable } from '@angular/core';
import { UserList } from '../schema/user/UserList';
import { UserRequest } from '../schema/user/UserRequest';
import { UserQueryFilter } from '../schema/user/UserQueryFIlter';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Result } from '../schema/result';
import { UserResetPassword } from '../schema/user/UserResetPassword';
import { SendRessetPasswordCode } from '../schema/user/SendRessetPasswordCode';
import { Profile } from '../schema/user/Profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiController = '/User';
    constructor(private httpClient: HttpClient) { }


    getAll(filter: UserQueryFilter): Observable<Result>{
      return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getlistpagination`, filter);
    }
  
    getById(id: number): Observable<Result>{
      return this.httpClient.get<Result>(`${this.apiController}/getbyid/${id}`);
    }
  
     add(formdata): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/add`, formdata);
    }
  
    update(item: UserRequest): Observable<Result> {
        return this.httpClient.put<Result>(`${environment.apiURL}${this.apiController}/edit`, item);
    }
  
    resetpassword(item: UserResetPassword): Observable<boolean> {
      return this.httpClient.patch<boolean>(`${environment.apiURL}${this.apiController}/resetpassword`, item);
    }
  
    unblocked(id: number): Observable<Result>{
      return this.httpClient.patch<Result>(`${environment.apiURL}${this.apiController}/unblocked/${id}`, id);
    }

    resetpasswordPatch(item: UserResetPassword): Observable<Result> {
      return this.httpClient.patch<Result>(
        `${environment.apiURL}${this.apiController}/resetpassword`,
        item
      );
    }
    changemypassword(item: any): Observable<Result> {
      return this.httpClient.patch<Result>(`${environment.apiURL}${this.apiController}/changemypassword`,item);
    }
    sendResetPasswordCode(item: SendRessetPasswordCode): Observable<Result> {
      return this.httpClient.post<Result>(
        `${environment.apiURL}${this.apiController}/sendpasswordresetcode`,
        item
      );
    }
    getValidRessetPassword(id: number,codebase: string): Observable<Result>{


      return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/validressetpassword/${id}/${codebase}`);

      /*
         let queryParams = new HttpParams();
    queryParams = queryParams.append("page",1);
 
    return this.http.get<UserInformation>(url,{params:queryParams});
      
      */


    }

    getProfileList(): Observable<any>{
      return this.httpClient.get<any>(`${environment.apiURL}/Profile/getprofilelist`);
  }
}