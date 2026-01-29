import { Row } from 'antd'
import { useEffect, useState } from 'react'
import { AssetForm } from '../../../../components/form-asset'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { useAddAssetMutation } from '../../../../app/services/assets';
import { Paths } from '../../../../paths';
import { IAsset } from '../../../../app/types/asset';
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';

export const AddAssets = () => {
    const [errors, setError] = useState<ErrorValidator[]>([]);


    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [AddAssets] = useAddAssetMutation();

    useEffect(() => {
        if (!user) {
            navigate(Paths.home)
        }
    }, [navigate, user])


    const handleAddAsset = async (data: IAsset) => {
        try {
            await AddAssets(data).unwrap();
            localStorage.setItem('createSuccessAssets', 'Актив успішно створено!');
            navigate(`${Paths.admin}/assets`);
        } catch (err) {
            setError(getErrors(err));
        }
    }

    return (
        <div style={{ minHeight: '67vh' }}>
            <Row align="middle" justify="center">
                <AssetForm
                    title='Додати новий актив'
                    btnText='Додати'
                    onFinish={handleAddAsset}
                    errors={errors}
                />
            </Row>
        </div>
    )
}
