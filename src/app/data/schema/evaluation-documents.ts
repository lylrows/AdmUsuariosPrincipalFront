import { FileDto } from "./Postulant/postulant";

export interface EvaluationPostulantDocumentsDto {
    id: number | null;
    idEvaluationPostulant: number;
    folderAntecedentes: string;
    folderCertificado: string;
    nombreDocumento: string;
    idPostulant: number;
    fileAntecedentes: FileDto;
    fileCertificado: FileDto;
}