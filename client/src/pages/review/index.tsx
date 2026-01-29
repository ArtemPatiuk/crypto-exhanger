import { List, Spin, Alert, Row, Col, Avatar } from 'antd';
import { useGetAllReviewsQuery } from '../../app/services/reviews';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import { AddReviews } from './add-reviews';
import { Breadcrumb } from "antd";
const formatDateTime = (dateTime: Date) => {
    return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

const Reviews = () => {
    const { data: reviews, error, isLoading } = useGetAllReviewsQuery();

    if (isLoading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message="Помилка завантаження відгуків" type="error" />;
    }

    return (
        <div style={{ padding: '20px',minHeight:"67vh" }}>
            <Breadcrumb style={{fontSize:""}} items={[{ title: 'Відгуки' }]} />
            <Row gutter={[16, 16]} style={{marginTop:"10px"}}>
                {reviews && reviews.map(review => (
                    <Col xs={24} sm={24} md={12} key={review.id}>
                        <List
                            itemLayout="horizontal"
                            dataSource={[review]} 
                            renderItem={(item) => (
                                <List.Item style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px',height: "120px" }}>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined style={{ fontSize: "25px", padding: "0" }} />} />}
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 'bold' }}>{item.user?.name || 'Анонімний користувач'}</span>
                                                <span>{formatDateTime(item.createdAt)}</span>
                                            </div>
                                        }
                                        description={<div style={{ wordWrap: 'break-word' }}>{item.text}</div>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                ))}
            </Row>
            <div style={{margin:"20px"}}>
            <AddReviews />
            </div>
           
        </div>
    );
};
//extra={formatDateTime(new Date(review.createdAt))}
export default Reviews;