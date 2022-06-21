import type { Container } from 'react-dom';
import createFullElecLogin from './App';
import './index.css';

createFullElecLogin({
  tid: '0',
  taxNoList: ['91310118MA1JNRHF6D', '91440101MA5AU36B52', '91440101MA59FLRQ80', '91440101MA59BFL5XX', '91440101MA5ANGXC2K'],
  container: document.getElementById('root') as Container,
  requestInterceptor: (requestConfig) => {
    console.log({ requestConfig });
    return requestConfig;
  },
  responseInterceptor: (responseConfig) => {
    console.log({ responseConfig });
    return responseConfig;
  },
});
