import { Layout, Grid } from 'antd';
import { useState } from 'react';
import { Logo } from './components/Logo';
import { Navigation } from './components/Navigation';
import { AuthSection } from './components/AuthSection';
import { MobileMenuButton } from './components/MobileMenuButton';
import { MobileNavigation } from '../navigation-menu/NavigationMobileMenu';
import { AuthModal } from '../../features/auth/ui/AuthModal';
import styles from './index.module.css';

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <AntHeader className={styles.header} style={{ background: 'transparent' }}>
      <div className={styles.container}>
        {isMobile && (
          <div className={styles.mobileMenuButton} onClick={() => setMobileOpen(true)}>
             <MobileMenuButton onClick={() => setMobileOpen(true)} /> 
          </div>
        )}
        <div className={styles.logo}>
          <Logo />
        </div>
        {!isMobile && <Navigation />}

       <div className={styles.authWrapper}>
          <AuthSection />
        </div>
      </div>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <AuthModal />
    </AntHeader>
  );
};