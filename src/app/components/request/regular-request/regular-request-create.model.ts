import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { CattleBreedingCreateViewModel } from '../appendix-primary-sector/cattle-breeding-create.mode';
import { PoultryCreateViewModel } from '../appendix-primary-sector/poultry-create.model';
import { VegetablesProducerCreateViewModel } from '../appendix-primary-sector/vegetables-producer-create.model';
import { BusinessConditionViewModel } from './business-condition.model';
import { TimeScaleViewModel } from './time-scale.model';
import { AdditionalSiteCreateViewModel } from './additional-site-create.model';
import { ProductFamily } from './product-family.model';

export class RegularRequestCreateViewModel {
    ID: number;
    id: number;
    RequestID: number;
    RegistrationScope: string;
    HaveLocalActivities: boolean = false;
    Exclusions: string;
    OutsourcedSpecialistOperations: string;
    ConsultancyRelatingDetails: string;
    TotalProductionLinesNumber: number;
    HACCPStudyTypeAndNumber: string;
    RawMaterials: string;
    OtherProductionLinesInformation: string;
    TotalEmployeesNumber: number;
    PermanentEmployeesCount: number;
    TemporaryEmployeesCount: number;
    ShiftNumber: number;
    SeasonalProductInformation: string;
    GrossAnnualTurnover: number;
    ProductionFloorArea: number;
    BusinessConditions: BusinessConditionViewModel[] = [];
    TimeScales: TimeScaleViewModel[] = [];
    AdditionalSites: AdditionalSiteCreateViewModel[] = [];
    ScopeAttachments: AttachmentCreateViewModel[] = [];
    RawMaterialsAttachments	:AttachmentCreateViewModel[] = [];
    CattleBreedings: CattleBreedingCreateViewModel[] = []
    Poultries: PoultryCreateViewModel[] = [];
    VegetablesProducers: VegetablesProducerCreateViewModel[] = [];
    ProductFamilies: ProductFamily[] = []
}