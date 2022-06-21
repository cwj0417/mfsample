import React, {
  FC, useState, useRef,
} from 'react';
import {
  Button, Form, Input, Alert, Popover, message,
} from 'antd';
import { login2 } from '../../requests';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { componentConfigType } from '../../types';

const Form2: FC<{
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

  const formData = useRef<{
        operatorAccount: string,
        operatorPassword: string,
    }>({
      operatorAccount: '',
      operatorPassword: '',
    });

  const login = () => {
    if (!formData.current.operatorAccount) {
      setErrormsg('请输入账号');
      return;
    }
    if (!formData.current.operatorPassword) {
      setErrormsg('请输入密码');
      return;
    }
    setRequesting(true);
    login2({
      ...formData.current,
      companyTaxNo,
    }, tid, intercepters)
      .then((res) => {
        if (res.code === 'TXWR000000') {
          if (res.result.code === 1) {
            message.success('登录成功');
            onsuccess(companyTaxNo);
          } else {
            setErrormsg(res.result.message);
          }
        } else {
          setErrormsg(res.message);
        }
      })
      .finally(() => {
        setRequesting(false);
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
            <Form.Item label="用户名/实名手机号码" required>
                <Input onChange={e => formData.current.operatorAccount = e.target.value} />
            </Form.Item>
            <Form.Item label="用户密码" required>
                <Input autoComplete={'true'} type="password" onChange={e => formData.current.operatorPassword = e.target.value} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 9 }}>
                <Button loading={requesting} style={{ width: '120px' }} type="primary" onClick={login}>登录</Button>
            </Form.Item>
        </Form>
  );
};

export default Form2;
