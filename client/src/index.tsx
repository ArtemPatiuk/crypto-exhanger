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
        components:{
          Radio: {
            // orange color
            colorPrimary: "orange",
            colorPrimaryActive: "orange",
            colorPrimaryHover: "orange",       
           // buttonCheckedBg:"#7F7C7C",
                  
          },
          List :{
            colorPrimary:"green"
          }
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



