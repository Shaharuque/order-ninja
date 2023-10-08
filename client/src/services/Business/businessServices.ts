import CustomInstance from "../../lib/axios";

export const getAllCategory = async () => {
    try {
        const result = await CustomInstance.get(`/category`);
        return result.data;

    } catch (error) {
        console.log(error);
    }
}

export async function getAllSearchedProducts(query: any, category: any) {

    try {
        const result = await CustomInstance.get(`/public/search?q=${query}&cat=${category}`);
        return result.data?.data;

    } catch (error) {

        console.log(error);
        return [];
    }
}

export async function getAllSearchedProductsSuccessCheck(query: any, category: any) {

    try {
        const result = await CustomInstance.get(`/public/search?q=${query}&cat=${category}`);
        return result.data;

    } catch (error) {

        console.log(error);
        return [];
    }
}