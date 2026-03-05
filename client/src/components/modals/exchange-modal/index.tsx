import { Modal, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectIsExchangeModalOpen, setExchangeModalOpen } from "../../../features/auth/authSlice";
import { ICoin } from '../../../app/types';

type Props = {
	open: boolean;
	assetFrom: ICoin | null;
	assetTo: ICoin | null;
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

