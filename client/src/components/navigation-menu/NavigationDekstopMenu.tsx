import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';

type MenuItem = { label: string; path: string };

type Props = {
	items: MenuItem[];
	mode?: 'horizontal' | 'vertical';
	onItemClick?: () => void;
};

export const NavigationDekstopMenu = ({ items, mode = 'horizontal', onItemClick }: Props) => {
	const location = useLocation();

	return (
		<Menu
			mode={mode}
			selectedKeys={[location.pathname]}
			style={{ background: 'transparent', border: 'none' }}
			items={items.map(item => ({
				key: item.path,
				label: (
					<NavLink
						to={item.path}
						onClick={onItemClick}
						style={{ textDecoration: 'none' }}
					>
						{item.label}
					</NavLink>
				),
			}))}
		/>
	);
};