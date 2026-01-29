import { Layout } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';

import styles from './index.module.css';

export const Footer = () => {
  return (
    <Layout.Footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.social}>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><FacebookOutlined /></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><InstagramOutlined /></a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><TwitterOutlined /></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><LinkedinOutlined /></a>
        </div>
        <div className={styles.contact}>
          <p>Email: mardukg2017@gmail.com</p>
        </div>
      </div>
    </Layout.Footer>
  );
};
