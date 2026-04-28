import { Layout, FloatButton } from 'antd';
import { Outlet } from 'react-router-dom';

import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer';
import styles from './index.module.css'
const { Content } = Layout;

export const LayoutPage = () => {
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Content className={styles.mainContent}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </Content>

      <Footer />
      <FloatButton.BackTop />
    </Layout>
  );
};