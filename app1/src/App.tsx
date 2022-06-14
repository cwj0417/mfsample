import React, { FC, useState, useEffect, Suspense, lazy } from 'react';
import { render, Container } from 'react-dom';
import './App.css';
import { Modal, Badge, message } from 'antd';
import { getList, checkStatus } from './requests';
import type { listitem } from './types';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const List = lazy(() => import('app2/App'))

const App: FC<{
  tid: string,
  taxNoList: string[],
  intercepters?: {
    requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
    responseInterceptor: (response: AxiosResponse) => AxiosResponse,
  }
}> = (props) => {
  const { tid, taxNoList, intercepters } = props;
  const [list, setList] = useState<listitem[]>([]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getList(taxNoList, tid, intercepters).then(((res) => {
      if (res.code === 'TXWR000000') {
        setList(res.result.list);
      }
    }));
  }, [taxNoList, tid, intercepters]);

  const check: (item: listitem) => Promise<string> = item => checkStatus(item, tid, intercepters).then((res) => {
    if (res.code === 'TXWR000000') {
      message.success('刷新成功');
      setList(pre => pre.map((each) => {
        if (item.companyTaxNo === each.companyTaxNo) {
          each.status = res.result;
        }
        return each;
      }));
      return Promise.resolve('suc');
    }
    message.error('刷新失败');
    return Promise.reject('fail');
  });

  const logsuc = (taxNo: string) => {
    setList(pre => pre.map((each) => {
      if (taxNo === each.companyTaxNo) {
        each.status = 1;
      }
      return each;
    }));
  };

  return list.length ? (
    <>
      <div style={{ margin: 10 }} onClick={() => setVisible(true)}>
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          list.some(i => i.status === 1) ? (list.some(i => i.status === 0) ? <Badge offset={[10, 0]} count={list.filter(i => i.status === 0).length}> <a>部分税号连接失败</a></Badge> : <Badge color="green" offset={[5, 0]} ><a>所有税号连接成功</a></Badge>) : <Badge offset={[10, 0]} count={list.length}><a>所有税号连通失败</a></Badge>
        }
      </div>
      <Modal
        {...{
          width: 900,
          title: '电子发票服务平台连通状态',
          footer: null,
          visible,
          onOk: () => setVisible(false),
          onCancel: () => setVisible(false),
        }}
      >
        <Suspense fallback="loading">
          <List check={check} data={list} tid={tid} logsuc={logsuc} intercepters={intercepters} />
        </Suspense>
      </Modal>
    </>
  ) : null;
};

export default ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  tid, taxNoList, container, requestInterceptor = a => a, responseInterceptor = a => a,
}: { tid: string, taxNoList: string[], container: Container, requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig, responseInterceptor?: (config: AxiosResponse) => AxiosResponse }) => {
  render(<App tid={tid} taxNoList={taxNoList} intercepters={{ requestInterceptor, responseInterceptor }} />, container);
};
