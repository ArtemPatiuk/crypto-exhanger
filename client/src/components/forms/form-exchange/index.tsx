import { ExchangeRequest } from "../../../app/types/exhangerequest";
import { ErrorValidator } from "../../../utils/get-errors";

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