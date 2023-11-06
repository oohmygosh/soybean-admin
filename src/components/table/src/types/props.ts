import type { DataTableProps } from 'naive-ui';
import RequestResult = Service.RequestResult;

export interface STableProps<M> extends /* @vue-ignore */ DataTableProps {
  api?: (...param: any) => Promise<RequestResult<Page<M>>>;
  title?: 'aaaa';
}
