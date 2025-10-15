import { STATIC_MODAL_TYPES } from '../types';

// 静态方法的常量和配置

// 默认文本配置
export const DEFAULT_TEXTS = {
  [STATIC_MODAL_TYPES.INFO]: {
    title: '信息',
    okText: '知道了',
  },
  [STATIC_MODAL_TYPES.SUCCESS]: {
    title: '成功',
    okText: '知道了',
  },
  [STATIC_MODAL_TYPES.ERROR]: {
    title: '错误',
    okText: '知道了',
  },
  [STATIC_MODAL_TYPES.WARNING]: {
    title: '警告',
    okText: '知道了',
  },
  [STATIC_MODAL_TYPES.CONFIRM]: {
    title: '确认',
    okText: '确定',
    cancelText: '取消',
  },
} as const;

// 销毁延迟时间
export const DESTROY_DELAY = 100;
