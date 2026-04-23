import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { logout, selectUser, setAuthModalOpen } from '../../../features/auth/authSlice';
import { Paths } from '../../../paths';

export const AuthSection = () => {
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const onLogout = () => {
		dispatch(logout());
		localStorage.removeItem('token');
		navigate(Paths.home);
	};

	if (!user) {
		return (
			<Button type="primary" onClick={() => dispatch(setAuthModalOpen(true))}>
				Sign In
			</Button>
		);
	}

	return (
		<Button danger onClick={onLogout}>
			Вийти
		</Button>
	);
};