import { Card, Select, Button, notification, Spin, ConfigProvider } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useGetAllAssetsQuery } from "../../app/services/assets";
import styles from "./index.module.css";
import { ICoin, INetwork } from "../../app/types/asset"
import { useAppDispatch, useAppSelector } from '../../app/store';
import { selectUser, setAuthModalOpen, setExchangeModalOpen } from '../../features/auth/authSlice';
import { ExchangeModal } from '../modals/exchange-modal';




export const ExchangeWidget = () => {
	const { data: coins = [], isLoading } = useGetAllAssetsQuery();

	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);

	const [assetFrom, setAssetFrom] = useState<INetwork | null>(null);
	const [assetTo, setAssetTo] = useState<INetwork | null>(null);
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
					{/* FROM */}
					<Select
						placeholder="I will spend"
						size="large"
						className={styles.select}
						value={assetFrom?.id}
						showSearch
						optionLabelProp="label"
						onChange={(networkId) => {
							for (const coin of coins) {
								const network = coin.networks.find(
									(n) => n.id === networkId
								);
								if (network) {
									setAssetFrom(network);
									break;
								}
							}
						}}
					>
						{coins.flatMap((coin) =>
							coin.networks.map((network) => (
								<Select.Option
									key={network.id}
									value={network.id}
									label={
										<div className={styles.option}>
											{coin.imageUrl && (
												<img
													src={coin.imageUrl}
													alt={coin.symbol}
													className={styles.coinIcon}
												/>
											)}
											<div className={styles.textBlock}>
												<div className={styles.coinName}>
													{coin.symbol}
												</div>
												<div className={styles.network}>
													{network.networkSignature}
												</div>
											</div>
										</div>
									}
								>
									<div className={styles.option}>
										{coin.imageUrl && (
											<img
												src={coin.imageUrl}
												alt={coin.symbol}
												className={styles.coinIcon}
											/>
										)}
										<div className={styles.textBlock}>
											<div className={styles.coinName}>
												{coin.symbol}
											</div>
											<div className={styles.network}>
												{network.networkSignature}
											</div>
										</div>
									</div>
								</Select.Option>
							))
						)}
					</Select>

					<button
						className={styles.swapButton}
						onClick={handleSwap}
					>
						<SwapOutlined />
					</button>

					{/* TO */}
					<Select
						placeholder="I will receive"
						size="large"
						showSearch
						optionFilterProp="label"
						className={styles.select}
						value={assetTo?.id}
						optionLabelProp="label"
						onChange={(networkId) => {
							for (const coin of coins) {
								const network = coin.networks.find(
									(n) => n.id === networkId
								);
								if (network) {
									setAssetTo(network);
									break;
								}
							}
						}}
					>
						{coins.flatMap((coin) =>
							coin.networks.map((network) => (
								<Select.Option
									key={network.id}
									value={network.id}
									label={
										<div className={styles.option}>
											{coin.imageUrl && (
												<img
													src={coin.imageUrl}
													alt={coin.symbol}
													className={styles.coinIcon}
												/>
											)}
											<div className={styles.textBlock}>
												<div className={styles.coinName}>
													{coin.symbol}
												</div>
												<div className={styles.network}>
													{network.networkSignature}
												</div>
											</div>
										</div>
									}
								>
									<div className={styles.option}>
										{coin.imageUrl && (
											<img
												src={coin.imageUrl}
												alt={coin.symbol}
												className={styles.coinIcon}
											/>
										)}
										<div className={styles.textBlock}>
											<div className={styles.coinName}>
												{coin.symbol}
											</div>
											<div className={styles.network}>
												{network.networkSignature}
											</div>
										</div>
									</div>
								</Select.Option>
							))
						)}
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