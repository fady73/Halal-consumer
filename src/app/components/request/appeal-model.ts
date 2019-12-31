import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';

export class AppealModel {
    constructor(){
        this.AppealAttachments=[];
    }
    ID:number;
    RequestID:number;
    Message:string;
    AppealAttachments:AttachmentCreateViewModel[]=[];

}
