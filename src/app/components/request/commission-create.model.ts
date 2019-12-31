import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
export class CommissionCreateViewModel {
    ID: number;
    RequestID: number;
    NumberOfCertificates: number = 0;
    Attachments: AttachmentCreateViewModel[] = [];
}