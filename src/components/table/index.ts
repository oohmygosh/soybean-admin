import type { RowData } from 'naive-ui/es/data-table/src/interface';
import type STable from '@/components/table/s-table.vue';
import type { PseudoComponent } from './PseudoComponent';

export type STableElementType<T extends RowData> = PseudoComponent<typeof STable<T>>;
