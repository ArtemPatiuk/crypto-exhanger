import { useState } from 'react';
import { useLoginMutation } from '../../../../app/services/auth';
import { getErrors, ErrorValidator } from '../../../../utils/get-errors'; 

export const useLoginForm = (onSuccess: () => void) => {
    const [loginUser, { isLoading }] = useLoginMutation();
    const [errors, setErrors] = useState<ErrorValidator[]>([]);

    const onFinish = async (data: any) => {
        try {
            await loginUser(data).unwrap();
            onSuccess();
        } catch (error) {
            setErrors(getErrors(error));
        }
    };

    return { onFinish, isLoading, errors };
};