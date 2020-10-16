"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
exports.textStyle = (fontSize = 13, fontColor = "#b3b6c3") => {
    return {
        left: 24,
        bottom: 1,
        color: fontColor,
        fontSize: fontSize
    };
};
exports.default = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center"
    }
});
