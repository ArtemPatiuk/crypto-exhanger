import { useState } from 'react';
import { Button, ConfigProvider, Layout, Menu, Modal, theme, Typography, Space, Form } from 'antd';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { Paths } from '../../paths';
import { logout, selectIsAuthModalOpen, selectUser, setAuthModalOpen } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { ErrorValidator, getErrors } from "../../utils/get-errors";

import styles from './index.module.css';
import { AuthModal } from '../auth-modal';
import { LoginForm } from '../login-form';
import { RegisterForm } from '../register-form';

const { Text } = Typography;

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const location = useLocation();

  // Стан для модального вікна
  const isLoginModalOpen = useAppSelector(selectIsAuthModalOpen);
  const [errors, setErrors] = useState<ErrorValidator[]>([]);

  const showModal = () => dispatch(setAuthModalOpen(true));
  const handleCancel = () => dispatch(setAuthModalOpen(false));

  const onLogoutClick = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate(Paths.home);
  };
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const getLinkClassName = (isActive: boolean) =>
    isActive ? styles.linkActive : styles.linkNotActive;

  const centerMenuItems = [
    { key: Paths.home, label: <NavLink to={Paths.home} className={({ isActive }) => getLinkClassName(isActive)}>Home</NavLink> },
    { key: Paths.review, label: <NavLink to={Paths.review} className={({ isActive }) => getLinkClassName(isActive)}>Reviews</NavLink> },
    { key: Paths.contacts, label: <NavLink to={Paths.contacts} className={({ isActive }) => getLinkClassName(isActive)}>Contacts</NavLink> },
  ];

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

          <div className={styles.logoSection}>
            <span className={styles.logoText}>LOGO</span>
          </div>

          <div className={styles.menuSection}>
            <Menu
              mode="horizontal"
              items={centerMenuItems}
              selectedKeys={[location.pathname]}
              disabledOverflow
              style={{ background: 'transparent', borderBottom: 'none', minWidth: '300px' }}
            />
          </div>

          {/* AUTH BUTTONS */}
          <div className={styles.authSection}>
            {user ? (
              <div className={styles.userInfo}>
                <NavLink to={Paths.cabinet} className={({ isActive }) => getLinkClassName(isActive)} style={{ marginRight: '20px' }}>Заявки</NavLink>
                <Button type="primary" danger onClick={onLogoutClick}>Вийти</Button>
              </div>
            ) : (
              <Button type="primary" className={styles.signInBtn} onClick={showModal}>Sign In</Button>
            )}
          </div>
        </div>
       
        <AuthModal />
      </Layout.Header>
    </ConfigProvider>
  );
};

