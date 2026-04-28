import { Modal, notification } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetListAvailableCoinQuery, useGetListAvailableNetworkQuery, useAddAssetMutation } from '../../../../app/services/assets';
import { IAsset } from '../../../../app/types';
import { AssetForm } from '../AddAssetForm/AddAssetForm';
import { Paths } from '../../../../paths';
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';

type Props = {
	open: boolean;
	onClose: () => void;
};

export const AddAssetModal = ({ open, onClose }: Props) => {

	const navigate = useNavigate();
	const [errors, setError] = useState<ErrorValidator[]>([]);
	const [api, contextHolder] = notification.useNotification();

	const { data: coins } = useGetListAvailableCoinQuery();

	const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
	const handleClose = () => {
		setSelectedCoin(null)
		setError([]);
		onClose();
	};

	const { data: networks, isLoading: networkLoading } =
		useGetListAvailableNetworkQuery(selectedCoin!, {
			skip: !selectedCoin,
			refetchOnMountOrArgChange: true
		});

	const [AddAssets] = useAddAssetMutation();

	const handleAddAsset = async (data: any) => {
		try {
			console.log('Данные формы:', data);
			await AddAssets(data).unwrap();

			api.success({
				message: "Статус змінено",
				description: "Новий актив успішно створено"
			});
			onClose();

			navigate(`${Paths.admin}/assets`);

		} catch (err) {
			setError(getErrors(err));
		}
	};

	return (
		<Modal
			className='asset-modal'
			open={open}
			onCancel={handleClose}
			footer={null}
			centered
			destroyOnClose
			width={600}
			mask
			maskClosable
			bodyStyle={{
				padding: "30px 40px 40px 40px"
			}}
			style={{
				backdropFilter: "blur(20px)",
				backgroundColor: "rgba(15, 15, 15, 0.9)",
				borderRadius: "30px",
				overflow: "hidden",
			}}
		>
			{contextHolder}
			<AssetForm
				title="Додати новий актив"
				onFinish={handleAddAsset}
				errors={errors}
				coins={coins || []}
				networks={networks}
				networksLoading={networkLoading}
				onCoinChange={setSelectedCoin}
				existingImageUrl={networks?.imageUrl}
			/>
		</Modal>

	);
};