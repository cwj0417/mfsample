/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fetch } from '@xforce/standard-http-request';
import type {
  listitem, requestResponse, pageResponse, status,
} from '../types';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const getList: (companyTaxNoList: string[], tid: string, intercepters?: {
  requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
  responseInterceptor: (response: AxiosResponse) => AxiosResponse, // @ts-ignore
}) => Promise<requestResponse<pageResponse<listitem>>> = (companyTaxNoList, tid, intercepters) => fetch({
  url: `/api/etax/${tid}/taxware/v1/login/list`,
  method: 'POST',
  body: {
    companyTaxNoList,
    pageSize: 10000,
    currentPage: 1,
  },
  ...intercepters,
});
// return Promise.resolve({
//     "code": "TXWR000000",
//     "message": "成功",
//     "result": {
//         "currentPage": 1,
//         "pageSize": 20,
//         "total": 35,
//         "list": [{
//             "companyTaxNo": "91440101MA5ANGXC2K",
//             "companyName": "汉堡王食品（深圳）有限公司广州新港西路分公司",
//             "componentVersion": 1,
//             "imageUrl": "https://imsc-dvlp-files.oss-cn-hangzhou.aliyuncs.com/taxware/el-cloud-auth/log/20220512/4400/91440101MA5ANGXC2K/20220512193243087.jpg",
//             "docUrl": "https://imsc-prod-files.oss-cn-hangzhou.aliyuncs.com/file/client/el/doc/%E5%BA%95%E8%B4%A6%E5%AE%9E%E6%96%BD%E8%BF%90%E7%BB%B4%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.pdf",
//             "status": 1,
//             "lastLoginTime": "2022-05-18 15:54:12"
//         }, {
//             "companyTaxNo": "91440101MA5ANGXC2T",
//             "companyName": "麦当劳食品（深圳）有限公司广州新港西路分公司",
//             "componentVersion": 2,
//             "imageUrl": "https://imsc-dvlp-files.oss-cn-hangzhou.aliyuncs.com/taxware/el-cloud-auth/log/20220512/4400/91440101MA5ANGXC2K/20220512193243087.jpg",
//             "docUrl": "https://imsc-prod-files.oss-cn-hangzhou.aliyuncs.com/file/client/el/doc/%E5%BA%95%E8%B4%A6%E5%AE%9E%E6%96%BD%E8%BF%90%E7%BB%B4%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.pdf",
//             "status": 0,
//             "lastLoginTime": "2022-05-18 15:54:12"
//         }]
//     }
// })


const checkStatus: (item: listitem, tid: string, intercepters?: {
  requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
  responseInterceptor: (response: AxiosResponse) => AxiosResponse, // @ts-ignore
}) => Promise<requestResponse<status>> = (item, tid, intercepters) => fetch({
  url: `/api/etax/${tid}/taxware/v1/login/status?companyTaxNo=${item.companyTaxNo}&t=${Date.now()}`,
  method: 'GET',
  ...intercepters,
});
// return Promise.resolve({
//     "code": "TXWR000000",
//     "message": "成功",
//     "result": {
//         "status": item.status === 1 ? 0 : 1,
//     }
// })


const login2: (param: {
    companyTaxNo: string,
    operatorAccount: string,
    operatorPassword: string,
}, tid: string, intercepters?: {
  requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
  responseInterceptor: (response: AxiosResponse) => AxiosResponse,
}) => Promise<requestResponse<{
    code: 0 | 1,
    message: string, // @ts-ignore
}>> = (param, tid, intercepters) => fetch({
  url: `/api/etax/${tid}/taxware/v1/login`,
  method: 'POST',
  body: {
    ...param,
    componentVersion: 2,
  },
  ...intercepters,
});
// return Promise.resolve({
//     "code": "TXWR000000",
//     "message": "成功",
//     result: {
//         "code": 1,
//         "message": "国税异常"
//     }
// })

const login3: (param: {
  companyTaxNo: string,
  step: 1 | 2,
}, tid: string, intercepters?: {
  requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
  responseInterceptor: (response: AxiosResponse) => AxiosResponse,
  }) => Promise<requestResponse<{
    code: 0 | 1 | 2,
    message: string,
    qrCode: string,
    scanTip: string, // @ts-ignore
  } >> = (param, tid, intercepters) => fetch({
    url: `/api/etax/${tid}/taxware/v1/login`,
    method: 'POST',
    body: {
      ...param,
      componentVersion: 3,
    },
    ...intercepters,
  });


export {
  getList,
  checkStatus,
  login2,
  login3,
};
