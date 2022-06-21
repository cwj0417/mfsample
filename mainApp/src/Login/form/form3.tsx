import React, {
  FC, useState, useRef, useEffect,
} from 'react';
import {
  Form, Alert, Popover, message, Spin,
} from 'antd';
import { login3 } from '../../requests';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { componentConfigType } from '../../types';

const Form3: FC<{
  companyTaxNo: string,
  tid: string,
  intercepters?: {
    requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig,
    responseInterceptor: (response: AxiosResponse) => AxiosResponse,
  },
  onsuccess: (taxno: string) => void,
  comp: componentConfigType,
}> = (props) => {
  const {
    companyTaxNo, tid, intercepters, onsuccess, comp,
  } = props;

  const [requesting, setRequesting] = useState(false);
  const [errormsg, setErrormsg] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [scanTip, setScanTip] = useState('');

  const pollingHandler = useRef(0);

  useEffect(() => {
    fetchQrCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    pollingHandler.current = setInterval(() => {
      login3({
        companyTaxNo,
        step: 2,
      }, tid, intercepters)
        .then((res) => {
          if (res.code === 'TXWR000000') {
            if (res.result.code === 1) {
              message.success('登录成功');
              onsuccess(companyTaxNo);
            } else if (res.result.code === 0) {
              setErrormsg(res.result.message);
            }
          } else {
            setErrormsg(res.message);
          }
        });
    }, 10000);
    return () => {
      clearInterval(pollingHandler.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQrCode = () => {
    setRequesting(true);
    setQrCode('');
    login3({
      companyTaxNo,
      step: 1,
    }, tid, intercepters)
      .then((res) => {
        setRequesting(false);
        if (res.code === 'TXWR000000') {
          if (res.result.code === 1) {
            setQrCode(res.result.qrCode);
            setScanTip(res.result.scanTip);
          }
        } else {
          setErrormsg(res.message);
        }
      });
  };

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      {errormsg && <Alert type="error" message={errormsg} banner /> || null}
      <Form.Item label="税号">
        {companyTaxNo}
        {comp.imageUrl && (
          <Popover
            trigger="click"
            title={null}
            content={(
              <img src={comp.imageUrl} style={{ maxWidth: 700 }} />
            )} >
            <a style={{ float: 'right' }}>登录指引</a>
          </Popover>
        ) || null}
      </Form.Item>
      {requesting && <Spin style={{ marginLeft: '220px' }} /> || (
        <>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <img src={qrCode ? `data:image/png;base64,${qrCode}` : ''} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 2 }}>
            {scanTip} <a onClick={fetchQrCode}>刷新二维码</a>
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default Form3;
