import type { Container } from 'react-dom';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

declare function createApp(options: { tid: string, taxNoList: string[], container: Container, requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig, responseInterceptor: (config: AxiosResponse) => AxiosResponse }): void

export default createApp;
