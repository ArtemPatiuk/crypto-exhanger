export interface NavItem {
	key: string,
	label: string,
	path: string,
	roles?: ('ADMIN' | 'USER')[];
}