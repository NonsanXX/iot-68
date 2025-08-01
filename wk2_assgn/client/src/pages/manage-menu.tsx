import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR, { mutate } from "swr";
import { MenuItem } from "../lib/models";
import Loading from "../components/loading";
import {
    Alert,
    Badge,
    Button,
    Card,
    Group,
    Text,
    Title,
    Modal,
    TextInput,
    NumberInput,
    Select,
    Stack,
    ActionIcon,
    Table,
    Tabs
} from "@mantine/core";
import {
    IconAlertTriangleFilled,
    IconPlus,
    IconTrash,
    IconEdit,
    IconCheck
} from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";

export default function ManageMenuPage() {
    const { data: menuItems, error, isLoading } = useSWR<MenuItem[]>("/menu-items");
    const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Form states for add modal
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState<number>(0);
    const [newItemCategory, setNewItemCategory] = useState<string>("");

    // Form states for edit modal
    const [editItemName, setEditItemName] = useState("");
    const [editItemPrice, setEditItemPrice] = useState<number>(0);
    const [editItemCategory, setEditItemCategory] = useState<string>("");

    const categoryOptions = [
        { value: 'drink', label: 'เครื่องดื่ม' },
        { value: 'food', label: 'อาหาร' },
        { value: 'dessert', label: 'ของหวาน' }
    ];

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'drink': return 'blue';
            case 'food': return 'orange';
            case 'dessert': return 'pink';
            default: return 'gray';
        }
    };

    const getCategoryDisplayName = (category: string) => {
        switch (category.toLowerCase()) {
            case 'drink': return 'เครื่องดื่ม';
            case 'food': return 'อาหาร';
            case 'dessert': return 'ของหวาน';
            default: return category;
        }
    };

    const getCategories = () => {
        if (!menuItems) return [];
        const categories = [...new Set(menuItems.map(item => item.category))];
        return categories.sort();
    };

    const getCategoryCount = (category: string) => {
        if (!menuItems) return 0;
        if (category === "all") return menuItems.length;
        return menuItems.filter(item => item.category === category).length;
    };

    const getFilteredMenuItems = () => {
        if (!menuItems) return [];

        let filtered = [];
        if (selectedCategory === "all") {
            filtered = menuItems;
        } else {
            filtered = menuItems.filter(item => item.category === selectedCategory);
        }

        // เรียงตามประเภทก่อน แล้วเรียงตามชื่อ
        return filtered.sort((a, b) => {
            // เรียงตามประเภทก่อน
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            // ถ้าประเภทเดียวกัน เรียงตามชื่อ
            return a.name.localeCompare(b.name);
        });
    };

    const renderMenuTable = () => {
        const filteredItems = getFilteredMenuItems();

        if (filteredItems.length === 0) {
            return (
                <Card shadow="sm" padding="xl" radius="md" withBorder>
                    <Text ta="center" c="dimmed" size="lg">
                        {selectedCategory === "all" ? "ยังไม่มีเมนู" : "ไม่มีเมนูในหมวดหมู่นี้"}
                    </Text>
                </Card>
            );
        }

        // ถ้าเลือก "ทั้งหมด" ให้แสดงแยกตามหมวดหมู่
        if (selectedCategory === "all") {
            const categories = getCategories();

            return categories.map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category);

                return (
                    <div key={category} className="mb-8">
                        <Title order={4} mb="md" c={getCategoryColor(category)}>
                            {getCategoryDisplayName(category)} ({categoryItems.length} รายการ)
                        </Title>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Table striped highlightOnHover style={{ tableLayout: 'fixed' }}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th style={{ width: '40%' }}>ชื่อเมนู</Table.Th>
                                        <Table.Th style={{ width: '20%' }}>ประเภท</Table.Th>
                                        <Table.Th style={{ width: '20%' }}>ราคา</Table.Th>
                                        <Table.Th style={{ width: '20%' }}>การจัดการ</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {categoryItems.map((item) => (
                                        <MenuTableRow key={item.id} item={item} />
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Card>
                    </div>
                );
            });
        } else {
            // ถ้าเลือกหมวดหมู่เฉพาะ ให้แสดงแบบปกติ
            return (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Table striped highlightOnHover style={{ tableLayout: 'fixed' }}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ width: '40%' }}>ชื่อเมนู</Table.Th>
                                <Table.Th style={{ width: '20%' }}>ประเภท</Table.Th>
                                <Table.Th style={{ width: '20%' }}>ราคา</Table.Th>
                                <Table.Th style={{ width: '20%' }}>การจัดการ</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredItems.map((item) => (
                                <MenuTableRow key={item.id} item={item} />
                            ))}
                        </Table.Tbody>
                    </Table>
                </Card>
            );
        }
    };

    const MenuTableRow = ({ item }: { item: MenuItem }) => (
        <Table.Tr>
            <Table.Td>
                <Text fw={500}>{item.name}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={getCategoryColor(item.category)} variant="light">
                    {getCategoryDisplayName(item.category)}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text fw={600} c="blue">
                    ฿{parseFloat(item.price).toFixed(2)}
                </Text>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => openEditModalWithItem(item)}
                    >
                        <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDeleteMenuItem(item)}
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    );

    const handleAddMenuItem = async () => {
        if (!newItemName.trim() || newItemPrice <= 0 || !newItemCategory) {
            notifications.show({
                title: "ข้อมูลไม่ครบถ้วน",
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                color: "red",
            });
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/menu-items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET}`,
                },
                body: JSON.stringify({
                    name: newItemName.trim(),
                    price: newItemPrice.toString(),
                    category: newItemCategory,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create menu item");
            }

            notifications.show({
                title: "เพิ่มเมนูสำเร็จ",
                message: `เพิ่ม ${newItemName} แล้ว`,
                color: "green",
            });

            // Reset form and close modal
            setNewItemName("");
            setNewItemPrice(0);
            setNewItemCategory("");
            closeAddModal();

            // Refresh data
            mutate("/menu-items");
        } catch (error) {
            notifications.show({
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถเพิ่มเมนูได้",
                color: "red",
            });
            console.error("Error adding menu item:", error);
        }
    };

    const handleEditMenuItem = async () => {
        if (!editingItem || !editItemName.trim() || editItemPrice <= 0 || !editItemCategory) {
            notifications.show({
                title: "ข้อมูลไม่ครบถ้วน",
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                color: "red",
            });
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/menu-items/${editingItem.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET}`,
                },
                body: JSON.stringify({
                    name: editItemName.trim(),
                    price: editItemPrice.toString(),
                    category: editItemCategory,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update menu item");
            }

            notifications.show({
                title: "แก้ไขเมนูสำเร็จ",
                message: `แก้ไข ${editItemName} แล้ว`,
                color: "green",
            });

            // Close modal and reset
            closeEditModal();
            setEditingItem(null);

            // Refresh data
            mutate("/menu-items");
        } catch (error) {
            notifications.show({
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถแก้ไขเมนูได้",
                color: "red",
            });
            console.error("Error updating menu item:", error);
        }
    };

    const handleDeleteMenuItem = async (item: MenuItem) => {
        modals.openConfirmModal({
            title: `คุณต้องการลบเมนู "${item.name}" ใช่หรือไม่?`,
            children: (
                <span className="text-sm">
                    เมื่อคุณดำเนินการลบเมนูนี้แล้ว จะไม่สามารถย้อนกลับได้
                </span>
            ),
            labels: { confirm: "ลบ", cancel: "ยกเลิก" },
            onConfirm: async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/menu-items/${item.id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to delete menu item");
                    }

                    notifications.show({
                        title: "ลบเมนูสำเร็จ",
                        message: `ลบ ${item.name} แล้ว`,
                        color: "green",
                    });

                    // Refresh data
                    mutate("/menu-items");
                } catch (error) {
                    notifications.show({
                        title: "เกิดข้อผิดพลาด",
                        message: "ไม่สามารถลบเมนูได้",
                        color: "red",
                    });
                    console.error("Error deleting menu item:", error);
                }
            },
            confirmProps: {
                color: "red",
            },
        });
    };    const openEditModalWithItem = (item: MenuItem) => {
        setEditingItem(item);
        setEditItemName(item.name);
        setEditItemPrice(parseFloat(item.price));
        setEditItemCategory(item.category);
        openEditModal();
    };

    return (
        <>
            <Layout>
                <section
                    className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                    style={{
                        backgroundImage: `url(${cafeBackgroundImage})`,
                    }}
                >
                    <h1 className="text-5xl mb-2">จัดการเมนู</h1>
                    <h2>เพิ่ม แก้ไข และลบรายการเมนู (สำหรับสตาฟ)</h2>
                </section>

                <section className="container mx-auto py-8">
                    <div className="flex justify-between items-center mb-6">
                        <Title order={2}>รายการเมนูทั้งหมด</Title>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={openAddModal}
                        >
                            เพิ่มเมนูใหม่
                        </Button>
                    </div>

                    {isLoading && <Loading />}

                    {error && (
                        <Alert
                            icon={<IconAlertTriangleFilled />}
                            color="red"
                            title="เกิดข้อผิดพลาด"
                        >
                            ไม่สามารถโหลดข้อมูลเมนูได้
                        </Alert>
                    )}

                    {menuItems && menuItems.length === 0 && (
                        <Card shadow="sm" padding="xl" radius="md" withBorder>
                            <Text ta="center" c="dimmed" size="lg">
                                ยังไม่มีเมนู
                            </Text>
                        </Card>
                    )}

                    {menuItems && menuItems.length > 0 && (
                        <>
                            {/* Category Filter Tabs */}
                            <Tabs value={selectedCategory} onChange={(value) => setSelectedCategory(value || "all")} mb="xl">
                                <Tabs.List>
                                    <Tabs.Tab value="all">
                                        ทั้งหมด ({getCategoryCount("all")})
                                    </Tabs.Tab>
                                    {getCategories().map((category) => (
                                        <Tabs.Tab
                                            key={category}
                                            value={category}
                                            color={getCategoryColor(category)}
                                        >
                                            {getCategoryDisplayName(category)} ({getCategoryCount(category)})
                                        </Tabs.Tab>
                                    ))}
                                </Tabs.List>
                            </Tabs>

                            {/* Menu Items Table */}
                            {renderMenuTable()}
                        </>
                    )}

                    {/* Statistics */}
                    {menuItems && menuItems.length > 0 && (
                        <Card shadow="sm" padding="md" radius="md" withBorder mt="xl" bg="blue.0">
                            <Group justify="space-between">
                                <Text fw={500}>สถิติเมนู</Text>
                                <div className="text-right">
                                    <Text size="sm" c="dimmed">
                                        จำนวนเมนูทั้งหมด: {menuItems.length} รายการ
                                    </Text>
                                    <Group gap="md">
                                        <Text size="sm" c="blue">
                                            เครื่องดื่ม: {menuItems.filter(item => item.category === 'drink').length}
                                        </Text>
                                        <Text size="sm" c="orange">
                                            อาหาร: {menuItems.filter(item => item.category === 'food').length}
                                        </Text>
                                        <Text size="sm" c="pink">
                                            ของหวาน: {menuItems.filter(item => item.category === 'dessert').length}
                                        </Text>
                                    </Group>
                                </div>
                            </Group>
                        </Card>
                    )}
                </section>
            </Layout>

            {/* Add Menu Item Modal */}
            <Modal
                opened={addModalOpened}
                onClose={closeAddModal}
                title="เพิ่มเมนูใหม่"
                size="md"
            >
                <Stack gap="md">
                    <TextInput
                        label="ชื่อเมนู"
                        placeholder="เช่น กาแฟอเมริกาโน่"
                        value={newItemName}
                        onChange={(event) => setNewItemName(event.currentTarget.value)}
                        required
                    />

                    <NumberInput
                        label="ราคา (บาท)"
                        placeholder="0.00"
                        min={0}
                        max={9999}
                        decimalScale={2}
                        fixedDecimalScale
                        value={newItemPrice}
                        onChange={(value) => setNewItemPrice(typeof value === 'number' ? value : 0)}
                        required
                    />

                    <Select
                        label="ประเภท"
                        placeholder="เลือกประเภทเมนู"
                        data={categoryOptions}
                        value={newItemCategory}
                        onChange={(value) => setNewItemCategory(value || "")}
                        required
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="light" onClick={closeAddModal}>
                            ยกเลิก
                        </Button>
                        <Button
                            leftSection={<IconCheck size={16} />}
                            onClick={handleAddMenuItem}
                        >
                            เพิ่มเมนู
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Edit Menu Item Modal */}
            <Modal
                opened={editModalOpened}
                onClose={closeEditModal}
                title="แก้ไขเมนู"
                size="md"
            >
                <Stack gap="md">
                    <TextInput
                        label="ชื่อเมนู"
                        placeholder="เช่น กาแฟอเมริกาโน่"
                        value={editItemName}
                        onChange={(event) => setEditItemName(event.currentTarget.value)}
                        required
                    />

                    <NumberInput
                        label="ราคา (บาท)"
                        placeholder="0.00"
                        min={0}
                        max={9999}
                        decimalScale={2}
                        fixedDecimalScale
                        value={editItemPrice}
                        onChange={(value) => setEditItemPrice(typeof value === 'number' ? value : 0)}
                        required
                    />

                    <Select
                        label="ประเภท"
                        placeholder="เลือกประเภทเมนู"
                        data={categoryOptions}
                        value={editItemCategory}
                        onChange={(value) => setEditItemCategory(value || "")}
                        required
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="light" onClick={closeEditModal}>
                            ยกเลิก
                        </Button>
                        <Button
                            leftSection={<IconCheck size={16} />}
                            onClick={handleEditMenuItem}
                        >
                            บันทึกการแก้ไข
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
