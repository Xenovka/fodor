import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from "react-native";

import { defaultPizzaImage } from "@/src/components/ProductListItem";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { useProduct } from "@/src/api/products";

const ProductDetailScreen = () => {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

    const { data: product, error, isLoading } = useProduct(id);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Failed to fetch products</Text>;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Menu",
                    headerRight: () => (
                        <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name="pencil"
                                        size={25}
                                        color={Colors.light.tint}
                                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    )
                }}
            />
            <Stack.Screen options={{ title: product.name }} />

            <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image} />

            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 10
    },
    image: {
        width: "100%",
        aspectRatio: 1
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    sizes: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
    size: {
        backgroundColor: "gainsboro",
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    },
    price: {
        fontSize: 20,
        fontWeight: "500"
    }
});

export default ProductDetailScreen;
