import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import useSWR from "swr";
import { MenuItem } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Badge, Button, Card, Group, NumberInput, Text, TextInput, Title, Tabs } from "@mantine/core";
import { IconAlertTriangleFilled, IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

interface CartItem {
    menuItem: MenuItem;
    quantity: number;
    note: string;
}

export default function MenuPage() {
    const { data: menuItems, error } = useSWR<MenuItem[]>("/menu-items");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [notes, setNotes] = useState<Record<number, string>>({});
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const addToCart = (menuItem: MenuItem) => {
        try {
            if (!menuItem || !menuItem.id) {
                notifications.show({
                    title: "เกิดข้อผิดพลาด",
                    message: "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้",
                    color: "red",
                });
                return;
            }

            const quantity = quantities[menuItem.id] || 1;
            const note = notes[menuItem.id] || "";

            const existingIndex = cart.findIndex(item => item?.menuItem?.id === menuItem.id);

            if (existingIndex >= 0) {
                const newCart = [...cart];
                newCart[existingIndex] = {
                    menuItem,
                    quantity: newCart[existingIndex].quantity + quantity,
                    note: note
                };
                setCart(newCart);
            } else {
                setCart(prevCart => [...prevCart, { menuItem, quantity, note }]);
            }

            // Reset inputs
            setQuantities(prev => ({ ...prev, [menuItem.id]: 1 }));
            setNotes(prev => ({ ...prev, [menuItem.id]: "" }));

            notifications.show({
                title: "เพิ่มลงตะกร้าแล้ว",
                message: `${menuItem.name} x${quantity}`,
                color: "green",
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            notifications.show({
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้",
                color: "red",
            });
        }
    };

    const removeFromCart = (index: number) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
    };

    const submitOrder = async () => {
        if (cart.length === 0) {
            notifications.show({
                title: "ไม่สามารถส่งคำสั่งซื้อได้",
                message: "กรุณาเพิ่มสินค้าลงตะกร้าก่อน",
                color: "red",
            });
            return;
        }

        try {
            // Create order first
            const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET}`,
                },
                body: JSON.stringify({}),
            });

            if (!orderResponse.ok) {
                throw new Error("Failed to create order");
            }

            const { order } = await orderResponse.json();

            // Add order items
            for (const cartItem of cart) {
                const requestData: any = {
                    orderId: order.id,
                    menuItemId: cartItem.menuItem.id,
                    quantity: cartItem.quantity,
                };
                
                // Only add note if it exists and is not empty
                if (cartItem.note && cartItem.note.trim() !== "") {
                    requestData.note = cartItem.note.trim();
                }

                console.log("Sending order item data:", requestData); // Debug log

                const orderItemResponse = await fetch(`${import.meta.env.VITE_API_URL}/order-items`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET}`,
                    },
                    body: JSON.stringify(requestData),
                });

                if (!orderItemResponse.ok) {
                    const errorData = await orderItemResponse.text();
                    console.error("Order item creation failed:", errorData);
                    throw new Error(`Failed to create order item: ${errorData}`);
                }
            }

            notifications.show({
                title: "สั่งซื้อสำเร็จ",
                message: `หมายเลขคำสั่งซื้อ: ${order.id}`,
                color: "green",
            });

            // Clear cart
            setCart([]);
        } catch (error) {
            notifications.show({
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถส่งคำสั่งซื้อได้",
                color: "red",
            });
            console.error("Error submitting order:", error);
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
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

    const getCategories = () => {
        if (!menuItems) return [];
        const categories = [...new Set(menuItems.map(item => item.category))];
        return categories.sort();
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

    const renderMenuItems = () => {
        const filteredItems = getFilteredMenuItems();
        
        // ถ้าเลือก "ทั้งหมด" ให้แสดงแยกตามหมวดหมู่
        if (selectedCategory === "all") {
            const categories = getCategories();
            
            return categories.map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category);
                
                return (
                    <div key={category} className="mb-8">
                        <Title order={3} mb="md" c={getCategoryColor(category)}>
                            {getCategoryDisplayName(category)} ({categoryItems.length})
                        </Title>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryItems.map((item) => (
                                <MenuItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                );
            });
        } else {
            // ถ้าเลือกหมวดหมู่เฉพาะ ให้แสดงแบบปกติ
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                    ))}
                </div>
            );
        }
    };

    const MenuItemCard = ({ item }: { item: MenuItem }) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
                <Text fw={500}>{item.name}</Text>
                <Badge color={getCategoryColor(item.category)} variant="light">
                    {getCategoryDisplayName(item.category)}
                </Badge>
            </Group>

            <Text size="lg" fw={700} c="blue" mb="md">
                ฿{parseFloat(item.price).toFixed(2)}
            </Text>

            <Group mb="md">
                <NumberInput
                    label="จำนวน"
                    placeholder="1"
                    min={1}
                    max={99}
                    value={quantities[item.id] || 1}
                    onChange={(value) => {
                        const qty = typeof value === 'number' && value > 0 ? value : 1;
                        setQuantities(prev => ({
                            ...prev,
                            [item.id]: qty
                        }));
                    }}
                    style={{ flex: 1 }}
                />
            </Group>

            <TextInput
                label="หมายเหตุ"
                placeholder="เช่น ไม่ใส่น้ำแข็ง, เพิ่มหวาน..."
                value={notes[item.id] || ""}
                onChange={(event) => {
                    const value = event?.currentTarget?.value || "";
                    setNotes(prev => ({
                        ...prev,
                        [item.id]: value
                    }));
                }}
                mb="md"
            />

            <Button
                variant="filled"
                fullWidth
                leftSection={<IconShoppingCart size={16} />}
                onClick={() => addToCart(item)}
            >
                เพิ่มลงตะกร้า
            </Button>
        </Card>
    );

    const getCategoryCount = (category: string) => {
        if (!menuItems) return 0;
        if (category === "all") return menuItems.length;
        return menuItems.filter(item => item.category === category).length;
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
                    <h1 className="text-5xl mb-2">เมนู</h1>
                    <h2>เลือกสั่งอาหารและเครื่องดื่ม</h2>
                </section>

                <section className="container mx-auto py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Menu Items */}
                        <div className="lg:col-span-2">
                            <Title order={2} mb="md">รายการเมนู</Title>

                            {!menuItems && !error && <Loading />}
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
                                <Text ta="center" c="dimmed">
                                    ไม่มีเมนูในขณะนี้
                                </Text>
                            )}

                            {/* Category Filter Tabs */}
                            {menuItems && menuItems.length > 0 && (
                                <>
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

                                    {renderMenuItems()}

                                    {getFilteredMenuItems().length === 0 && (
                                        <Text ta="center" c="dimmed" mt="xl">
                                            ไม่มีเมนูในหมวดหมู่นี้
                                        </Text>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Cart */}
                        <div className="lg:col-span-1">
                            <Card shadow="sm" padding="lg" radius="md" withBorder className="sticky top-4">
                                <Title order={3} mb="md">ตะกร้าสินค้า ({cart.length})</Title>

                                {cart.length === 0 ? (
                                    <Text ta="center" c="dimmed">
                                        ตะกร้าว่าง
                                    </Text>
                                ) : (
                                    <>
                                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                            {cart.map((item, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-md">
                                                    <Group justify="space-between" mb="xs">
                                                        <Text size="sm" fw={500}>
                                                            {item.menuItem.name}
                                                        </Text>
                                                        <Button
                                                            size="xs"
                                                            variant="subtle"
                                                            color="red"
                                                            onClick={() => removeFromCart(index)}
                                                        >
                                                            ลบ
                                                        </Button>
                                                    </Group>
                                                    <Text size="xs" c="dimmed">
                                                        จำนวน: {item.quantity} | ราคา: ฿{(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
                                                    </Text>
                                                    {item.note && (
                                                        <Text size="xs" c="dimmed">
                                                            หมายเหตุ: {item.note}
                                                        </Text>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <Group justify="space-between" mb="md">
                                            <Text fw={700}>รวมทั้งหมด:</Text>
                                            <Text fw={700} size="lg" c="blue">
                                                ฿{getTotalPrice()}
                                            </Text>
                                        </Group>

                                        <Button
                                            fullWidth
                                            size="md"
                                            onClick={submitOrder}
                                            loading={false}
                                        >
                                            ส่งคำสั่งซื้อ
                                        </Button>
                                    </>
                                )}
                            </Card>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}
