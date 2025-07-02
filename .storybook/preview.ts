import type { Preview } from '@storybook/react-vite'
import { withFluentProvider } from './decorators'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    withFluentProvider,
  ],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: '主题',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: '浅色主题', icon: 'sun' },
          { value: 'dark', title: '深色主题', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;