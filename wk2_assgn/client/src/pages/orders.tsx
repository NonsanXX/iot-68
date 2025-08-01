import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Order, OrderItem } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Badge, Button, Card, Group, Text, Title, Stack, Divider } from "@mantine/core";
import { IconAlertTriangleFilled, IconTrash, IconRefresh } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { mutate } from "swr";
import { modals } from "@mantine/modals";

// Extended Order interface สำหรับรวม orderItems
interface OrderWithItems extends Order {
    orderItems: (OrderItem & {
        menuItem: {
            id: number;
            name: string;
            category: string;
            price: string;
        };
    })[];
}

export default function OrdersPage() {
    const { data: orders, error, isLoading } = useSWR<OrderWithItems[]>("/orders");

    const deleteOrder = async (orderId: number) => {
        modals.openConfirmModal({
            title: `คุณต้องการลบคำสั่งซื้อ #${orderId} ใช่หรือไม่?`,
            children: (
                <span className="text-sm">
                    เมื่อคุณดำเนินการลบคำสั่งซื้อนี้แล้ว จะไม่สามารถย้อนกลับได้
                </span>
            ),
            labels: { confirm: "ลบ", cancel: "ยกเลิก" },
            onConfirm: async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to delete order");
                    }

                    notifications.show({
                        title: "ลบคำสั่งซื้อสำเร็จ",
                        message: `ลบคำสั่งซื้อเลขที่ ${orderId} แล้ว`,
                        color: "green",
                    });

                    // Refresh data
                    mutate("/orders");
                } catch (error) {
                    notifications.show({
                        title: "เกิดข้อผิดพลาด",
                        message: "ไม่สามารถลบคำสั่งซื้อได้",
                        color: "red",
                    });
                    console.error("Error deleting order:", error);
                }
            },
            confirmProps: {
                color: "red",
            },
        });
    };

    const refreshOrders = () => {
        mutate("/orders");
        notifications.show({
            title: "รีเฟรชแล้ว",
            message: "อัพเดทข้อมูลคำสั่งซื้อล่าสุด",
            color: "blue",
        });
    };

    const getOrderTotal = (order: OrderWithItems) => {
        return order.orderItems.reduce((total, item) => {
            return total + (parseFloat(item.menuItem.price) * item.quantity);
        }, 0).toFixed(2);
    };

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

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    <h1 className="text-5xl mb-2">คำสั่งซื้อ</h1>
                    <h2>จัดการคำสั่งซื้อทั้งหมด (สำหรับสตาฟ)</h2>
                </section>

                <section className="container mx-auto py-8">
                    <div className="flex justify-between items-center mb-6">
                        <Title order={2}>รายการคำสั่งซื้อทั้งหมด</Title>
                        <Button
                            leftSection={<IconRefresh size={16} />}
                            onClick={refreshOrders}
                            variant="light"
                        >
                            รีเฟรช
                        </Button>
                    </div>

                    {isLoading && <Loading />}
                    
                    {error && (
                        <Alert
                            icon={<IconAlertTriangleFilled />}
                            color="red"
                            title="เกิดข้อผิดพลาด"
                        >
                            ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้
                        </Alert>
                    )}

                    {orders && orders.length === 0 && (
                        <Card shadow="sm" padding="xl" radius="md" withBorder>
                            <Text ta="center" c="dimmed" size="lg">
                                ยังไม่มีคำสั่งซื้อ
                            </Text>
                        </Card>
                    )}

                    {orders && orders.length > 0 && (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <Title order={4} mb="xs">
                                                คำสั่งซื้อ #{order.id}
                                            </Title>
                                            <Text size="sm" c="dimmed">
                                                📅 {formatDateTime(order.createdAt)}
                                            </Text>
                                        </div>
                                        <div className="flex gap-2">
                                            <Text size="lg" fw={700} c="green">
                                                ฿{getOrderTotal(order)}
                                            </Text>
                                            <Button
                                                size="xs"
                                                color="red"
                                                variant="light"
                                                leftSection={<IconTrash size={14} />}
                                                onClick={() => deleteOrder(order.id)}
                                            >
                                                ลบ
                                            </Button>
                                        </div>
                                    </div>

                                    <Divider mb="md" />

                                    <Title order={5} mb="sm">
                                        รายการสินค้า ({order.orderItems.length} รายการ)
                                    </Title>

                                    <Stack gap="sm">
                                        {order.orderItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                                            >
                                                <div className="flex-1">
                                                    <Group justify="space-between" mb="xs">
                                                        <Text fw={500}>{item.menuItem.name}</Text>
                                                        <Badge 
                                                            color={getCategoryColor(item.menuItem.category)} 
                                                            variant="light"
                                                            size="sm"
                                                        >
                                                            {getCategoryDisplayName(item.menuItem.category)}
                                                        </Badge>
                                                    </Group>
                                                    
                                                    <Group gap="md">
                                                        <Text size="sm" c="dimmed">
                                                            จำนวน: {item.quantity}
                                                        </Text>
                                                        <Text size="sm" c="dimmed">
                                                            ราคา: ฿{parseFloat(item.menuItem.price).toFixed(2)}
                                                        </Text>
                                                        <Text size="sm" fw={500} c="blue">
                                                            รวม: ฿{(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
                                                        </Text>
                                                    </Group>

                                                    {item.note && (
                                                        <Text size="sm" c="orange" mt="xs">
                                                            📝 หมายเหตุ: {item.note}
                                                        </Text>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </Stack>

                                    <Divider mt="md" mb="sm" />
                                    
                                    <Group justify="space-between">
                                        <Text fw={700}>ยอดรวมทั้งสิ้น:</Text>
                                        <Text fw={700} size="xl" c="green">
                                            ฿{getOrderTotal(order)}
                                        </Text>
                                    </Group>
                                </Card>
                            ))}
                        </div>
                    )}

                    {orders && orders.length > 0 && (
                        <Card shadow="sm" padding="md" radius="md" withBorder mt="xl" bg="blue.0">
                            <Group justify="space-between">
                                <Text fw={500}>สถิติวันนี้</Text>
                                <div className="text-right">
                                    <Text size="sm" c="dimmed">
                                        จำนวนคำสั่งซื้อ: {orders.length} รายการ
                                    </Text>
                                    <Text fw={700} c="blue">
                                        ยอดขายรวม: ฿{orders.reduce((total, order) => total + parseFloat(getOrderTotal(order)), 0).toFixed(2)}
                                    </Text>
                                </div>
                            </Group>
                        </Card>
                    )}
                </section>
            </Layout>
        </>
    );
}
