import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Badge } from '@heroui/badge';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
}

interface Role {
    id: number;
    name: string;
}

interface AdminUsersProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    roles: Role[];
}

export default function AdminUsers({ users, roles }: AdminUsersProps) {
    const [updatingRole, setUpdatingRole] = useState<number | null>(null);

    const handleRoleUpdate = async (userId: number, roleName: string) => {
        setUpdatingRole(userId);

        router.patch(`/admin/users/${userId}/role`,
            { role: roleName },
            {
                onFinish: () => setUpdatingRole(null),
                onError: (errors) => {
                    console.error('Role update failed:', errors);
                    setUpdatingRole(null);
                }
            }
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleBadgeColor = (roleName: string) => {
        switch (roleName) {
            case 'super-admin':
                return 'danger';
            case 'admin':
                return 'warning';
            case 'customer':
                return 'primary';
            default:
                return 'default';
        }
    };

    return (
        <AdminLayout>
            <Head title="User Management" />

            <div className="space-y-6">
                <Heading
                    title="User Management"
                    description={`Manage ${users.total} users and their roles`}
                />

                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">All Users</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">User</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Role</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Joined</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        color={getRoleBadgeColor(role.name)}
                                                        variant="flat"
                                                        className="mr-1"
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </td>
                                            <td className="py-3 px-4">

                                                <Badge
                                                    color={user.email_verified_at ? 'success' : 'warning'}
                                                    variant="flat"
                                                >
                                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.roles.some(role => role.name !== 'customer') ? (
                                                    <Select
                                                        placeholder="Change Role"
                                                        size="sm"
                                                        isDisabled={updatingRole === user.id}
                                                        onSelectionChange={(keys) => {
                                                            const selectedRole = Array.from(keys)[0] as string;
                                                            if (selectedRole) {
                                                                handleRoleUpdate(user.id, selectedRole);
                                                            }
                                                        }}
                                                        className="min-w-[120px]"
                                                    >
                                                        {roles
                                                            .filter(role => role.name === 'admin' || role.name === 'super-admin')
                                                            .map((role) => (
                                                                <SelectItem key={role.name}>
                                                                    {role.name}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </Select>
                                                ) : (
                                                    <span className="text-gray-500 dark:text-gray-400 text-sm">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {((users.current_page - 1) * users.per_page) + 1} to {Math.min(users.current_page * users.per_page, users.total)} of {users.total} users
                                </div>
                                <div className="flex space-x-2">
                                    {users.current_page > 1 && (
                                        <Button
                                            as={Link}
                                            href={`/admin/users?page=${users.current_page - 1}`}
                                            size="sm"
                                            variant="flat"
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {users.current_page < users.last_page && (
                                        <Button
                                            as={Link}
                                            href={`/admin/users?page=${users.current_page + 1}`}
                                            size="sm"
                                            variant="flat"
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
