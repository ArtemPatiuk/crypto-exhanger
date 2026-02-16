import { Modal, Typography } from 'antd';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { selectIsAuthModalOpen, selectUser, setAuthModalOpen } from '../../features/auth/authSlice';
import { LoginForm } from '../login-form';
import { RegisterForm } from '../register-form';

const { Title } = Typography;

export const AuthModal = () => {
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector(selectIsAuthModalOpen);
	const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
	const user = useAppSelector(selectUser);

	const handleClose = () => dispatch(setAuthModalOpen(false));


	return (
		<Modal
			open={isOpen}
			onCancel={handleClose}
			footer={null}
			centered
			destroyOnClose
			width={550}
			mask={true}
			maskClosable={true}
			maskStyle={{
				backdropFilter: 'blur(10px)',
				backgroundColor: 'rgba(0, 0, 0, 0.6)'
			}}
			bodyStyle={{
				padding: '20px 40px 40px 40px',
				backdropFilter: 'blur(20px)',
			}}
			style={{
				borderRadius: '20px',
				overflow: 'hidden',
				border: '1px solid rgba(255, 255, 255, 0.15)',
				boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
			}}
		>
			{authMode === 'login' ? (
				<LoginForm
					onSuccess={handleClose}
					onOpenRegister={() => setAuthMode('register')}
				/>
			) : (
				<RegisterForm
					onSuccess={handleClose}
					onOpenLogin={() => setAuthMode('login')}
				/>
			)}
		</Modal>
	);
};
