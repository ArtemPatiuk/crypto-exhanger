import { Modal, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectIsExchangeModalOpen, setExchangeModalOpen } from "../../../features/auth/authSlice";
import { IAsset } from '../../../app/types';

type Props = {
	open: boolean;
	assetFrom: IAsset | null;
	assetTo: IAsset | null;
	onClose: () => void;
};

export const ExchangeModal = ({
	open,
	assetFrom,
	assetTo,
	onClose,
}: Props) => {


	return (
		<div>
			123
		</div>
	);
};

