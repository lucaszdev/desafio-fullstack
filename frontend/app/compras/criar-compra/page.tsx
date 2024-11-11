import CreatePurchase from "@/components/features/create-purchase";
import Layout from "@/components/Layout";
import React from "react";

const criarCompra = () => {
    return (
        <Layout pathname="/compras">
            <CreatePurchase />
        </Layout>
    );
};

export default criarCompra;
