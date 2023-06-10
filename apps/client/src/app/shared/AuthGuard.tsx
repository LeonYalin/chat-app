import { selectIsAuthenticated } from '@client/features/auth/auth.slice';
import { useAppSelector } from '@client/hooks';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};
