export interface NotesEvaluationDto {
    id: number | null;
    idEvaluationPostulant: number;
    descripcion: string;
    autor: string;
    dateRegister: string;
    postulantName?:string;
}