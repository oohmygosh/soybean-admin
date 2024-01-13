import type { TableBaseColumn } from 'naive-ui/es/data-table/src/interface';
import type { FormSetupProps } from 'naive-ui/es/form/src/Form';

interface CustomProps {
  columns: TableBaseColumn<any>[];
  modelValue: Record<string, unknown>;
}

export type SearchBarProps = CustomProps & Partial<FormSetupProps>;
