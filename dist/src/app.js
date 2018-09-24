"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var polymer_element_js_1 = require("@polymer/polymer/polymer-element.js");
require("bootstrap/dist/css/bootstrap.css");

var ChannelsDBPlugin = function (_polymer_element_js_) {
    _inherits(ChannelsDBPlugin, _polymer_element_js_);

    function ChannelsDBPlugin() {
        _classCallCheck(this, ChannelsDBPlugin);

        var _this = _possibleConstructorReturn(this, (ChannelsDBPlugin.__proto__ || Object.getPrototypeOf(ChannelsDBPlugin)).apply(this, arguments));

        _this.shortResidueNames = {
            ALA: "A",
            ARG: "R",
            ASN: "N",
            ASP: "D",
            CYS: "C",
            GLN: "Q",
            GLU: "E",
            HIS: "H",
            ILE: "I",
            LEU: "L",
            LYS: "K",
            MET: "M",
            PHE: "F",
            PRO: "P",
            SER: "S",
            THR: "T",
            TRP: "W",
            TYR: "Y",
            VAL: "V"
        };
        return _this;
    }

    _createClass(ChannelsDBPlugin, [{
        key: "calculateLining",
        value: function calculateLining(channel, backbone) {
            var residueLining = channel.Layers.map(function (x) {
                return x.Residues;
            });
            var union = [].concat.apply([], residueLining);
            var result = [];
            if (backbone) {
                result = union.filter(function (x) {
                    return x.Backbone;
                });
            } else {
                result = union.filter(function (x) {
                    return x.SideChain;
                });
            }
            return this.liningResiduesString(result);
        }
    }, {
        key: "liningResiduesString",
        value: function liningResiduesString(residueLining) {
            var lining = {};
            var result = "";
            var uniqueResidues = ChannelsDBPlugin.distinctBy(residueLining, function (x) {
                return x['SequenceNumber'] + x['Chain'];
            });
            for (var i = 0; i < uniqueResidues.length; i++) {
                var _name = uniqueResidues[i]['Name'];
                var value = this.getShortResidueName(_name);
                if (typeof lining[this.getShortResidueName(_name)] == 'undefined') {
                    lining[this.getShortResidueName(_name)] = 1;
                } else {
                    lining[this.getShortResidueName(_name)] = lining[this.getShortResidueName(_name)] + 1;
                }
            }
            for (var key in lining) {
                var _value = lining[key];
                result = _value === 1 ? result + key + '-' : result + _value + key + '-';
            }
            return result.substring(0, result.length - 1);
        }
    }, {
        key: "getShortResidueName",
        value: function getShortResidueName(residue) {
            var r = this.shortResidueNames[name];
            if (!r) return name;
            return r;
        }
    }, {
        key: "methoda",
        value: function methoda() {
            console.log(this.shortResidueNames);
        }
    }, {
        key: "connectedCallback",
        value: function connectedCallback() {
            _get(ChannelsDBPlugin.prototype.__proto__ || Object.getPrototypeOf(ChannelsDBPlugin.prototype), "connectedCallback", this).call(this);
            console.log('pica');
        }
    }], [{
        key: "distinctBy",
        value: function distinctBy(data, key) {
            var elements = {};
            var result = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var v = _step.value;

                    var k = key(v);
                    if (!elements[k]) {
                        result.push(v);
                        elements[k] = true;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return result;
        }
    }]);

    return ChannelsDBPlugin;
}(polymer_element_js_1.PolymerElement);

window.customElements.define('channelsdb-plugin', ChannelsDBPlugin);
//# sourceMappingURL=app.js.map