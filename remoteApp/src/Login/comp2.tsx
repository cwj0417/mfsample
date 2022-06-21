import React, {
  FC, useState, useRef, forwardRef, useImperativeHandle,
} from 'react';
import {
  Modal, Tabs,
} from 'antd';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { componentConfigType } from '../types';
import Form2 from './form/form2';
import Form3 from './form/form3';

const compMap: {
  [key: number]: {
    name: string,
    comp: FC<{
      companyTaxNo: string,
      tid: string,
      intercepters?: {
        requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
        responseInterceptor: (response: AxiosResponse) => AxiosResponse,
      },
      onsuccess: (taxno: string) => void,
      comp: componentConfigType,
    }>
  }
} = {
  // 1: {
  //   name: '手机验证码登录',
  // },
  2: {
    name: '账号密码登录',
    comp: Form2,
  },
  3: {
    name: '二维码登录',
    comp: Form3,
  },
};

const useLogin = (intercepters?: {
  requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
  responseInterceptor: (response: AxiosResponse) => AxiosResponse,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modalRef = useRef<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LoginComp: FC<{ onsuccess: (taxno: string) => void }> = forwardRef((props, fwdRef) => {
    const [comps, setComps] = useState<componentConfigType[]>([]);
    const [tid, setTid] = useState('');
    const [companyTaxNo, setCompanyTaxNo] = useState('');
    const [visible, setVisible] = useState(false);

    const openModal = (tn: string, compList: componentConfigType[], tid: string) => {
      setComps(compList);

      setCompanyTaxNo(tn);
      setVisible(true);
      setTid(tid);
    };
    useImperativeHandle(fwdRef, () => ({ openModal }));

    return (
      <Modal
        {...{
          visible,
          onOk: () => setVisible(false),
          onCancel: () => setVisible(false),
          title: '登录',
          footer: null,
          width: '700px',
          destroyOnClose: true,
        }}
      >
        <Tabs {...{
          defaultActiveKey: '1',
          tabPosition: 'left',
        }}>
          {comps.map((comp, index) => {
            const LoginComponent = compMap[comp.componentVersion]?.comp;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            return ( // @ts-ignore
              <Tabs.TabPane key={index} tab={compMap[comp.componentVersion]?.name ?? '未知登录类型'}>
                {LoginComponent && (
                  <LoginComponent {...{
                    companyTaxNo,
                    tid,
                    intercepters,
                    onsuccess: props.onsuccess,
                    comp,
                  }} />
                ) || null}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </Modal>
    );
  });
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    Comp: (props: { onsuccess: (taxno: string) => void }) => ( // @ts-ignore
      <LoginComp {...props} ref={modalRef} />
    ),
    openModal: (s: string, compList: componentConfigType[], tid: string) => { modalRef.current.openModal(s, compList, tid); },
  };
};

export default useLogin;
