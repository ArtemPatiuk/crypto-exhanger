import { useNavigate } from 'react-router-dom';
import { Paths } from '../../../paths';

import styles from '../index.module.css';

export const Logo = () => {
	const navigate = useNavigate();

	return (
		<div
			className={styles.logo}
			onClick={() => navigate(Paths.home)}
		>
			CRYPTO
		</div>
	);
};