import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';

export class OperationCreateViewModel {
    RequestID: number = 0;
    OperationsDetails: string = "";
    Attachments: AttachmentCreateViewModel[] = [];
}