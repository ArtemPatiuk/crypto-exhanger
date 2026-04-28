import { AvailableCoin, AvailableNetworkByCoin, IAsset } from "../../../app/types/asset";
import { Button, Card, Form, Space, Input, notification, Select } from "antd";
import { CustomInput } from "../../inputs/custom-input";
import { ErrorMessage } from "../../error-message";
import { ErrorValidator } from "../../../utils/get-errors";
import { AssetImageUpload } from '../../ui/AssetImageUpload';
import { useEffect } from 'react';

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
    existingImageUrl?:string
}

export const AssetForm = ({
    onFinish,
    title,
    errors,
    coins,
    networks,
    networksLoading,
    onCoinChange,
    existingImageUrl
}: Props) => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
    if (!existingImageUrl && !networksLoading) {
        form.resetFields(['imageUrl']); 
    }
}, [existingImageUrl, networksLoading, form]);
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
                <Form.Item 
                name="imageUrl" 
                label="Іконка активу"
                rules={[{ required: !existingImageUrl, message: 'Завантажте іконку' }]}
            >
                <AssetImageUpload existingUrl={existingImageUrl} />
            </Form.Item>
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
