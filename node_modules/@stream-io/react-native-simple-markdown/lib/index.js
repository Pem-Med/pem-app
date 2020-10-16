'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _simpleMarkdown = require('simple-markdown');

var _simpleMarkdown2 = _interopRequireDefault(_simpleMarkdown);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Markdown = function (_Component) {
  _inherits(Markdown, _Component);

  function Markdown() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Markdown);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Markdown.__proto__ || Object.getPrototypeOf(Markdown)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = function (nextProps) {
      return _this.props.children !== nextProps.children || _this.props.styles !== nextProps.styles;
    }, _this._postProcessRules = function (preRules) {
      var defaultRules = ['paragraph', 'text'];
      if (_this.props.whitelist && _this.props.whitelist.length) {
        return _lodash2.default.pick(preRules, _lodash2.default.concat(_this.props.whitelist, defaultRules));
      } else if (_this.props.blacklist && _this.props.blacklist.length) {
        return _lodash2.default.omit(preRules, _lodash2.default.pullAll(_this.props.blacklist, defaultRules));
      }
      return preRules;
    }, _this._renderContent = function (children) {
      try {
        var mergedStyles = Object.assign({}, _styles2.default, _this.props.styles);
        var rules = _this._postProcessRules(_lodash2.default.merge({}, _simpleMarkdown2.default.defaultRules, (0, _rules2.default)(mergedStyles), _this.props.rules));
        var child = Array.isArray(_this.props.children) ? _this.props.children.join('') : _this.props.children;
        // @TODO: Add another \n?
        var blockSource = child + '\n';
        var tree = _simpleMarkdown2.default.parserFor(rules)(blockSource, {
          inline: false
        });
        return _simpleMarkdown2.default.reactFor(_simpleMarkdown2.default.ruleOutput(rules, 'react'))(tree);
      } catch (errors) {
        _this.props.errorHandler ? _this.props.errorHandler(errors, children) : console.error(errors);
      }
      return null;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // @TODO: Rewrite this part to prevent text from overriding other rules
  /** Post processes rules to strip out unwanted styling options
   *  while keeping the default 'paragraph' and 'text' rules
   */


  _createClass(Markdown, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactNative.View,
        { style: [_styles2.default.view, this.props.styles.view] },
        this._renderContent(this.props.children)
      );
    }
  }]);

  return Markdown;
}(_react.Component);

Markdown.defaultProps = {
  blacklist: [],
  children: '',
  errorHandler: function errorHandler() {
    return null;
  },
  rules: {},
  styles: _styles2.default,
  whitelist: []
};
Markdown.propTypes = {
  blacklist: _propTypes2.default.arrayOf(_propTypes2.default.string),
  children: _propTypes2.default.string,
  errorHandler: _propTypes2.default.func,
  rules: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  styles: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  whitelist: _propTypes2.default.arrayOf(_propTypes2.default.string)
};
exports.default = Markdown;