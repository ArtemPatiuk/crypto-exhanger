import { Select } from 'antd';
import styles from "./index.module.css";
import { ICoin, INetwork } from '../../app/types';
import { CoinNetworkOption } from '../coin-network-otions-widget/CoinNetworkOption';

interface CoinSelectProps {
	value?: string;
	coins: ICoin[];
	placeholder: string;
	onChange: (network: INetwork | null) => void;
}

export const CoinSelect = ({
	value,
	coins,
	placeholder,
	onChange,
}: CoinSelectProps) => {
	const options = coins.flatMap(coin =>
		coin.networks.map(network => ({
			id: network.id,
			coin,
			network,
		}))
	);

	return (
		<Select
			size="large"
			placeholder={placeholder}
			value={value}
			optionLabelProp="label"
			onChange={(id) => {
				const selected = options.find(o => o.id === id);
				onChange(selected ? selected.network : null);
			}}
		>
			{options.map(option => (
				<Select.Option
					key={option.id}
					value={option.id}
					label={
						<CoinNetworkOption
							imageUrl={option.coin.imageUrl}
							coinSymbol={option.coin.symbol}
							networkSignature={option.network.chainName}
						/>
					}
				>
					<CoinNetworkOption
						imageUrl={option.coin.imageUrl}
						coinSymbol={option.coin.symbol}
						networkSignature={option.network.chainName}
					/>
				</Select.Option>
			))}
		</Select>
	);
};