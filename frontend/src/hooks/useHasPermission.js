"use client"
import { useSelector } from 'react-redux';
import { routePermissionMap } from '@/components/ProtectedRoute/routePermissions';


export const useHasPermission = (routeOrPermission) => {
    console.log( routePermissionMap[routeOrPermission])
  const user = useSelector((state) => state.auth.user);

  if (!user) return false;
  if (user.role === 'admin') return true; // admin bypass

  const required =
    routePermissionMap[routeOrPermission] || routeOrPermission;

  if (Array.isArray(required)) {
    return required.some((perm) => user.permission?.includes(perm));
  }

  return user.permission?.includes(required);
};
