import Upload from './Upload';
import UploadDragger from './UploadDragger';
import type { UploadProps, UploadDraggerProps } from './types';

// 将 Dragger 作为 Upload 的静态属性
type UploadComponent = typeof Upload & {
  Dragger: typeof UploadDragger;
};

const UploadWithDragger = Upload as UploadComponent;
UploadWithDragger.Dragger = UploadDragger;

export { UploadDragger };
export type { UploadProps, UploadDraggerProps };
export default UploadWithDragger;
