import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { Chip } from '@heroui/chip';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Switch } from '@heroui/switch';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    description: string;
    price: string;
    category_id: number;
    category: Category;
    image: string | null;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

interface ItemManagementProps {
    items: {
        data: Item[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Category[];
}

export default function ItemManagement({ items, categories }: ItemManagementProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditCloseOriginal } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const onEditClose = () => {
        setSelectedItem(null);
        setEditData({
            name: '',
            description: '',
            price: '',
            category_id: '',
            is_available: true,
            image: null,
        });
        onEditCloseOriginal();
    };

    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: createReset } = useForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        is_available: true,
        image: null as File | null,
    });

    const { data: editData, setData: setEditData, processing: editProcessing, errors: editErrors } = useForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        is_available: true,
        image: null as File | null,
    });

    const { delete: deleteItem, processing: deleteProcessing } = useForm();

    const filteredItems = items.data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category_id.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categorySelectItems = [
        { key: 'all', label: 'All Categories' },
        ...categories.map(category => ({
            key: category.id.toString(),
            label: category.name
        }))
    ];

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPost('/admin/items', {
            onSuccess: () => {
                onCreateClose();
                createReset();
            }
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItem) {
            console.log('Submitting edit form with image:', editData.image?.name);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', editData.name);
            formData.append('description', editData.description);
            formData.append('price', editData.price);
            formData.append('category_id', editData.category_id);
            formData.append('is_available', editData.is_available ? '1' : '0');
            formData.append('_method', 'PUT');

            if (editData.image) {
                formData.append('image', editData.image);
            }

            router.post(`/admin/items/${selectedItem.id}`, formData, {
                onSuccess: () => {
                    onEditClose();
                }
            });
        }
    };

    const handleEdit = (item: Item) => {
        setSelectedItem(item);
        setEditData({
            name: item.name,
            description: item.description,
            price: item.price,
            category_id: item.category_id.toString(),
            is_available: item.is_available,
            image: null,
        });
        onEditOpen();
    };

    const handleDelete = (item: Item) => {
        setSelectedItem(item);
        onDeleteOpen();
    };

    const handleDeleteConfirm = () => {
        if (selectedItem) {
            deleteItem(`/admin/items/${selectedItem.id}`, {
                onSuccess: () => {
                    onDeleteClose();
                    setSelectedItem(null);
                }
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
        const file = e.target.files?.[0] || null;
        console.log('Image selected:', file?.name, 'for edit:', isEdit);

        if (isEdit) {
            setEditData('image', file);
        } else {
            setCreateData('image', file);
        }
    };

    return (
        <AdminLayout>
            <Head title="Item Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Item Management"
                        description="Manage your menu items"
                    />
                    <Button
                        color="primary"
                        startContent={<Plus size={18} />}
                        onPress={onCreateOpen}
                    >
                        Add Item
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardBody>
                        <div className="flex gap-4 items-center">
                            <Input
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startContent={<Search size={18} />}
                                className="max-w-sm"
                            />
                            <Select
                                placeholder="Select category"
                                selectedKeys={[selectedCategory]}
                                onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                                className="max-w-xs"
                            >
                                {categorySelectItems.map((item) => (
                                    <SelectItem key={item.key}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </CardBody>
                </Card>

                {/* Items Table */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Items ({items.total})</h3>
                    </CardHeader>
                    <CardBody>
                        <Table aria-label="Items table">
                            <TableHeader>
                                <TableColumn>ITEM</TableColumn>
                                <TableColumn>CATEGORY</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>CREATED DATE</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {item.image && (
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-sm text-gray-600 line-clamp-1">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color="secondary"
                                                variant="flat"
                                                size="sm"
                                            >
                                                {item.category.name}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                {formatCurrency(item.price)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={item.is_available ? "success" : "danger"}
                                                variant="flat"
                                                size="sm"
                                            >
                                                {item.is_available ? "Available" : "Unavailable"}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(item.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                    startContent={<Edit size={14} />}
                                                    onPress={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="danger"
                                                    startContent={<Trash2 size={14} />}
                                                    onPress={() => handleDelete(item)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredItems.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm || selectedCategory !== 'all'
                                    ? 'No items found matching your search.'
                                    : 'No items found.'}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Create Item Modal */}
            <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="2xl">
                <ModalContent>
                    <form onSubmit={handleCreateSubmit}>
                        <ModalHeader>
                            <h2 className="text-xl font-semibold">Add New Item</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Item Name"
                                placeholder="Enter item name"
                                value={createData.name}
                                onChange={(e) => setCreateData('name', e.target.value)}
                                errorMessage={createErrors.name}
                                isInvalid={!!createErrors.name}
                                isRequired
                            />
                            <Input
                                label="Description"
                                placeholder="Enter item description"
                                value={createData.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateData('description', e.target.value)}
                                errorMessage={createErrors.description}
                                isInvalid={!!createErrors.description}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Price"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={createData.price}
                                    onChange={(e) => setCreateData('price', e.target.value)}
                                    errorMessage={createErrors.price}
                                    isInvalid={!!createErrors.price}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">฿</span>
                                        </div>
                                    }
                                    isRequired
                                />
                                <Select
                                    label="Category"
                                    placeholder="Select category"
                                    selectedKeys={createData.category_id ? [createData.category_id] : []}
                                    onSelectionChange={(keys) => setCreateData('category_id', Array.from(keys)[0] as string)}
                                    errorMessage={createErrors.category_id}
                                    isInvalid={!!createErrors.category_id}
                                    isRequired
                                >
                                    {categories.map((category) => (
                                        <SelectItem key={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, false)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                                {createErrors.image && (
                                    <p className="text-danger text-sm">{createErrors.image}</p>
                                )}
                            </div>
                            <Switch
                                isSelected={createData.is_available}
                                onValueChange={(checked) => setCreateData('is_available', checked)}
                            >
                                Available for order
                            </Switch>
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
                                Create Item
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            {/* Edit Item Modal */}
            <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">
                <ModalContent>
                    <form onSubmit={handleEditSubmit}>
                        <ModalHeader>
                            <h2 className="text-xl font-semibold">Edit Item</h2>
                        </ModalHeader>
                        <ModalBody className="space-y-4">
                            <Input
                                label="Item Name"
                                placeholder="Enter item name"
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                errorMessage={editErrors.name}
                                isInvalid={!!editErrors.name}
                                isRequired
                            />
                            <Input
                                label="Description"
                                placeholder="Enter item description"
                                value={editData.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData('description', e.target.value)}
                                errorMessage={editErrors.description}
                                isInvalid={!!editErrors.description}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Price"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editData.price}
                                    onChange={(e) => setEditData('price', e.target.value)}
                                    errorMessage={editErrors.price}
                                    isInvalid={!!editErrors.price}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">฿</span>
                                        </div>
                                    }
                                    isRequired
                                />
                                <Select
                                    label="Category"
                                    placeholder="Select category"
                                    selectedKeys={editData.category_id ? [editData.category_id] : []}
                                    onSelectionChange={(keys) => setEditData('category_id', Array.from(keys)[0] as string)}
                                    errorMessage={editErrors.category_id}
                                    isInvalid={!!editErrors.category_id}
                                    isRequired
                                >
                                    {categories.map((category) => (
                                        <SelectItem key={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image</label>
                                {selectedItem?.image && (
                                    <div className="mb-2">
                                        <img
                                            src={`/storage/${selectedItem.image}`}
                                            alt={selectedItem.name}
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Current image</p>
                                    </div>
                                )}
                                {editData.image && (
                                    <div className="mb-2">
                                        <img
                                            src={URL.createObjectURL(editData.image)}
                                            alt="New image preview"
                                            className="w-24 h-24 rounded-lg object-cover border-2 border-primary"
                                        />
                                        <p className="text-sm text-primary mt-1">New image selected: {editData.image.name}</p>
                                    </div>
                                )}
                                <input
                                    key={selectedItem?.id || 'edit-image'}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, true)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                                {editErrors.image && (
                                    <p className="text-danger text-sm">{editErrors.image}</p>
                                )}
                            </div>
                            <Switch
                                isSelected={editData.is_available}
                                onValueChange={(checked) => setEditData('is_available', checked)}
                            >
                                Available for order
                            </Switch>
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
                                Update Item
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            {/* Delete Item Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-xl font-semibold text-danger">Delete Item</h2>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            Are you sure you want to delete the item "{selectedItem?.name}"?
                        </p>
                        <p className="text-danger text-sm">
                            This action cannot be undone.
                        </p>
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
                        >
                            <p className='text-white'>Delete Item</p>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AdminLayout>
    );
}
