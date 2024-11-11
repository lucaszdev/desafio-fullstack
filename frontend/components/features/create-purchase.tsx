"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn, convertToISOFormat } from "@/lib/utils";
import { Input } from "../ui/input";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import api from "@/app/services/axios";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";

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

interface PurchaseFormData {
    name: string;
    description: string;
    supplierId: string;
    PurchaseSaleProducts: { saleProductId: string }[];
}

const purchaseSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    supplierId: z.string().uuid("Selecione um fornecedor"),
    PurchaseSaleProducts: z
        .array(
            z.object({
                saleProductId: z.string().uuid("Produto da Venda inválido"),
            })
        )
        .min(1, "Selecione ao menos um produto de uma venda"),
});

const CreatePurchase = () => {
    const router = useRouter();

    const [loadingCreatingPurchase, setLoadingCreatingPurchase] =
        useState(false);

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    const [sales, setSales] = useState<Sale[]>([]);
    const [loadingSales, setLoadingSales] = useState(false);

    const {
        register,
        setValue,
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PurchaseFormData>({
        resolver: zodResolver(purchaseSchema),
        defaultValues: {
            name: "",
            description: "",
            supplierId: "",
            PurchaseSaleProducts: [],
        },
    });

    const [selectedSalesProduct, setSelectedSalesProduct] = useState<
        { saleProductId: string }[]
    >([]);

    const onSubmit = async (data: any) => {
        const formData: PurchaseFormData = {
            ...data,
            PurchaseSaleProducts: selectedSalesProduct,
        };

        try {
            setLoadingCreatingPurchase(true);
            await api.post<PurchaseFormData>("/purchase", formData);
            router.back();
        } catch (error) {
            console.log("Erro ao criar compra", error);
        } finally {
            setLoadingCreatingPurchase(false);
            reset();
        }
    };

    const handleSaleProductChange = (
        saleProductId: string,
        checked: boolean
    ) => {
        setSelectedSalesProduct((prev) => {
            const updatedSalesProduct = checked
                ? [...prev, { saleProductId }]
                : prev.filter((item) => item.saleProductId !== saleProductId);

            setValue("PurchaseSaleProducts", updatedSalesProduct);

            return updatedSalesProduct;
        });
    };

    const fetchSuppliers = async () => {
        try {
            setLoadingSuppliers(true);
            const response = await api.get<Supplier[]>("/supplier");
            setSuppliers(response.data);
        } catch (error) {
            console.log("Erro ao buscar fornecedores: ", error);
        } finally {
            setLoadingSuppliers(false);
        }
    };

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

    useEffect(() => {
        fetchSuppliers();
        fetchSales();
    }, []);

    return (
        <Card>
            <CardHeader className="px-7">
                <CardTitle>Criar Compra</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name and Description */}
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            id="name"
                            placeholder="Nome da compra..."
                            className="col-span-3"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                {errors.name.message}
                            </p>
                        )}
                        <Input
                            id="description"
                            placeholder="Descrição da compra..."
                            className="col-span-3"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Select Supplier */}
                    <div>
                        <Label>Fornecedor</Label>

                        <div className="pt-4">
                            <Select
                                onValueChange={(supplierId) => {
                                    setValue("supplierId", supplierId);
                                }}
                            >
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Selecione um fornecedor" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Fornecedores</SelectLabel>
                                        {suppliers.map((supplier) => (
                                            <SelectItem
                                                key={supplier.id}
                                                value={supplier.id}
                                            >
                                                {supplier.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {errors.supplierId && (
                        <p className="text-red-500">
                            {errors.supplierId.message}
                        </p>
                    )}

                    {/* Select Sales */}
                    <div>
                        <Label>Vendas</Label>

                        <div className="flex overflow-x-auto space-x-4 pt-4">
                            {sales.map((sale) => (
                                <Card
                                    key={sale.id}
                                    className="min-w-[300px] flex-shrink-0"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">
                                            {sale.name}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-500">
                                            {sale.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="mt-4 space-y-2">
                                        {sale.saleProducts.map(
                                            (saleProduct) => (
                                                <div
                                                    key={saleProduct.id}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        id={`saleProduct-${saleProduct.id}`}
                                                        checked={selectedSalesProduct.some(
                                                            (item) =>
                                                                item.saleProductId ===
                                                                saleProduct.id
                                                        )}
                                                        onCheckedChange={(
                                                            checked: boolean
                                                        ) => {
                                                            handleSaleProductChange(
                                                                saleProduct.id,
                                                                checked
                                                            );
                                                        }}
                                                    />
                                                    <Label
                                                        htmlFor={`saleProduct-${saleProduct.id}`}
                                                        className="text-sm font-medium leading-none"
                                                    >
                                                        {
                                                            saleProduct.product
                                                                .name
                                                        }
                                                    </Label>
                                                </div>
                                            )
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {errors.PurchaseSaleProducts && (
                        <p className="text-xs text-red-500 col-span-3 ml-auto">
                            {errors.PurchaseSaleProducts.message}
                        </p>
                    )}

                    {/* Submit Button */}

                    {loadingCreatingPurchase ? (
                        <Button disabled>
                            <Loader2 className="animate-spin text-red-500" />
                        </Button>
                    ) : (
                        <Button type="submit">Criar Compra</Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default CreatePurchase;
