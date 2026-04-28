import { useState } from 'react';
import { useGetAllAssetsQuery, useGetCountAssetsQuery, useGetAssetFiltersQuery } from '../../../../app/services/assets';
import { AssetFilters } from '../../../../app/types';
import { usePagination } from '../../../../app/hooks/use-pagination';

export const useListAssets = () => {
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenProfile, setIsModalOpenProfile] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  const {
    pagination,
    updateDataFilters,
    getTablePaginationConfig,
    updatePagination,
    getTableDataSource
  } = usePagination({});

  const [assetFilters, setAssetFilters] = useState<AssetFilters>({
    coins: undefined,
    networks: undefined,
    isActive: undefined,
  });

  const { data: assetsResponse, isFetching, isLoading } = useGetAllAssetsQuery({
    pagination,
    filters: assetFilters,
  });

  const { data: filtersData } = useGetAssetFiltersQuery();
  const { data: stats, isLoading: isLoadingCount } = useGetCountAssetsQuery();

  const handleTableChange = (pagination: any, tableFilters: any, _sorter: any, extra: any) => {
    if (extra.action === 'paginate') {
      updatePagination(pagination.current, pagination.pageSize);
    }
    if (extra.action === 'filter') {
      updateDataFilters<AssetFilters>(setAssetFilters, {
        coins: tableFilters.coins?.length ? tableFilters.coins : undefined,
        networks: tableFilters.networks?.length ? tableFilters.networks : undefined,
        isActive: tableFilters.isActive?.length !== undefined ? tableFilters.isActive[0] : undefined,
      });
    }
  };

  return {
    state: { isModalOpenCreate, isModalOpenProfile, selectedAssetId, assetFilters },
    actions: { setIsModalOpenCreate, setIsModalOpenProfile, setSelectedAssetId, handleTableChange },
    data: { assetsResponse, filtersData, stats },
    status: { isLoading, isFetching, isLoadingCount },
    paginationUtils: { getTablePaginationConfig, getTableDataSource }
  };
};