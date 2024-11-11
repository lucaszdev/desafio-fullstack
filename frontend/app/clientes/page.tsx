import Customers from "@/components/features/customers";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import React from "react";

const clientes = () => {
    return (
        <Layout pathname="/clientes">
            <Customers />
        </Layout>
    );
};

export default clientes;
