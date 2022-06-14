import React, { FC, useState } from 'react';
import { Table, Badge, Button } from 'antd';
import type { listitem } from './types';
import useLogin2 from './Login/comp2';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const List: FC<{
    data: listitem[],
    check: (item: listitem) => Promise<string>,
    tid: string,
    logsuc: (taxNo: string) => void,
    intercepters?: {
      requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
      responseInterceptor: (response: AxiosResponse) => AxiosResponse,
    }
}> = (props) => {
  const {
    data, check, tid, logsuc, intercepters,
  } = props;
  const { Comp, openModal } = useLogin2(intercepters);
  const columns = [{
    title: '公司名称',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '税号',
    dataIndex: 'companyTaxNo',
    key: 'companyTaxNo',
    width: '200px',
  }, {
    title: '状态123213',
    dataIndex: 'status',
    key: 'status',
    width: '130px',
    render: (status: number) => (status === 1 ? <Badge status="success" text="连接成功" /> : <Badge status="error" text="身份认证失败" />),
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: '120px',
    render: (text: number, record: listitem) => {
      if (record.status === 1) {
        const Refresh: FC<{ check: (item: listitem) => Promise<string> }> = ({ check }) => {
          const [loading, setLoading] = useState(false);
          return <Button
            loading={loading}
            type="link"
            onClick={() => {
              setLoading(true);
              check(record).finally(() => setLoading(false));
            }}>刷新</Button>;
        };
        return <Refresh check={check} />;
      }
      return <a onClick={() => openModal(record.companyTaxNo, record.componentList, tid)}>重新登录</a>;
    },
  }];
  return (
    <>
            <Table pagination={false} dataSource={data} columns={columns} rowKey='companyTaxNo' />
            {Comp({ onsuccess: (tid) => { logsuc(tid); } })}
    </>
  );
};

export default List;
