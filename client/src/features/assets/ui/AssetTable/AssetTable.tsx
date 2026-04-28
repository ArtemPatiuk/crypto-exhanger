import React from 'react';
import { Table } from 'antd';
import { useListAssets } from './useListAssets';
import { getAssetColumns } from './columns';
import styles from './AssetTable.module.css';
import { ProfileAssetModal } from '../ProfileAssetModal/ProfileAssetModal';
import { setProfileModalOpen } from '../../assetsSlice';
import { useAppDispatch } from '../../../../app/store';

export const AssetTable = () => {
    const dispatch = useAppDispatch();
	const { state, actions, data, status, paginationUtils } = useListAssets();

	const coinFilters = data.filtersData?.coins.map((c) => ({ text: c.label, value: c.value })) || [];
	const networkFilters = data.filtersData?.networks.map((n) => ({ text: n.label, value: n.value })) || [];

	return (
		<>
			<Table
				className={styles['customTable']}
				columns={getAssetColumns(coinFilters, networkFilters, state.assetFilters)}
				dataSource={paginationUtils.getTableDataSource(status.isFetching, data.assetsResponse?.data)}
				rowKey="id"
				loading={status.isLoading || status.isFetching}
				onRow={(record) => ({
					onClick: () => {
                        dispatch(setProfileModalOpen({ 
                            open: true, 
                            id: record.id 
                        }));
                    }
				})}
				pagination={paginationUtils.getTablePaginationConfig(data.assetsResponse?.meta.total)}
				onChange={actions.handleTableChange}
			/>



			<ProfileAssetModal/>
			{/* <ProfileAssetModal
				open={state.isModalOpenProfile}
				onClose={() => actions.setIsModalOpenProfile(false)}
				id={state.selectedAssetId}
			/> */}
		</>
	);
};