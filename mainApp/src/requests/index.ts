/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import type {
  listitem, requestResponse, pageResponse, status,
} from '../types';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

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

const getList: (companyTaxNoList: string[], tid: string, intercepters?: {
  requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
  responseInterceptor: (response: AxiosResponse) => AxiosResponse, // @ts-ignore
}) => Promise<requestResponse<pageResponse<listitem>>> = (companyTaxNoList, tid, intercepters) => instance({
  method: 'POST',
  headers: {
    tenantId: tid,
    action: config[env].action.list,
  },
  body: {
    companyTaxNoList,
    pageSize: 10000,
    currentPage: 1,
  }
})
//     fetch({
//   url: `/api/etax/${tid}/taxware/v1/login/list`,
//   method: 'POST',
//   body: {
//     companyTaxNoList,
//     pageSize: 10000,
//     currentPage: 1,
//   },
//   ...intercepters,
// });
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
}) => Promise<requestResponse<status>> = (item, tid, intercepters) => instance({
  method: 'GET',
  url: `/?companyTaxNo=${item.companyTaxNo}&t=${Date.now()}`,
  headers: {
    tenantId: tid,
    action: config[env].action.check,
  }
})
//   fetch({
//   url: `/api/etax/${tid}/taxware/v1/login/status?companyTaxNo=${item.companyTaxNo}&t=${Date.now()}`,
//   method: 'GET',
//   ...intercepters,
// });
// return Promise.resolve({
//     "code": "TXWR000000",
//     "message": "成功",
//     "result": {
//         "status": item.status === 1 ? 0 : 1,
//     }
// })

export {
  getList,
  checkStatus,
};
