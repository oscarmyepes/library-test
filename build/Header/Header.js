'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactJss = require('react-jss');

var useStyles = reactJss.createUseStyles({
    myLabel: {
        color: 'green',
    },
});
var Header = function (_a) {
    var text = _a.text;
    var classes = useStyles();
    return React.createElement("h1", { className: classes.myLabel }, text);
};

exports.Header = Header;
//# sourceMappingURL=Header.js.map
