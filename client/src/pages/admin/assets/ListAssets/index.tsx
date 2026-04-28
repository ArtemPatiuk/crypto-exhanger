import React from 'react';
import { Table, Row, Col, Card, Statistic } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { useListAssets } from '../../../../features/assets/ui/AssetTable/useListAssets';
import styles from './index.module.css';
import { AssetTable } from '../../../../features/assets/ui/AssetTable/AssetTable';
import { AddAssetModal } from '../../../../features/assets/ui/AddAssetModal/AddAssetModal';

export const ListAssets = () => {
  const { actions, data, status, state } = useListAssets();

  return (
    <div className={styles['pageContainer']}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card
            className={styles['assetCard']}
            onClick={() => actions.setIsModalOpenCreate(true)}
            hoverable
          >
            <PlusSquareOutlined className={styles['addIcon']} />
            <div className={styles['addText']}>Додати актив</div>
          </Card>
        </Col>

        <Col span={8}>
          <Card className={styles['assetCard']}>
            <Statistic
              title="Активні активи"
              value={data.stats?.activeAssets ?? 0}
              loading={status.isLoadingCount}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card className={styles['assetCard']}>
            <Statistic
              title="Всього активів"
              value={data.stats?.allAssets ?? 0}
              loading={status.isLoadingCount}
            />
          </Card>
        </Col>
      </Row>

      <AssetTable />

      <AddAssetModal
				open={state.isModalOpenCreate}
				onClose={() => actions.setIsModalOpenCreate(false)}
			/>
    </div>
  );
};

export default ListAssets;