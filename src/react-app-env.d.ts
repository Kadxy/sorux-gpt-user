/// <reference types="react-scripts" />
//后台地址
declare namespace NodeJS {
    interface ProcessEnv {
        //后端地址
        REACT_APP_API_BASE_URL: string;
    }
}