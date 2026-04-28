import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { refreshSuccess } from './authSlice';
import { authApi } from '../../app/services/auth';
import { Paths } from '../../paths';
import { Spin } from 'antd';


export const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [triggerCurrent] = authApi.useLazyCurrentQuery();

useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            
            dispatch(refreshSuccess({ accessToken: token, user: null }));

            triggerCurrent()
                .unwrap()
                .then(() => {
                    navigate(Paths.home);
                })
                .catch(() => {
                    navigate(Paths.home);
                });
        }
    }, [searchParams, dispatch, navigate, triggerCurrent]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Spin />
    </div>
  );
};