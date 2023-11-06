import type { PaginationProps } from 'naive-ui';
import type { BaseLoadingExposedProps } from 'naive-ui/es/_internal';
import type { CreateRowKey, RowData, RowKey, TableColumns } from 'naive-ui/es/data-table/src/interface';

export interface STableProps<T> {
  api: (...param: any) => Promise<Service.RequestResult<Page<any>>>;
  columns: TableColumns<T>;
  data?: RowData[];
  size?: 'small' | 'medium' | 'large';
  tableLayout?: 'fixed' | 'auto';
  bordered?: boolean | undefined;
  pagination?: PaginationProps;
  virtualScroll?: boolean;
  remote?: boolean;
  paginateSinglePage?: boolean;
  bottomBordered?: boolean | undefined;
  striped?: boolean;
  defaultCheckedRowKeys?: RowKey[];
  singleLine?: boolean;
  singleColumn?: boolean;
  defaultExpandedRowKeys?: RowKey[];
  defaultExpandAll?: boolean;
  stickyExpandedRows?: boolean;
  allowCheckingNotLoaded?: boolean;
  cascade?: boolean;
  childrenKey?: string;
  indent?: number;
  flexHeight?: boolean;
  summaryPlacement?: 'bottom' | 'top';
  paginationBehaviorOnFilter?: 'first' | 'current';
  spinProps?: BaseLoadingExposedProps;
  scrollX?: string | number;
  rowKey?: CreateRowKey<T>;
}

/* declare const CustomProps: {
  readonly api: PropType<(...param: any) => any>;
  readonly data: RowData[];
  readonly size: 'small' | 'medium' | 'large';
  readonly tableLayout: 'fixed' | 'auto';
  readonly columns: PropType<TableColumns<any>>;
  readonly loading: boolean;
  readonly bordered: {
    readonly type: PropType<BooleanConstructor | undefined>;
    readonly default: undefined;
  };
  readonly pagination: false | PaginationProps;
  readonly virtualScroll: boolean;
  readonly remote: boolean;
  readonly paginateSinglePage: boolean;
  readonly bottomBordered: boolean | undefined;
  readonly striped: boolean;
  readonly defaultCheckedRowKeys: PropType<RowKey[]>;
  readonly singleLine: boolean;
  readonly singleColumn: boolean;
  readonly defaultExpandedRowKeys: RowKey[];
  readonly defaultExpandAll: boolean;
  readonly stickyExpandedRows: boolean;
  readonly allowCheckingNotLoaded: boolean;
  readonly cascade: boolean;
  readonly childrenKey: string;
  readonly indent: number;
  readonly flexHeight: boolean;
  readonly summaryPlacement: 'bottom' | 'top';
  readonly paginationBehaviorOnFilter: 'first' | 'current';
  readonly spinProps: BaseLoadingExposedProps;
  readonly scrollX: PropType<string | number>;
  readonly rowKey: PropType<CreateRowKey<any>>;
}; */

// export type STableProps = ExtractPropTypes<typeof CustomProps> | DataTableSetupProps;
