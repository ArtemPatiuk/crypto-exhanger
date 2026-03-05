import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorValidator, getErrors } from '../../../../utils/get-errors';
import { useEditAssetMutation, useGetAssetByIdQuery } from '../../../../app/services/assets';
import { Row, Spin } from 'antd';
import { AssetForm } from '../../../../components/forms/form-asset';
import {ICoin } from '../../../../app/types/asset';
import { Paths } from '../../../../paths';

export const EditAssets = () => {
    const navigate = useNavigate();
    const params = useParams<{ id: string }>()
    const [errors, setError] = useState<ErrorValidator[]>([])
    const { data, isLoading } = useGetAssetByIdQuery(params.id || "")
    const [EditAssets] = useEditAssetMutation();

    if (isLoading) {
        return <Spin size="large" />;
    }
    const handleEditAssets = async (asset: ICoin) => {
        try {
            const editedAsset = {
                ...data,
                ...asset
            };
            await EditAssets(editedAsset).unwrap();
            localStorage.setItem('editSuccessAssets', 'Актив успішно оновлено!');
            navigate(`${Paths.admin}/assets`);
        } catch (error) {
            setError(getErrors(error));
        }
    }
    
    return (
        <Row align="middle" justify="center" style={{ minHeight: '67vh' }}>
            {/* <AssetForm
                title="Редагувати актив"
                btnText="Редагувати"
                errors={errors}
                asset={data}
                onFinish={handleEditAssets}
            /> */}
        </Row>
    )
}

