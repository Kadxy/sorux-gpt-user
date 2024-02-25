export type LoginRequest = {
    username: string;
    password: string;
};

//{"StatusCode":10003,"StatusMsg":"网关内部错误","Token":"","AccessToken":""}
//{"StatusCode": 0,"StatusMsg": "success","Token": "5e9c69a0-edc6-4de9-b844-387c6f2cd263","AccessToken": "1b58fb54-ea68-4321-beaa-145d33018422"}
export type LoginResponse = {
    StatusCode: number;
    StatusMsg: string;
    Token: string;
    AccessToken: string;
}

// {
//     "StatusCode": 0,
//     "StatusMsg": "success",
//     "data": [
//     {
//         "relation_id": 36,
//         "node_id": 8,
//         "name": "07 Plus 4.0",
//         "description": "共享4.0 有GPTS以及插件",
//         "is_plus": true,
//         "is_valid": true,
//         "is_unlimited": false,
//         "link": "plus7.yunai.xyz",
//         "time": "2024-02-25T20:36:42Z"
//     }
// ]
// }

export type ListResponse = {
    StatusCode: number;
    StatusMsg: string;
    data: Array<{
        relation_id: number;
        node_id: number;
        name: string;
        description: string;
        is_plus: boolean;
        is_valid: boolean;
        is_unlimited: boolean;
        link: string;
        time: string;
    }>
}

// {
//     "StatusCode": 0,
//     "StatusMsg": "success",
//     "Data": {
//     "ID": 13,
//         "UserName": "ceshi001",
//         "Bill": 0,
//         "RecommendCode": "0a48a49f-42a2-4c05-a191-c18ab83cba54",
//         "WebCode": "1b58fb54-ea68-4321-beaa-145d33018422",
//         "APIKey": "15cabd4f-d2b4-4c42-acca-2480c3c58baf",
//         "PlusCount": "",
//         "NormalCount": "",
//         "MessageLimited": 0,
//         "RateRefreshTime": 0,
//         "Email": ""
// }
// }

export type UserInfoResponse = {
    StatusCode: number;
    StatusMsg: string;
    Data: {
        ID: number;
        UserName: string;
        Bill: number;
        RecommendCode: string;
        WebCode: string;
        APIKey: string;
        PlusCount: string;
        NormalCount: string;
        MessageLimited: number;
        RateRefreshTime: number;
        Email: string;
    }
}

// {"StatusCode":0,"StatusMsg":"success"}

export type VerifyLoginStatusResponse = {
    StatusCode: number;
    StatusMsg: string;
}