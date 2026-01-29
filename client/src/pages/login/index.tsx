import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Row, Typography, Space, Button } from "antd";

import { CustomInput } from "../../components/custom-input";
import { PasswordInput } from "../../components/password-input";
import { Paths } from "../../paths";
import { UserData, useLoginMutation } from "../../app/services/auth";
import { ErrorValidator, getErrors } from "../../utils/get-errors";
import { ErrorMessage } from "../../components/error-message";

export const Login = () => {
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginMutation();
  const [errors, setErrors] = useState<ErrorValidator[]>([]);

  const login = async (data: UserData) => {
    try {
      const response = await loginUser(data).unwrap();
 
      // сохраняем токен
      localStorage.setItem("token", response.accessToken);

      navigate("/");
    } catch (error) {
      setErrors(getErrors(error));
    }
  }

  return (
    <Row align="middle" justify="center" style={{ minHeight: '67vh' }}>
      <Card title="Увійти" style={{ width: "30rem" }}>

        <Form onFinish={login} className="NalarLox">
          <CustomInput
            type="email"
            name="email"
            placeholder="Email"
          />
          <PasswordInput
            name="password"
            placeholder="Пароль"
          />
          <Button
            block
            className="mb-3"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Увійти
          </Button>
        </Form>

        <Space className="w-100" direction="vertical" size="large">
          <div className="d-flex justify-content-between gap-3">
            <Typography.Text>Не маєш аккаунт?</Typography.Text>
            <Link to={Paths.register}>Зареєструватись</Link>
          </div>
          <ErrorMessage errors={errors} />
        </Space>

      </Card>
    </Row>
  )
}