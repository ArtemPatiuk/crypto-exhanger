import { Form, Typography, Space, Button,Divider } from "antd";
import { CustomInput } from "../../../../components/inputs/custom-input";
import { PasswordInput } from "../../../../components/inputs/password-input";
import { ErrorMessage } from "../../../../components/error-message";
import { useLoginForm } from './useLoginForm';
import { GoogleOutlined } from "@ant-design/icons";
import style from './index.module.css'

const { Title } = Typography;
type Props = {
	onOpenRegister: () => void;
	onSuccess: () => void;
};

export const LoginForm = ({ onOpenRegister, onSuccess }: Props) => {
	const { onFinish, isLoading, errors } = useLoginForm(onSuccess);

	const handleGoogleLogin = () => {
        window.location.href = "http://my-dev-site.com:8000/api/auth/google";
    };

	return (
		<Form onFinish={onFinish} layout="vertical" style={{ marginTop: '20px' }}>
			<Title level={2} style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>
				Вхід
			</Title>

			<CustomInput type="email" name="email" placeholder="Email" size="large" style={{ height: '55px' }} />
			<PasswordInput name="password" placeholder="Пароль" size="large" style={{ height: '55px' }} />

			<Button block type="primary" htmlType="submit" loading={isLoading} size="large"
                style={{ height: '60px', marginTop: '20px', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 6px 20px rgba(0, 255, 160, 0.4)' }}>
                Увійти
            </Button>

            <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)' }}>
                або
            </Divider>
            <Button 
                block
                size="large"
                icon={<GoogleOutlined />}
                onClick={handleGoogleLogin}
                className={style['googleLoginBtn']}
            >
                Продовжити з Google
            </Button>

			<Space className="w-100" direction="vertical" size="large" style={{ marginTop: '2rem', width: '100%', textAlign: 'center' }}>
				<Typography.Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>
					Не маєш аккаунт?
					<span onClick={onOpenRegister} style={{ color: '#00FFA0', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}>
						Зареєструватись
					</span>
				</Typography.Text>
				<ErrorMessage errors={errors} />
			</Space>
		</Form>
	);
};
