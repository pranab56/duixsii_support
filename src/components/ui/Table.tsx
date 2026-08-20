import { ConfigProvider, Table as AntTable, TableProps as AntTableProps } from 'antd';

interface TableProps<T> extends AntTableProps<T> {
  className?: string;
  light?: boolean;
}

export function Table<T extends object>({ className, pagination = false, light = false, ...props }: TableProps<T>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: 'transparent',
            headerColor: light ? 'rgba(36, 36, 36, 0.4)' : 'rgba(255, 255, 255, 0.4)',
            headerSplitColor: 'transparent',
            colorBgContainer: 'transparent',
            colorText: light ? '#242424' : '#ffffff',
            borderColor: light ? 'rgba(86, 0, 12, 0.08)' : 'rgba(255, 255, 255, 0.05)',
            rowHoverBg: light ? 'rgba(86, 0, 12, 0.02)' : 'rgba(255, 255, 255, 0.02)',
          },
        },
      }}
    >
      <AntTable
        pagination={pagination}
        className={`${className || ''}`}
        {...props}
      />
    </ConfigProvider>
  );
}
export default Table;
