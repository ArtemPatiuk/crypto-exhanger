import { useEffect } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';

export const Admin = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);


  useEffect(() => {
    if (!user) return; 

    if (!user.role?.includes("ADMIN")) {
      navigate(Paths.home);
    }
  }, [user, navigate]);





  const goToListAssets = () => {
    navigate(Paths.assetsList)
  }
  const goToListExchanges = () => {
    navigate(Paths.exchangesList)
  }
  return (
    <div style={{ minHeight: '67vh' }}>
      <Button
        onClick={goToListAssets}
        title="Керування активами"
        style={{ marginRight: "5px" }}
      >
        Керування активами
      </Button>
      <Button
        onClick={goToListExchanges}
        title="Перейти в список обмінів"
      >
        Керування активами
      </Button>
    </div>
  );
}

export default Admin;