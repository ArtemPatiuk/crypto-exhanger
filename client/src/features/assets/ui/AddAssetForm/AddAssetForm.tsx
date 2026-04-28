import { AvailableCoin, AvailableNetworkByCoin, IAsset } from "../../../../app/types/asset";
import { Button, Card, Form, Space, Input, notification, Select, Typography } from "antd";
import { CustomInput } from "../../../../components/inputs/custom-input";
import { ErrorMessage } from "../../../../components/error-message";
import { ErrorValidator } from "../../../../utils/get-errors";
import { AssetImageUpload } from '../../../../components/ui/AssetImageUpload';
import { useEffect } from 'react';
import styles from './index.module.css';

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
    existingImageUrl?: string
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
        <div className={styles['formContainer']}>
            <Typography.Title level={3} className={styles.formTitle}>
                {title}
            </Typography.Title>
            {contextHolder}
            <Form name="asset-form"
                form={form}
                layout="vertical"
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
                        placeholder="Доступні монети"
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
                        placeholder="Виберіть мережу"
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
                    noStyle
                    rules={[{ required: !existingImageUrl, message: 'Завантажте іконку' }]}
                >
                    <AssetImageUpload existingUrl={existingImageUrl} />
                </Form.Item>
                <Form.Item className={styles['submitWrapper']}>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    block // Кнопка на всю ширину выглядит солиднее
                    className={styles['submitBtn']}
                >
                    Створити актив
                </Button>
            </Form.Item>
            </Form>
            <div style={{ marginTop: "10px" }}>
                <ErrorMessage errors={errors} />
            </div>
        </div>
    )
}
