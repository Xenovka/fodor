import { StatusBar } from "expo-status-bar";
import { View, Text, Platform } from "react-native";

const CartScreen = () => {
    return (
        <View>
            <Text>CartScreen</Text>

            <StatusBar style={Platform.OS === "android" ? "light" : "auto"} />
        </View>
    );
};

export default CartScreen;
