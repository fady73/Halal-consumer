import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';

export class RecognitionRequestModificationModel {
    RequestID: number;
    ProductCategoriesIDs: number[]=[];
    Attachments: AttachmentCreateViewModel[] = [];
}