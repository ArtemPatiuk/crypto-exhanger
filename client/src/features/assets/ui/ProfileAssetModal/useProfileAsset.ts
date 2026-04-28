import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useGetAssetByIdQuery, useRemoveAssetMutation, useEditAssetMutation } from '../../../../app/services/assets';
import { getErrors } from '../../../../utils/get-errors';
import { selectProfileModalState, setProfileModalOpen } from '../../assetsSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/store';

export const useProfileAsset = () => {
    const dispatch = useAppDispatch();
    const { isOpen, id } = useAppSelector(selectProfileModalState);

    const [status, setStatus] = useState<boolean | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const { data, isLoading } = useGetAssetByIdQuery(id!, { skip: !id });
    const [updateAsset, { isLoading: updating }] = useEditAssetMutation();
    const [removeAsset, { isLoading: deleting }] = useRemoveAssetMutation();

  useEffect(() => {
        if (data && isOpen) {
            setStatus(data.isActive);
            setIsDirty(false);
        }
    }, [data?.id, isOpen]);

    const handleStatusChange = (checked: boolean) => {
        setStatus(checked);
        setIsDirty(true); 
    };

    const handleUpdateStatus = async () => {
        if (!data || status === null) return;
        try {
            await updateAsset({ id: data.id, isActive: status }).unwrap();
            api.success({ message: "Статус змінено" });
            setIsDirty(false);
        } catch (error) {
            getErrors(error);
        }
    };
        const handleClose = () => {
        dispatch(setProfileModalOpen({ open: false, id: null }));
        setStatus(null); 
    };


    const handleDelete = async () => {
        if (!data) return;
        try {
            await removeAsset(data.id).unwrap();
            api.success({ message: "Актив видалено" });
            setDeleteModalOpen(false);
            handleClose();
        } catch (error) {
            getErrors(error);
        }
    };

   return {
        data, isLoading, status, isDirty,
        handleStatusChange, handleUpdateStatus,
        handleClose, isOpen, contextHolder,
        deleteModalOpen, setDeleteModalOpen, updating, handleDelete, deleting
    };
};