import type { DataTableSetupProps } from 'naive-ui/es/data-table/src/interface';

interface CustomProps {
  api: (...param: any) => Promise<Service.RequestResult<Page<any>>>;
}

export type STableProps = Partial<DataTableSetupProps> & CustomProps;
