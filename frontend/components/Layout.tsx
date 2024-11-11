"use client";

import React from "react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    BriefcaseBusinessIcon,
    Menu,
    Package,
    Package2,
    ShoppingCart,
    StoreIcon,
    Users,
} from "lucide-react";
import ModeToggle from "@/components/ui/mode-toggle";
import Link from "next/link";

const Layout: React.FC<{ children: React.ReactNode; pathname: string }> = ({
    children,
    pathname,
}) => {
    const isActive = (path: string) => pathname === path;

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="">Desafio Fullstack</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/produtos"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                    isActive("/produtos")
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                <Package className="h-4 w-4" />
                                Produtos
                            </Link>
                            <Link
                                href="/clientes"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                    isActive("/clientes")
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                <Users className="h-4 w-4" />
                                Clientes
                            </Link>
                            <Link
                                href="/fornecedores"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                    isActive("/fornecedores")
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                <BriefcaseBusinessIcon className="h-4 w-4" />
                                Fornecedores
                            </Link>
                            <Link
                                href="/vendas"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                    isActive("/vendas")
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Vendas
                            </Link>
                            <Link
                                href="/compras"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                    isActive("/compras")
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                <StoreIcon className="h-4 w-4" />
                                Compras
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle navigation menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <SheetTitle>Menu</SheetTitle>
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                <Link
                                    href="/produtos"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                        isActive("/produtos")
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    <Package className="h-4 w-4" />
                                    Produtos
                                </Link>
                                <Link
                                    href="/clientes"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                        isActive("/clientes")
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    <Users className="h-4 w-4" />
                                    Clientes
                                </Link>
                                <Link
                                    href="/fornecedores"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                        isActive("/fornecedores")
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    <BriefcaseBusinessIcon className="h-4 w-4" />
                                    Fornecedores
                                </Link>
                                <Link
                                    href="/vendas"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                        isActive("/vendas")
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Vendas
                                </Link>
                                <Link
                                    href="/compras"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                        isActive("/compras")
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    <StoreIcon className="h-4 w-4" />
                                    Compras
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1"></div>
                    <ModeToggle />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
