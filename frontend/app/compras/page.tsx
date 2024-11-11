import Purchases from "@/components/features/purchases";
import Layout from "@/components/Layout";
import React from "react";

const compras = () => {
    return (
        <Layout pathname="/compras">
            <Purchases />
        </Layout>
    );
};

export default compras;
