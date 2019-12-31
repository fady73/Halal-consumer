import { AttachmentCreateViewModel } from './../../shared/view-models/attachment-create.model';
export class RequestDocumentViewModel {
    constructor(){
        this.Attachments.length=0;
    }
    ID: number = 0;
    RequestID: number = 0;
    RequiredDocumentID: number = 0;
    RequiredDocumentName: string;
    Notes: string = " ";
    Attachments: AttachmentCreateViewModel[] = [];
    Valid: boolean = false;
}