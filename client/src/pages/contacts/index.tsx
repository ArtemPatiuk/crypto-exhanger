import { Row, Col, Typography, Space, Breadcrumb, Card } from 'antd';
import { MailOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const {Text } = Typography;

const ContactPage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#141414', minHeight: '67vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Breadcrumb style={{ fontSize: '35px', color: '#fff' }} items={[{ title: 'Контакти' }]} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          style={{
            width: '100%',
            maxWidth: '800px',
            backgroundColor: '#1f1f1f',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            color: '#fff',
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Space size="large">
                <MailOutlined style={{ fontSize: '24px', color: '#08c' }} />
                <div>
                  <Text strong style={{ color: '#fff' }}>Email</Text>
                  <br />
                  <Text style={{ color: '#ccc' }}>ipz203_pai@student.ztu.edu.ua</Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Space size="large">
                <ClockCircleOutlined style={{ fontSize: '24px', color: '#08c' }} />
                <div>
                  <Text strong style={{ color: '#fff' }}>Розпорядок роботи</Text>
                  <br />
                  <Text style={{ color: '#ccc' }}>Час роботи оператора пн-сб з 10:00 до 22:00 (Київ). У разі виникнення питань у неробочий час, питання та заявки будуть опрацьовані наступного дня.</Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Space size="large">
                <UserOutlined style={{ fontSize: '24px', color: '#08c' }} />
                <div>
                  <Text strong style={{ color: '#fff' }}>Telegram</Text>
                  <br />
                  <a href="https://t.me/DaddyKapp" target="_blank" rel="noopener noreferrer" style={{ color: '#08c' }}>Зв'язатись з адміністоратором</a>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
