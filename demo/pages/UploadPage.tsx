import React, { useState } from 'react';
import { Upload, message } from '../../src';
import { Button } from '@fluentui/react-components';
import { ArrowUpload20Regular, DocumentArrowUp20Regular } from '@fluentui/react-icons';
import { useCommonDemoStyles } from '../hooks';
import { useApiTableStyles } from '../hooks/useApiTableStyles';

const UploadPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const apiTableStyles = useApiTableStyles();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // 合并通用样式
  const styles = {
    ...commonStyles,
  };

  // 模拟上传函数
  const handleUpload = (files: File[]) => {
    console.log('上传文件:', files);
    setUploadedFiles(prev => [...prev, ...files]);
    message.success(`成功选择 ${files.length} 个文件`);
  };

  // 文件验证
  const beforeUpload = (file: File, fileList: File[]) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error(`${file.name} 文件大小不能超过 5MB`);
      return false;
    }
    return true;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upload 上传</h1>
        <p className={styles.description}>文件上传组件，支持点击上传和拖拽上传，用于将文件上传到远程服务器。</p>
      </div>

      {/* 基础用法 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>基础用法</h2>
        <p className={styles.sectionDescription}>点击按钮选择文件</p>
        <div className={styles.demoContainer}>
          <Upload onChange={handleUpload}>
            <Button icon={<ArrowUpload20Regular />}>点击上传</Button>
          </Upload>
        </div>
      </section>

      {/* 多文件上传 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>多文件上传</h2>
        <p className={styles.sectionDescription}>支持一次选择多个文件</p>
        <div className={styles.demoContainer}>
          <Upload multiple onChange={handleUpload}>
            <Button icon={<ArrowUpload20Regular />}>选择多个文件</Button>
          </Upload>
        </div>
      </section>

      {/* 文件类型限制 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>文件类型限制</h2>
        <p className={styles.sectionDescription}>只能上传图片文件</p>
        <div className={styles.demoContainer}>
          <Upload accept='image/*' onChange={handleUpload}>
            <Button icon={<ArrowUpload20Regular />}>只能上传图片</Button>
          </Upload>
        </div>
      </section>

      {/* 文件验证 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>文件验证</h2>
        <p className={styles.sectionDescription}>使用 beforeUpload 验证文件大小（限制 5MB）</p>
        <div className={styles.demoContainer}>
          <Upload beforeUpload={beforeUpload} onChange={handleUpload}>
            <Button icon={<ArrowUpload20Regular />}>上传文件（限制 5MB）</Button>
          </Upload>
        </div>
      </section>

      {/* 拖拽上传 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>拖拽上传</h2>
        <p className={styles.sectionDescription}>支持拖拽文件到区域内上传</p>
        <div className={styles.demoContainer}>
          <Upload.Dragger
            multiple
            accept='image/*'
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => {
              console.log('文件拖入:', e);
            }}
          >
            <div style={{ padding: '20px' }}>
              <DocumentArrowUp20Regular style={{ fontSize: '48px', color: '#0078d4' }} />
              <p style={{ margin: '16px 0 0', fontSize: '16px', fontWeight: 600 }}>点击或拖拽文件到此区域上传</p>
              <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#666' }}>
                支持 JPG、PNG、GIF 等图片格式，单个文件不超过 5MB
              </p>
            </div>
          </Upload.Dragger>
        </div>
      </section>

      {/* 自定义拖拽区域高度 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>自定义高度</h2>
        <p className={styles.sectionDescription}>设置拖拽区域的高度</p>
        <div className={styles.demoContainer}>
          <Upload.Dragger height={200} onChange={handleUpload}>
            <div>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>拖拽文件到此处</p>
              <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#666' }}>自定义高度的上传区域</p>
            </div>
          </Upload.Dragger>
        </div>
      </section>

      {/* 禁用状态 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>禁用状态</h2>
        <p className={styles.sectionDescription}>禁用上传功能</p>
        <div className={styles.demoContainer} style={{ display: 'flex', gap: '16px' }}>
          <Upload disabled>
            <Button disabled icon={<ArrowUpload20Regular />}>
              禁用上传
            </Button>
          </Upload>
          <Upload.Dragger disabled>
            <div>
              <p style={{ margin: 0 }}>禁用的拖拽区域</p>
            </div>
          </Upload.Dragger>
        </div>
      </section>

      {/* 已上传文件列表 */}
      {uploadedFiles.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>已选择的文件</h2>
          <div className={styles.demoContainer}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  style={{
                    padding: '8px 12px',
                    margin: '4px 0',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                  <Button
                    size='small'
                    onClick={() => {
                      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    移除
                  </Button>
                </li>
              ))}
            </ul>
            <Button appearance='secondary' onClick={() => setUploadedFiles([])} style={{ marginTop: '12px' }}>
              清空列表
            </Button>
          </div>
        </section>
      )}

      {/* API 文档 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>API</h2>

        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '24px' }}>Upload Props</h3>
        <table style={apiTableStyles.tableStyle}>
          <thead>
            <tr>
              <th style={apiTableStyles.thStyle}>属性</th>
              <th style={apiTableStyles.thStyle}>说明</th>
              <th style={apiTableStyles.thStyle}>类型</th>
              <th style={apiTableStyles.thStyle}>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>accept</code>
              </td>
              <td style={apiTableStyles.tdStyle}>接受上传的文件类型，如 'image/*', '.jpg,.png'</td>
              <td style={apiTableStyles.tdStyle}>string</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>multiple</code>
              </td>
              <td style={apiTableStyles.tdStyle}>是否支持多选文件</td>
              <td style={apiTableStyles.tdStyle}>boolean</td>
              <td style={apiTableStyles.tdStyle}>false</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>disabled</code>
              </td>
              <td style={apiTableStyles.tdStyle}>是否禁用</td>
              <td style={apiTableStyles.tdStyle}>boolean</td>
              <td style={apiTableStyles.tdStyle}>false</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>beforeUpload</code>
              </td>
              <td style={apiTableStyles.tdStyle}>上传前的验证钩子，返回 false 则停止上传</td>
              <td style={apiTableStyles.tdStyle}>
                (file: File, fileList: File[]) =&gt; boolean | Promise&lt;boolean&gt;
              </td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>onChange</code>
              </td>
              <td style={apiTableStyles.tdStyle}>文件选择后的回调，用于处理上传逻辑</td>
              <td style={apiTableStyles.tdStyle}>(files: File[]) =&gt; void</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>onDrop</code>
              </td>
              <td style={apiTableStyles.tdStyle}>文件拖入时的回调</td>
              <td style={apiTableStyles.tdStyle}>(e: DragEvent) =&gt; void</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>className</code>
              </td>
              <td style={apiTableStyles.tdStyle}>自定义类名</td>
              <td style={apiTableStyles.tdStyle}>string</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>style</code>
              </td>
              <td style={apiTableStyles.tdStyle}>自定义样式</td>
              <td style={apiTableStyles.tdStyle}>CSSProperties</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>children</code>
              </td>
              <td style={apiTableStyles.tdStyle}>上传按钮或拖拽区域内容</td>
              <td style={apiTableStyles.tdStyle}>ReactNode</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '24px' }}>
          Upload.Dragger Props
        </h3>
        <p style={{ margin: '8px 0', color: '#666' }}>继承所有 Upload Props，并额外支持：</p>
        <table style={apiTableStyles.tableStyle}>
          <thead>
            <tr>
              <th style={apiTableStyles.thStyle}>属性</th>
              <th style={apiTableStyles.thStyle}>说明</th>
              <th style={apiTableStyles.thStyle}>类型</th>
              <th style={apiTableStyles.thStyle}>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={apiTableStyles.tdStyle}>
                <code>height</code>
              </td>
              <td style={apiTableStyles.tdStyle}>拖拽区域的高度</td>
              <td style={apiTableStyles.tdStyle}>number | string</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UploadPage;
