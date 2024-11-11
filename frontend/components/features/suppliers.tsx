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
import { useEffect, useState } from "react";
import api from "@/app/services/axios";
import { formatToBrazilianDate } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminSearch from "./admin-search";
import LoadingTableSkeleton from "../LoadingTableSkeleton";

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

const supplierSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z
        .string()
        .regex(
            /^\(\d{2}\) \d{4,5}-\d{4}$/,
            "Telefone inválido. Use o formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX"
        ),
    cnpj: z
        .string()
        .regex(
            /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
            "CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX"
        ),
    address: z.string().min(1, "Endereço é obrigatório"),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    const [loadingEditSupplier, setLoadingAddSupplier] = useState(false);
    const [editSupplierObj, setEditSupplierObj] = useState<Supplier>();

    const [loadingAddSupplier, setLoadingEditSupplier] = useState(false);

    const [loadingDeleteSupplier, setLoadingDeleteSupplier] = useState(false);
    const [deleteSupplierId, setDeleteSupplierId] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogEditOpen, setDialogEditOpen] = useState(false);

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

    const editSupplier = async (supplierData: SupplierFormData) => {
        try {
            setLoadingEditSupplier(true);
            await api.put<Supplier>(
                `/supplier/${editSupplierObj?.id}`,
                supplierData
            );
            fetchSuppliers();
        } catch (error) {
            console.log("Erro ao editar fornecedores: ", error);
        } finally {
            setLoadingEditSupplier(false);
            setEditSupplierObj({} as Supplier);
            setDialogEditOpen(false);
            reset();
        }
    };

    const searchSuppliers = async (query: String) => {
        try {
            setLoadingSuppliers(true);
            const responseSuppliers = await api.get<Supplier[]>(
                `/supplier/search/${query}`
            );
            setSuppliers(responseSuppliers.data);
        } catch (error) {
            console.log("Erro ao procurar fornecedores: ", error);
        } finally {
            setLoadingSuppliers(false);
        }
    };

    const deleteSupplier = async (supplierId: string) => {
        try {
            setDeleteSupplierId(supplierId);
            setLoadingDeleteSupplier(true);
            await api.delete<Supplier[]>(`/supplier/${supplierId}`);
            fetchSuppliers();
        } catch (error) {
            console.log("Erro ao deletar fornecedore: ", error);
        } finally {
            setLoadingDeleteSupplier(false);
            setDeleteSupplierId("");
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
    });

    const onSubmit = async (data: SupplierFormData) => {
        try {
            setLoadingAddSupplier(true);
            await api.post<Supplier>("/supplier", data);
            fetchSuppliers();
        } catch (error) {
            console.log("Erro ao adicionar fornecedor", error);
        } finally {
            setLoadingAddSupplier(false);
            setDialogOpen(false);
            reset();
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <>
            <div className="w-full">
                <AdminSearch
                    placeholder="Pesquisar fornecedores..."
                    callBack={(query) => {
                        if (!query) {
                            fetchSuppliers();
                        } else {
                            searchSuppliers(query);
                        }
                    }}
                />
            </div>

            <Card>
                <CardHeader className="px-7 flex-row items-center justify-between">
                    <CardTitle>Fornecedores</CardTitle>

                    <Dialog
                        open={dialogEditOpen}
                        onOpenChange={setDialogEditOpen}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Editar fornecedor</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(editSupplier)}>
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
                                            placeholder="Nome do fornecedor..."
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
                                            htmlFor="email"
                                            className="text-right"
                                        >
                                            Email
                                        </Label>

                                        <Input
                                            id="email"
                                            placeholder="Digite o email do fornecedor..."
                                            className="col-span-3"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="cnpj"
                                            className="text-right"
                                        >
                                            CNPJ
                                        </Label>
                                        <Input
                                            id="cnpj"
                                            placeholder="Digite o CNPJ..."
                                            className="col-span-3"
                                            {...register("cnpj")}
                                        />
                                        {errors.cnpj && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.cnpj.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="phone"
                                            className="text-right"
                                        >
                                            Telefone
                                        </Label>
                                        <Input
                                            id="phone"
                                            placeholder="Telefone do fornecedor..."
                                            inputMode="numeric"
                                            className="col-span-3"
                                            {...register("phone", {
                                                pattern: {
                                                    value: /^\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}$/,
                                                    message:
                                                        "Telefone inválido (ex: (11) 98765-4321)",
                                                },
                                            })}
                                        />
                                        {errors.phone && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="address"
                                            className="text-right"
                                        >
                                            Endereço
                                        </Label>
                                        <Input
                                            id="address"
                                            placeholder="Endereço do fornecedor..."
                                            className="col-span-3"
                                            {...register("address")}
                                        />
                                        {errors.address && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter>
                                    {loadingEditSupplier ? (
                                        <Button disabled>
                                            <Loader2 className="animate-spin" />
                                            Salvando fornecedor
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
                                <Plus /> Adicionar fornecedor
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar fornecedor</DialogTitle>
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
                                            placeholder="Nome do fornecedor..."
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
                                            htmlFor="cnpj"
                                            className="text-right"
                                        >
                                            CNPJ
                                        </Label>
                                        <Input
                                            id="cnpj"
                                            placeholder="Digite o CNPJ do fornecedor..."
                                            className="col-span-3"
                                            {...register("cnpj")}
                                        />
                                        {errors.cnpj && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.cnpj.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="email"
                                            className="text-right"
                                        >
                                            E-Mail
                                        </Label>

                                        <Input
                                            id="email"
                                            placeholder="Digite o E-Mail do fornecedor..."
                                            className="col-span-3"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="phone"
                                            className="text-right"
                                        >
                                            Telefone
                                        </Label>
                                        <Input
                                            id="phone"
                                            placeholder="Digite o telefone do fornecedor..."
                                            inputMode="numeric"
                                            className="col-span-3"
                                            {...register("phone", {
                                                pattern: {
                                                    value: /^\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}$/,
                                                    message:
                                                        "Telefone inválido (ex: (11) 98765-4321)",
                                                },
                                            })}
                                        />
                                        {errors.phone && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="address"
                                            className="text-right"
                                        >
                                            Endereço
                                        </Label>

                                        <Input
                                            id="address"
                                            placeholder="Digite o Endereço do fornecedor..."
                                            className="col-span-3"
                                            {...register("address")}
                                        />
                                        {errors.address && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter>
                                    {loadingAddSupplier ? (
                                        <Button disabled>
                                            <Loader2 className="animate-spin" />
                                            Adicionando Fornecedor
                                        </Button>
                                    ) : (
                                        <Button type="submit">Adicionar</Button>
                                    )}
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                {loadingSuppliers ? (
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
                                            CNPJ
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            E-Mail
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            Telefone
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            Endereço
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Data
                                        </TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suppliers.map((supplier) => (
                                        <TableRow
                                            key={supplier.id}
                                            className="bg-accent group"
                                        >
                                            <TableCell>
                                                <div className="font-medium">
                                                    {supplier.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {supplier.cnpj}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {supplier.email}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {supplier.phone}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {supplier.address}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatToBrazilianDate(
                                                    supplier.createdAt
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
                                                                    setEditSupplierObj(
                                                                        supplier
                                                                    );

                                                                    setValue(
                                                                        "name",
                                                                        supplier.name
                                                                    );
                                                                    setValue(
                                                                        "cnpj",
                                                                        supplier.cnpj
                                                                    );
                                                                    setValue(
                                                                        "email",
                                                                        supplier.email
                                                                    );
                                                                    setValue(
                                                                        "phone",
                                                                        supplier.phone
                                                                    );
                                                                    setValue(
                                                                        "address",
                                                                        supplier.address
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
                                                            {loadingDeleteSupplier &&
                                                            deleteSupplierId ===
                                                                supplier.id ? (
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
                                                                        deleteSupplier(
                                                                            supplier.id
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
