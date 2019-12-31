import { AttachmentType } from '../enum/attachment-type';

export class AttachmentCreateViewModel {
    ID: number;
    FileName: string;
    FilePath: string;
    AttachmentType: AttachmentType;
    OwnerID: number;
}