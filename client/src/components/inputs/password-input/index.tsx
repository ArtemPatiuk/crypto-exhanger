import { Form, Input } from 'antd';
import { PasswordProps } from 'antd/es/input';

import { ruleRequiredField } from '../custom-input';

interface Props extends PasswordProps {
  name: string;
}

export const PasswordInput = ({ name, ...props }: Props) => {
  return (
    <Form.Item
      name={name}
      hasFeedback
      rules={[
        ...ruleRequiredField,
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value) {
              return Promise.resolve();
            }

            if (name === 'confirmPassword' && getFieldValue('password') !== value) {
              return Promise.reject(new Error('Паролі повинні співпадати'));
            } else if (value.length < 6) {
              return Promise.reject(new Error('Довжина пароля має бути більше 6-ти символів'));
            }

            return Promise.resolve();
          },
        }),
      ]}
    >
      <Input.Password size="large" {...props} />
    </Form.Item>
  )
}
