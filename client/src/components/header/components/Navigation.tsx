import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../app/store';
import { selectUser } from '../../../features/auth/authSlice';

import { defaultMenu, userMenu, adminMenu } from '../menu.config';

export const Navigation = () => {
	const location = useLocation();
	const user = useAppSelector(selectUser);

	const menu = [
		...defaultMenu,
		...(user
			? user.role.includes('ADMIN')
				? adminMenu
				: userMenu
			: []),
	];
	const items = menu.map((item) => ({
		key: item.path,
		label: <NavLink to={item.path}>{item.label}</NavLink>,
	}));

	return (
		<Menu
			mode="horizontal"
			items={items}
			selectedKeys={[location.pathname]}
			style={{ flex: 1, justifyContent: 'center' }}
		/>
	);
};