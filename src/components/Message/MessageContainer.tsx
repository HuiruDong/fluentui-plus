import React, { useEffect } from 'react';
import { Toaster, useToastController } from '@fluentui/react-components';
import type { ToastDispatch } from './types';

interface MessageContainerProps {
  onDispatchReady: (dispatch: ToastDispatch) => void;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ onDispatchReady }) => {
  const { dispatchToast } = useToastController('message-toaster');

  useEffect(() => {
    onDispatchReady(dispatchToast);
  }, [dispatchToast, onDispatchReady]);

  return <Toaster toasterId='message-toaster' position='top' />;
};

export default MessageContainer;
