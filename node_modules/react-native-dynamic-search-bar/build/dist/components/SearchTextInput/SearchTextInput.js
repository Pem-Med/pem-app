"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
/**
 * ? Local Imports
 */
const SearchTextInput_style_1 = tslib_1.__importStar(require("./SearchTextInput.style"));
class SearchTextInput extends React.Component {
    renderContent(props) {
        const { fontSize, fontColor, placeholder, textInputDisable } = props;
        return (textInputDisable && (<react_native_1.Text style={[SearchTextInput_style_1.textStyle(fontSize, fontColor)]}>{placeholder}</react_native_1.Text>));
    }
    render() {
        const { textInputComponent } = this.props;
        return (<react_native_1.View>
        {textInputComponent || (<react_native_1.View style={SearchTextInput_style_1.default.container}>{this.renderContent(this.props)}</react_native_1.View>)}
      </react_native_1.View>);
    }
}
exports.default = SearchTextInput;
