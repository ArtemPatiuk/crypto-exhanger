import { Alert, AlertProps,notification } from 'antd';

import { ErrorValidator } from '../../utils/get-errors';
import { SimpleErrorMessage } from './simple-error-message';

interface Props extends AlertProps {
    message?: string;
    errors?: ErrorValidator[];
}

export const ErrorMessage = ({ message, errors, type = 'error', ...props }: Props) => {
    if (message) {
        return <Alert {...props} type={type} message={message} />;
    }

    if (!errors || errors.length === 0) {
        return null;
    }

    return (
        <Alert
            {...props}
            type={type}
            message={<SimpleErrorMessage errors={errors} />}
        />
    );
}
