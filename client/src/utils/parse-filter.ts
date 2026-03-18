import { FilterValue, SorterResult } from 'antd/es/table/interface';
export const getFilters = (array: string[] | undefined) => {
	return array?.map((item) => ({
		text: item,
		value: item
	}));
}

export const parseFilter = (filter: FilterValue | null): string[] => {
	return filter?.map((item) => item.toString()) || [];
}
