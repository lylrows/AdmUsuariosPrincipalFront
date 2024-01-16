import { PostulantQueryFilter } from "./../schema/Postulant/PostulantQueryFilter";
import { FileDto } from "./../schema/File/FileDto";
import { environment } from "./../../../environments/environment";
import { Observable } from "rxjs";
import { Result } from "./../schema/result";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class PostulantService {
  private apiController = "/Postulant";
  constructor(private httpClient: HttpClient) {}

  getPostulants(filter: PostulantQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlist`,
      filter
    );
  }

  getPostulantsExport(filter: PostulantQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistexport`,
      filter
    );
  }

  getPostulantsInternal(filter: PostulantQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistpostulantinternal`,
      filter
    );
  }

  getPostulantsInternalExport(filter: PostulantQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistpostulantinternalexport`,
      filter
    );
  }

  getFile(FileDto: FileDto): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getfile`,
      FileDto
    );
  }

  getFileInternal(FileDto: FileDto): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getfileinternal`,
      FileDto
    );
  }

  getCv(idPerson, idjob, iduser): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getcv/${idPerson}/${idjob}/${iduser}`
    );
  }

  getCvWord(idPerson, idjob, iduser): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getcvword/${idPerson}/${idjob}/${iduser}`
    );
  }
}
