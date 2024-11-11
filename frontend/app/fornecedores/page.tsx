import Suppliers from "@/components/features/suppliers";
import Layout from "@/components/Layout";
import React from "react";

const clientes = () => {
    return (
        <Layout pathname="/fornecedores">
            <Suppliers />
        </Layout>
    );
};

export default clientes;
