import CustomInstance from "../../lib/axios";

export async function postProduct(newProduct:any,rawJson:any){

    try {
        const result = await CustomInstance.post(
                `/product/${rawJson.store_id}`,
                newProduct
            );
        return result.data;

    } catch (error) {

        console.log(error);
        return [];
    }
}

export const productView= async (id:any) => {
    try{
        const result = await CustomInstance.get(`/product/single/${id}`);
        return result.data;

    }catch(error){
        console.log(error);
    }

}
