import { PaginationFilter } from "../paginationFilter";

export interface UserQueryFilter {
  idCompany: number;
  idArea: number;
  chargeName: string;
  userName: string;
  nsituation:number;
  pagination: PaginationFilter;
}
