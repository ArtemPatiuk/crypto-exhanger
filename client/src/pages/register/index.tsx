import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Row, Typography, Space, Button } from "antd";
import { IUser } from "../../app/types/user";

import { CustomInput } from "../../components/custom-input";
import { PasswordInput } from "../../components/password-input";
import { Paths } from "../../paths";
import { useRegisterMutation } from "../../app/services/auth";
import { ErrorValidator, getErrors } from "../../utils/get-errors";
import { ErrorMessage } from "../../components/error-message";

export type RegisterData = {
  email: string;
  password: string;
  name: string;
  role:any, 
  createdAt: string, 
  updatedAt: string,
  // можно добавить name и т.д.
};

export const Register = () => {
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();
  const [errors, setErrors] = useState<ErrorValidator[]>([]);

  const register = async (data: RegisterData) => {
    try {
      await registerUser(data).unwrap()

      navigate("/");
    } catch (error) {
      setErrors(getErrors(error));
    }
  }

  return (
    <Row align="middle" justify="center" style={{ minHeight: '67vh' }}>
      <Card title="Зареєструватись" style={{ width: "30rem" }}>
        <Form onFinish={register}>
          <CustomInput name="name" placeholder="Ім'я" />
          <Form.Item name="email" rules={[
            {
              type: 'email',
              message: 'Вам потрібно ввести Email',
            },
          ]}
          >
            <CustomInput type="email" name="email" placeholder="Email" />
          </Form.Item>
          <PasswordInput name="password" placeholder="Пароль" />
          <PasswordInput name="confirmPassword" placeholder="Повторіть пароль" />
          <Button
            block
            className="mb-3"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Зареєструватись
          </Button>
        </Form>

        <Space className="w-100" direction="vertical" size="large">
          <div className="d-flex justify-content-between gap-3">
            <Typography.Text>Маєш аккаунт?</Typography.Text>
            <Link to={Paths.login}>Увійти</Link>
          </div>
          <ErrorMessage errors={errors} />
        </Space>

      </Card>
    </Row>
  )
}
