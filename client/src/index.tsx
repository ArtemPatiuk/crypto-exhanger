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
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00FFA0',
          colorBgContainer: 'transparent',
        },
        components:{
          Menu: {
            itemSelectedColor: '#00FFA0',
            itemHoverColor: '#00FFA0',
            horizontalItemSelectedColor: '#00FFA0',
            horizontalItemHoverColor: '#00FFA0',
          },
        }
      }
      }
      locale={locale}
    >
      <App notification={{ placement: 'bottomRight' }}>
        <Auth>
          <RouterProvider router={router} />
        </Auth>
      </App>
    </ConfigProvider>
  </Provider>
);



