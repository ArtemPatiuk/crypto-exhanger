import { Layout, FloatButton } from 'antd';
import { Outlet } from 'react-router-dom';

import { Header } from '../../components/header';

import styles from './index.module.css';
import { Footer } from '../../components/footer';


export const LayoutPage = () => {
    return (
        <>
          <Header />
        <div className={styles.main}>
            <Layout.Content style={{ height: '100%' }}>
                <Outlet />
                <FloatButton.BackTop />
            </Layout.Content>
        </div>
        <Footer />
        </>
    )
}
