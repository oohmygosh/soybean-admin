import RequestResult = Service.RequestResult;

export interface STableProps {
  api?: (...param: any) => Promise<RequestResult<Page<any>>>;
}
