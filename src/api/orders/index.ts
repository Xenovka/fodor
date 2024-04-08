import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAdminOrderList = ({ archived = false }) => {
    const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

    return useQuery({
        queryKey: ["orders", { archived }],
        queryFn: async () => {
            const { data, error } = await supabase.from("orders").select("*").in("status", statuses);
            if (error) {
                throw new Error(error.message);
            }

            return data;
        }
    });
};

export const useMyOrderList = () => {
    const { session } = useAuth();
    const id = session?.user.id;

    return useQuery({
        queryKey: ["orders", { userId: id }],
        queryFn: async () => {
            if (!id) return null;

            const { data, error } = await supabase.from("orders").select("*").eq("user_id", id);
            if (error) {
                throw new Error(error.message);
            }

            return data;
        }
    });
};
export const useInsertProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(data: any) {
            const { data: newProduct, error } = await supabase
                .from("products")
                .insert({
                    name: data.name,
                    image: data.image,
                    price: data.price
                })
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return newProduct;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(data: any) {
            const { data: updatedProduct, error } = await supabase
                .from("products")
                .update({
                    name: data.name,
                    image: data.image,
                    price: data.price
                })
                .eq("id", data.id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return updatedProduct;
        },
        async onSuccess(_, data) {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
            await queryClient.invalidateQueries({ queryKey: ["products", data.id] });
        }
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(id: number) {
            const { error } = await supabase.from("products").delete().eq("id", id);

            if (error) {
                throw new Error(error.message);
            }
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
};
