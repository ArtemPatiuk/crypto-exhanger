import { Layout, FloatButton } from 'antd';
import { Outlet } from 'react-router-dom';

import { Header } from '../../components/header';

import styles from './index.module.css';
import { Footer } from '../../components/footer';


export const LayoutPage = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Header />
            <Layout.Content className={styles.main}>
                <Outlet />
                <FloatButton.BackTop />
            </Layout.Content>
            <Footer />
        </Layout>
    )
}

