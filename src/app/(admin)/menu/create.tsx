import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "@/src/components/Button";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import Colors from "@/src/constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from "@/src/api/products";

const CreateProductScreen = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState("");
    const [image, setImage] = useState<string | null>("");

    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === "string" ? idString : idString?.[0]);
    const isUpdating = !!idString;

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { mutate: deleteProduct } = useDeleteProduct();
    const { data: updatingProduct } = useProduct(id);

    const router = useRouter();

    useEffect(() => {
        if (updatingProduct) {
            setName(updatingProduct.name);
            setPrice(updatingProduct.price.toString());
            setImage(updatingProduct.image);
        }
    }, [updatingProduct]);

    const resetField = () => {
        setName("");
        setPrice("");
    };

    const validateInput = () => {
        setErrors("");
        if (!name) {
            setErrors("Name is required");
            return false;
        }

        if (!price) {
            setErrors("Price is required");
            return false;
        }

        if (isNaN(parseFloat(price))) {
            setErrors("Price is not a number");
            return false;
        }

        return true;
    };

    const onSubmit = () => {
        if (isUpdating) {
            onUpdate();
        } else {
            onCreate();
        }
    };

    const onUpdate = () => {
        if (!validateInput()) return;

        updateProduct(
            {
                name,
                price: parseFloat(price),
                image,
                id
            },
            {
                onSuccess: () => {
                    resetField();
                    router.back();
                }
            }
        );
    };

    const onCreate = () => {
        if (!validateInput()) {
            return;
        }

        insertProduct(
            { name, price: parseFloat(price), image },
            {
                onSuccess: () => {
                    resetField();
                    router.back();
                }
            }
        );
    };

    const onDelete = () => {
        deleteProduct(id, {
            onSuccess: () => {
                resetField();
                router.replace("/(admin)");
            }
        });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const confirmDelete = () => {
        Alert.alert("Confirm", "Are you sure you want to delete this product?", [
            {
                text: "Cancel"
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: onDelete
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: isUpdating ? "Update Product" : "Create Product" }} />

            <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
            <Text onPress={pickImage} style={styles.textButton}>
                Select Image
            </Text>

            <Text style={styles.label}>Name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />

            <Text style={styles.label}>Price ($)</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="9.99"
                style={styles.input}
                keyboardType="numeric"
            />

            <Text style={{ color: "red" }}>{errors}</Text>
            <Button onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
            {isUpdating && (
                <Text onPress={confirmDelete} style={styles.textButton}>
                    Delete
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 10
    },
    image: {
        width: "50%",
        aspectRatio: 1,
        alignSelf: "center"
    },
    input: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20
    },
    label: {
        color: "gray",
        fontSize: 16
    },
    textButton: {
        alignSelf: "center",
        fontWeight: "bold",
        color: Colors.light.tint,
        marginVertical: 10
    }
});

export default CreateProductScreen;
