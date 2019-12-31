import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';

export class ComplaintModel {
    constructor(){
        this.ComplaintDocuments=[];
    }
    Content:string="";
    ComplaintDocuments: AttachmentCreateViewModel[]=[];
}
