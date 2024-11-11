import CreateSale from "@/components/features/create-sale";
import Layout from "@/components/Layout";
import React from "react";

const criarVenda = () => {
    return (
        <Layout pathname="/vendas">
            <CreateSale />
        </Layout>
    );
};

export default criarVenda;
