/* eslint-disable no-useless-catch */
import axios from "axios";
import CustomInstance from "../lib/axios";


const pathoInstance = axios.create({
    baseURL:`https://courier-api-sandbox.pathao.com`,
});

const pathaoCredentials = JSON.stringify({
    "base_url": "https://courier-api-sandbox.pathao.com",
    "client_id": "267",
    "client_secret": "wRcaibZkUdSNz2EI9ZyuXLlNrnAv0TdPUPXMnD39",
    "username": "test@pathao.com",
    "password": "lovePathao",
    "grant_type": "password"
});



const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://hermes-api.p-stageenv.xyz/aladdin/api/v1/issue-token',
    headers: {
        'Content-Type': 'application/json'
    },
    data: pathaoCredentials
};

async function getPathaoToken() {
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://hermes-api.p-stageenv.xyz/aladdin/api/v1/issue-token',
        headers: {
            'Content-Type': 'application/json'
        },
        data: pathaoCredentials
    };

    try {

      const {data : resData} = await axios.request(config);
        console.log(`pathao token `,resData);
      localStorage.setItem('ptoken',resData['access_token']);
      return resData['access_token'];
      
    } catch (error) {
      throw error;
    }

}

export async function getPathaoCity(){
    
    try {
        const {data:{data}} = await CustomInstance.get(`/pathao/city`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getPathaoZone(cityId){
    const result=Number(cityId)
    try {
        const {data:{data}} = await CustomInstance.get(`/pathao/zone/${result}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}
export async function getPathaoArea(zoneId){
    
    try {
        const {data:{data}} = await CustomInstance.get(`/pathao/area/${zoneId}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}
export async function getPathaoCost({weight,city,zone}){
    
    try {

        const requestBody = {
            "item_weight":weight,
            "recipient_city":city,
            "recipient_zone":zone
        }

        const {data : {pathao_cost}} = await CustomInstance.post(`/pathao/price`,requestBody);
        return pathao_cost;
    } catch (error) {
        console.log(error);
    }
}