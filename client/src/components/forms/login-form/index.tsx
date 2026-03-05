import { Form, Typography, Space, Button } from "antd";
import { CustomInput } from "../../inputs/custom-input";
import { PasswordInput } from "../../inputs/password-input";
import { ErrorMessage } from "../../error-message";
import { useState } from 'react';
import { useLoginMutation, UserData } from "../../../app/services/auth";
import { getErrors, ErrorValidator } from "../../../utils/get-errors";


const { Title, Text } = Typography;
type Props = {
	onOpenRegister: () => void;
	onSuccess: () => void;
};



export const LoginForm = ({ onOpenRegister, onSuccess }: Props) => {
	const [loginUser, { isLoading }] = useLoginMutation();
	const [errors, setErrors] = useState<ErrorValidator[]>([]);

	const onFinish = async (data: UserData) => {
		try {
			await loginUser(data).unwrap();
			onSuccess();
		} catch (error) {
			setErrors(getErrors(error));
		}
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

			<Space className="w-100" direction="vertical" size="large" style={{ marginTop: '2rem', width: '100%', textAlign: 'center' }}>
				<Typography.Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>
					Не маєш аккаунту?
					<span onClick={onOpenRegister} style={{ color: '#00FFA0', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}>
						Sign out
					</span>
				</Typography.Text>
				<ErrorMessage errors={errors} />
			</Space>
		</Form>
	);
};
