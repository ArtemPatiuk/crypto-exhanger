import { Drawer, Button } from 'antd';
import { NavigationDekstopMenu } from './NavigationDekstopMenu';
import { defaultMenu, userMenu, adminMenu } from '../header/menu.config';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { selectUser, logout, setAuthModalOpen } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';

type Props = {
	open: boolean;
	onClose: () => void;
};

export const MobileNavigation = ({ open, onClose }: Props) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);

	const onLogoutClick = () => {
		dispatch(logout());
		localStorage.removeItem('token');
		navigate(Paths.home);
		onClose();
	};

	const menuRight = user?.role.includes('ADMIN') ? adminMenu : userMenu;

	return (
		<Drawer placement="right" open={open} onClose={onClose}>
			<NavigationDekstopMenu items={defaultMenu} mode="vertical" onItemClick={onClose} />

			{user && (
				<NavigationDekstopMenu items={menuRight} mode="vertical" onItemClick={onClose} />
			)}

			{user ? (
				<Button danger onClick={onLogoutClick} style={{ marginTop: 20 }}>
					Вийти
				</Button>
			) : (
				<Button
					type="primary"
					onClick={() => {
						onClose();
						dispatch(setAuthModalOpen(true));
					}}
				>
					Sign In
				</Button>
			)}
		</Drawer>
	);
};