import React, { useState, useEffect, useCallback } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useUploadImageMutation } from '../../app/services/files';



interface Props {
  value?: string;
  onChange?: (fileName: string) => void;
  existingUrl?: string;
}

export const AssetImageUpload: React.FC<Props> = ({ value, onChange, existingUrl }) => {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [localPreview, setLocalPreview] = useState<string | null>(null);

 useEffect(() => {
    setLocalPreview(null);
  }, [existingUrl]);

  const displayUrl = localPreview || existingUrl;

  const handleUpload = useCallback(async (options: any) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadImage(formData).unwrap();
      if (onChange) onChange(response.fileName);

      setLocalPreview(URL.createObjectURL(file as File));
      onSuccess("ok");
    } catch (err) {
      onError(err);
    }
  }, [uploadImage, onChange]);

  return (
    <Upload
      listType="picture-card"
      showUploadList={false}
      customRequest={handleUpload}
      accept="image/*"
      fileList={[]}
    >
     {displayUrl ? (
        <img src={displayUrl} alt="avatar" style={{ width: '100%', borderRadius: '8px' }} />
      ) : (
        <div>
          {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Завантажити</div>
        </div>
      )}
    </Upload>
  );
};