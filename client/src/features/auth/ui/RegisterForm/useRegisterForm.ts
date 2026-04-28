import { useState } from 'react';
import { useRegisterMutation } from '../../../../app/services/auth'; 
import { getErrors, ErrorValidator } from '../../../../utils/get-errors';
import { RegisterData } from '../../types';

export const useRegisterForm = (onSuccess: () => void) => {
	const [registerUser, { isLoading }] = useRegisterMutation();
		const [errors, setErrors] = useState<ErrorValidator[]>([]);
	
		const onFinish = async (data: RegisterData) => {
			try {
				await registerUser(data).unwrap()
				onSuccess();
			} catch (error) {
				setErrors(getErrors(error));
			}
	};

	return { onFinish, isLoading, errors };
};