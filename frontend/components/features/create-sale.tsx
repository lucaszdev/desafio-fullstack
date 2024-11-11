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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import api from "@/app/services/axios";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";

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

interface SaleFormData {
    name: string;
    description: string;
    customerId: string;
    saleDate: String;
    saleProducts: { productId: string; quantity: number }[];
}

const saleSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    customerId: z.string().uuid("Selecione um cliente"),
    saleDate: z.date(),
    saleProducts: z
        .array(
            z.object({
                productId: z.string().uuid("Produto inválido"),
                quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
            })
        )
        .min(1, "Selecione pelo menos um produto"),
});

const CreateSale = () => {
    const router = useRouter();

    const [loadingCreatingSale, setLoadingCreatingSale] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const {
        register,
        setValue,
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SaleFormData>({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            name: "",
            description: "",
            customerId: "",
            saleDate: undefined,
            saleProducts: [],
        },
    });

    const [selectedProducts, setSelectedProducts] = useState<
        { productId: string; quantity: number }[]
    >([]);
    const [date, setDate] = useState<Date | undefined>();
    const [isPopoverOpen, setPopoverOpen] = useState(false);

    const onSubmit = async (data: any) => {
        const formData: SaleFormData = {
            ...data,
            saleDate: date?.toISOString(),
            saleProducts: selectedProducts,
        };

        try {
            setLoadingCreatingSale(true);
            await api.post<SaleFormData>("/sale", formData);
            router.back();
        } catch (error) {
            console.log("Erro ao criar venda", error);
        } finally {
            setLoadingCreatingSale(false);
            reset();
        }
    };

    const handleProductChange = (productId: string, quantity: number) => {
        setSelectedProducts((prev) => {
            const existingProduct = prev.find(
                (item) => item.productId === productId
            );

            let updatedProducts;

            if (existingProduct) {
                updatedProducts = prev.map((item) =>
                    item.productId === productId ? { ...item, quantity } : item
                );
            } else {
                updatedProducts = [...prev, { productId, quantity }];
            }

            setValue("saleProducts", updatedProducts, { shouldValidate: true });
            return updatedProducts;
        });
    };

    const fetchCustomers = async () => {
        try {
            setLoadingCustomers(true);
            const response = await api.get<Customer[]>("/customer");
            setCustomers(response.data);
        } catch (error) {
            console.log("Erro ao buscar clientes: ", error);
        } finally {
            setLoadingCustomers(false);
        }
    };

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

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    return (
        <Card>
            <CardHeader className="px-7">
                <CardTitle>Criar Venda</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name and Description */}
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            id="name"
                            placeholder="Nome da venda..."
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
                            placeholder="Descrição da venda..."
                            className="col-span-3"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Select Customer */}
                    <div>
                        <Label className="pb-3">Cliente</Label>

                        <Select
                            onValueChange={(customerId) => {
                                setValue("customerId", customerId);
                            }}
                        >
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Clientes</SelectLabel>
                                    {customers.map((customer) => (
                                        <SelectItem
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {errors.customerId && (
                        <p className="text-red-500">
                            {errors.customerId.message}
                        </p>
                    )}

                    {/* Sale Date Picker */}
                    <div>
                        <Label className="pr-5">Data da venda</Label>
                        <Controller
                            name="saleDate"
                            control={control}
                            render={({ field }) => (
                                <Popover
                                    open={isPopoverOpen}
                                    onOpenChange={setPopoverOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                            onClick={() => setPopoverOpen(true)}
                                        >
                                            <CalendarIcon />

                                            {date ? (
                                                format(date, "PPP")
                                            ) : (
                                                <span>Selecione a data</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(newDate) => {
                                                setDate(newDate);
                                                field.onChange(newDate);
                                                setPopoverOpen(false); // Close the popover
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />

                        {errors.saleDate && (
                            <p className="text-red-500">
                                {errors.saleDate.message}
                            </p>
                        )}
                    </div>

                    {/* Select Products and Quantities */}
                    <div>
                        <Label>Produtos</Label>

                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center space-x-2 py-2">
                                    <Checkbox
                                        id="product"
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                handleProductChange(
                                                    product.id,
                                                    1
                                                );
                                            } else {
                                                setSelectedProducts((prev) =>
                                                    prev.filter(
                                                        (item) =>
                                                            item.productId !==
                                                            product.id
                                                    )
                                                );
                                            }
                                        }}
                                    />

                                    <Label
                                        htmlFor="product"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {product.name}
                                    </Label>
                                </div>

                                {errors.saleProducts && (
                                    <p className="text-xs text-red-500 col-span-3 ml-auto">
                                        {errors.saleProducts.message}
                                    </p>
                                )}

                                {selectedProducts.some(
                                    (item) => item.productId === product.id
                                ) && (
                                    <div className="flex items-center gap-2">
                                        <Label
                                            htmlFor={`quantity-${product.id}`}
                                            className="text-sm font-medium"
                                        >
                                            Quantidade
                                        </Label>

                                        <Input
                                            id={`quantity-${product.id}`}
                                            type="number"
                                            min="1"
                                            value={
                                                selectedProducts.find(
                                                    (item) =>
                                                        item.productId ===
                                                        product.id
                                                )?.quantity || 1
                                            }
                                            onChange={(e) =>
                                                handleProductChange(
                                                    product.id,
                                                    Math.max(
                                                        1,
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                )
                                            }
                                            className="w-16"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}

                    {loadingCreatingSale ? (
                        <Button disabled>
                            <Loader2 className="animate-spin text-red-500" />
                        </Button>
                    ) : (
                        <Button type="submit">Criar Venda</Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateSale;
