import { Button, Layout, Menu } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { Paths } from '../../paths';
import { logout, selectUser } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/store';

import styles from './index.module.css'

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const auth = useAppSelector(state => state.auth);

  const onLogoutClick = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate(Paths.login);
  };

  const getLinkClassName = (path: string, isActive: boolean) => {
    return isActive ? styles.linkActive : styles.linkNotActive;
  };

  const staticMenuItems = [
    { key: 'home', label: <NavLink to={Paths.home} className={({ isActive }) => getLinkClassName(Paths.home, isActive)}>Головна</NavLink> },
    { key: 'reviews', label: <NavLink to={Paths.review} className={({ isActive }) => getLinkClassName(Paths.review, isActive)}>Відгуки</NavLink> },
    { key: 'contacts', label: <NavLink to={Paths.contacts} className={({ isActive }) => getLinkClassName(Paths.contacts, isActive)}>Контакти</NavLink> },
  ];

  let authMenuItems = [];

  if (user) {
    authMenuItems = [
      { key: 'exchangesUser', label: <NavLink to={Paths.cabinet} className={({ isActive }) => getLinkClassName(Paths.cabinet, isActive)}>Перейти до заявок</NavLink> },
      { key: 'logout', label: <Button className="mb-0" type="primary" icon={<LogoutOutlined />} onClick={onLogoutClick}>Вийти</Button> },
    ];

    if (user?.role?.includes("ADMIN")) {
      authMenuItems = [
        { key: 'assets', label: <NavLink to={Paths.assetsList} className={({ isActive }) => getLinkClassName(Paths.admin, isActive)}>Активи</NavLink> },
        { key: 'exchanges', label: <NavLink to={Paths.exchangesList} className={({ isActive }) => getLinkClassName(Paths.admin, isActive)}>Керування активами</NavLink> },
        { key: 'logout', label: <Button className="mb-0" type="primary" icon={<LogoutOutlined />} onClick={onLogoutClick}>Вийти</Button> },
      ];
    }
  } else {
    authMenuItems = [
      { key: 'login', label: <NavLink to={Paths.login} className={({ isActive }) => getLinkClassName(Paths.login, isActive)}>Увійти</NavLink> },
      { key: 'register', label: <NavLink to={Paths.register} className={({ isActive }) => getLinkClassName(Paths.register, isActive)}>Зареєструватись</NavLink> },
    ];
  }

  const menuItemsLayout = [
    ...staticMenuItems,
    ...authMenuItems
  ];

  return (
    <Layout.Header className={styles.header}>
      <Menu mode="horizontal" items={menuItemsLayout} style={{ width: '100%' }} />
    </Layout.Header>
  );
};