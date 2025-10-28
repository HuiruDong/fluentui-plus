import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Pagination } from '../../src';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

// PaginationPage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
  },
});

const PaginationPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  // 基础用法状态
  const [basicCurrent, setBasicCurrent] = useState(1);

  // 受控模式状态
  const [controlledCurrent, setControlledCurrent] = useState(1);

  // 快速跳转状态
  const [quickJumpCurrent, setQuickJumpCurrent] = useState(1);

  // 页面大小改变状态
  const [sizeChangerCurrent, setSizeChangerCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 显示总数状态
  const [showTotalCurrent, setShowTotalCurrent] = useState(1);

  // 简洁模式状态
  const [simpleCurrent, setSimpleCurrent] = useState(1);

  // 禁用状态
  const [disabledCurrent, setDisabledCurrent] = useState(5);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Pagination 分页</div>
        <div className={styles.description}>采用分页的形式分隔长列表，每次只加载一个页面。</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>基础的分页组件，通过 total 和 pageSize 计算总页数。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础分页</div>
          <div className={styles.demo}>
            <Pagination
              current={basicCurrent}
              total={100}
              pageSize={10}
              onChange={(page: number, pageSize: number) => {
                console.log('页码改变:', page, '页面大小:', pageSize);
                setBasicCurrent(page);
              }}
            />
            <div className={styles.valueDisplay}>当前页码: {basicCurrent}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>受控模式</div>
        <div className={styles.sectionDescription}>通过 current 和 onChange 实现受控模式，完全控制分页状态。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>受控分页</div>
          <div className={styles.demo}>
            <Pagination
              current={controlledCurrent}
              total={200}
              pageSize={10}
              onChange={(page: number, pageSize: number) => {
                console.log('受控模式 - 页码改变:', page);
                setControlledCurrent(page);
              }}
            />
            <div className={styles.valueDisplay}>当前页码: {controlledCurrent}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={() => setControlledCurrent(1)}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                }}
              >
                跳转到第一页
              </button>
              <button
                onClick={() => setControlledCurrent(10)}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                }}
              >
                跳转到第10页
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>更多页码</div>
        <div className={styles.sectionDescription}>当页数较多时，会自动折叠中间的页码。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>大数据量分页</div>
          <div className={styles.demo}>
            <Pagination defaultCurrent={1} total={500} pageSize={10} />
            <div style={{ marginTop: '16px' }}>
              <Pagination defaultCurrent={25} total={500} pageSize={10} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>快速跳转</div>
        <div className={styles.sectionDescription}>通过 showQuickJumper 属性可以快速跳转到指定页码。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>快速跳转分页</div>
          <div className={styles.demo}>
            <Pagination
              current={quickJumpCurrent}
              total={500}
              pageSize={10}
              showQuickJumper
              onChange={(page: number, pageSize: number) => {
                console.log('快速跳转到:', page);
                setQuickJumpCurrent(page);
              }}
            />
            <div className={styles.valueDisplay}>当前页码: {quickJumpCurrent}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>改变每页显示条数</div>
        <div className={styles.sectionDescription}>通过 showSizeChanger 属性可以改变每页显示的条数。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>可调整页面大小</div>
          <div className={styles.demo}>
            <Pagination
              current={sizeChangerCurrent}
              total={500}
              pageSize={pageSize}
              showSizeChanger
              pageSizeOptions={[10, 20, 50, 100]}
              onChange={(page: number, newPageSize: number) => {
                console.log('页码:', page, '页面大小:', newPageSize);
                setSizeChangerCurrent(page);
                setPageSize(newPageSize);
              }}
            />
            <div className={styles.valueDisplay}>
              当前页码: {sizeChangerCurrent}, 每页条数: {pageSize}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>显示总数</div>
        <div className={styles.sectionDescription}>通过 showTotal 属性可以显示数据总数和当前数据范围。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>显示总数（默认格式）</div>
          <div className={styles.demo}>
            <Pagination
              current={showTotalCurrent}
              total={500}
              pageSize={10}
              showTotal
              onChange={(page: number, pageSize: number) => {
                setShowTotalCurrent(page);
              }}
            />
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义总数显示</div>
          <div className={styles.demo}>
            <Pagination
              defaultCurrent={1}
              total={500}
              pageSize={10}
              showTotal={(total: number, range: [number, number]) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>简洁模式</div>
        <div className={styles.sectionDescription}>通过 simple 属性可以启用简洁模式。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>简洁分页</div>
          <div className={styles.demo}>
            <Pagination
              current={simpleCurrent}
              total={500}
              pageSize={10}
              simple
              onChange={(page: number, pageSize: number) => {
                console.log('简洁模式 - 页码改变:', page);
                setSimpleCurrent(page);
              }}
            />
            <div className={styles.valueDisplay}>当前页码: {simpleCurrent}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>禁用状态</div>
        <div className={styles.sectionDescription}>通过 disabled 属性可以禁用分页组件。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>禁用分页</div>
          <div className={styles.demo}>
            <Pagination
              current={disabledCurrent}
              total={100}
              pageSize={10}
              disabled
              onChange={(page: number, pageSize: number) => {
                setDisabledCurrent(page);
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>单页时隐藏</div>
        <div className={styles.sectionDescription}>通过 hideOnSinglePage 属性可以在只有一页时隐藏分页组件。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>单页隐藏（总数：5，每页：10）</div>
          <div className={styles.demo}>
            <Pagination defaultCurrent={1} total={5} pageSize={10} hideOnSinglePage />
            <div style={{ color: '#6b7280', fontSize: '14px' }}>当只有一页时，分页组件会自动隐藏</div>
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>多页显示（总数：50，每页：10）</div>
          <div className={styles.demo}>
            <Pagination defaultCurrent={1} total={50} pageSize={10} hideOnSinglePage />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>完整功能</div>
        <div className={styles.sectionDescription}>展示所有功能的完整示例。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>完整功能分页</div>
          <div className={styles.demo}>
            <Pagination
              defaultCurrent={1}
              total={500}
              pageSize={20}
              showTotal={(total: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条 / 总共 ${total} 条`}
              showQuickJumper
              showSizeChanger
              pageSizeOptions={[10, 20, 50, 100]}
              onChange={(page: number, pageSize: number) => {
                console.log('完整功能 - 页码:', page, '页面大小:', pageSize);
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Pagination 组件支持的所有参数配置。</div>
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
                <td style={apiTableStyles.tdStyle}>current</td>
                <td style={apiTableStyles.tdStyle}>当前页数（受控）</td>
                <td style={apiTableStyles.tdStyle}>number</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>defaultCurrent</td>
                <td style={apiTableStyles.tdStyle}>默认的当前页数</td>
                <td style={apiTableStyles.tdStyle}>number</td>
                <td style={apiTableStyles.tdStyle}>1</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>total</td>
                <td style={apiTableStyles.tdStyle}>数据总数</td>
                <td style={apiTableStyles.tdStyle}>number</td>
                <td style={apiTableStyles.tdStyle}>0</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>pageSize</td>
                <td style={apiTableStyles.tdStyle}>每页条数</td>
                <td style={apiTableStyles.tdStyle}>number</td>
                <td style={apiTableStyles.tdStyle}>10</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onChange</td>
                <td style={apiTableStyles.tdStyle}>页码或 pageSize 改变的回调</td>
                <td style={apiTableStyles.tdStyle}>(page: number, pageSize: number) =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>disabled</td>
                <td style={apiTableStyles.tdStyle}>禁用分页</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>showQuickJumper</td>
                <td style={apiTableStyles.tdStyle}>是否可以快速跳转至某页</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>showTotal</td>
                <td style={apiTableStyles.tdStyle}>用于显示数据总量和当前数据顺序</td>
                <td style={apiTableStyles.tdStyle}>
                  boolean | ((total: number, range: [number, number]) =&gt; ReactNode)
                </td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>showSizeChanger</td>
                <td style={apiTableStyles.tdStyle}>是否展示 pageSize 切换器</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>pageSizeOptions</td>
                <td style={apiTableStyles.tdStyle}>指定每页可以显示多少条</td>
                <td style={apiTableStyles.tdStyle}>number[]</td>
                <td style={apiTableStyles.tdStyle}>[10, 20, 50, 100]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>simple</td>
                <td style={apiTableStyles.tdStyle}>当添加该属性时，显示为简单分页</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>hideOnSinglePage</td>
                <td style={apiTableStyles.tdStyle}>只有一页时是否隐藏分页器</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>自定义样式类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>itemRender</td>
                <td style={apiTableStyles.tdStyle}>用于自定义页码的结构</td>
                <td style={apiTableStyles.tdStyle}>
                  (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', element: ReactNode) =&gt;
                  ReactNode
                </td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaginationPage;
