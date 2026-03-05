import { ICoin, INetwork } from '../../app/types';
import styles from "./index.module.css";

interface CoinNetworkOptionProps {
	imageUrl?: string;
	coinSymbol: string;
	networkSignature: string;
}

export const CoinNetworkOption = ({
	imageUrl,
	coinSymbol,
	networkSignature
}: CoinNetworkOptionProps) => {
	return (
		<div className={styles.option}>
			{imageUrl && (
				<img
					src="https://via.placeholder.com/40"
					alt={coinSymbol}
					className={styles.coinIcon}
				/>
			)}
			<div className={styles.textBlock}>
				<div className={styles.coinName}>{coinSymbol}</div>
				<div className={styles.network}>
					{networkSignature}
				</div>
			</div>
		</div>
	);
};