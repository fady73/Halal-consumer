import { AttachmentCreateViewModel } from './../../../shared/view-models/attachment-create.model';
export class NCSCorrectiveActionCreateViewModel{
    NCSID:number;
    CorrectiveAction:string;
    ImplementationPeriod:Date=new Date();
    SuppliedDocuments: AttachmentCreateViewModel[] = [];
}