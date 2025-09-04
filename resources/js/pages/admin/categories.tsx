import { Head } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { Chip } from '@heroui/chip';
import { Input } from '@heroui/input';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    items_count: number;
    created_at: string;
    updated_at: string;
}

interface CategoryManagementProps {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function CategoryManagement({ categories }: CategoryManagementProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: createReset } = useForm({
        name: '',
    });

    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors } = useForm({
        name: '',
    });

    const { delete: deleteCategory, processing: deleteProcessing } = useForm();

    const filteredCategories = categories.data.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPost('/admin/categories', {
            onSuccess: () => {
                onCreateClose();
                createReset();
            }
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCategory) {
            editPut(`/admin/categories/${selectedCategory.id}`, {
                onSuccess: () => {
                    onEditClose();
                    setSelectedCategory(null);
                }
            });
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setEditData({ name: category.name });
        onEditOpen();
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        onDeleteOpen();
    };

    const handleDeleteConfirm = () => {
        if (selectedCategory) {
            deleteCategory(`/admin/categories/${selectedCategory.id}`, {
                onSuccess: () => {
                    onDeleteClose();
                    setSelectedCategory(null);
                }
            });
        }
    };

    return (
        <AdminLayout>

            <Head title="Category Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Category Management"
                        description="Manage your product categories"
                    />
                    <Button
                        color="primary"
                        startContent={<Plus size={18} />}
                        onPress={onCreateOpen}
                    >
                        Add Category
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardBody>
                        <div className="flex gap-4 items-center">
                            <Input
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startContent={<Search size={18} />}
                                className="max-w-sm"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Categories ({categories.total})</h3>
                    </CardHeader>
                    <CardBody>
                        <Table aria-label="Categories table">
                            <TableHeader>
                                <TableColumn>NAME</TableColumn>
                                <TableColumn>ITEMS COUNT</TableColumn>
                                <TableColumn>CREATED DATE</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredCategories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <div className="font-medium">{category.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={category.items_count > 0 ? "success" : "default"}
                                                variant="flat"
                                                size="sm"
                                            >
                                                {category.items_count} items
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(category.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                    startContent={<Edit size={14} />}
                                                    onPress={() => handleEdit(category)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="danger"
                                                    startContent={<Trash2 size={14} />}
                                                    onPress={() => handleDelete(category)}
                                                    isDisabled={category.items_count > 0}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredCategories.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Create Category Modal */}
            <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
                <ModalContent>
                    <form onSubmit={handleCreateSubmit}>
                        <ModalHeader>
                            <h2 className="text-xl font-semibold">Add New Category</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Category Name"
                                placeholder="Enter category name"
                                value={createData.name}
                                onChange={(e) => setCreateData('name', e.target.value)}
                                errorMessage={createErrors.name}
                                isInvalid={!!createErrors.name}
                                isRequired
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onCreateClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                isLoading={createProcessing}
                            >
                                Create Category
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            {/* Edit Category Modal */}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalContent>
                    <form onSubmit={handleEditSubmit}>
                        <ModalHeader>
                            <h2 className="text-xl font-semibold">Edit Category</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Category Name"
                                placeholder="Enter category name"
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                errorMessage={editErrors.name}
                                isInvalid={!!editErrors.name}
                                isRequired
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onEditClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                isLoading={editProcessing}
                            >
                                Update Category
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            {/* Delete Category Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-xl font-semibold text-danger">Delete Category</h2>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            Are you sure you want to delete the category "{selectedCategory?.name}"?
                        </p>
                        {selectedCategory?.items_count && selectedCategory.items_count > 0 && (
                            <p className="text-danger text-sm">
                                This category has {selectedCategory.items_count} items. Please move or delete the items first.
                            </p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="default"
                            variant="light"
                            onPress={onDeleteClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleDeleteConfirm}
                            isLoading={deleteProcessing}
                            isDisabled={selectedCategory?.items_count ? selectedCategory.items_count > 0 : false}
                        >
                          <p className='text-white'>Delete Category</p>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AdminLayout>
    );
}
