import { AttachmentCreateViewModel } from '../../shared/view-models/attachment-create.model';
export class PaymentUploadViewModel {
    ID: number;
    RequestID:number;
    FileName:string;
    FilePath:string;
    Type:string;
    // Attachments: AttachmentCreateViewModel[] = [];
    IsActive: boolean;
    IsSelected: boolean = false;
}
