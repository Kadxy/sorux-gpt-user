// src/api/api.ts

import axios, {AxiosError} from 'axios';
import {message} from "antd";

// 请求参数均使用 form-data 格式
// 除基本API外，参数均需要鉴权，鉴权 Token 以 Query 方式传入
// 对于返回的内容，一定是一个JSON 格式，且JSON 格式中一定包含:status msg 和 status code 字段。
// 对于一切的请求，如果被处理 HTTP 状态码均为 200 0K，根据 status_code 来判断业务状态。
// 如果 status code 为0，那么表示业务按照预期被处理;如果 status code 不为0，根据 status msg 判断异常原因。
// --对于内部异常，请在 SoruxGPT 控制台日志查看原因(保障业务安全，防止 BUG 被猜出来)
// --对于业务异常，会通过 status msg 返回原因

export const API = axios.create({
    baseURL: 'https://chat.yunai.xyz',
    // baseURL: 'https://mock.apifox.com/m1/4058384-0-default',
});

API.interceptors.response.use(
    (response) => response,
    (error) => showError(error)
);

function isAxiosError(error: any): error is AxiosError {
    return (error as AxiosError).response !== undefined;
}

export function showError(error: AxiosError | Error | any, showMessage: boolean = true): void {//接受 any，因为会处理非 AxiosError 类型的错误
    console.error('showError', error);
    if (isAxiosError(error)) {
        console.error('isAxiosError', error);
        message.error('请求失败：' + error.message);
    } else {
        console.error('isNotAxiosError', error);
        message.error('操作失败：' + error.message);
    }
}