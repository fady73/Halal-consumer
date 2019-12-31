export class ComplaintUploadModel {
    ID: number;
   
    FileName: string = "";
    FilePath: string = "";

    complaintDate:Date=new Date();
    // Attachments: AttachmentCreateViewModel[] = [];
    IsActive: boolean;
    IsSelected: boolean = false;
}
