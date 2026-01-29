import { IAsset } from "../../app/types/asset";
import { Button, Card, Form, Space, Input, notification } from "antd";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { ErrorValidator } from "../../utils/get-errors";

type Props<T> = {
    onFinish: (value: T) => void;
    btnText: string;
    title: string;
    errors?: ErrorValidator[];
    asset?: T;
}

export const AssetForm = ({
    onFinish,
    title,
    btnText,
    errors,
    asset
}: Props<IAsset>) => {

    const [api, contextHolder] = notification.useNotification();
    return (
        <Card title={title} style={{ width: "30rem" }}>
            {contextHolder}
            <Form name="asset-form" onFinish={onFinish} initialValues={asset}>
                <CustomInput type="text" name="coin" placeholder="Назва" />
                <Form.Item required={false}>
                    <CustomInput type="text" name="network" placeholder="Мережа" />
                </Form.Item>
                <CustomInput type="text" name="imageUrl" placeholder="Посилання на зображення" required={false} />
                <Input type="text" disabled value={"https://cryptologos.cc/"} />
                <Space style={{ justifyContent: "center", alignItems: "center" }}>
                    <Button htmlType="submit" style={{ marginTop: "10px" }}>
                        {btnText}
                    </Button>
                </Space>
            </Form>
            <div style={{ marginTop: "10px" }}>
                <ErrorMessage errors={errors} />
            </div>

        </Card>
    )
}
