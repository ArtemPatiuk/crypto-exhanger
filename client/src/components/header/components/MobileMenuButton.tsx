import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import styles from '../index.module.css';

type Props = {
	onClick: () => void;
};

export const MobileMenuButton = ({ onClick }: Props) => {
	return (
		<Button
			className={styles.mobileMenuButton}
			icon={<MenuOutlined />}
			onClick={onClick}
			type="text"
		/>
	);
};