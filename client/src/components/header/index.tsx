import { Button, ConfigProvider, Layout, Menu, theme } from 'antd';
import { NavLink, useLocation, useNavigate, } from 'react-router-dom';
import { Paths } from '../../paths';
import { logout, selectUser, setAuthModalOpen } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { MenuOutlined } from '@ant-design/icons';
import { MobileNavigation } from '../navigation-menu/NavigationMobileMenu';

import styles from './index.module.css';
import { AuthModal } from '../modals/auth-modal';
import { defaultMenu, userMenu, adminMenu } from './menu.config';
import { useState } from 'react';


const renderMenuItems = (items: { label: string; path: string }[]) =>
  items.map(item => ({
    key: item.path,
    label: <NavLink to={item.path}>{item.label}</NavLink>,
  }));


export const Header = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);

  const showModal = () => dispatch(setAuthModalOpen(true));
  const onLogoutClick = () => { dispatch(logout()); localStorage.removeItem('token'); navigate(Paths.home); };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#00FFA0', borderRadius: 12 },
        components: {
          Button: { colorPrimary: '#00FFA0', colorTextLightSolid: '#000' },
          Menu: { darkItemBg: 'transparent' }
        },
      }}
    >
      <Layout.Header className={styles.header}>
        <div className={styles.headerContainer}>
          <Button
            className={styles.mobileMenuButton}
            icon={<MenuOutlined />}
            onClick={() => setMobileOpen(true)}
          />
          {/* ЛОГО */}
          <div className={styles.logoSection}>
            <a className={styles.logoText}>LOGO</a>
          </div>

          <div className={styles.menuSection}>
            <Menu
              mode="horizontal"
              items={renderMenuItems(defaultMenu)}
              selectedKeys={[location.pathname]}
              disabledOverflow
              style={{ background: 'transparent', borderBottom: 'none' }}
            />

          </div>

          <div className={styles.authSection}>
            {user ? (
              <div className={styles.userInfo}>
                <Menu
                  mode="horizontal"
                  items={renderMenuItems(
                    user.role.includes('ADMIN') ? adminMenu : userMenu
                  )}
                  selectedKeys={[location.pathname]}
                  style={{ background: 'transparent', borderBottom: 'none' }}
                />
                <Button type="primary" danger onClick={onLogoutClick}>
                  Вийти
                </Button>
              </div>
            ) : (
              <Button
                type="primary"
                className={styles.signInBtn}
                onClick={showModal}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
        <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <AuthModal />
      </Layout.Header>
    </ConfigProvider>
  );
};

