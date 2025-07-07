import React, { useState } from 'react'
import { InputTag } from '../src/components/InputTag'

const InputTagDemo = () => {
  const [basicTags, setBasicTags] = useState<string[]>(['React', 'TypeScript'])
  const [controlledTags, setControlledTags] = useState<string[]>(['Tag1', 'Tag2'])
  const [maxTagsValue, setMaxTagsValue] = useState<string[]>(['Max1'])
  const [delimiterTags, setDelimiterTags] = useState<string[]>([])
  const [customRenderTags, setCustomRenderTags] = useState<string[]>(['Custom1', 'Custom2'])

  const handleBasicChange = (tags: string[]) => {
    setBasicTags(tags)
    console.log('Basic tags changed:', tags)
  }

  const handleControlledChange = (tags: string[]) => {
    setControlledTags(tags)
    console.log('Controlled tags changed:', tags)
  }

  const handleInputChange = (value: string) => {
    console.log('Input value changed:', value)
  }

  const handleTagRemove = (tag: string, index: number) => {
    console.log('Tag removed:', tag, 'at index:', index)
  }

  const customRenderTag = (tag: string, index: number, onClose: () => void) => (
    <span
      key={index}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        margin: '2px 4px 2px 0',
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
        color: 'white',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '500'
      }}
    >
      🏷️ {tag}
      <button
        onClick={onClose}
        style={{
          marginLeft: '6px',
          background: 'rgba(255,255,255,0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '16px',
          height: '16px',
          cursor: 'pointer',
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        ✕
      </button>
    </span>
  )

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '32px',
        fontWeight: '600',
        color: '#262626'
      }}>
        InputTag 输入标签组件演示
      </h1>

      {/* 基础用法 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1890ff' }}>
          基础用法
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          最基本的输入标签组件，支持添加和删除标签。按 Enter 或 Tab 键添加标签。
        </p>
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          background: '#fff'
        }}>
          <InputTag
            value={basicTags}
            onChange={handleBasicChange}
            placeholder="请输入标签后按 Enter 键"
            onInputChange={handleInputChange}
            onTagRemove={handleTagRemove}
          />
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
            当前标签: {JSON.stringify(basicTags)}
          </div>
        </div>
      </section>

      {/* 受控模式 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1890ff' }}>
          受控模式
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          通过 value 和 onChange 属性完全控制组件状态。
        </p>
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          background: '#fff'
        }}>
          <InputTag
            value={controlledTags}
            onChange={handleControlledChange}
            placeholder="受控模式输入标签"
          />
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setControlledTags([...controlledTags, `新标签${Date.now()}`])}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              添加标签
            </button>
            <button
              onClick={() => setControlledTags([])}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              清空所有
            </button>
          </div>
        </div>
      </section>

      {/* 限制最大标签数量 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1890ff' }}>
          限制最大标签数量
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          使用 maxTags 属性限制最大标签数量，超出时无法继续添加。
        </p>
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          background: '#fff'
        }}>
          <InputTag
            value={maxTagsValue}
            onChange={setMaxTagsValue}
            placeholder="最多只能添加 3 个标签"
            maxTags={3}
          />
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
            标签数量: {maxTagsValue.length} / 3
          </div>
        </div>
      </section>

      {/* 自定义分隔符 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1890ff' }}>
          自定义分隔符
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          使用 delimiter 属性设置自定义分隔符，支持逗号、分号等自动分割。
        </p>
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          background: '#fff'
        }}>
          <InputTag
            value={delimiterTags}
            onChange={setDelimiterTags}
            placeholder="使用逗号、分号或空格分隔多个标签"
            delimiter={/[,;;\s]/}
          />
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
            提示: 可以输入 "tag1,tag2;tag3 tag4" 快速添加多个标签
          </div>
        </div>
      </section>

      {/* 禁用重复标签 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1890ff' }}>
          禁用重复标签
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          设置 allowDuplicates={false} 禁止添加重复的标签。
        </p>
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          background: '#fff'
        }}>
          <InputTag
            defaultValue={['React', 'Vue']}
            placeholder="尝试添加重复标签"
            allowDuplicates={false}
          />
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
            尝试添加已存在的标签，将被忽略
          </div>
        </div>
      </section>

      {/* 自定义标签渲染 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1890ff' }}>
          自定义标签渲染
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          使用 renderTag 属性自定义标签的外观和行为。
        </p>
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          background: '#fff'
        }}>
          <InputTag
            value={customRenderTags}
            onChange={setCustomRenderTags}
            placeholder="自定义样式标签"
            renderTag={customRenderTag}
          />
        </div>
      </section>

      {/* 禁用状态 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1890ff' }}>
          禁用状态
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          设置 disabled={true} 禁用组件，无法进行任何操作。
        </p>
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          background: '#fff'
        }}>
          <InputTag
            defaultValue={['已禁用', '无法编辑']}
            placeholder="禁用状态"
            disabled
          />
        </div>
      </section>

      {/* 标签不可关闭 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1890ff' }}>
          标签不可关闭
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          设置 tagClosable={false} 让标签无法删除。
        </p>
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          background: '#fff'
        }}>
          <InputTag
            defaultValue={['不可删除', '只能添加']}
            placeholder="添加新标签"
            tagClosable={false}
          />
        </div>
      </section>
    </div>
  )
}

export default InputTagDemo
