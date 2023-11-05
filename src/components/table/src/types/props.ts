import type { AxiosRequestConfig } from 'axios';
import RequestResult = Service.RequestResult;

export interface STableProps {
  title?: string;
  api?: (param?: PageParam<any>, config?: AxiosRequestConfig<any>) => Promise<RequestResult<Page<any>>>;
}
