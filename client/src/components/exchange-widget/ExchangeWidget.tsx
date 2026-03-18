import { Card, Select, Button, notification, Spin, ConfigProvider } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useGetAllAssetsQuery } from "../../app/services/assets";
import styles from "./index.module.css";
import { IAsset } from "../../app/types/asset"
import { useAppDispatch, useAppSelector } from '../../app/store';
import { selectUser, setAuthModalOpen, setExchangeModalOpen } from '../../features/auth/authSlice';
import { ExchangeModal } from '../modals/exchange-modal';




export const ExchangeWidget = () => {
	const [filters, setFilters] = useState<{
		coins?: string[];
		networks?: string[];
		isActive?: boolean;
	}>({});
	const { data, isLoading } = useGetAllAssetsQuery({
		pagination: { page: 1, limit: 100 },
		filters: { isActive: true }
	});
	const assets = data?.data || [];
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);

	const [assetFrom, setAssetFrom] = useState<IAsset | null>(null);
	const [assetTo, setAssetTo] = useState<IAsset | null>(null);
	const [isExchangeOpen, setIsExchangeOpen] = useState(false);

	const [api, contextHolder] = notification.useNotification();

	const handleSwap = () => {
		setAssetFrom(assetTo);
		setAssetTo(assetFrom);
	};

	const handleExchangeClick = () => {
		if (!assetFrom || !assetTo) {
			api.warning({ message: "Виберіть пару" });
			return;
		}

		if (assetFrom.id === assetTo.id) {
			api.error({ message: "Неможливо обміняти однакову мережу" });
			return;
		}

		if (!user) {
			dispatch(setAuthModalOpen(true));
			return;
		}

		setIsExchangeOpen(true);
	};

	if (isLoading) return <Spin size="large" />;

	return (
		<div className={styles.wrapper}>
			<Card className={styles.card}>
				<h2 className={styles.title}>Instant Exchange</h2>
				<div className={styles.row}>
					<Select
						placeholder="I will spend"
						size="large"
						className={styles.select}
						value={assetFrom?.id}
						showSearch
						optionLabelProp="label"
						onChange={(id) => {
							const selected = assets.find(a => a.id === id);
							setAssetFrom(selected || null);
						}}
					>
						{assets.map((asset) => (
							<Select.Option
								key={asset.id}
								value={asset.id}
								label={`${asset.symbol} - ${asset.networkSignature}`}
							>
								<div className={styles.option}>
									{asset.imageUrl && (
										<img
											src={asset.imageUrl}
											alt={asset.symbol}
											className={styles.coinIcon}
										/>
									)}
									<div className={styles.textBlock}>
										<div className={styles.coinName}>
											{asset.symbol}
										</div>
										<div className={styles.network}>
											{asset.networkSignature}
										</div>
									</div>
								</div>
							</Select.Option>
						))}
					</Select>

					<button
						className={styles.swapButton}
						onClick={handleSwap}
					>
						<SwapOutlined />
					</button>
					<Select
						placeholder="I will receive"
						size="large"
						showSearch
						className={styles.select}
						value={assetTo?.id}
						optionLabelProp="label"
						onChange={(id) => {
							const selected = assets.find(a => a.id === id);
							setAssetTo(selected || null);
						}}
					>
						{assets.map((asset) => (
							<Select.Option
								key={asset.id}
								value={asset.id}
								label={`${asset.symbol} - ${asset.networkSignature}`}
							>
								<div className={styles.option}>
									{asset.imageUrl && (
										<img
											src={asset.imageUrl}
											alt={asset.symbol}
											className={styles.coinIcon}
										/>
									)}
									<div className={styles.textBlock}>
										<div className={styles.coinName}>
											{asset.symbol}
										</div>
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
				</div>
			</Card>
		</div>
	);
};