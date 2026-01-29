
import { Review } from "../../app/types/review";
import { Button, Card, Form, Space, Input, Row, Col } from "antd";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { ErrorValidator } from "../../utils/get-errors";
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { UserOutlined } from '@ant-design/icons';


const { TextArea } = Input;



type Props<T> = {
    onFinish: (value: T) => void;
    btnText: string;
    title: string;
    errors?: ErrorValidator[];
    review?: T;
}

export const ReviewForm = ({
    onFinish,
    btnText,
    errors,
    review: reviews
}: Props<Review>) => {

    const user = useSelector(selectUser);

    return (
        <Card style={{ width: "40rem",backgroundColor:"#1f1f1f" }}>
            <Form name="review-form" onFinish={onFinish} layout="vertical" requiredMark="optional" initialValues={{ ...reviews, user: user?.email }}>
                <Form.Item name="user" label="Ваша пошта">
                    <CustomInput name="user" readOnly prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item name="text" label="Введіть текст відгуку" rules={[{ required: true, message: 'Будь ласка, введіть текст відгуку' }]}>
                    <TextArea autoSize placeholder="Поділіться з нами своїми враженями про користування нашим додатком ..." maxLength={200} />
                </Form.Item>
                <Space style={{ justifyContent: "center", alignItems: "center" }}>
                    <ErrorMessage errors={errors} />
                    <Button htmlType="submit" style={{ marginTop: "10px" }}>
                        {btnText}
                    </Button>
                </Space>
            </Form>
        </Card>
    )
}