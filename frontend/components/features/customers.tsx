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

const customerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),

    cpfOrCnpj: z.string().refine(
        (val) => {
            const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/;
            const cnpjRegex =
                /^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2}$/;

            return cpfRegex.test(val) || cnpjRegex.test(val);
        },
        {
            message: "CPF ou CNPJ inválido",
        }
    ),

    email: z.string().email("Email inválido"),

    phone: z.string().refine(
        (val) => {
            const phoneRegex = /^\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}$/;
            return phoneRegex.test(val);
        },
        {
            message: "Telefone inválido (ex: (11) 98765-4321)",
        }
    ),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    const [loadingEditCustomer, setLoadingAddCustomer] = useState(false);
    const [editCustomerObj, setEditCustomerObj] = useState<Customer>();

    const [loadingAddCustomer, setLoadingEditCustomer] = useState(false);

    const [loadingDeleteCustomer, setLoadingDeleteCustomer] = useState(false);
    const [deleteCustomerId, setDeleteCustomerId] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogEditOpen, setDialogEditOpen] = useState(false);

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

    const editCustomer = async (customerData: CustomerFormData) => {
        try {
            setLoadingEditCustomer(true);
            await api.put<Customer>(
                `/customer/${editCustomerObj?.id}`,
                customerData
            );
            fetchCustomers();
        } catch (error) {
            console.log("Erro ao editar cliente: ", error);
        } finally {
            setLoadingEditCustomer(false);
            setEditCustomerObj({} as Customer);
            setDialogEditOpen(false);
            reset();
        }
    };

    const searchCustomers = async (query: String) => {
        try {
            setLoadingCustomers(true);
            const responseCustomers = await api.get<Customer[]>(
                `/customer/search/${query}`
            );
            setCustomers(responseCustomers.data);
        } catch (error) {
            console.log("Erro ao procurar clientes: ", error);
        } finally {
            setLoadingCustomers(false);
        }
    };

    const deleteCustomer = async (customerId: string) => {
        try {
            setDeleteCustomerId(customerId);
            setLoadingDeleteCustomer(true);
            await api.delete<Customer[]>(`/customer/${customerId}`);
            fetchCustomers();
        } catch (error) {
            console.log("Erro ao deletar cliente: ", error);
        } finally {
            setLoadingDeleteCustomer(false);
            setDeleteCustomerId("");
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
    });

    const onSubmit = async (data: CustomerFormData) => {
        try {
            setLoadingAddCustomer(true);
            await api.post<Customer>("/customer", data);
            fetchCustomers();
        } catch (error) {
            console.log("Erro ao adicionar cliente", error);
        } finally {
            setLoadingAddCustomer(false);
            setDialogOpen(false);
            reset();
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <div className="w-full">
                <AdminSearch
                    placeholder="Pesquisar clientes..."
                    callBack={(query) => {
                        if (!query) {
                            fetchCustomers();
                        } else {
                            searchCustomers(query);
                        }
                    }}
                />
            </div>

            <Card>
                <CardHeader className="px-7 flex-row items-center justify-between">
                    <CardTitle>Clientes</CardTitle>

                    <Dialog
                        open={dialogEditOpen}
                        onOpenChange={setDialogEditOpen}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Editar produto</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(editCustomer)}>
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
                                            placeholder="Nome do cliente..."
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
                                            CPF/CNPJ
                                        </Label>
                                        <Input
                                            id="cpfOrcnpj"
                                            placeholder="Digite o CPF ou CNPJ..."
                                            className="col-span-3"
                                            {...register("cpfOrCnpj")}
                                        />
                                        {errors.cpfOrCnpj && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.cpfOrCnpj.message}
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
                                            placeholder="Digite o email do cliente..."
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
                                            placeholder="Telefone do cliente..."
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
                                </div>

                                <DialogFooter>
                                    {loadingEditCustomer ? (
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
                                <Plus /> Adicionar cliente
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar cliente</DialogTitle>
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
                                            placeholder="Nome do cliente..."
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
                                            htmlFor="cpfOrCnpj"
                                            className="text-right"
                                        >
                                            CPF/CNPJ
                                        </Label>
                                        <Input
                                            id="cpfOrCnpj"
                                            placeholder="Digite o CPF ou CNPJ do cliente..."
                                            className="col-span-3"
                                            {...register("cpfOrCnpj")}
                                        />
                                        {errors.cpfOrCnpj && (
                                            <p className="text-xs text-red-500 col-span-3 ml-auto">
                                                {errors.cpfOrCnpj.message}
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
                                            placeholder="Digite o E-Mail do cliente..."
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
                                            placeholder="Digite o telefone do cliente..."
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
                                </div>

                                <DialogFooter>
                                    {loadingAddCustomer ? (
                                        <Button disabled>
                                            <Loader2 className="animate-spin" />
                                            Adicionando Cliente
                                        </Button>
                                    ) : (
                                        <Button type="submit">Adicionar</Button>
                                    )}
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                {loadingCustomers ? (
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
                                            CPF/CNPJ
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            E-Mail
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            Telefone
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Data
                                        </TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((customer) => (
                                        <TableRow
                                            key={customer.id}
                                            className="bg-accent group"
                                        >
                                            <TableCell>
                                                <div className="font-medium">
                                                    {customer.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {customer.cpfOrCnpj}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {customer.email}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                R$ {customer.phone}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatToBrazilianDate(
                                                    customer.createdAt
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
                                                                    setEditCustomerObj(
                                                                        customer
                                                                    );

                                                                    setValue(
                                                                        "name",
                                                                        customer.name
                                                                    );
                                                                    setValue(
                                                                        "cpfOrCnpj",
                                                                        customer.cpfOrCnpj
                                                                    );
                                                                    setValue(
                                                                        "email",
                                                                        customer.email
                                                                    );
                                                                    setValue(
                                                                        "phone",
                                                                        customer.phone
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
                                                            {loadingDeleteCustomer &&
                                                            deleteCustomerId ===
                                                                customer.id ? (
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
                                                                        deleteCustomer(
                                                                            customer.id
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
