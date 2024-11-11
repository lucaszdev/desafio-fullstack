"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const formSchema = z.object({
    search: z.string(),
});

export default function AdminSearch({
    placeholder,
    callBack,
}: {
    placeholder: string;
    callBack: (text: string) => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        callBack(values.search);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={placeholder}
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                    {...form.register("search")}
                />
            </div>
        </form>
    );
}
