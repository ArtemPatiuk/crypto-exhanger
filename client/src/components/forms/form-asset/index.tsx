import { AvailableCoin, AvailableNetworkByCoin, IAsset } from "../../../app/types/asset";
import { Button, Card, Form, Space, Input, notification, Select } from "antd";
import { CustomInput } from "../../inputs/custom-input";
import { ErrorMessage } from "../../error-message";
import { ErrorValidator } from "../../../utils/get-errors";

type SelectOption = {
    value: string;
    label: string;
}

type Props = {
    title: string
    onFinish: (value: IAsset) => void
    coins: AvailableCoin[]
    networks?: AvailableNetworkByCoin
    networksLoading: boolean
    onCoinChange: (symbol: string) => void
    errors?: ErrorValidator[]
}

export const AssetForm = ({
    onFinish,
    title,
    errors,
    coins,
    networks,
    networksLoading,
    onCoinChange
}: Props) => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    return (
        <>
            <h2 style={{ marginBottom: 20 }}>{title}</h2>
            {contextHolder}
            <Form name="asset-form"
                form={form}
                onFinish={onFinish}
                onValuesChange={(changedValues, allValues) => {
                    if (changedValues.coin) {
                        form.setFieldsValue({ network: undefined });
                    }
                }}

            >
                <Form.Item name="coin" rules={[{ required: true }]}>
                    <Select
                        size="large"
                        className="custom-select"
                        placeholder="Available Coin"
                        showSearch
                        optionFilterProp="label"
                        filterSort={(optionA: SelectOption, optionB: SelectOption) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                        options={coins.map((coin) => ({
                            value: coin.symbol,
                            label: `${coin.symbol} - ${coin.name}`,
                        }))}
                        onChange={(value) => {
                            onCoinChange(value);
                        }}

                    />
                </Form.Item>
                <Form.Item name="network" rules={[{ required: true }]}>
                    <Select
                        size="large"
                        className="custom-select"
                        placeholder="Select Network"
                        loading={networksLoading}
                        disabled={!networks?.availableNetworksForSelectedCoin?.length}
                        options={networks?.availableNetworksForSelectedCoin?.map(n => ({
                            value: n.network,
                            label: n.name,
                            disabled: networks.existingNetworks.includes(n.network),
                        })) ?? []}
                    />
                </Form.Item>
                <CustomInput type="text" name="imageUrl" placeholder="Посилання на зображення" required={false} size="large" />
                <Input type="text" disabled value={"https://www.coingecko.com/"} />
                <Space style={{ justifyContent: "center", alignItems: "center" }}>
                    <Button htmlType="submit" style={{ marginTop: "10px" }}>
                        Створити
                    </Button>
                </Space>
            </Form>
            <div style={{ marginTop: "10px" }}>
                <ErrorMessage errors={errors} />
            </div>
        </>
    )
}
