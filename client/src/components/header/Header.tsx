import { Layout } from 'antd';
import { useState } from 'react';

import { Logo } from './components/Logo';
import { Navigation } from './components/Navigation';
import { AuthSection } from './components/AuthSection';
import { MobileMenuButton } from './components/MobileMenuButton';
import { MobileNavigation } from '../navigation-menu/NavigationMobileMenu';
import { AuthModal } from '../modals/auth-modal';

import styles from './index.module.css';

const { Header: AntHeader } = Layout;

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AntHeader className={styles.header}>
      <div className={styles.container}>
        <MobileMenuButton onClick={() => setMobileOpen(true)} />

        <Logo />

        <Navigation />

        <AuthSection />
      </div>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <AuthModal />
    </AntHeader>
  );
};