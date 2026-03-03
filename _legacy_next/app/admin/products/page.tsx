
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your digital products and inventory.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>
                        A list of all digital products available for sale.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="hidden md:table-cell">Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Product Row 1 */}
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <img
                                        alt="Product image"
                                        className="aspect-square rounded-md object-contain bg-secondary/10 p-1"
                                        height="64"
                                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    ChatGPT Plus (Shared)
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">AI Tools</Badge>
                                </TableCell>
                                <TableCell>{formatPrice(499)}</TableCell>
                                <TableCell className="hidden md:table-cell">Subscription</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>

                            {/* Product Row 2 */}
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <img
                                        alt="Product image"
                                        className="aspect-square rounded-md object-contain bg-secondary/10 p-1"
                                        height="64"
                                        src="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png"
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    Netflix Premium 4K
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">Streaming</Badge>
                                </TableCell>
                                <TableCell>{formatPrice(299)}</TableCell>
                                <TableCell className="hidden md:table-cell">Subscription</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>

                            {/* Product Row 3 */}
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <img
                                        alt="Product image"
                                        className="aspect-square rounded-md object-contain bg-secondary/10 p-1"
                                        height="64"
                                        src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_11_logo.svg"
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    Windows 11 Pro Key
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">Software</Badge>
                                </TableCell>
                                <TableCell>{formatPrice(599)}</TableCell>
                                <TableCell className="hidden md:table-cell">License Key</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
