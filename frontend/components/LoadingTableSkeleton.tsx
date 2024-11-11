import { Skeleton } from "./ui/skeleton";

const LoadingTableSkeleton = () => {
    return (
        <div className="p-4">
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th>
                            <Skeleton className="w-32 h-6" />
                        </th>
                        <th className="hidden sm:table-cell">
                            <Skeleton className="w-48 h-6" />
                        </th>
                        <th className="hidden sm:table-cell">
                            <Skeleton className="w-48 h-6" />
                        </th>
                        <th className="hidden sm:table-cell">
                            <Skeleton className="w-32 h-6" />
                        </th>
                        <th className="hidden md:table-cell">
                            <Skeleton className="w-24 h-6" />
                        </th>
                        <th>
                            <Skeleton className="w-24 h-6" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Skeleton className="w-32 h-8" />
                        </td>
                        <td className="hidden sm:table-cell">
                            <Skeleton className="w-48 h-8" />
                        </td>
                        <td className="hidden sm:table-cell">
                            <Skeleton className="w-48 h-8" />
                        </td>
                        <td className="hidden sm:table-cell">
                            <Skeleton className="w-32 h-8" />
                        </td>
                        <td className="hidden md:table-cell">
                            <Skeleton className="w-24 h-8" />
                        </td>
                        <td>
                            <Skeleton className="w-24 h-8" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default LoadingTableSkeleton;
