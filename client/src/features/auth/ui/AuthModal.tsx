import { Modal } from 'antd';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { selectIsAuthModalOpen, setAuthModalOpen } from '../authSlice';
import { LoginForm } from './LoginForm/LoginForm';
import { RegisterForm } from './RegisterForm/RegisterForm';

export const AuthModal = () => {
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector(selectIsAuthModalOpen);
	const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

	const handleClose = () => {
		dispatch(setAuthModalOpen(false));
		setTimeout(() => setAuthMode('login'), 300);
	};

	return (
		<Modal
			className="auth-modal"
			open={isOpen}
			onCancel={handleClose}
			footer={null}
			centered
			destroyOnClose
			width={550}
			mask={true}
			maskClosable={true}
			maskStyle={{
				backdropFilter: 'blur(20px)',
				backgroundColor: 'rgba(0, 0, 0, 0.45)'
			}}
			bodyStyle={{
				padding: '20px 40px 40px 40px',
			}}
			style={{
				borderRadius: '30px',
				overflow: 'hidden',
				border: '1px solid rgba(255, 255, 255, 0.15)',
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