"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Loader2, Package, Plus, ShoppingCart, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/app/services/axios";
import { formatToBrazilianDate } from "@/lib/utils";
import AdminSearch from "./admin-search";
import LoadingTableSkeleton from "../LoadingTableSkeleton";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    cnpj: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

interface Purchase {
    id: string;
    name: string;
    description: string;
    supplierId: string;
    supplier: Supplier;
    PurchaseSaleProducts: any[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export default function Purchases() {
    const router = useRouter();

    const [openSeeProducts, setOpenSeeProducts] = useState(false);
    const [purchaseSelected, setPurchaseSelected] = useState<Purchase>();

    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loadingPurchases, setLoadingPurchases] = useState(false);

    const [loadingDeletePurchase, setLoadingDeletePurchase] = useState(false);
    const [deletePurchaseId, setDeletePurchaseId] = useState("");

    const fetchPurchases = async () => {
        try {
            setLoadingPurchases(true);
            const response = await api.get<Purchase[]>("/purchase");
            setPurchases(response.data);
        } catch (error) {
            console.log("Erro ao buscar compras: ", error);
        } finally {
            setLoadingPurchases(false);
        }
    };

    const searchPurchases = async (query: String) => {
        try {
            setLoadingPurchases(true);
            const response = await api.get<Purchase[]>(
                `/purchase/search/${query}`
            );
            setPurchases(response.data);
        } catch (error) {
            console.log("Erro ao procurar compras: ", error);
        } finally {
            setLoadingPurchases(false);
        }
    };

    const deletePurchase = async (purchaseId: string) => {
        try {
            setDeletePurchaseId(purchaseId);
            setLoadingDeletePurchase(true);
            await api.delete<Purchase[]>(`/purchase/${purchaseId}`);
            fetchPurchases();
        } catch (error) {
            console.log("Erro ao deletar compra: ", error);
        } finally {
            setLoadingDeletePurchase(false);
            setDeletePurchaseId("");
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    return (
        <>
            <div className="w-full">
                <AdminSearch
                    placeholder="Pesquisar compras..."
                    callBack={(query) => {
                        if (!query) {
                            fetchPurchases();
                        } else {
                            searchPurchases(query);
                        }
                    }}
                />
            </div>

            <Dialog open={openSeeProducts} onOpenChange={setOpenSeeProducts}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Produtos</DialogTitle>
                        <DialogDescription>
                            Listagem dos produtos das vendas selecionadas na
                            compra
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Descrição
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Nome da Venda
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Fornecedor
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Preço
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Data da compra
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchaseSelected?.PurchaseSaleProducts.map(
                                    (purchaseSaleProduct) => (
                                        <TableRow
                                            key={purchaseSaleProduct.id}
                                            className="bg-accent group"
                                        >
                                            <TableCell>
                                                <div className="font-medium">
                                                    {
                                                        purchaseSaleProduct
                                                            .saleProduct.product
                                                            .name
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {
                                                    purchaseSaleProduct
                                                        .saleProduct.product
                                                        .description
                                                }
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {
                                                    purchaseSaleProduct
                                                        .saleProduct.sale.name
                                                }
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {
                                                    purchaseSaleProduct
                                                        .saleProduct.product
                                                        .brand
                                                }
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                R${" "}
                                                {
                                                    purchaseSaleProduct
                                                        .saleProduct.product
                                                        .price
                                                }
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatToBrazilianDate(
                                                    purchaseSaleProduct
                                                        .saleProduct.product
                                                        .createdAt
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => setOpenSeeProducts(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader className="px-7 flex-row items-center justify-between">
                    <CardTitle>Compras</CardTitle>

                    <Button
                        onClick={() => router.push("/compras/criar-compra")}
                    >
                        <Plus /> Criar compra
                    </Button>
                </CardHeader>

                {loadingPurchases ? (
                    <CardContent>
                        <LoadingTableSkeleton />
                        <LoadingTableSkeleton />
                        <LoadingTableSkeleton />
                        <LoadingTableSkeleton />
                        <LoadingTableSkeleton />
                    </CardContent>
                ) : (
                    <CardContent>
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            Descrição
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            Fornecedor
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Data da compra
                                        </TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchases.map((purchase) => (
                                        <TableRow
                                            key={purchase.id}
                                            className="bg-accent group"
                                        >
                                            <TableCell>
                                                <div className="font-medium">
                                                    {purchase.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {purchase.description}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {purchase.supplier.name}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatToBrazilianDate(
                                                    purchase.createdAt
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setPurchaseSelected(
                                                                        purchase
                                                                    );
                                                                    setOpenSeeProducts(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <Package className="text-blue-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Ver Produtos
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            {loadingDeletePurchase &&
                                                            deletePurchaseId ===
                                                                purchase.id ? (
                                                                <Button
                                                                    disabled
                                                                >
                                                                    <Loader2 className="animate-spin text-red-500" />
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        deletePurchase(
                                                                            purchase.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash className="text-red-500" />
                                                                </Button>
                                                            )}
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Deletar
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TooltipProvider>
                    </CardContent>
                )}
            </Card>
        </>
    );
}
