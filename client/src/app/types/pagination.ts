export interface Meta {
	total: number;
	page: number;
	limit: number;
	totalPage: number;
}

export interface PaginationResponse<T> {
	data: T[];
	meta: Meta;
}

export interface Pagination {
	page: number;
	limit: number;
}