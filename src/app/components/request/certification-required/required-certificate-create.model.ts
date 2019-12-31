import { RequestType } from '../request-type.enum';
import { CertificateType } from '../certificate-type.enum';
import { CompanyThirdPartyCertificationCreateViewModel } from '../company-third-party-certification-create.model';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';

export class RequiredCertificateCreateViewModel{
    constructor(){
        this.PreviousAuditAttachments=[];
    }
    ID:number=0;
    //RequestType:RequestType=RequestType.Certification_Issue;
    //RequestTypeDescription:string;
    CertificateTypes:RequestCertificateTypeCreateViewModel[];
    // CertificateDescription:string;
    CompanyCertified:boolean=null;
    PreviousAudit:string;
    PreviousAuditAttachments:AttachmentCreateViewModel[]=[];
    CompanyCertifications:CompanyThirdPartyCertificationCreateViewModel[]=[];
}

export class RequestCertificateTypeCreateViewModel{

    ID:number;	
    CertificateType:CertificateType;
    CertificateDescription:string;
    RequestID:number
}
