import { Spin } from 'antd';
import { useCurrentQuery } from "../../app/services/auth"


export const Auth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const { isLoading, isError } = useCurrentQuery(undefined, {
    skip: !token, 
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return children
}