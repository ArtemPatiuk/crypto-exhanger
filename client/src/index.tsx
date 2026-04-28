import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { App, ConfigProvider, theme } from 'antd';
import locale from 'antd/locale/uk_UA';
import { store } from './app/store';
import { Auth } from './features/auth/auth';
import { router } from './app/routers';

import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00FFA0',
          colorIcon: '#00FFA0',
          colorInfo: '#00FFA0',
          colorBgBase: '#141414',
          colorBgContainer: '#1c1c1c', 
          borderRadius: 12,
          fontFamily: 'Poppins, sans-serif',
        },
        components: {
          Layout: {
            colorBgBody: '#141414',
          },
          Modal: {
          contentBg: 'rgba(15, 15, 15, 0.9)',
        },
          Menu: {
            itemSelectedColor: '#00FFA0',
            itemHoverColor: '#00FFA0',
            horizontalLineHeight: '64px', 
          },
          Table: {
            colorBgContainer: 'transparent',
            colorFillAlter: 'transparent', 
          }
        },
      }
    }
    >
      <App notification={{ placement: 'bottomRight' }}>
        <Auth>
          <RouterProvider router={router} />
        </Auth>
      </App>
    </ConfigProvider>
  </Provider>
);



