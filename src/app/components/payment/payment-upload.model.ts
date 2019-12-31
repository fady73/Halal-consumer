import { PaymentType } from './payment-type.enum';

export class PaymentUploadViewModel {
    ID: number;
    RequestID: number;
    FileName: string = "";
    FilePath: string = "";
    Type: PaymentType;
    PaymentDate:Date=new Date();
    // Attachments: AttachmentCreateViewModel[] = [];
    IsActive: boolean;
    IsSelected: boolean = false;
}
