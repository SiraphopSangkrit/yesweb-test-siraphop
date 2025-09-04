import { User } from '@/types';

/**
 * Check if a user has a specific role
 */
export function hasRole(user: User | null, roleName: string): boolean {
    if (!user || !user.roles) {
        return false;
    }

    return user.roles.some(role => role.name === roleName);
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roleNames: string[]): boolean {
    if (!user || !user.roles) {
        return false;
    }

    return user.roles.some(role => roleNames.includes(role.name));
}

/**
 * Check if user is admin (has admin or super-admin role)
 */
export function isAdmin(user: User | null): boolean {
    return hasAnyRole(user, ['admin', 'super-admin']);
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: User | null): boolean {
    return hasRole(user, 'super-admin');
}

/**
 * Get user's primary role (first role in the list)
 */
export function getPrimaryRole(user: User | null): string | null {
    if (!user || !user.roles || user.roles.length === 0) {
        return null;
    }

    return user.roles[0].name;
}
