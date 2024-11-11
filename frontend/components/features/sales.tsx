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
import { Loader2, Package, Plus, Trash } from "lucide-react";
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

interface Customer {
    id: string;
    name: string;
    cpfOrCnpj: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

interface Sale {
    id: string;
    name: string;
    description: string;
    customerId: string;
    saleDate: Date;
    customer: Customer;
    saleProducts: any[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export default function Sales() {
    const router = useRouter();

    const [openSeeProducts, setOpenSeeProducts] = useState(false);
    const [saleSelected, setSaleSelected] = useState<Sale>();

    const [sales, setSales] = useState<Sale[]>([]);
    const [loadingSales, setLoadingSales] = useState(false);

    const [loadingDeleteSale, setLoadingDeleteSale] = useState(false);
    const [deleteSaleId, setDeleteSaleId] = useState("");

    const fetchSales = async () => {
        try {
            setLoadingSales(true);
            const response = await api.get<Sale[]>("/sale");
            setSales(response.data);
        } catch (error) {
            console.log("Erro ao buscar vendas: ", error);
        } finally {
            setLoadingSales(false);
        }
    };

    const searchSales = async (query: String) => {
        try {
            setLoadingSales(true);
            const responseSales = await api.get<Sale[]>(
                `/sale/search/${query}`
            );
            setSales(responseSales.data);
        } catch (error) {
            console.log("Erro ao procurar vendas: ", error);
        } finally {
            setLoadingSales(false);
        }
    };

    const deleteSale = async (saleId: string) => {
        try {
            setDeleteSaleId(saleId);
            setLoadingDeleteSale(true);
            await api.delete<Sale[]>(`/sale/${saleId}`);
            fetchSales();
        } catch (error) {
            console.log("Erro ao deletar vendas: ", error);
        } finally {
            setLoadingDeleteSale(false);
            setDeleteSaleId("");
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return (
        <>
            <div className="w-full">
                <AdminSearch
                    placeholder="Pesquisar vendas..."
                    callBack={(query) => {
                        if (!query) {
                            fetchSales();
                        } else {
                            searchSales(query);
                        }
                    }}
                />
            </div>

            <Dialog open={openSeeProducts} onOpenChange={setOpenSeeProducts}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Produtos</DialogTitle>
                        <DialogDescription>
                            Listagem dos produtos da venda selecionada
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
                                        Fabricante
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Preço
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Data
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {saleSelected?.saleProducts.map(
                                    (saleProducts) => (
                                        <TableRow
                                            key={saleProducts.id}
                                            className="bg-accent group"
                                        >
                                            <TableCell>
                                                <div className="font-medium">
                                                    {saleProducts.product.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {
                                                    saleProducts.product
                                                        .description
                                                }
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {saleProducts.product.brand}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                R$ {saleProducts.product.price}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatToBrazilianDate(
                                                    saleProducts.product
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
                    <CardTitle>Vendas</CardTitle>

                    <Button onClick={() => router.push("/vendas/criar-venda")}>
                        <Plus /> Criar venda
                    </Button>
                </CardHeader>

                {loadingSales ? (
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
                                            Cliente
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Data da venda
                                        </TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sales.map((sale) => (
                                        <TableRow
                                            key={sale.id}
                                            className="bg-accent group"
                                        >
                                            <TableCell>
                                                <div className="font-medium">
                                                    {sale.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {sale.description}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {sale.customer.name}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatToBrazilianDate(
                                                    sale.saleDate
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
                                                                    setSaleSelected(
                                                                        sale
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
                                                            {loadingDeleteSale &&
                                                            deleteSaleId ===
                                                                sale.id ? (
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
                                                                        deleteSale(
                                                                            sale.id
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
