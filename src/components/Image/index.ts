import Image from './Image';
import ImageGroup from './ImageGroup';
import ImagePreview from './ImagePreview';
import type { ImageProps, ImageGroupProps, ImagePreviewProps, PreviewImageInfo } from './types';

type ImageComponent = typeof Image & {
  PreviewGroup: typeof ImageGroup;
};

// 将 ImageGroup 挂载到 Image 上，支持 Image.PreviewGroup 调用方式
const ImageWithGroup = Image as ImageComponent;
ImageWithGroup.PreviewGroup = ImageGroup;

export { ImageGroup, ImagePreview };
export type { ImageProps, ImageGroupProps, ImagePreviewProps, PreviewImageInfo };
export default ImageWithGroup;
