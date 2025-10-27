import React from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Table } from '../../src/components';
import type { ColumnType } from '../../src/components';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  email: string;
  phone: string;
  department: string;
}

// TablePage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tableWrapper: {
    width: '600px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  },
});

const TablePage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  // 基础数据
  const dataSource: DataType[] = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      department: '技术部',
    },
    {
      key: '2',
      name: '李四',
      age: 28,
      address: '上海市浦东新区',
      email: 'lisi@example.com',
      phone: '13800138001',
      department: '产品部',
    },
    {
      key: '3',
      name: '王五',
      age: 35,
      address: '广州市天河区',
      email: 'wangwu@example.com',
      phone: '13800138002',
      department: '设计部',
    },
    {
      key: '4',
      name: '赵六',
      age: 30,
      address: '深圳市南山区',
      email: 'zhaoliu@example.com',
      phone: '13800138003',
      department: '技术部',
    },
    {
      key: '5',
      name: '孙七',
      age: 26,
      address: '杭州市西湖区',
      email: 'sunqi@example.com',
      phone: '13800138004',
      department: '运营部',
    },
  ];

  // 大数据量（用于测试纵向滚动）
  const largeDataSource: DataType[] = Array.from({ length: 50 }, (_, i) => ({
    key: String(i + 1),
    name: `用户${i + 1}`,
    age: 20 + (i % 40),
    address: `城市${i % 10}区域${i % 5}`,
    email: `user${i + 1}@example.com`,
    phone: `138${String(i).padStart(8, '0')}`,
    department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  }));

  // 基础列配置
  const columns: ColumnType<DataType>[] = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      align: 'center',
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: 200,
    },
    {
      key: 'email',
      title: '邮箱',
      dataIndex: 'email',
      width: 220,
    },
    {
      key: 'phone',
      title: '电话',
      dataIndex: 'phone',
      width: 140,
    },
    {
      key: 'department',
      title: '部门',
      dataIndex: 'department',
      width: 120,
    },
  ];

  // 不指定宽度的列配置（自动分配）
  const columnsAutoWidth: ColumnType<DataType>[] = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
    },
    {
      key: 'department',
      title: '部门',
      dataIndex: 'department',
    },
  ];

  // 自定义渲染列配置
  const columnsWithRender: ColumnType<DataType>[] = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      render: (value: unknown) => <strong>{value as string}</strong>,
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      align: 'center',
      render: (value: unknown) => {
        const age = value as number;
        return <span style={{ color: age > 30 ? '#d13438' : '#107c10' }}>{age}</span>;
      },
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: 200,
    },
    {
      key: 'action',
      title: '操作',
      width: 200,
      align: 'center',
      render: (_: any, record: DataType) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => alert(`编辑: ${record.name}`)}>编辑</button>
          <button onClick={() => alert(`删除: ${record.name}`)}>删除</button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Table 表格</div>
        <div className={styles.description}>基于 rc-table 实现逻辑的基础表格组件，支持数据渲染和 scroll 配置。</div>
      </div>

      {/* 基础用法 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的表格展示，传入 dataSource 和 columns 即可。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础表格</div>
          <div className={styles.demo}>
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </div>
      </div>

      {/* 带边框 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>带边框</div>
        <div className={styles.sectionDescription}>通过设置 bordered 属性，可以显示表格边框。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>带边框表格</div>
          <div className={styles.demo}>
            <Table dataSource={dataSource} columns={columns} bordered />
          </div>
        </div>
      </div>

      {/* 自动列宽 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>自动列宽</div>
        <div className={styles.sectionDescription}>
          不指定 column.width 时，列宽会根据内容自动分配。表格会使用 table-layout: fixed，所以列宽会平均分配。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>列宽自动分配</div>
          <div className={styles.demo}>
            <Table dataSource={dataSource} columns={columnsAutoWidth} bordered />
          </div>
        </div>
      </div>

      {/* 自定义渲染 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>自定义渲染</div>
        <div className={styles.sectionDescription}>通过 column.render 可以自定义单元格内容。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义单元格渲染</div>
          <div className={styles.demo}>
            <Table dataSource={dataSource.slice(0, 3)} columns={columnsWithRender} bordered />
          </div>
        </div>
      </div>

      {/* 横向滚动 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>横向滚动</div>
        <div className={styles.sectionDescription}>设置 scroll.x 可以实现横向滚动，适用于列数较多的场景。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>固定容器宽度，表格横向滚动</div>
          <div className={styles.demo}>
            <div className={styles.tableWrapper}>
              <Table dataSource={dataSource} columns={columns} scroll={{ x: 1000 }} bordered />
            </div>
          </div>
        </div>
      </div>

      {/* 纵向滚动 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>纵向滚动</div>
        <div className={styles.sectionDescription}>设置 scroll.y 可以实现纵向滚动，表头固定。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>固定表头，表体纵向滚动（50 条数据）</div>
          <div className={styles.demo}>
            <Table dataSource={largeDataSource} columns={columns} scroll={{ y: 300 }} bordered />
          </div>
        </div>
      </div>

      {/* 双向滚动 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>双向滚动</div>
        <div className={styles.sectionDescription}>同时设置 scroll.x 和 scroll.y 可以实现双向滚动。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>固定容器和表头，表格可横向和纵向滚动</div>
          <div className={styles.demo}>
            <div className={styles.tableWrapper}>
              <Table dataSource={largeDataSource} columns={columns} scroll={{ x: 1000, y: 300 }} bordered />
            </div>
          </div>
        </div>
      </div>

      {/* 不同对齐方式 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>列对齐</div>
        <div className={styles.sectionDescription}>通过 column.align 可以设置列内容的对齐方式。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>左对齐、居中、右对齐</div>
          <div className={styles.demo}>
            <Table
              dataSource={dataSource.slice(0, 3)}
              columns={[
                { key: 'name', title: '姓名（左对齐）', dataIndex: 'name', width: 150, align: 'left' },
                { key: 'age', title: '年龄（居中）', dataIndex: 'age', width: 120, align: 'center' },
                { key: 'address', title: '地址（右对齐）', dataIndex: 'address', width: 200, align: 'right' },
              ]}
              bordered
            />
          </div>
        </div>
      </div>

      {/* 空状态 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>空状态</div>
        <div className={styles.sectionDescription}>当 dataSource 为空数组时，显示空状态提示。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>默认空状态</div>
          <div className={styles.demo}>
            <Table dataSource={[]} columns={columns} bordered />
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义空状态文本</div>
          <div className={styles.demo}>
            <Table dataSource={[]} columns={columns} bordered emptyText='没有找到任何数据' />
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义空状态内容</div>
          <div className={styles.demo}>
            <Table
              dataSource={[]}
              columns={columns}
              bordered
              emptyText={
                <div style={{ padding: '20px 0', color: '#999' }}>
                  <div style={{ fontSize: '48px' }}>📭</div>
                  <div style={{ marginTop: '8px' }}>暂时没有数据哦</div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* 固定列 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>固定列</div>
        <div className={styles.sectionDescription}>
          通过 column.fixed 可以固定列到左侧或右侧，需要配合 scroll.x 使用。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>左侧固定列</div>
          <div className={styles.demo}>
            <div className={styles.tableWrapper}>
              <Table
                dataSource={dataSource}
                columns={[
                  { key: 'name', title: '姓名', dataIndex: 'name', width: 120, fixed: 'left' },
                  { key: 'age', title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
                  { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
                  { key: 'email', title: '邮箱', dataIndex: 'email', width: 220 },
                  { key: 'phone', title: '电话', dataIndex: 'phone', width: 140 },
                  { key: 'department', title: '部门', dataIndex: 'department', width: 120 },
                ]}
                scroll={{ x: 1000 }}
                bordered
              />
            </div>
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>右侧固定列</div>
          <div className={styles.demo}>
            <div className={styles.tableWrapper}>
              <Table
                dataSource={dataSource}
                columns={[
                  { key: 'name', title: '姓名', dataIndex: 'name', width: 120 },
                  { key: 'age', title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
                  { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
                  { key: 'email', title: '邮箱', dataIndex: 'email', width: 220 },
                  { key: 'phone', title: '电话', dataIndex: 'phone', width: 140 },
                  { key: 'department', title: '部门', dataIndex: 'department', width: 120, fixed: 'right' },
                ]}
                scroll={{ x: 1000 }}
                bordered
              />
            </div>
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>左右两侧固定列</div>
          <div className={styles.demo}>
            <div className={styles.tableWrapper}>
              <Table
                dataSource={dataSource}
                columns={[
                  { key: 'name', title: '姓名', dataIndex: 'name', width: 120, fixed: 'left' },
                  { key: 'age', title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
                  { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
                  { key: 'email', title: '邮箱', dataIndex: 'email', width: 220 },
                  { key: 'phone', title: '电话', dataIndex: 'phone', width: 140 },
                  { key: 'department', title: '部门', dataIndex: 'department', width: 120, fixed: 'right' },
                ]}
                scroll={{ x: 1000 }}
                bordered
              />
            </div>
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>多列固定</div>
          <div className={styles.demo}>
            <div className={styles.tableWrapper}>
              <Table
                dataSource={dataSource}
                columns={[
                  { key: 'name', title: '姓名', dataIndex: 'name', width: 120, fixed: 'left' },
                  { key: 'age', title: '年龄', dataIndex: 'age', width: 80, align: 'center', fixed: 'left' },
                  { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
                  { key: 'email', title: '邮箱', dataIndex: 'email', width: 220 },
                  { key: 'phone', title: '电话', dataIndex: 'phone', width: 140, fixed: 'right' },
                  { key: 'department', title: '部门', dataIndex: 'department', width: 120, fixed: 'right' },
                ]}
                scroll={{ x: 1000 }}
                bordered
              />
            </div>
          </div>
        </div>
      </div>

      {/* 空状态 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>空状态</div>
        <div className={styles.sectionDescription}>当 dataSource 为空数组时，显示空状态提示。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>默认空状态</div>
          <div className={styles.demo}>
            <Table dataSource={[]} columns={columns} bordered />
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义空状态文本</div>
          <div className={styles.demo}>
            <Table dataSource={[]} columns={columns} bordered emptyText='没有找到任何数据' />
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义空状态内容</div>
          <div className={styles.demo}>
            <Table
              dataSource={[]}
              columns={columns}
              bordered
              emptyText={
                <div style={{ padding: '20px 0', color: '#999' }}>
                  <div style={{ fontSize: '48px' }}>📭</div>
                  <div style={{ marginTop: '8px' }}>暂时没有数据哦</div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* API 文档 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Table 组件支持的所有参数配置。</div>
        <div className={styles.demoContainer}>
          <table style={apiTableStyles.tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={apiTableStyles.thStyle}>参数</th>
                <th style={apiTableStyles.thStyle}>说明</th>
                <th style={apiTableStyles.thStyle}>类型</th>
                <th style={apiTableStyles.thStyle}>默认值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={apiTableStyles.tdStyle}>dataSource</td>
                <td style={apiTableStyles.tdStyle}>数据源</td>
                <td style={apiTableStyles.tdStyle}>RecordType[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>columns</td>
                <td style={apiTableStyles.tdStyle}>列配置</td>
                <td style={apiTableStyles.tdStyle}>ColumnType[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>rowKey</td>
                <td style={apiTableStyles.tdStyle}>数据行的 key，用于优化渲染</td>
                <td style={apiTableStyles.tdStyle}>string | (record) =&gt; string</td>
                <td style={apiTableStyles.tdStyle}>'key'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>scroll</td>
                <td style={apiTableStyles.tdStyle}>滚动配置</td>
                <td style={apiTableStyles.tdStyle}>{'{ x?: number | string | true, y?: number | string }'}</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>bordered</td>
                <td style={apiTableStyles.tdStyle}>是否显示边框</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>showHeader</td>
                <td style={apiTableStyles.tdStyle}>是否显示表头</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>true</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>emptyText</td>
                <td style={apiTableStyles.tdStyle}>空状态时显示的内容</td>
                <td style={apiTableStyles.tdStyle}>React.ReactNode</td>
                <td style={apiTableStyles.tdStyle}>'暂无数据'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>自定义类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>style</td>
                <td style={apiTableStyles.tdStyle}>自定义样式</td>
                <td style={apiTableStyles.tdStyle}>React.CSSProperties</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Column API */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Column 配置</div>
        <div className={styles.sectionDescription}>列配置项说明。</div>
        <div className={styles.demoContainer}>
          <table style={apiTableStyles.tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={apiTableStyles.thStyle}>参数</th>
                <th style={apiTableStyles.thStyle}>说明</th>
                <th style={apiTableStyles.thStyle}>类型</th>
                <th style={apiTableStyles.thStyle}>默认值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={apiTableStyles.tdStyle}>key</td>
                <td style={apiTableStyles.tdStyle}>列的唯一标识（必填）</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>title</td>
                <td style={apiTableStyles.tdStyle}>列头显示的文字</td>
                <td style={apiTableStyles.tdStyle}>React.ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>dataIndex</td>
                <td style={apiTableStyles.tdStyle}>数据在数据项中对应的路径</td>
                <td style={apiTableStyles.tdStyle}>string | string[]</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>width</td>
                <td style={apiTableStyles.tdStyle}>列宽度</td>
                <td style={apiTableStyles.tdStyle}>number | string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>render</td>
                <td style={apiTableStyles.tdStyle}>自定义渲染函数</td>
                <td style={apiTableStyles.tdStyle}>(value, record, index) =&gt; ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>align</td>
                <td style={apiTableStyles.tdStyle}>列的对齐方式</td>
                <td style={apiTableStyles.tdStyle}>'left' | 'center' | 'right'</td>
                <td style={apiTableStyles.tdStyle}>'left'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>fixed</td>
                <td style={apiTableStyles.tdStyle}>固定列到左侧或右侧</td>
                <td style={apiTableStyles.tdStyle}>'left' | 'right'</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>列的类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
