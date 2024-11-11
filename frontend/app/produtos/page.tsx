import Products from "@/components/features/products";
import Layout from "@/components/Layout";
import React from "react";

const produtos = () => {
    return (
        <Layout pathname="/produtos">
            <Products />
        </Layout>
    );
};

export default produtos;
