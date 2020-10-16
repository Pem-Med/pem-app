"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_dynamic_vector_icons_1 = tslib_1.__importDefault(require("react-native-dynamic-vector-icons"));
/**
 * ? Local Imports
 */
const SearchCancel_style_1 = tslib_1.__importDefault(require("./SearchCancel.style"));
class SearchCancel extends React.PureComponent {
    renderIcon(props) {
        const { onPressCancel, cancelIconName, cancelIconType, cancelIconSize, cancelIconColor, cancelIconComponent, cancelButtonDisable, } = props;
        return (!cancelButtonDisable && (<react_native_1.TouchableOpacity onPress={onPressCancel} style={SearchCancel_style_1.default.iconContainer}>
          {cancelIconComponent || (<react_native_dynamic_vector_icons_1.default name={cancelIconName} type={cancelIconType} size={cancelIconSize} color={cancelIconColor}/>)}
        </react_native_1.TouchableOpacity>));
    }
    render() {
        const { cancelComponent } = this.props;
        return cancelComponent || this.renderIcon(this.props);
    }
}
exports.default = SearchCancel;
SearchCancel.defaultProps = {
    cancelIconName: "clear",
    cancelIconType: "MaterialIcons",
    cancelIconSize: 23,
    cancelIconColor: "#b3b6c3",
};
