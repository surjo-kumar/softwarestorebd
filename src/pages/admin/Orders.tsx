
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Loader2, Search, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const MotionTableRow = motion(TableRow);

export default function AdminOrdersPage() {
    const supabase = createClient();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        // We need to join with products to get product title
        const { data, error } = await supabase
            .from('orders')
            .select('*, products(title)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
        } else {
            console.log("Orders data:", data); // Debugging
            setOrders(data || []);
        }
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error("Error updating order:", error);
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        } else {
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            toast({ title: "Success", description: "Order status updated" });
        }
    }

    const filteredOrders = orders.filter(o =>
        o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
        o.id.includes(search) ||
        o.transaction_id?.toLowerCase().includes(search.toLowerCase())
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied", description: "Copied to clipboard" });
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Orders</h1>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by email, ID, or TrxID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Customer / Mobile</TableHead>
                            <TableHead>Amount & Method</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <MotionTableRow
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        whileHover={{ scale: 1.005, backgroundColor: "var(--accent)" }}
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{order.products?.title || "Unknown Product"}</span>
                                                <span className="text-xs text-muted-foreground font-mono">ID: {order.id.slice(0, 8)}...</span>
                                                {order.duration && <span className="text-xs badge bg-gray-100 rounded px-1 w-fit">{order.duration}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{order.customer_name}</span>
                                                <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                                {order.mobile_number && <span className="text-xs text-blue-600 font-mono">{order.mobile_number}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary">{formatPrice(order.amount)}</span>
                                                <span className="text-xs capitalize flex items-center gap-1">
                                                    {order.payment_provider}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {order.transaction_id ? (
                                                <div className="flex items-center gap-1 group">
                                                    <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono select-all">
                                                        {order.transaction_id}
                                                    </code>
                                                    <Button size="icon" variant="ghost" className="h-5 w-5 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(order.transaction_id)}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={order.status === 'completed' ? 'default' : 'outline'}
                                                className={
                                                    order.status === 'completed' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                        order.status === 'pending' ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                                                            ""
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end">
                                                <Select
                                                    defaultValue={order.status}
                                                    onValueChange={(val) => updateStatus(order.id, val)}
                                                >
                                                    <SelectTrigger className="w-[110px] h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                        <SelectItem value="refunded">Refunded</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                    </MotionTableRow>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
