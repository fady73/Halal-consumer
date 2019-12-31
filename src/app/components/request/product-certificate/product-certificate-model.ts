import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { DetailsModel } from './details-model';

export class ProductCertificateModel {
    constructor()
    {
        this.Details=[];
    }
    ID:number
    RequestID: number;
   Details:DetailsModel[]=[];

}
