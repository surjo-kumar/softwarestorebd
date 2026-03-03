
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
import { Loader2, Search, Copy, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const MotionTableRow = motion(TableRow);

export default function AdminPaymentsPage() {
    const supabase = createClient();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { toast } = useToast();
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    async function fetchPendingOrders() {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, products(title)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
        } else {
            console.log("Pending Orders:", data);
            setOrders(data || []);
        }
        setLoading(false);
    }

    async function handleApprove(id: string) {
        if (!confirm("Are you sure you want to approve this payment?")) return;
        setProcessingId(id);

        const { error } = await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', id);

        if (error) {
            toast({ title: "Error", description: "Failed to approve payment", variant: "destructive" });
        } else {
            setOrders(orders.filter(o => o.id !== id));
            toast({ title: "Approved", description: "Payment approved and order completed." });
        }
        setProcessingId(null);
    }

    async function handleReject(id: string) {
        if (!confirm("Are you sure you want to REJECT this payment?")) return;
        setProcessingId(id);

        const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', id);

        if (error) {
            toast({ title: "Error", description: "Failed to reject payment", variant: "destructive" });
        } else {
            setOrders(orders.filter(o => o.id !== id));
            toast({ title: "Rejected", description: "Payment rejected and order cancelled." });
        }
        setProcessingId(null);
    }

    const filteredOrders = orders.filter(o =>
        o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
        o.id.includes(search) ||
        o.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
        o.mobile_number?.includes(search)
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied", description: "Copied to clipboard" });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Pending Payments</h1>
                <Badge variant="outline" className="text-lg px-4 py-1">
                    {filteredOrders.length} Pending
                </Badge>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by email, TrxID, or Phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>TrxID / Method</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product / Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle className="h-10 w-10 text-green-500/50" />
                                            <p>No pending payments. All caught up!</p>
                                        </div>
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
                                        className="group"
                                    >
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <code className="text-sm font-bold bg-muted px-1.5 py-0.5 rounded select-all">
                                                        {order.transaction_id || "NO_TRX_ID"}
                                                    </code>
                                                    <Copy
                                                        className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                                                        onClick={() => copyToClipboard(order.transaction_id)}
                                                    />
                                                </div>
                                                <Badge variant="secondary" className="w-fit text-xs capitalize">
                                                    {order.payment_provider}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.customer_name}</span>
                                                <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                                <span className="text-xs font-mono text-blue-600 mt-0.5">
                                                    {order.mobile_number}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{order.products?.title || "Unknown"}</span>
                                                <span className="text-xs text-muted-foreground mb-1">{order.duration}</span>
                                                <span className="font-bold text-green-600">
                                                    {formatPrice(order.amount)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                                <br />
                                                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleReject(order.id)}
                                                    disabled={processingId === order.id}
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="h-8 gap-1 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleApprove(order.id)}
                                                    disabled={processingId === order.id}
                                                >
                                                    {processingId === order.id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-3 w-3" /> Approve
                                                        </>
                                                    )}
                                                </Button>
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
