// src/__ tests __/App.test.tsx
import '@testing-library/jest-dom'
import { getAllCategory, getAllSearchedProducts, getAllSearchedProductsSuccessCheck } from "../services/Business/businessServices";

const expectedValue = [
    {
        "_id": "64f2eef9d6ef6d4abbe5e90a",
        "id": "99bf4fd3-ac5a-4d3a-bc6c-320824dcf77e",
        "image": "https://res.cloudinary.com/dro9twjqg/image/upload/icons/ctahwydhc2omltzuoq2j",
        "name": "Beverages",
        "createdAt": "2023-09-02T08:14:49.695Z",
        "updatedAt": "2023-09-02T08:14:49.695Z",
        "__v": 0
    },
    {
        "_id": "64f2ef42d6ef6d4abbe5e90c",
        "id": "ef217974-e516-4057-a325-b4e84b34b13c",
        "image": "https://res.cloudinary.com/dro9twjqg/image/upload/v1693642222/icons/c4gspxyl6bn37uoxkhjq.png",
        "name": "Sauces & Pickles",
        "createdAt": "2023-09-02T08:16:02.524Z",
        "updatedAt": "2023-09-02T08:16:02.524Z",
        "__v": 0
    },
    {
        "_id": "64f2ef72d6ef6d4abbe5e90e",
        "id": "a87ee15d-bf96-44ff-977e-427171165f64",
        "image": "https://res.cloudinary.com/dro9twjqg/image/upload/v1693642221/icons/wratlixjasaqadynivnp.png",
        "name": "Frozen Goods",
        "createdAt": "2023-09-02T08:16:50.560Z",
        "updatedAt": "2023-09-02T08:16:50.560Z",
        "__v": 0
    },
    {
        "_id": "64f2efd6d6ef6d4abbe5e912",
        "id": "275a1c7e-d39d-46a8-bae7-298c3e2badf4",
        "image": "https://res.cloudinary.com/dro9twjqg/image/upload/v1693642221/icons/plou3lig5grae7w8waqx.png",
        "name": "Fruits",
        "createdAt": "2023-09-02T08:18:30.491Z",
        "updatedAt": "2023-09-02T08:18:30.491Z",
        "__v": 0
    },
    {
        "_id": "64f2effdd6ef6d4abbe5e914",
        "id": "fc73811d-9cf1-43af-b3e4-73a6de08ada7",
        "image": "https://res.cloudinary.com/dro9twjqg/image/upload/v1693642221/icons/c0f3dxe3q9gh3slqqivx.png",
        "name": "Vegetables",
        "createdAt": "2023-09-02T08:19:09.420Z",
        "updatedAt": "2023-09-02T08:19:09.420Z",
        "__v": 0
    },
    {
        "_id": "64f2f020d6ef6d4abbe5e916",
        "id": "3ac7fa68-920a-4541-aae7-67f114e4536d",
        "image": "https://res.cloudinary.com/dro9twjqg/image/upload/v1693642221/icons/yjq4cdjhrnko5m0oxkrq.png",
        "name": "Meat",
        "createdAt": "2023-09-02T08:19:44.170Z",
        "updatedAt": "2023-09-02T08:19:44.170Z",
        "__v": 0
    },
    {
        "_id": "64f2f03cd6ef6d4abbe5e918",
        "id": "bbe0197b-aee6-4da3-a502-d3554df78d96",
        "image": "https://res.cloudinary.com/dro9twjqg/image/upload/v1693642221/icons/jytljomeirnu8joxx5wz.png",
        "name": "Fish",
        "createdAt": "2023-09-02T08:20:12.719Z",
        "updatedAt": "2023-09-02T08:20:12.719Z",
        "__v": 0
    }
]
const searchedProductData = [
    {
        "_id": "64f872ee54d66f80bebfbdbe",
        "id": "3a7d63ba-a583-4c4a-a3bd-f5158bdb19c0",
        "store_id": "fe2a6dfd-1a36-4f75-80f6-96a7bac875be",
        "name": "egg",
        "category": [
            "a87ee15d-bf96-44ff-977e-427171165f64"
        ],
        "price": 700,
        "stock": 5,
        "sold": 0,
        "description": "Best egg",
        "images": [
            "http://res.cloudinary.com/dro9twjqg/image/upload/v1694003949/skh2otyhq1a2my2xk5cc.jpg"
        ],
        "reviews": [],
        "unit_size": 50,
        "weight": 2,
        "createdAt": "2023-09-06T12:39:10.288Z",
        "updatedAt": "2023-09-06T12:39:10.288Z",
        "__v": 0
    }
]

const taggedData =
    [
        {
            "_id": "64f872ee54d66f80bebfbdbe",
            "id": "3a7d63ba-a583-4c4a-a3bd-f5158bdb19c0",
            "store_id": "fe2a6dfd-1a36-4f75-80f6-96a7bac875be",
            "name": "egg",
            "category": [
                "a87ee15d-bf96-44ff-977e-427171165f64"
            ],
            "price": 700,
            "stock": 5,
            "sold": 0,
            "description": "Best egg",
            "images": [
                "http://res.cloudinary.com/dro9twjqg/image/upload/v1694003949/skh2otyhq1a2my2xk5cc.jpg"
            ],
            "reviews": [],
            "unit_size": 50,
            "weight": 2,
            "createdAt": "2023-09-06T12:39:10.288Z",
            "updatedAt": "2023-09-06T12:39:10.288Z",
            "__v": 0
        }
    ]


test('demo', () => {
    expect(true).toBe(true)
})


// describe('fetchData', () => {
//     it('fetches data successfully from an API', async () => {
//         const data = await getAllCategory();

//         // Your assertions here
//         expect(data).toBeDefined();
//         expect(data.someKey).toEqual(expectedValue);
//     });
// });

test('fetching product categories test', async () => {
    return await getAllCategory().then(data => {
        expect(data).toStrictEqual(expectedValue);
    });
});

test('fetching searched data api test', async () => {
    let query = 'egg'
    let category = ''
    return await getAllSearchedProducts(query, category).then(data => {
        expect(data).toStrictEqual(searchedProductData);
    });
});

test('fetching tagged category product get test', async () => {
    let query = ''
    let category = 'a87ee15d-bf96-44ff-977e-427171165f64'
    return await getAllSearchedProducts(query, category).then(data => {
        expect(data).toStrictEqual(taggedData);
    });
});

test('fetching tagged category success test', async () => {
    let query = ''
    let category = 'a87ee15d-bf96-44ff-977e-427171165f64'
    return await getAllSearchedProductsSuccessCheck(query, category).then(data => {
        expect(data?.status).toStrictEqual(true);
    });
});

// test('fetching individual product data', async () => {
//     let query = ''
//     let category = 'a87ee15d-bf96-44ff-977e-427171165f64'
//     return await getAllSearchedProducts(query, category).then(data => {
//         expect(data).toStrictEqual(taggedData);
//     });
// });
