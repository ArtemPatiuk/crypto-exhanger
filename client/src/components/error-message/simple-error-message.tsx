import { ErrorValidator } from '../../utils/get-errors';

interface Props {
    errors: ErrorValidator[];
}

export const SimpleErrorMessage = ({ errors }: Props) => {
    if (!errors || errors.length === 0) {
        return null;
    }

    return (
        <div>
            {errors.map((item, index) => (
                <p key={index}>{item.msg}</p>
            ))}
        </div>
    );
}
