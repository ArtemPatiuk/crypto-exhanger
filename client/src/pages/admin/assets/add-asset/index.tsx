import { Row } from 'antd'
import { useEffect, useState } from 'react'
import { AssetForm } from '../../../../components/forms/form-asset'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { useAddAssetMutation, useGetListAvailableCoinQuery, useGetListAvailableNetworkQuery } from '../../../../app/services/assets';
import { Paths } from '../../../../paths';
import { ICoin } from '../../../../app/types/asset';
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';




export const AddAssets = () => {
    const [errors, setError] = useState<ErrorValidator[]>([]);

    const { data: coins, isLoading } = useGetListAvailableCoinQuery();
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
    const { data: networks, isLoading: networkLoading } = useGetListAvailableNetworkQuery(selectedCoin!, {
        skip:!selectedCoin
    })

    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [AddAssets] = useAddAssetMutation();

    useEffect(() => {
        if (!user) {
            navigate(Paths.home)
        }
    }, [navigate, user])


    const handleAddAsset = async (data: ICoin) => {
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
                    onFinish={handleAddAsset}
                    errors={errors}
                    coins={coins || []}
                    networks={networks}
                    networksLoading={networkLoading}
                    onCoinChange={setSelectedCoin}
                    
                />
            </Row>
        </div>
    )
}
