import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { View, Text, Platform } from "react-native";
import { useCart } from "../providers/CartProvider";

const CartScreen = () => {
    const { items } = useCart();

    return (
        <View>
            <Text>Cart item length: {items.length}</Text>

            <StatusBar style={Platform.OS === "android" ? "light" : "auto"} />
        </View>
    );
};

export default CartScreen;
