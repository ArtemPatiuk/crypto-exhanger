import { Form, Input, InputProps } from "antd"
import { Rule } from 'antd/es/form';

export const ruleRequiredField: Rule[] = [{ required: true, message: "Обов'язкове поле" }];

interface Props extends InputProps {
  name: string;
  label?: string;
}

export const CustomInput = ({ name, label, ...props }: Props) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={ruleRequiredField}
      shouldUpdate={true}
    >
      <Input {...props} />
    </Form.Item>
  )
}
