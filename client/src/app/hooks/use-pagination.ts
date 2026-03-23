import { useState } from 'react';
import { TablePaginationConfig } from 'antd';

import {Pagination} from '../types/pagination';
import { defaultPaginationLimit, paginationPageSizeOptions } from '../config';

interface Props {
	initPagination?: Pagination;
}

export const usePagination = (
	{
		initPagination = { page: 1, limit: defaultPaginationLimit }
	}: Props
) => {
	const [pagination, setPagination] = useState<Pagination>(initPagination);

	const updatePagination = (page: number, limit: number) => {
		setPagination({ page, limit });
	}

	const resetPagination = () => {
		setPagination((state) => ({
			...state,
			page: 1
		}));
	}

	const updateDataFilters = <T>(
		setFilters: (value: React.SetStateAction<T>) => void,
		filters: T
	) => {
		resetPagination();

		setFilters((state) => ({
			...state,
			...filters
		}));
	}

	const getTablePaginationConfig = (totalItems: number | undefined): TablePaginationConfig => {
		return {
			responsive: true,
			showSizeChanger: true,
			current: pagination.page,
			pageSize: pagination.limit,
			total: totalItems,
			pageSizeOptions: paginationPageSizeOptions,
			showTotal: (total) => `Загальна кількість записів: ${total}`,
			onChange: updatePagination
		};
	}

	// [FIX] Warning: [antd: Table] dataSource length is less than pagination.total but large than pagination.pageSize.
	// Please make sure your config correct data with async mode.
	const getTableDataSource = <T>(isFetching: boolean, data: T[] | undefined): T[] | undefined => {
		if (isFetching && data && data.length > pagination.limit) {
			return data.slice(0, pagination.limit);
		}

		return data;
	}

	return {
		pagination,
		setPagination,
		updatePagination,
		resetPagination,

		updateDataFilters,
		getTablePaginationConfig,
		getTableDataSource
	};
}