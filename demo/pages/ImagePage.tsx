import React, { useState } from 'react';
import { Image, Modal } from '../../src';
import { Button } from '@fluentui/react-components';
import { useCommonDemoStyles } from '../hooks';
import { useApiTableStyles } from '../hooks/useApiTableStyles';

const ImagePage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const apiTableStyles = useApiTableStyles();
  const styles = { ...commonStyles };

  const [modalOpen, setModalOpen] = useState(false);

  // 示例图片（缩略图）
  const sampleImages = [
    'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1765873360326-54d50adefc15?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=300&auto=format&fit=crop',
  ];

  // 高清大图（用于自定义预览图）
  const hdImages = [
    'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1765873360326-54d50adefc15?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Image 图片</h1>
        <p className={styles.description}>用于展示图片，支持懒加载、加载失败容错、点击预览放大、相册模式等功能。</p>
      </div>

      {/* 基础用法 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>基础用法</h2>
        <p className={styles.sectionDescription}>最基本的图片展示，点击可预览大图。</p>
        <div className={styles.demoContainer}>
          <Image
            src='https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop'
            alt='示例图片'
            width={300}
            height={200}
          />
        </div>
      </section>

      {/* 加载失败容错 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>加载失败容错</h2>
        <p className={styles.sectionDescription}>
          当图片加载失败时，会显示错误占位内容。可通过 fallback 属性自定义错误内容。
        </p>
        <div className={styles.demoContainer} style={{ display: 'flex', gap: 16 }}>
          <div>
            <p style={{ marginBottom: 8, color: '#666' }}>默认错误样式</p>
            <Image src='https://invalid-url.com/not-found.jpg' alt='加载失败' width={200} height={150} />
          </div>
          <div>
            <p style={{ marginBottom: 8, color: '#666' }}>自定义错误内容</p>
            <Image
              src='https://invalid-url.com/not-found.jpg'
              alt='加载失败'
              width={200}
              height={150}
              fallback={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: '#f5f5f5',
                    color: '#999',
                  }}
                >
                  图片不存在
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* 自定义占位内容 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>自定义占位内容</h2>
        <p className={styles.sectionDescription}>加载过程中显示的占位内容，可通过 placeholder 属性自定义。</p>
        <div className={styles.demoContainer}>
          <Image
            src='https://images.unsplash.com/photo-1765873360326-54d50adefc15?q=80&w=300&auto=format&fit=crop'
            alt='带占位图片'
            width={300}
            height={200}
            placeholder={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                }}
              >
                加载中...
              </div>
            }
          />
        </div>
      </section>

      {/* 懒加载 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>懒加载</h2>
        <p className={styles.sectionDescription}>
          设置 lazy 属性开启懒加载，图片进入可视区域后才会加载。向下滚动查看效果。
        </p>
        <div className={styles.demoContainer} style={{ height: 300, overflow: 'auto', padding: 16 }}>
          <div style={{ height: 400, display: 'flex', alignItems: 'flex-end' }}>
            <p style={{ color: '#999' }}>↓ 向下滚动加载图片</p>
          </div>
          <Image
            src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300&auto=format&fit=crop'
            alt='懒加载图片1'
            width={300}
            height={200}
            lazy
          />
          <div style={{ height: 100 }} />
          <Image
            src='https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=300&auto=format&fit=crop'
            alt='懒加载图片2'
            width={300}
            height={200}
            lazy
          />
        </div>
      </section>

      {/* 禁用预览 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>禁用预览</h2>
        <p className={styles.sectionDescription}>设置 preview={'{false}'} 可禁用点击预览功能。</p>
        <div className={styles.demoContainer}>
          <Image
            src='https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop'
            alt='禁用预览'
            width={300}
            height={200}
            preview={false}
          />
        </div>
      </section>

      {/* 相册模式 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>相册模式</h2>
        <p className={styles.sectionDescription}>
          使用 Image.PreviewGroup 包裹多张图片，点击任意图片可预览并支持左右切换。
        </p>
        <div className={styles.demoContainer}>
          <Image.PreviewGroup>
            {sampleImages.map((src, index) => (
              <Image key={index} src={src} alt={`相册图片 ${index + 1}`} width={150} height={100} />
            ))}
          </Image.PreviewGroup>
        </div>
      </section>

      {/* 自定义预览图 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>自定义预览图</h2>
        <p className={styles.sectionDescription}>
          通过 previewSrc 属性指定预览时使用的大图地址，适用于缩略图和原图分离的场景。
        </p>
        <div className={styles.demoContainer}>
          <Image.PreviewGroup>
            {sampleImages.map((src, index) => (
              <Image
                key={index}
                src={src}
                previewSrc={hdImages[index]}
                alt={`自定义预览图 ${index + 1}`}
                width={150}
                height={100}
              />
            ))}
          </Image.PreviewGroup>
        </div>
      </section>

      {/* 预览数组 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>预览数组</h2>
        <p className={styles.sectionDescription}>
          通过 images 属性设置预览图片数组，可以实现展示一张图片但点击后预览多张的效果。支持字符串数组或对象数组。
        </p>
        <div className={styles.demoContainer} style={{ display: 'flex', gap: 24 }}>
          <div>
            <p style={{ marginBottom: 8, color: '#666' }}>点击单张图片预览4张</p>
            <Image.PreviewGroup images={hdImages}>
              <Image src={sampleImages[0]} alt='点击预览多张' width={200} height={150} />
            </Image.PreviewGroup>
          </div>
          <div>
            <p style={{ marginBottom: 8, color: '#666' }}>展示2张但预览4张</p>
            <Image.PreviewGroup images={hdImages}>
              <Image src={sampleImages[0]} alt='图片1' width={120} height={90} />
              <Image src={sampleImages[1]} alt='图片2' width={120} height={90} />
            </Image.PreviewGroup>
          </div>
        </div>
      </section>

      {/* 在 Modal 中使用 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>在 Modal 中使用</h2>
        <p className={styles.sectionDescription}>
          Image 组件可以在 Modal 中正常使用，点击图片预览时会正确显示在 Modal 之上。
        </p>
        <div className={styles.demoContainer}>
          <Button onClick={() => setModalOpen(true)}>打开 Modal</Button>
          <Modal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            onOk={() => setModalOpen(false)}
            title='Modal 中的图片'
          >
            <p style={{ marginBottom: 16 }}>点击下方图片可以预览大图：</p>
            <Image.PreviewGroup>
              {sampleImages.slice(0, 2).map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  previewSrc={hdImages[index]}
                  alt={`Modal 内图片 ${index + 1}`}
                  width={120}
                  height={80}
                  style={{ marginRight: 8 }}
                />
              ))}
            </Image.PreviewGroup>
          </Modal>
        </div>
      </section>

      {/* API 文档 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>API</h2>

        <h3 style={{ marginTop: 24, marginBottom: 12 }}>Image</h3>
        <table style={apiTableStyles.tableStyle}>
          <thead>
            <tr>
              <th style={apiTableStyles.thStyle}>参数</th>
              <th style={apiTableStyles.thStyle}>说明</th>
              <th style={apiTableStyles.thStyle}>类型</th>
              <th style={apiTableStyles.thStyle}>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={apiTableStyles.tdStyle}>src</td>
              <td style={apiTableStyles.tdStyle}>图片地址</td>
              <td style={apiTableStyles.tdStyle}>string</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>alt</td>
              <td style={apiTableStyles.tdStyle}>图片描述</td>
              <td style={apiTableStyles.tdStyle}>string</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>width</td>
              <td style={apiTableStyles.tdStyle}>图片宽度</td>
              <td style={apiTableStyles.tdStyle}>number | string</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>height</td>
              <td style={apiTableStyles.tdStyle}>图片高度</td>
              <td style={apiTableStyles.tdStyle}>number | string</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>lazy</td>
              <td style={apiTableStyles.tdStyle}>是否启用懒加载</td>
              <td style={apiTableStyles.tdStyle}>boolean</td>
              <td style={apiTableStyles.tdStyle}>false</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>placeholder</td>
              <td style={apiTableStyles.tdStyle}>加载占位内容</td>
              <td style={apiTableStyles.tdStyle}>ReactNode</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>fallback</td>
              <td style={apiTableStyles.tdStyle}>加载失败时的容错内容</td>
              <td style={apiTableStyles.tdStyle}>ReactNode</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>preview</td>
              <td style={apiTableStyles.tdStyle}>是否开启预览</td>
              <td style={apiTableStyles.tdStyle}>boolean</td>
              <td style={apiTableStyles.tdStyle}>true</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>previewSrc</td>
              <td style={apiTableStyles.tdStyle}>自定义预览图地址</td>
              <td style={apiTableStyles.tdStyle}>string</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>onLoad</td>
              <td style={apiTableStyles.tdStyle}>图片加载完成回调</td>
              <td style={apiTableStyles.tdStyle}>(e: SyntheticEvent) =&gt; void</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>onError</td>
              <td style={apiTableStyles.tdStyle}>图片加载失败回调</td>
              <td style={apiTableStyles.tdStyle}>(e: SyntheticEvent) =&gt; void</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ marginTop: 24, marginBottom: 12 }}>Image.PreviewGroup</h3>
        <table style={apiTableStyles.tableStyle}>
          <thead>
            <tr>
              <th style={apiTableStyles.thStyle}>参数</th>
              <th style={apiTableStyles.thStyle}>说明</th>
              <th style={apiTableStyles.thStyle}>类型</th>
              <th style={apiTableStyles.thStyle}>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={apiTableStyles.tdStyle}>children</td>
              <td style={apiTableStyles.tdStyle}>子元素（Image 组件）</td>
              <td style={apiTableStyles.tdStyle}>ReactNode</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>images</td>
              <td style={apiTableStyles.tdStyle}>预览图片数组（优先级高于子组件收集的图片）</td>
              <td style={apiTableStyles.tdStyle}>(string | PreviewImageInfo)[]</td>
              <td style={apiTableStyles.tdStyle}>-</td>
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
              <td style={apiTableStyles.tdStyle}>CSSProperties</td>
              <td style={apiTableStyles.tdStyle}>-</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ marginTop: 24, marginBottom: 12 }}>预览快捷键</h3>
        <table style={apiTableStyles.tableStyle}>
          <thead>
            <tr>
              <th style={apiTableStyles.thStyle}>快捷键</th>
              <th style={apiTableStyles.thStyle}>功能</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={apiTableStyles.tdStyle}>Esc</td>
              <td style={apiTableStyles.tdStyle}>关闭预览</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>← / →</td>
              <td style={apiTableStyles.tdStyle}>上一张 / 下一张（相册模式）</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>+ / =</td>
              <td style={apiTableStyles.tdStyle}>放大</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>-</td>
              <td style={apiTableStyles.tdStyle}>缩小</td>
            </tr>
            <tr>
              <td style={apiTableStyles.tdStyle}>滚轮</td>
              <td style={apiTableStyles.tdStyle}>放大 / 缩小</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ImagePage;
