import { ProductFamily } from './regular-request/product-family.model';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';

export class ModificationModel {
    ProductCategoriesIDs:number[]=[];
 
    RequestID: number;
  
    RegistrationScope: string;
    Exclusions:string;

    TotalProductionLinesNumber: number;
    HACCPStudyTypeAndNumber: string;
 
    HaveLocalActivities:boolean=false;
 
    Attachments: AttachmentCreateViewModel[] = [];
    ScopeAttachments: AttachmentCreateViewModel[] = [];
    ProductFamilies: ProductFamily[] = []



    // ID: number;
    // id: number;

    // OutsourcedSpecialistOperations: string;
    // ConsultancyRelatingDetails: string;
 
    // RawMaterials: string;
    // OtherProductionLinesInformation: string;
    // TotalEmployeesNumber: number;
    // PermanentEmployeesCount: number;
    // TemporaryEmployeesCount: number;
    // ShiftNumber: number;
    // SeasonalProductInformation: string;
    // GrossAnnualTurnover: number;
    // ProductionFloorArea: number;
    // BusinessConditions: BusinessConditionViewModel[] = [];
    // TimeScales: TimeScaleViewModel[] = [];
    // AdditionalSites: AdditionalSiteCreateViewModel[] = [];  
    //  RawMaterialsAttachments	:AttachmentCreateViewModel[] = [];
    // CattleBreedings: CattleBreedingCreateViewModel[] = []
    // Poultries: PoultryCreateViewModel[] = [];
    // VegetablesProducers: VegetablesProducerCreateViewModel[] = [];

}
