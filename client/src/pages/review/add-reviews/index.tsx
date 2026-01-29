import { Row, notification } from 'antd'
import { useEffect, useState } from 'react'
import { ReviewForm } from '../../../components/form-reviews'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { Paths } from '../../../paths';
//import { Review } from '@prisma/client';
import { ErrorValidator, getErrors } from '../../../utils/get-errors';
import { useAddReviewMutation } from '../../../app/services/reviews';



export const AddReviews = () => {
    const [errors, setError] = useState<ErrorValidator[]>([]);
    const [api, contextHolder] = notification.useNotification();

    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const [addReview] = useAddReviewMutation()


    useEffect(() => {
        if (!user) {
            api.info({
                message: 'Попередження!',
                description: "Щоб створити відгук потрібно авторизуватись в системі.",
            });
        }
        const successMessage = localStorage.getItem('reviewSuccessMessage');
        if (successMessage) {
            api.success({
                message: 'Вітаю!',
                description: successMessage,
            });
            localStorage.removeItem('reviewSuccessMessage');
        }
    }, [user, api]);

    const handleAddReview = async (tmp: any) => {
        try {
            await addReview(tmp).unwrap();
            localStorage.setItem('reviewSuccessMessage', "Відгук успішно створено");
            window.location.reload();
        } catch (err) {
            setError(getErrors(errors));
        }
    }

    return (
        <div>
            {contextHolder}
            <Row align="middle" justify="center">
                {user ?
                    <>
                        <ReviewForm
                            title='Додати новий відгук'
                            btnText='Створити'
                            onFinish={handleAddReview}
                            errors={errors}
                        />
                    </>
                    :
                    <>

                    </>}
            </Row>
        </div>
    )
}
