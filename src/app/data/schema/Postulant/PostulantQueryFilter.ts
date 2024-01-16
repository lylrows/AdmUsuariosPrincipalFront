import { PaginationFilter } from './../paginationFilter';
export interface PostulantQueryFilter {
    idJob: number;
    estudios: string;
    universidad: string;
    experiencia: string;
    edadMinima: string;
    edadMaxima: string;
    salarioMinimo: string;
    salarioMaximo: string;
    genero: string;
    isWorking: string;
    keyWords: string;
    levelStudy:string;
    pagination: PaginationFilter;
    includeFilterQuery: number;
}