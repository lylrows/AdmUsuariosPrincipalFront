export interface InformationExtraDto {
    id: number;
    idPostulant: number;
    placeOfBirth: string;
    createBcp: boolean | null;
    rucNumber: string;
    bankOpen: string;
    afp: string;
    bankAfp: string;
    company: string;
    moto: boolean | null;
    auto: boolean | null;
    categoryBrevete: string;
    nombreContacto: string;
    nroReferenciaContacto: string;
    parentescoContacto: string;
    typeSangre: string;
    age: string;
    //nuevos
    bankHaberes: string;
    incomeCountryDate?: string;
    idDocumentType: number;
    disclaimer: boolean;
    hasMobility: boolean;
    hasDisability: boolean;
    sent: boolean;
}