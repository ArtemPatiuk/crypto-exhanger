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
  
  return (
    <div>
      
    </div>
  )
};