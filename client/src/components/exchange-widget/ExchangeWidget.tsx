import { Card, Select, Button, notification, Spin,ConfigProvider } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetAllAssetsQuery } from "../../app/services/assets";
import styles from "./index.module.css";
import { IAsset } from "../../app/types/asset"
import { useAppDispatch, useAppSelector } from '../../app/store';
import { selectUser, setAuthModalOpen, setExchangeModalOpen } from '../../features/auth/authSlice';
import { ExchangeModal } from '../modals/exchange-modal';

export const ExchangeWidget = () => {
	const { data: assets, isLoading } = useGetAllAssetsQuery();

	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);

	const [isExchangeOpen, setIsExchangeOpen] = useState(false);
	const [api, contextHolder] = notification.useNotification();
	const [assetFrom, setAssetFrom] = useState<IAsset | null>(null);
	const [assetTo, setAssetTo] = useState<IAsset | null>(null);


	const handleSwap = () => {
		setAssetFrom(assetTo);
		setAssetTo(assetFrom);
	};

	const handleExchangeClick = () => {
		if (!assetFrom || !assetTo) {
			api.warning({
				message: "Виберіть пару для обміну",
				description: "Будь ласка, оберіть актив для відправки та отримання",
			});
			return;
		}

		if (assetFrom.id === assetTo.id) {
			api.error({
				message: "Помилка",
				description: "Неможливо обміняти актив сам на себе",
			});
			return;
		}

		if (!user) {
			dispatch(setAuthModalOpen(true));
			return;
		}

		setIsExchangeOpen(true); // 👈 локально
	};


	if (isLoading) return <Spin size="large" />;

	return (
		<div className={styles.wrapper}>
			<Card className={styles.card}>
				<div className={styles.header}>
					<h2 className={styles.title}>Instant Exchange</h2>
				</div>

				<div className={styles.row}>
					{/* FROM */}
					<Select
						placeholder="I will spend"
						size="large"
						className={styles.select}
						value={assetFrom?.id}
						optionLabelProp="label"
						onChange={(value) => {
							const selected = assets?.find(a => a.id === value);
							setAssetFrom(selected || null);
						}}
					>
						{assets?.map(asset => (
							<Select.Option
								key={asset.id}
								value={asset.id}
								label={
									<div className={styles.option}>
										{asset.imageUrl && (
											<img
												src={asset.imageUrl}
												alt={asset.coin}
												className={styles.coinIcon}
											/>
										)}
										<div className={styles.textBlock}>
											<div className={styles.coinName}>{asset.coin}</div>
											<div className={styles.network}>
												{asset.networkSignature}
											</div>
										</div>
									</div>
								}
							>
								<div className={styles.option}>
									{asset.imageUrl && (
										<img
											src={asset.imageUrl}
											alt={asset.coin}
											className={styles.coinIcon}
										/>
									)}
									<div className={styles.textBlock}>
										<div className={styles.coinName}>{asset.coin}</div>
										<div className={styles.network}>
											{asset.networkSignature}
										</div>
									</div>
								</div>
							</Select.Option>
						))}
					</Select>


					<button className={styles.swapButton} onClick={handleSwap}>
						<SwapOutlined />
					</button>

					{/* TO */}
					<Select
						placeholder="I will receive"
						size="large"
						className={styles.select}
						value={assetTo?.id}
						onChange={(value) => {
							const selected = assets?.find(a => a.id === value);
							setAssetTo(selected || null);
						}}
						optionLabelProp="label"
					>
						{assets?.map(asset => (
							<Select.Option
								key={asset.id}
								value={asset.id}
								label={
									<div className={styles.option}>
										{asset.imageUrl && (
											<img
												src={asset.imageUrl}
												alt={asset.coin}
												className={styles.coinIcon}
											/>
										)}
										<div className={styles.textBlock}>
											<div className={styles.coinName}>{asset.coin}</div>
											<div className={styles.network}>
												{asset.networkSignature}
											</div>
										</div>
									</div>
								}
							>
								<div className={styles.option}>
									{asset.imageUrl && (
										<img
											src={asset.imageUrl}
											alt={asset.coin}
											className={styles.coinIcon}
										/>
									)}
									<div className={styles.textBlock}>
										<div className={styles.coinName}>{asset.coin}</div>
										<div className={styles.network}>
											{asset.networkSignature}
										</div>
									</div>
								</div>
							</Select.Option>
						))}
					</Select>

					<Button
						type="primary"
						size="large"
						className={styles.exchangeButton}
						onClick={handleExchangeClick}
					>
						{!assetFrom || !assetTo
							? "Select pair"
							: "Exchange"}
					</Button>
					{contextHolder}
					<ExchangeModal
						open={isExchangeOpen}
						assetFrom={assetFrom}
						assetTo={assetTo}
						onClose={() => setIsExchangeOpen(false)}
					/>
				</div>
			</Card>
		</div>
	);
};
