import React, { useEffect, useState, useMemo } from 'react';
import { Spinner } from '@fluentui/react-components';
import clsx from 'clsx';
import type { SpinProps } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-spin';

const Spin: React.FC<SpinProps> = ({
  tip,
  fullscreen = false,
  size = 'medium',
  className,
  style,
  spinning = true,
  delay = 0,
  children,
  ...restProps
}) => {
  const [showSpin, setShowSpin] = useState(delay === 0 ? spinning : false);

  useEffect(() => {
    if (spinning) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setShowSpin(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShowSpin(true);
      }
    } else {
      setShowSpin(false);
    }
  }, [spinning, delay]);

  const spinnerNode = useMemo(() => {
    if (!showSpin) return null;

    // 将 tip 转换为字符串或保持为 undefined
    const label = tip ? String(tip) : undefined;
    return <Spinner size={size} label={label} {...restProps} />;
  }, [showSpin, size, tip, restProps]);

  // 全屏模式
  if (fullscreen) {
    const classes = clsx(
      prefixCls,
      `${prefixCls}--fullscreen`,
      {
        [`${prefixCls}--hidden`]: !showSpin,
      },
      className
    );

    return (
      <div className={classes} style={style}>
        <div className={`${prefixCls}__content`}>{spinnerNode}</div>
      </div>
    );
  }

  // 嵌套模式（包裹内容）
  if (children) {
    const classes = clsx(
      prefixCls,
      `${prefixCls}--nested`,
      {
        [`${prefixCls}--spinning`]: showSpin,
      },
      className
    );

    return (
      <div className={classes} style={style}>
        {showSpin && (
          <div className={`${prefixCls}__mask`}>
            <div className={`${prefixCls}__content`}>{spinnerNode}</div>
          </div>
        )}
        <div className={`${prefixCls}__container`}>{children}</div>
      </div>
    );
  }

  // 简单模式（仅显示 Spinner）
  const classes = clsx(prefixCls, className);

  return (
    <div className={classes} style={style}>
      {spinnerNode}
    </div>
  );
};

export default Spin;
export type { SpinProps };
