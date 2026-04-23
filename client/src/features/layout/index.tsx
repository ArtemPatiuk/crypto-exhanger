import { Layout, FloatButton } from 'antd';
import { Outlet } from 'react-router-dom';

import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer';

const { Content } = Layout;

export const LayoutPage = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header />

            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                <Outlet />
            </Content>

            <Footer />

            <FloatButton.BackTop />
        </Layout>
    );
};