import { useState } from "react";
import { Form, Typography, Space, Button } from "antd";
import { CustomInput } from "../../inputs/custom-input";
import { PasswordInput } from "../../inputs/password-input";
import { useRegisterMutation } from "../../../app/services/auth";
import { ErrorValidator, getErrors } from "../../../utils/get-errors";
import { ErrorMessage } from "../../error-message";
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// Ваші типи
export type RegisterData = {
	email: string;
	password: string;
	name: string;
	role: any,
	createdAt: string,
	updatedAt: string,
	// можно добавить name и т.д.
};

interface Props {
	onOpenLogin: () => void;
	onSuccess: () => void;
}

export const RegisterForm = ({ onOpenLogin, onSuccess }: Props) => {
	const navigate = useNavigate();

	const [registerUser, { isLoading }] = useRegisterMutation();
	const [errors, setErrors] = useState<ErrorValidator[]>([]);

	const register = async (data: RegisterData) => {
		try {
			await registerUser(data).unwrap()

			onSuccess();
		} catch (error) {
			setErrors(getErrors(error));
		}
	}

	return (
		<Form onFinish={register} layout="vertical">
			<Title level={2} style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>
				Реєстрація
			</Title>

			<CustomInput name="name" placeholder="Ім'я" size="large" style={{ height: '50px' }} />

			<Form.Item
				name="email"
				rules={[{ type: 'email', message: 'Вам потрібно ввести Email' }]}
				style={{ marginBottom: '15px' }}
			>
				<CustomInput type="email" name="email" placeholder="Email" size="large" style={{ height: '50px' }} />
			</Form.Item>

			<PasswordInput name="password" placeholder="Пароль" size="large" style={{ height: '50px' }} />
			<PasswordInput name="confirmPassword" placeholder="Повторіть пароль" size="large" style={{ height: '50px' }} />

			<Button
				block
				type="primary"
				htmlType="submit"
				loading={isLoading}
				size="large"
				style={{
					height: '55px',
					marginTop: '10px',
					fontSize: '18px',
					fontWeight: 'bold',
					boxShadow: '0 6px 20px rgba(0, 255, 160, 0.3)'
				}}
			>
				Зареєструватись
			</Button>

			<Space className="w-100" direction="vertical" size="large" style={{ marginTop: '1.5rem', width: '100%', textAlign: 'center' }}>
				<div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
					<Text style={{ color: 'rgba(255,255,255,0.6)' }}>Маєш аккаунт?</Text>
					<span
						onClick={onOpenLogin}
						style={{ color: '#00FFA0', fontWeight: 'bold', cursor: 'pointer' }}
					>
						Увійти
					</span>
				</div>
				<ErrorMessage errors={errors} />
			</Space>
		</Form>
	);
};
