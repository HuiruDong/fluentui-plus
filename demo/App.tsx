import React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import AppRouter from './router';

const App: React.FC = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <AppRouter />
    </FluentProvider>
  );
};

export default App;
