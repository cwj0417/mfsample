/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { fetch } from '@xforce/standard-http-request';
import type {
  listitem, requestResponse, pageResponse, status,
} from '../types';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

const env = /(localhost|-t)/.test(window.location.host) ? 'dev' : 'prod';

const config = {
  dev: {
    host: 'https://janus-inte.xforceplus.com',
    Authentication: 'FELC2022062215314313892371',
    action: {
      list: 'B3DC9C95130F16A0BDBE009D35E88F9B',
      check: 'CC6E55BD7B59489D3AB442B8F942EAC8',
      login: 'A25D91BF0956F20B765AA767513DB2C5',
    }
  },
  prod: { // 暂时没有
    host: 'https://janus.xforceplus.com',
    Authentication: 'FELC2022062215314313892371',
    action: {
      list: 'B3DC9C95130F16A0BDBE009D35E88F9B',
      check: 'CC6E55BD7B59489D3AB442B8F942EAC8',
      login: 'A25D91BF0956F20B765AA767513DB2C5',
    }
  },
}

const instance = axios.create({
  baseURL: config[env].host,
  timeout: 10000,
  headers: {
    'Authentication': config[env].Authentication,
    'rpcType': 'http',
    'serialNo': Date.now(),
  }
})


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
}>> = (param, tid, intercepters) => instance({
  method: 'POST',
  headers: {
    tenantId: tid,
    action: config[env].action.login,
  },
  body: {
    ...param,
    componentVersion: 2,
  }
})
//    fetch({
//   url: `/api/etax/${tid}/taxware/v1/login`,
//   method: 'POST',
//   body: {
//     ...param,
//     componentVersion: 2,
//   },
//   ...intercepters,
// });
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
}>> = (param, tid, intercepters) => instance({
  method: 'POST',
  headers: {
    tenantId: tid,
    action: config[env].action.login,
  },
  body: {
    ...param,
    componentVersion: 3,
  }
})
// fetch({
//   url: `/api/etax/${tid}/taxware/v1/login`,
//   method: 'POST',
//   body: {
//     ...param,
//     componentVersion: 3,
//   },
//   ...intercepters,
// });


export {
  login2,
  login3,
};
