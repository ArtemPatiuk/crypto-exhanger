import { ExchangeRequest } from "../../../app/types/exhangerequest";
import { Button, Form, Space, Spin, Row, Col, Radio, RadioChangeEvent, InputNumber, List, Input } from "antd";
import { ErrorValidator } from "../../../utils/get-errors";
import { useGetAllAssetsQuery } from "../../../app/services/assets";
import { useState, useEffect } from "react";
import useBinance from "../../../app/hooks/use-binance";
import { MoneyCollectOutlined } from '@ant-design/icons';

type Props<T> = {
  onFinish: (value: T) => void;
  btnText: string;
  title: string;
  errors?: ErrorValidator[];
  exchange?: T;
};
export const ExchangeForm = ({ onFinish, title, btnText, errors, exchange }: Props<ExchangeRequest>) => {
  const { data, isLoading } = useGetAllAssetsQuery();

  const [assetFromId, setAssetFromId] = useState<{ id: string, coin: string, networkSignature: string, address: string, imageUrl?: string, depositDust: number } | null>(null);
  const [assetToId, setAssetToId] = useState<{ id: string, coin: string, networkSignature: string, imageUrl?: string, withdrawMin: number, withdrawFee: number } | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | undefined>(undefined);
  const [amount, setAmount] = useState<number | undefined>();
  const [totalSum, setTotalSum] = useState<number | undefined>();
  const [commission, setCommission] = useState<number | undefined>();
  const [isExchangeRateLoading, setIsExchangeRateLoading] = useState<boolean>(false);

  const isSameAsset = assetFromId?.coin === assetToId?.coin;


  const { coursesInfo, reversed, resetFetch } = useBinance(assetFromId?.coin || '', assetToId?.coin || '');

  const [form] = Form.useForm();

  useEffect(() => {
    if (assetFromId && assetToId) {
      setIsExchangeRateLoading(true);
    }
  }, [assetFromId, assetToId]);

  useEffect(() => {
    if (isSameAsset) {
      setExchangeRate(1);
      form.setFieldsValue({ exchangeRate: '1' });
      setIsExchangeRateLoading(false);
    } else if (coursesInfo) {
      const rate = parseFloat(coursesInfo.price);
      setExchangeRate(rate);
      form.setFieldsValue({ exchangeRate: rate });
      if (!reversed) {
        setExchangeRate(rate);
        form.setFieldsValue({ exchangeRate: rate });
      } else if (reversed) {
        const reversedRate = (1 / rate).toFixed(6)
        setExchangeRate(parseFloat(reversedRate));
        form.setFieldsValue({ exchangeRate: reversedRate });
      } else {
        setExchangeRate(rate);
        form.setFieldsValue({ exchangeRate: rate });
      }
      setIsExchangeRateLoading(false);
    }
  }, [coursesInfo, form, assetFromId, assetToId, isSameAsset, reversed]);

  useEffect(() => {
    if (amount !== undefined && exchangeRate !== undefined && assetFromId && assetToId) {
      const rate = !reversed ? exchangeRate : 1 / exchangeRate;

      const calculatedTotalSum = !reversed
        ? amount * rate
        : amount / rate;

      const calculatedCommission = calculatedTotalSum * 0.05;
      const networkCommission = assetToId.withdrawFee;
      const totalSumAfterCommission = calculatedTotalSum - calculatedCommission - networkCommission;

      setTotalSum(totalSumAfterCommission);
      setCommission(calculatedCommission);

      form.setFieldsValue({
        totalSum: totalSumAfterCommission.toFixed(9),
        commission: calculatedCommission.toFixed(9),
      });

      form.validateFields(['totalSum']);
    } else {
      setTotalSum(undefined);
      setCommission(undefined);
      form.setFieldsValue({
        totalSum: undefined,
        commission: undefined,
      });
    }
  }, [amount, exchangeRate, assetFromId, assetToId, form, reversed]);

  const handleSelectAssetFrom = ({ target: { value } }: RadioChangeEvent) => {
    const selectedAsset = data?.find(asset => asset.id === value);
    if (selectedAsset) {
      setAssetFromId({
        id: selectedAsset.id,
        coin: selectedAsset.coin,
        networkSignature: selectedAsset.networkSignature,
        address: selectedAsset.address,
        depositDust: selectedAsset.depositDust,
        imageUrl: selectedAsset.imageUrl || undefined,
      });
      form.setFieldsValue({
        exchangeRate: null,
        assetFromName: selectedAsset.coin,
        assetFromNetwork: selectedAsset.networkSignature,
        assetAddress: selectedAsset.address,
      });
      resetFetch();
      setAmount(undefined);
      setTotalSum(undefined);
      setExchangeRate(undefined);
      setCommission(undefined);
      setIsExchangeRateLoading(false);
      form.resetFields(['amount', 'totalSum', 'exchangeRate', 'commission']);
    }
  };

  const handleSelectAssetTo = ({ target: { value } }: RadioChangeEvent) => {
    const selectedAsset = data?.find(asset => asset.id === value);
    if (selectedAsset) {
      setAssetToId({
        id: selectedAsset.id,
        coin: selectedAsset.coin,
        networkSignature: selectedAsset.networkSignature,
        withdrawMin: selectedAsset.withdrawMin,
        withdrawFee: selectedAsset.withdrawFee,
        imageUrl: selectedAsset.imageUrl || undefined,
      });
      form.setFieldsValue({
        exchangeRate: null,
        assetToName: selectedAsset.coin,
        assetToNetwork: selectedAsset.networkSignature,
      });
      resetFetch();
      setAmount(undefined);
      setTotalSum(undefined);
      setExchangeRate(undefined);
      setCommission(undefined);
      setIsExchangeRateLoading(false);
      form.resetFields(['amount', 'totalSum', 'exchangeRate', 'commission']);
    }
  };

  const handleAmountChange = (value: number | null) => {
    if (value !== null) {
      setAmount(value);
      form.validateFields(['amount']);
    } else {
      setAmount(undefined);
      setTotalSum(undefined);
      setCommission(undefined);
      form.setFieldsValue({
        totalSum: undefined,
        commission: undefined,
      });
    }
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  const showExchangeRateBlock = assetFromId && assetToId && exchangeRate !== undefined;

  interface CustomInputProps {
    imageUrl?: string;
    type: string;
    name: string;
    placeholder?: string;
  }
  const CustomInputWithImage: React.FC<CustomInputProps> = ({ imageUrl, ...rest }) => {
    return (
      <Input
        {...rest}
        suffix={
          imageUrl ? (
            <img
              src={imageUrl}
              alt="Recipient"
              style={{ width: "30px", height: "30px", marginRight: "10px" }}
            />
          ) : null
        }
      />
    );
  };
  return (
    <div style={{ padding: "10px" }}>
      <Form form={form} name="exchange-form" initialValues={exchange} onFinish={onFinish} style={{ width: "100%" }} layout="horizontal">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8} style={{ padding: "10px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Form.Item
                name="amount"
                required
                extra={`Мін.сума депозиту ${(assetFromId?.depositDust)?.toFixed(8) || 0}`}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || value >= (assetFromId?.depositDust || 0)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(`Сума не може бути меншою за ${(assetFromId?.depositDust)?.toFixed(8) || 0}`));
                    },
                  },
                ]}
              >
                <InputNumber placeholder="К-сть криптовалюти" style={{ width: "100%", borderRadius: "14px", fontSize: "16px" }} onChange={handleAmountChange}

                />
              </Form.Item>
              <Form.Item name="assetFromId" required style={{ width: "100%" }}>
                <List dataSource={data} bordered renderItem={asset => (
                  <List.Item key={asset.id} style={{ width: "100%" }}>
                    <Radio.Group onChange={handleSelectAssetFrom} value={assetFromId?.id} style={{ width: "100%" }}>
                      <Radio.Button value={asset.id} style={{ width: "100%", border: "none" }}>
                        {asset.imageUrl ? (
                          <img
                            src={asset.imageUrl}
                            alt={asset.coin}
                            style={{ width: "30px", height: "30px", marginRight: "10px" }}
                          />
                        ) : (
                          <MoneyCollectOutlined style={{ fontSize: '30px', marginRight: '10px' }} />
                        )}
                        {asset.coin} {asset.networkSignature}
                      </Radio.Button>
                    </Radio.Group>
                  </List.Item>
                )} />
              </Form.Item>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ padding: "10px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Form.Item
                name="totalSum"
                extra={`Мін.сума виводу ${assetToId?.withdrawMin || 0}`}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || value >= (assetToId?.withdrawMin || 0)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(`Сума не може бути меншою за ${assetToId?.withdrawMin || 0}`));
                    },
                  },
                ]}
              >
                <InputNumber placeholder="Загальна сума" value={totalSum} style={{ width: "100%", borderRadius: "14px", fontSize: "16px" }} readOnly />
              </Form.Item>

              <Form.Item name="assetToId" required>
                <List dataSource={data} bordered renderItem={asset => (
                  <List.Item key={asset.id} style={{ width: "100%" }}>
                    <Radio.Group onChange={handleSelectAssetTo} value={assetToId?.id} style={{ width: "100%" }}>
                      <Radio.Button value={asset.id} style={{ width: "100%", background: "none", border: "none" }}>
                        {asset.imageUrl ? (
                          <img
                            src={asset.imageUrl}
                            alt={asset.coin}
                            style={{ width: "30px", height: "30px", marginRight: "10px" }}
                          />
                        ) : (
                          <MoneyCollectOutlined style={{ fontSize: '30px', marginRight: '10px' }} />
                        )}
                        {asset.coin} {asset.networkSignature}
                      </Radio.Button>
                    </Radio.Group>
                  </List.Item>
                )} />
              </Form.Item>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space direction="vertical" style={{ width: "100%", border: "1px solid #d9d9d9", borderRadius: "8px", padding: "10px" }}>
                {showExchangeRateBlock ? (
                  <>
                    <div style={{ alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {assetFromId?.imageUrl ? (
                          <img
                            src={assetFromId.imageUrl}
                            alt={assetFromId.coin}
                            style={{ width: "30px", height: "30px", marginRight: "10px" }}
                          />
                        ) : (
                          <Spin size="large" />
                        )}
                        <span>{assetFromId?.coin} {assetFromId?.networkSignature}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                        {assetToId?.imageUrl ? (
                          <img
                            src={assetToId.imageUrl}
                            alt={assetToId.coin}
                            style={{ width: "30px", height: "30px", marginRight: "10px" }}
                          />
                        ) : (
                          <Spin size="large" />
                        )}
                        <span>{assetToId?.coin} {assetToId?.networkSignature}</span>
                      </div>
                    </div>
                    <div>
                      <Form.Item name="exchangeRate" label="Курс">
                        {isExchangeRateLoading ? (
                          <Spin size="large" />
                        ) : (
                          <InputNumber placeholder="Курс обміну" value={exchangeRate} style={{ width: "100%", borderRadius: "14px", fontSize: "16px" }} readOnly />
                        )}
                      </Form.Item>
                      <Form.Item name="commission" label="Комісія" extra={`+ Комісія мережі ${assetToId.networkSignature}`}>
                        <InputNumber placeholder="Комісія" style={{ width: "100%", borderRadius: "14px", fontSize: "16px" }} value={commission} readOnly />
                      </Form.Item>
                    </div>

                  </>
                ) : (
                  <>
                    <Spin size="large"></Spin>
                  </>
                )}
              </Space>
              <div style={{ width: "100%", border: "1px solid #d9d9d9", borderRadius: "8px", padding: "10px", backgroundColor: "gray" }}>
                <p style={{ fontStyle: "italic" }}>Курс обміну фіксується за останнім підтвердженням мережі обраної вами монети, за курсами біржі Binance.</p>
              </div>
              <Form.Item name="recipientAddress">
                <CustomInputWithImage type="text" name="recipientAddress" placeholder="Адреса для отримання" imageUrl={assetToId?.imageUrl}></CustomInputWithImage>
              </Form.Item>
              <Button htmlType="submit" type="primary" block>
                {btnText}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};