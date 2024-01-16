import { EvaluationRatingPostulantDto } from './evaluation-rating';
import { EvaluationMultitestExternDto } from './reportExternIndividualDto';
import { EvaluationProficiencyDto } from './evaluation-proficiency';
import { IPerson } from './person';
export interface InfoReportIndividualInternDto {
    infoPerson: IPerson;
    infoEvaluationProficiencyActually: EvaluationProficiencyDto[];
    infoEvaluationProficiencyFuture: EvaluationProficiencyDto[];
    infoEvaluationRating: EvaluationRatingPostulantDto[];
    infoEvaluationMultitest: EvaluationMultitestExternDto;
    positionApplicant: string;
}