import { ProductType } from './request/regular-request/product-type.model';

export class ProductModelClass {
        ID:number;
        Name:string;
        RegularRequestID:number=0;
        ProductTypes:ProductType[]=[];
    
}
