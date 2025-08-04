import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withRoleProtection = (Component: any, allowedRoles: string[]) => {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    useEffect(() => {
      if (!role) {
        router.push('/login');
      } else if (!allowedRoles.includes(role)) {
        router.push('/unauthorized');
      }
    }, []);

    if (!role || !allowedRoles.includes(role)) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withRoleProtection;