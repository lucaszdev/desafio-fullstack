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
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import api from "@/app/services/axios";
import { formatToBrazilianDate } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminSearch from "./admin-search";
import LoadingTableSkeleton from "../LoadingTableSkeleton";

interface Product {
    id: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

const productSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    brand: z.string().min(1, "Fabricante é obrigatório"),
    price: z
        .string()
        .refine((val) => /^(\d+(\.\d{1,2})?)?$/.test(val), {
            message: "Digite um preço válido (ex: 123.45)",
        })
        .transform((val) => parseFloat(val)),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [loadingEditProduct, setLoadingAddProduct] = useState(false);
    const [editProductObj, setEditProductObj] = useState<Product>();

    const [loadingAddProduct, setLoadingEditProduct] = useState(false);

    const [loadingDeleteProduct, setLoadingDeleteProduct] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogEditOpen, setDialogEditOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await api.get<Product[]>("/product");
            setProducts(response.data);
        } catch (error) {
            console.log("Erro ao buscar produtos: ", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const editProduct = async (productData: ProductFormData) => {
        try {
            setLoadingEditProduct(true);
            await api.put<Product>(
                `/product/${editProductObj?.id}`,
                productData
            );
            fetchProducts();
        } catch (error) {
            console.log("Erro ao editar o produto: ", error);
        } finally {
            setLoadingEditProduct(false);
            setEditProductObj({} as Product);
            setDialogEditOpen(false);
            reset();
        }
    };

    const searchProducts = async (query: String) => {
        try {
            setLoadingProducts(true);
            const responseProducts = await api.get<Product[]>(
                `/product/search/${query}`
            );
            setProducts(responseProducts.data);
        } catch (error) {
            console.log("Erro ao procurar os produtos: ", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const deleteProduct = async (productId: string) => {
        try {
            setDeleteProductId(productId);
            setLoadingDeleteProduct(true);
            await api.delete<Product[]>(`/product/${productId}`);
            fetchProducts();
        } catch (error) {
            console.log("Erro ao deletar o produto: ", error);
        } finally {
            setLoadingDeleteProduct(false);
            setDeleteProductId("");
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    });

    const onSubmit = async (data: ProductFormData) => {
        try {
            setLoadingAddProduct(true);
            await api.post<Product>("/product", data);
            fetchProducts();
        } catch (error) {
            console.log("Erro ao adicionar produto", error);
        } finally {
            setLoadingAddProduct(false);
            setDialogOpen(false);
            reset();
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <div className="w-full">
                <AdminSearch
                    placeholder="Pesquisar produtos..."
                    callBack={(query) => {
                        if (!query) {
                            fetchProducts();
                        } else {
                            searchProducts(query);
                        }
                    }}
                />
            </div>

            <Card>
                <CardHeader className="px-7 flex-row items-center justify-between">
                    <CardTitle>Produtos</CardTitle>

                    <Dialog
                        open={dialogEditOpen}
                        onOpenChange={setDialogEditOpen}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Editar produto</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(editProduct)}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="name"
                                            className="text-right"
                                        >
                                            Nome
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Nome do produto..."
                                            className="col-span-3"
                                            {...register("name")}
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="description"
                                            className="text-right"
                                        >
                                            Descrição
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Descrição do produto..."
                                            className="col-span-3"
                                            {...register("description")}
                                        />
                                        {errors.description && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.description.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="brand"
                                            className="text-right"
                                        >
                                            Fabricante
                                        </Label>

                                        <Input
                                            id="brand"
                                            placeholder="Fabricante do produto..."
                                            className="col-span-3"
                                            {...register("brand")}
                                        />
                                        {errors.brand && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.brand.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="price"
                                            className="text-right"
                                        >
                                            Preço
                                        </Label>
                                        <Input
                                            id="price"
                                            placeholder="Preço do produto..."
                                            inputMode="numeric"
                                            className="col-span-3"
                                            {...register("price", {
                                                pattern: {
                                                    value: /^\d+(\.\d{1,2})?$/,
                                                    message:
                                                        "Digite um preço válido (ex: 123.45)",
                                                },
                                            })}
                                        />
                                        {errors.price && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.price.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter>
                                    {loadingEditProduct ? (
                                        <Button disabled>
                                            <Loader2 className="animate-spin" />
                                            Salvando produto
                                        </Button>
                                    ) : (
                                        <Button type="submit">Salvar</Button>
                                    )}
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => reset()}>
                                <Plus /> Adicionar produto
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar produto</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="name"
                                            className="text-right"
                                        >
                                            Nome
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Nome do produto..."
                                            className="col-span-3"
                                            {...register("name")}
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="description"
                                            className="text-right"
                                        >
                                            Descrição
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Descrição do produto..."
                                            className="col-span-3"
                                            {...register("description")}
                                        />
                                        {errors.description && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.description.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="brand"
                                            className="text-right"
                                        >
                                            Fabricante
                                        </Label>

                                        <Input
                                            id="brand"
                                            placeholder="Fabricante do produto..."
                                            className="col-span-3"
                                            {...register("brand")}
                                        />
                                        {errors.brand && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.brand.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="price"
                                            className="text-right"
                                        >
                                            Preço
                                        </Label>
                                        <Input
                                            id="price"
                                            placeholder="Preço do produto..."
                                            inputMode="numeric"
                                            className="col-span-3"
                                            {...register("price", {
                                                pattern: {
                                                    value: /^\d+(\.\d{1,2})?$/,
                                                    message:
                                                        "Digite um preço válido (ex: 123.45)",
                                                },
                                            })}
                                        />
                                        {errors.price && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.price.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter>
                                    {loadingAddProduct ? (
                                        <Button disabled>
                                            <Loader2 className="animate-spin" />
                                            Adicionando produto
                                        </Button>
                                    ) : (
                                        <Button type="submit">Adicionar</Button>
                                    )}
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                {loadingProducts ? (
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
                                            Fabricante
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            Preço
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Data
                                        </TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow
                                            key={product.id}
                                            className="bg-accent group"
                                        >
                                            <TableCell>
                                                <div className="font-medium">
                                                    {product.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {product.description}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {product.brand}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                R$ {product.price}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatToBrazilianDate(
                                                    product.createdAt
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
                                                                    setEditProductObj(
                                                                        product
                                                                    );

                                                                    setValue(
                                                                        "name",
                                                                        product.name
                                                                    );
                                                                    setValue(
                                                                        "description",
                                                                        product.description
                                                                    );
                                                                    setValue(
                                                                        "brand",
                                                                        product.brand
                                                                    );
                                                                    setValue(
                                                                        "price",
                                                                        product.price
                                                                    );

                                                                    setDialogEditOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <Edit className="text-blue-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Editar
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            {loadingDeleteProduct &&
                                                            deleteProductId ===
                                                                product.id ? (
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
                                                                        deleteProduct(
                                                                            product.id
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
