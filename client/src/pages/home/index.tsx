import { Button, Row, Col, notification } from 'antd';
import { useGetAllAssetsQuery } from '../../app/services/assets';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';
import { useEffect } from 'react';
import ContactPage from '../contacts';
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { CreateExchange } from '../admin/exchanges/add-exchange';
import { ExchangeWidget } from '../../components/exchange-widget/ExchangeWidget';

const gridStyle: React.CSSProperties = {
  width: '80%',
  textAlign: 'center',
  userSelect: "none",
  marginLeft: "10%",
  display: 'flex',
  alignItems: 'center',
};

const logoStyle: React.CSSProperties = {
  width: '10%',
  marginRight: '5px',
};

const defaultSymbols = [
  {
    proName: "FOREXCOM:SPXUSD",
    title: "S&P 500",
  },
  {
    proName: "FOREXCOM:NSXUSD",
    title: "Nasdaq 100",
  },
  {
    proName: "FX_IDC:EURUSD",
    title: "EUR/USD",
  },
  {
    proName: "BITSTAMP:BTCUSD",
    title: "BTC/USD",
  },
  {
    proName: "BITSTAMP:ETHUSD",
    title: "ETH/USD",
  },
  {
    proName: "BITSTAMP:BTCUSDT",
    title: "BTC/USDT",
  },
];

//,backgroundColor:"tomato" 
export const Home = () => {
  const { data, isLoading } = useGetAllAssetsQuery();
  const reversedData = data ? [...data].reverse() : [];
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const user = useSelector(selectUser);
  const scrollToTableOrder = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const scrollToHowItWorks = () => {
    const element = document.getElementById('howItWorks');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
  const goToAddExchange = () => {
    navigate(Paths.exchangeCreate)
  }
  useEffect(() => {
    const adjustIframeStyles = () => {
      const iframe = document.querySelector('iframe[title="ticker tape TradingView widget"]');
      if (iframe) {
        (iframe as HTMLIFrameElement).style.left = '0';
        (iframe as HTMLIFrameElement).style.position = 'absolute !important';
      }
    };
    const timer = setTimeout(adjustIframeStyles, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div style={{
        padding: "0 5%"
      }}>
    
          <ExchangeWidget />
       
        {/* <div style={{ marginBottom: '20px' }}>
        <TickerTape colorTheme="dark" symbols={defaultSymbols} />
      </div> */}
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '60px' }}>
          <Col xs={24} md={12}>
            <h2 style={{ fontSize: '32px', letterSpacing: '2px', fontFamily: 'Arial' }}>Ваш надійний партнер з обміну криптовалют</h2>
            <p style={{ fontSize: '20px', lineHeight: '1.5' }}>Підніміть свої інвестиції на новий рівень завдяки нашому додатку</p>
            <Button type="primary" onClick={scrollToHowItWorks} block style={{ height: '50px', fontSize: '18px' }}>Як це працює?</Button>
          </Col>
          <Col xs={24} md={12}>
            <img src="/A-Crypto-Donation-Ecosystem-The-Giving-Block.webp" alt="Як це працює?" style={{ width: '100%', maxHeight: '400px', height: "auto", maxWidth: "100%" }} />
          </Col>
        </Row>
        <div id="howItWorks" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', letterSpacing: '2px', fontFamily: 'Arial' }}>Як це працює?</h2>
          <p style={{ fontSize: '20px', lineHeight: '1.5' }}>Як створити обмін на нашому застосунку?</p>
        </div>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '40px' }}>
          <Col xs={24} md={12}>
            <img src="/exhanger1.png" alt="Зареєструйте обліковий запис" style={{ width: '100%', maxHeight: '550px' }} />
          </Col>
          <Col xs={24} md={12}>
            <h2 style={{ fontSize: '32px', letterSpacing: '2px', fontFamily: 'Arial' }}>Зареєструйте обліковий запис</h2>
            <p style={{ fontSize: '20px', lineHeight: '1.5' }}>Щоб розпочати обмін криптовалюти, створіть обліковий запис, натиснувши кнопку «Зареєструватись» або «Увійти», якщо ви вже маєте існуючий обліковий запис. Створивши обліковий запис, ви отримаєте можливість створювати заявки. На головній сторінці ви побачите велику кількість різних криптовалют, які можна обміняти.</p>
          </Col>
        </Row>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '40px' }}>
          <Col xs={24} md={12}>
            <h2 style={{ fontSize: '32px', letterSpacing: '2px', fontFamily: 'Arial' }}>Найпростіший спосіб обміну криптовалюти</h2>
            <p style={{ fontSize: '20px', lineHeight: '1.5' }}>Для обміну криптовалюти, просто виберіть криптовалюту, яку ви хочете віддати з бажаною сумою, так само виберіть криптовалюту, яку хочете отримати. Після вибору криптовалюти ви побачите деталі обміну на головній сторінці сайту. Для завершення обміну введіть вашу адресу криптовалюти, так само всі дані, після чого натисніть на кнопку Обміняти.</p>
          </Col>
          <Col xs={24} md={12}>
            <img src="/exhanger2.png" alt="Найпростіший спосіб обміну криптовалюти" style={{ width: '100%', maxHeight: '550px' }} />
          </Col>
        </Row>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '100', textTransform: 'none' }}>Переваги нашого сервісу</h2>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} md={8}>
              <div>
                <img src='/like.029e843.svg' style={{ maxWidth: "80px", paddingTop: "6px", width: "300px", height: "auto" }} alt="Гарантії" />
                <p style={{ fontSize: '1rem', lineHeight: '1.88', marginTop: '1.4rem', textTransform: 'uppercase' }}>
                  <b style={{ fontFamily: "Conv_MuseoSansCyrl_2, sans-serif" }}>Гарантії</b>
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>У нас 100% обміни з наступними виплатами!</p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div>
                <img src='/credit-card.90d4b40.svg' style={{ maxWidth: "80px", paddingTop: "6px", width: "300px", height: "auto" }} alt="Конфіденційність" />
                <p style={{ fontSize: '1rem', lineHeight: '1.88', marginTop: '1.4rem', textTransform: 'uppercase' }}>
                  <b style={{ fontFamily: "Conv_MuseoSansCyrl_2, sans-serif" }}>Конфіденційність</b>
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>Ми не передаємо інформацію про вас третім особам.</p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div>
                <img src='/like.029e843.svg' style={{ maxWidth: "80px", paddingTop: "6px", width: "300px", height: "auto" }} alt="Підтримка" />
                <p style={{ fontSize: '1rem', lineHeight: '1.88', marginTop: '1.4rem', textTransform: 'uppercase' }}>
                  <b style={{ fontFamily: "Conv_MuseoSansCyrl_2, sans-serif" }}>Підтримка</b>
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>Наша команда підтримки завжди готова відповісти на ваші технічні запитання.</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <ContactPage />
    </>
  );
};
{/* <div style={{ height: "550px", width: "100%" }}>
        <AdvancedRealTimeChart theme="dark" autosize symbol="BINANCE:BTCUSDT" />
      </div> */}