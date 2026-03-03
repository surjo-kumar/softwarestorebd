
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
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const MotionTableRow = motion(TableRow);

export default function AdminUsersPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Since we can't easily list all AUTH users with client SDK without edge functions or admin api,
        // we will fetch from the 'users' public table if it exists, or simulated from orders.
        // Assuming there is a public 'users' table or we just list customers from 'orders' for now as a fallback.
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        // Attempt to fetch from 'users' table or similar data source
        const { data, error } = await supabase
            .from('users') // Assuming a public profiles table exists
            .select('*');

        if (error) {
            console.warn("Could not fetch users table directly (might be RLS or table missing). Fetching distinct customers from orders instead.");
            // Fallback: Get distinct customers from orders
            const { data: orders } = await supabase.from('orders').select('customer_email, customer_name, created_at');
            if (orders) {
                // Deduplicate by email
                const uniqueUsers = Array.from(new Map(orders.map(item => [item.customer_email, item])).values());
                setUsers(uniqueUsers);
            }
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    }

    const filteredUsers = users.filter(u =>
        (u.email || u.customer_email)?.toLowerCase().includes(search.toLowerCase()) ||
        (u.name || u.customer_name)?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Users & Customers</h1>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]"></TableHead>
                            <TableHead>Namę</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined / First Order</TableHead>
                            <TableHead>Role</TableHead>
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
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user, idx) => (
                                    <MotionTableRow
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.005, backgroundColor: "var(--accent)" }}
                                        className="cursor-pointer"
                                    >
                                        <TableCell>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar_url} />
                                                <AvatarFallback>
                                                    {(user.name || user.customer_name || 'U').charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{user.name || user.customer_name || 'Unknown'}</TableCell>
                                        <TableCell>{user.email || user.customer_email}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 bg-gray-50 text-gray-600">
                                                {user.role || 'Customer'}
                                            </span>
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
