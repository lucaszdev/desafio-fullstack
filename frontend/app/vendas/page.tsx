import Sales from "@/components/features/sales";
import Layout from "@/components/Layout";
import React from "react";

const vendas = () => {
    return (
        <Layout pathname="/vendas">
            <Sales />
        </Layout>
    );
};

export default vendas;
