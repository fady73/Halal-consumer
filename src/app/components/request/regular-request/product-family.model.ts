import { ProductType } from './product-type.model';

export class ProductFamily{
    ID:number;
    NameArabic:string;
    NameEnglish:string;
    RegularRequestID:number=0;
    ProductTypes:ProductType[]=[];
}