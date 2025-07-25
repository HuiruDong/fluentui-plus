/**
 * 生成唯一的CSS类名
 * @param prefix 前缀
 * @param suffix 后缀
 * @returns CSS类名
 */
export const generateClassName = (prefix: string, suffix?: string): string => {
  return suffix ? `${prefix}-${suffix}` : prefix;
};
