import { CattleBreedingCreateViewModel } from '../appendix-primary-sector/cattle-breeding-create.mode';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';

export class RecognitionRequestCreateViewMode{
    constructor(){
        this.ScopeAttachments.length=0;

    }
    RequestID:number;
    RegistrationScope:string="";
    Exclusions:string;
    OutsourcedSpecialistOperations:string;
    ConsultancyRelatingDetails:string;
    TotalEmployeesNumber:number;
    TotalContractualEmployeesNumber:number;
    CertificationsCount:number;
    TotalAnnualRevenue:number;
    HaveLocalActivities:boolean=false;
    CertificateCountriesIDs:Array<number>=[];
    ScopeAttachments: AttachmentCreateViewModel[] = [];

}