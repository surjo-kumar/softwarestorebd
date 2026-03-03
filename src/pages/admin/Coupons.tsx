
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus, Trash2, Loader2, Tag, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const MotionTableRow = motion(TableRow);

interface Coupon {
    id: string;
    code: string;
    discount_amount: number;
    discount_type: 'percentage' | 'fixed';
    is_active: boolean;
    created_at: string;
}

export default function AdminCouponsPage() {
    const supabase = createClient();
    const { toast } = useToast();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    // Sheet State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discount_amount: "10",
        discount_type: "percentage",
        is_active: true
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    async function fetchCoupons() {
        setLoading(true);
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCoupons(data);
        }
        setLoading(false);
    }

    const openCreateSheet = () => {
        setFormData({ code: "", discount_amount: "10", discount_type: "percentage", is_active: true });
        setIsSheetOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            code: formData.code.toUpperCase(),
            discount_amount: parseFloat(formData.discount_amount),
            discount_type: formData.discount_type,
            is_active: formData.is_active
        };

        const { data, error } = await supabase
            .from('coupons')
            .insert([payload])
            .select()
            .single();

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else if (data) {
            toast({ title: "Success", description: "Coupon created successfully" });
            setCoupons([data, ...coupons]);
            setIsSheetOpen(false);
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;

        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id);

        if (error) {
            toast({ title: "Error", description: "Failed to delete coupon.", variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Coupon deleted" });
            setCoupons(coupons.filter(c => c.id !== id));
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase.from('coupons').update({ is_active: !currentStatus }).eq('id', id);
        if (!error) {
            setCoupons(coupons.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
                <Button onClick={openCreateSheet} className="gap-2">
                    <Plus className="h-4 w-4" /> Create Coupon
                </Button>
            </div>

            <div className="border rounded-lg bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
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
                            ) : coupons.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No coupons found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                coupons.map((coupon, index) => (
                                    <MotionTableRow
                                        key={coupon.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        whileHover={{ scale: 1.01, backgroundColor: "var(--accent)" }}
                                    >
                                        <TableCell className="font-medium font-mono">
                                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {
                                                navigator.clipboard.writeText(coupon.code);
                                                toast({ title: "Copied", description: "Coupon code copied to clipboard" });
                                            }}>
                                                <Tag className="h-4 w-4 text-primary" />
                                                {coupon.code}
                                                <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {coupon.discount_type === 'percentage' ? `${coupon.discount_amount}%` : `BDT ${coupon.discount_amount}`}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={coupon.is_active ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                                            >
                                                {coupon.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(coupon.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                onClick={() => handleDelete(coupon.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </MotionTableRow>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Create Coupon</SheetTitle>
                        <SheetDescription>
                            Add a new discount code for your customers.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Coupon Code</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                placeholder="e.g. SUMMER20"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="discount">Amount</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={formData.discount_amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.discount_type}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, discount_type: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <SheetFooter>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Creating..." : "Create Coupon"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}
