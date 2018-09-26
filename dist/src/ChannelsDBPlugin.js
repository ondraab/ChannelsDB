"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _templateObject = _taggedTemplateLiteral([""], [""]),
    _templateObject2 = _taggedTemplateLiteral(["\n                        <!--<li ng-repeat=\"channel in channels\">-->\n                            <div>\n                                <div>#[[ $index + 1 ]]</div>\n                                <div>\n                                    <b>\n\t\t\t\t\t\t\t<span class=\"hint--bottom\" data-hint=\"Length of the channel [&#8491;].\">\n\t\t\t\t\t\t\t\tLength:\n\t\t\t\t\t\t\t</span>\n                                    </b>\n                                    \n                                    {{channel.Length | number: 1}}&#8491;\n\n                                    <span class=\"channels-db-delimiter\">|</span>\n\n                                    <b>\n\t\t\t\t\t\t\t<span class=\"hint--bottom hint--large\" data-hint=\"Channel's hydropathy is an average hydropathy index assigned to the lining residues according to the Kyte and Doolitle.\">\n\t\t\t\t\t\t\t\tHPthy:\n\t\t\t\t\t\t\t</span>\n                                    </b>\n                                    {{channel.Properties.Hydropathy | number: 2}}\n\n                                    <span class=\"channels-db-delimiter\">|</span>\n                                    <b>\n\t\t\t\t\t\t\t<span class=\"hint--bottom hint--large\" data-hint=\"Charge is calculated as a sum of charged residues (Arg, Lys = +1; Asp, Glu = -1)\">\n\t\t\t\t\t\t\t\tCharge:\n\t\t\t\t\t\t\t</span>\n                                    </b>\n                                    {{channel.Properties.Charge > 0? '+': ''}}{{channel.Properties.Charge}}\n                                    <span style=\"float: right; font-weight: 200;\">{{channel.Name}}</span>\n                                </div>\n\n                            </div>\n\n                            <div class=\"channels-db-channel-body\">\n                                <!--<div style=\"background: #{{channel.Color}}\"></div>-->\n\n                                <div class=\"channels-db-channel-body-content\">\n                                    <div style=\"position: relative\">\n                                        <b>Bottleneck:</b>\n\n                                        <span class=\"hint--bottom\" data-hint=\"Channels's lowest profile: radius / length\">\n\t\t\t\t\t\t\t\t{{bottlenecks[$index].MinRadius | number: 1}} / {{(bottlenecks[$index].EndDistance - bottlenecks[$index].StartDistance) | number: 1}}\n\t\t\t\t\t\t\t</span>\n                                        <span class=\"channels-db-delimiter\">|</span>\n                                        <span class=\"hint--bottom\" data-hint=\"Hydropathy of the bottleneck.\">\n\t\t\t\t\t\t\t\t{{bottlenecks[$index].Properties.Hydropathy | number: 2}}\n\t\t\t\t\t\t\t</span>\n                                        <span class=\"channels-db-delimiter\">|</span>\n                                        <span class=\"hint--bottom\" data-hint=\"Formal charge of the bottleneck.\">\n\t\t\t\t\t\t\t\t{{channel.Properties.Charge > 0? '+': ''}}{{bottlenecks[$index].Properties.Charge}}\n\t\t\t\t\t\t\t</span>\n                                        <span class=\"channels-db-delimiter\">|</span>\n                                        <span class=\"hint--bottom\" data-hint=\"Bottleneck lining residues.\">\n\t\t\t\t\t\t\t\t{{liningResiduesString(bottlenecks[$index].Residues) | cut:true:10:' ...' }}\n\t\t\t\t\t\t\t</span>\n                                    </div>\n\n\n                                    <div>\n                                        <b>Lining:</b>\n                                        <span class=\"hint--top\" data-hint=\"Sidechain lining residues\">\n\t\t\t\t\t\t\t\t{{calculateLining(channel, false) | cut:true:200:'...' }}\n\t\t\t\t\t\t\t</span>\n                                        <!--<span ng-show=\"{{calculateLining(channel, true).length > 0}}\" class=\"channels-db-delimiter\">|</span>-->\n                                        <span class=\"hint--top\" data-hint=\"Backbone lining residues\">\n\t\t\t\t\t\t\t\t{{calculateLining(channel, true) | cut:true:200:'...' }}\n\t\t\t\t\t\t\t</span>\n\n\n\n                                    </div>\n                                </div>\n                            </div>\n\n                            <div class=\"channels-db-channel-layers-wrapper\">\n\n                                <div class=\"hint--right hint--large\" data-hint=\"The channel is uniformly divided into layers, and each layer is defined by the residues lining it. A new layer starts whenever there is a change in the list of residues lining the channel along its length.\">\n                                    Layers\n                                </div>\n\n                                <div class=\"channels-db-channel-layers\">\n                                    <!--<div ng-repeat=\"layer in channel.wrappedLayers\"-->\n                                         style=\"width: {{ layer.computedWidth }}%; background-color:{{ layer.color }};\n\t\t\t\t\t\t\t\t\t border-bottom: {{layer.layer.LocalMinima ? '3px' : '0'}} solid {{layer.layer.Bottleneck ? 'black' : '\t#666666'}}\">\n\n                                        <div class=\"channels-db-channel-layer-info\">\n                                            <div style=\"left: 0;\" class=\"channels-db-channel-layer-info-unit\">\n                                                <div><small><b>Radius:</b> {{layer.layer.MinRadius | number: 1}}&#8491;</small></div>\n                                                <div><small><b>Length:</b> {{layer.layer.EndDistance - layer.layer.StartDistance | number: 1}}&#8491;</small></div>\n                                            </div>\n                                            <div style=\"left: 96px;\" class=\"channels-db-channel-layer-info-unit\">\n                                                <div><small><b>Hpthy:</b> {{layer.layer.Properties.Hydropathy | number: 2}}</small></div>\n                                                <div><small><b>Charge:</b> {{layer.layer.Properties.Charge > 0? '+': ''}}{{layer.layer.Properties.Charge}}</small></div>\n                                            </div>\n                                            <div class=\"channels-db-channel-layer-info-residues\">\n\t\t\t\t\t\t\t\t\t<!--<span ng-repeat=\"residue in layer.layer.Residues\">-->\n\t\t\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t\t\t<!--<small ng-if=\"residue.Backbone\">-->\n\t\t\t\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t\t\t\t<b>\n\t\t\t\t\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"hint--top\" data-hint=\"Backbone\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}\n                                                    <!--\n                                                    -->\n\t\t\t\t\t\t\t\t\t\t\t\t</span>\n                                                <!--\n                                                -->\n\t\t\t\t\t\t\t\t\t\t\t</b>\n                                            <!--\n                                            -->\n\t\t\t\t\t\t\t\t\t\t</small>\n                                        <!--\n                                        -->\n\t\t\t\t\t\t\t\t\t\t<!--<small ng-if=\"!residue.Backbone\">{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}</small>-->\n                                        <!--\n                                        -->\n\t\t\t\t\t\t\t\t\t</span>\n                                                <!--<div ng-show=\"{{layer.layer.Bottleneck}}\" class=\"channels-db-channel-layer-info-bottleneck\">Bottleneck</div>-->\n                                                <!--<div ng-show=\"{{layer.layer.LocalMinima && !layer.layer.Bottleneck}}\" class=\"channels-db-channel-layer-info-bottleneck\">Local minimum</div>-->\n                                            </div>\n                                            <div style=\"background: {{ layer.color }}\"></div>\n                                        </div>\n\n                                    </div>\n                                </div>\n                            </div>\n                        </li>"], ["\n                        <!--<li ng-repeat=\"channel in channels\">-->\n                            <div>\n                                <div>#[[ $index + 1 ]]</div>\n                                <div>\n                                    <b>\n\t\t\t\t\t\t\t<span class=\"hint--bottom\" data-hint=\"Length of the channel [&#8491;].\">\n\t\t\t\t\t\t\t\tLength:\n\t\t\t\t\t\t\t</span>\n                                    </b>\n                                    \n                                    {{channel.Length | number: 1}}&#8491;\n\n                                    <span class=\"channels-db-delimiter\">|</span>\n\n                                    <b>\n\t\t\t\t\t\t\t<span class=\"hint--bottom hint--large\" data-hint=\"Channel's hydropathy is an average hydropathy index assigned to the lining residues according to the Kyte and Doolitle.\">\n\t\t\t\t\t\t\t\tHPthy:\n\t\t\t\t\t\t\t</span>\n                                    </b>\n                                    {{channel.Properties.Hydropathy | number: 2}}\n\n                                    <span class=\"channels-db-delimiter\">|</span>\n                                    <b>\n\t\t\t\t\t\t\t<span class=\"hint--bottom hint--large\" data-hint=\"Charge is calculated as a sum of charged residues (Arg, Lys = +1; Asp, Glu = -1)\">\n\t\t\t\t\t\t\t\tCharge:\n\t\t\t\t\t\t\t</span>\n                                    </b>\n                                    {{channel.Properties.Charge > 0? '+': ''}}{{channel.Properties.Charge}}\n                                    <span style=\"float: right; font-weight: 200;\">{{channel.Name}}</span>\n                                </div>\n\n                            </div>\n\n                            <div class=\"channels-db-channel-body\">\n                                <!--<div style=\"background: #{{channel.Color}}\"></div>-->\n\n                                <div class=\"channels-db-channel-body-content\">\n                                    <div style=\"position: relative\">\n                                        <b>Bottleneck:</b>\n\n                                        <span class=\"hint--bottom\" data-hint=\"Channels's lowest profile: radius / length\">\n\t\t\t\t\t\t\t\t{{bottlenecks[$index].MinRadius | number: 1}} / {{(bottlenecks[$index].EndDistance - bottlenecks[$index].StartDistance) | number: 1}}\n\t\t\t\t\t\t\t</span>\n                                        <span class=\"channels-db-delimiter\">|</span>\n                                        <span class=\"hint--bottom\" data-hint=\"Hydropathy of the bottleneck.\">\n\t\t\t\t\t\t\t\t{{bottlenecks[$index].Properties.Hydropathy | number: 2}}\n\t\t\t\t\t\t\t</span>\n                                        <span class=\"channels-db-delimiter\">|</span>\n                                        <span class=\"hint--bottom\" data-hint=\"Formal charge of the bottleneck.\">\n\t\t\t\t\t\t\t\t{{channel.Properties.Charge > 0? '+': ''}}{{bottlenecks[$index].Properties.Charge}}\n\t\t\t\t\t\t\t</span>\n                                        <span class=\"channels-db-delimiter\">|</span>\n                                        <span class=\"hint--bottom\" data-hint=\"Bottleneck lining residues.\">\n\t\t\t\t\t\t\t\t{{liningResiduesString(bottlenecks[$index].Residues) | cut:true:10:' ...' }}\n\t\t\t\t\t\t\t</span>\n                                    </div>\n\n\n                                    <div>\n                                        <b>Lining:</b>\n                                        <span class=\"hint--top\" data-hint=\"Sidechain lining residues\">\n\t\t\t\t\t\t\t\t{{calculateLining(channel, false) | cut:true:200:'...' }}\n\t\t\t\t\t\t\t</span>\n                                        <!--<span ng-show=\"{{calculateLining(channel, true).length > 0}}\" class=\"channels-db-delimiter\">|</span>-->\n                                        <span class=\"hint--top\" data-hint=\"Backbone lining residues\">\n\t\t\t\t\t\t\t\t{{calculateLining(channel, true) | cut:true:200:'...' }}\n\t\t\t\t\t\t\t</span>\n\n\n\n                                    </div>\n                                </div>\n                            </div>\n\n                            <div class=\"channels-db-channel-layers-wrapper\">\n\n                                <div class=\"hint--right hint--large\" data-hint=\"The channel is uniformly divided into layers, and each layer is defined by the residues lining it. A new layer starts whenever there is a change in the list of residues lining the channel along its length.\">\n                                    Layers\n                                </div>\n\n                                <div class=\"channels-db-channel-layers\">\n                                    <!--<div ng-repeat=\"layer in channel.wrappedLayers\"-->\n                                         style=\"width: {{ layer.computedWidth }}%; background-color:{{ layer.color }};\n\t\t\t\t\t\t\t\t\t border-bottom: {{layer.layer.LocalMinima ? '3px' : '0'}} solid {{layer.layer.Bottleneck ? 'black' : '\t#666666'}}\">\n\n                                        <div class=\"channels-db-channel-layer-info\">\n                                            <div style=\"left: 0;\" class=\"channels-db-channel-layer-info-unit\">\n                                                <div><small><b>Radius:</b> {{layer.layer.MinRadius | number: 1}}&#8491;</small></div>\n                                                <div><small><b>Length:</b> {{layer.layer.EndDistance - layer.layer.StartDistance | number: 1}}&#8491;</small></div>\n                                            </div>\n                                            <div style=\"left: 96px;\" class=\"channels-db-channel-layer-info-unit\">\n                                                <div><small><b>Hpthy:</b> {{layer.layer.Properties.Hydropathy | number: 2}}</small></div>\n                                                <div><small><b>Charge:</b> {{layer.layer.Properties.Charge > 0? '+': ''}}{{layer.layer.Properties.Charge}}</small></div>\n                                            </div>\n                                            <div class=\"channels-db-channel-layer-info-residues\">\n\t\t\t\t\t\t\t\t\t<!--<span ng-repeat=\"residue in layer.layer.Residues\">-->\n\t\t\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t\t\t<!--<small ng-if=\"residue.Backbone\">-->\n\t\t\t\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t\t\t\t<b>\n\t\t\t\t\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"hint--top\" data-hint=\"Backbone\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t\t\t\t\t\t{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}\n                                                    <!--\n                                                    -->\n\t\t\t\t\t\t\t\t\t\t\t\t</span>\n                                                <!--\n                                                -->\n\t\t\t\t\t\t\t\t\t\t\t</b>\n                                            <!--\n                                            -->\n\t\t\t\t\t\t\t\t\t\t</small>\n                                        <!--\n                                        -->\n\t\t\t\t\t\t\t\t\t\t<!--<small ng-if=\"!residue.Backbone\">{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}</small>-->\n                                        <!--\n                                        -->\n\t\t\t\t\t\t\t\t\t</span>\n                                                <!--<div ng-show=\"{{layer.layer.Bottleneck}}\" class=\"channels-db-channel-layer-info-bottleneck\">Bottleneck</div>-->\n                                                <!--<div ng-show=\"{{layer.layer.LocalMinima && !layer.layer.Bottleneck}}\" class=\"channels-db-channel-layer-info-bottleneck\">Local minimum</div>-->\n                                            </div>\n                                            <div style=\"background: {{ layer.color }}\"></div>\n                                        </div>\n\n                                    </div>\n                                </div>\n                            </div>\n                        </li>"]),
    _templateObject3 = _taggedTemplateLiteral(["\n            <style>\n                @import url( ../public/style.css )\n            </style>\n            <div class=\"channels-db-header\">\n            <span>\n                <span class=\"channels-db-id\">[[pdbId]] | <small>[[channelsJson.length]] [[subtitle]]</small> &nbsp;&nbsp;&mdash;&nbsp;&nbsp;</span>ChannelsDB\n                <span style=\"float:right;\"><a href=\"https://webchemdev.ncbr.muni.cz/ChannelsDB/detail/[[pdbId]]\">[+ More]</a></span>\n            </span>\n            </div>\n            <div class=\"channels-db-body\">\n                <div class=\"channels-db-left-pane\">\n                    <div class=\"channels-db-thumb channels-db-thumb-src\">\n                        <img src=\"{{imgSrc}}\">\n                    </div>\n                </div>\n\n                <div class=\"channels-db-right-pane\">\n                    <!--<div ng-show=\"isError\" class=\"channels-db-right-pane-error\">Error: {{error}}</div>-->\n\n                    <ul class=\"channels-db-list\">\n                        \n                    </ul>\n                </div>\n\n            </div>\n\n            <div class=\"channels-db-footer\">\n                <span class=\"channels-db-powered\">powered by <a target=\"_blank\" href=\"http://mole.chemi.muni.cz\">MOLE 2.5</a></span>\n                <!--<a target=\"_blank\" href=\"{{link}}\">[+ Custom analysis]</a>-->\n            </div>\n        "], ["\n            <style>\n                @import url( ../public/style.css )\n            </style>\n            <div class=\"channels-db-header\">\n            <span>\n                <span class=\"channels-db-id\">[[pdbId]] | <small>[[channelsJson.length]] [[subtitle]]</small> &nbsp;&nbsp;&mdash;&nbsp;&nbsp;</span>ChannelsDB\n                <span style=\"float:right;\"><a href=\"https://webchemdev.ncbr.muni.cz/ChannelsDB/detail/[[pdbId]]\">[+ More]</a></span>\n            </span>\n            </div>\n            <div class=\"channels-db-body\">\n                <div class=\"channels-db-left-pane\">\n                    <div class=\"channels-db-thumb channels-db-thumb-src\">\n                        <img src=\"{{imgSrc}}\">\n                    </div>\n                </div>\n\n                <div class=\"channels-db-right-pane\">\n                    <!--<div ng-show=\"isError\" class=\"channels-db-right-pane-error\">Error: {{error}}</div>-->\n\n                    <ul class=\"channels-db-list\">\n                        \n                    </ul>\n                </div>\n\n            </div>\n\n            <div class=\"channels-db-footer\">\n                <span class=\"channels-db-powered\">powered by <a target=\"_blank\" href=\"http://mole.chemi.muni.cz\">MOLE 2.5</a></span>\n                <!--<a target=\"_blank\" href=\"{{link}}\">[+ Custom analysis]</a>-->\n            </div>\n        "]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var polymer_element_js_1 = require("@polymer/polymer/polymer-element.js");
require("@polymer/polymer/lib/elements/dom-repeat.js");
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
        _this.createSubtitle = function (channels) {
            var subtitle = '';
            switch (channels[0].Type) {
                case 0:
                    subtitle = "Reviewed";
                    break;
                case 1:
                    subtitle = "Transmembrane";
                    break;
                case 2:
                    subtitle = "CSA";
                    break;
                case 3:
                    subtitle = "Cof actor";
                    break;
                default:
                    break;
            }
            return subtitle + " " + this.channelsToPlural();
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
            if (backbone) result = union.filter(function (x) {
                return x.Backbone;
            });else result = union.filter(function (x) {
                return x.SideChain;
            });
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
                var name = uniqueResidues[i]['Name'];
                var value = this.getShortResidueName(name);
                if (typeof lining[this.getShortResidueName(name)] == 'undefined') {
                    lining[this.getShortResidueName(name)] = 1;
                } else {
                    lining[this.getShortResidueName(name)] = lining[this.getShortResidueName(name)] + 1;
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
        value: function getShortResidueName(name) {
            var r = this.shortResidueNames[name];
            if (!r) return name;
            return r;
        }
    }, {
        key: "channelsToPlural",
        value: function channelsToPlural() {
            return "channel" + (this.channelsJson.length > 0 ? 's' : '');
        }
    }, {
        key: "connectedCallback",
        value: function connectedCallback() {
            var _this2 = this;

            var request = new XMLHttpRequest();
            var channels = [];
            request.open('GET', "https://webchem.ncbr.muni.cz/API/ChannelsDB/Component/" + this.pdbId, true);
            request.onload = function (req) {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        channels = JSON.parse(request.response);
                        callback();
                    } else {
                        console.error(request.statusText);
                    }
                }
            };
            var callback = function callback() {
                _this2.channelsJson = channels;
                ChannelsDBPlugin.channelsList = channels;
                _this2.subtitle = _this2.createSubtitle(_this2.channelsJson);
                _this2.imgSrc = "https://webchem.ncbr.muni.cz/API/ChannelsDB/Download/" + _this2.pdbId + "?type=png";
                _get(ChannelsDBPlugin.prototype.__proto__ || Object.getPrototypeOf(ChannelsDBPlugin.prototype), "connectedCallback", _this2).call(_this2);
                _this2.addChannelsReview();
            };
            request.send(null);
        }
    }, {
        key: "addChannelsReview",
        value: function addChannelsReview() {
            var ul = document.querySelector('channelsdb-plugin').shadowRoot.querySelector('.channels-db-list');
            this.channelsJson.forEach(function (channel, index) {
                var li = document.createElement('li');
                var mainDiv = document.createElement('div');
                var numberDiv = document.createElement('div');
                numberDiv.innerHTML += "#" + (index + 1);
                mainDiv.appendChild(numberDiv);
                var infoDiv = document.createElement('div');
                var lengthSpan = document.createElement('span');
                lengthSpan.setAttribute('class', 'hint--bottom');
                lengthSpan.setAttribute('data-hint', 'Length of the channel [&#8491;].');
                lengthSpan.innerHTML += "Length: ";
                var bold = document.createElement('b');
                bold.appendChild(lengthSpan);
                infoDiv.appendChild(bold);
                infoDiv.innerHTML += (channel.Length || 1) + "&#8491";
                var delimiterSpan = document.createElement('span');
                delimiterSpan.setAttribute('class', 'channels-db-delimiter');
                delimiterSpan.innerHTML += '|';
                infoDiv.appendChild(delimiterSpan);
                var hpSpan = document.createElement('span');
                hpSpan.setAttribute('class', 'hint--bottom hint--large');
                hpSpan.setAttribute('data-hint', 'Channel\'s hydropathy is an average hydropathy index assigned to the lining residues according to the Kyte and Doolitle.');
                hpSpan.innerHTML += "HPthy: ";
                bold = document.createElement('b');
                bold.appendChild(hpSpan);
                infoDiv.appendChild(bold);
                infoDiv.innerHTML += "" + (channel.Properties.Hydropathy || 2);
                infoDiv.appendChild(delimiterSpan);
                var chargeSpan = document.createElement('span');
                chargeSpan.setAttribute('class', 'hint--bottom hint--large');
                chargeSpan.setAttribute('data-hint', 'Charge is calculated as a sum of charged residues (Arg, Lys = +1; Asp, Glu = -1)');
                chargeSpan.innerHTML += "Charge: ";
                bold = document.createElement('b');
                bold.appendChild(chargeSpan);
                infoDiv.appendChild(bold);
                infoDiv.innerHTML += "" + (channel.Properties.Charge > 0 ? '+' : '') + channel.Properties.Charge;
                var nameSpan = document.createElement('span');
                nameSpan.setAttribute('style', "float: right; font-weight: 200;");
                nameSpan.innerHTML += "" + channel.Name;
                infoDiv.appendChild(nameSpan);
                mainDiv.appendChild(infoDiv);
                li.appendChild(mainDiv);
                ul.appendChild(li);
            });
            // ul.appendChild(document.createElement('li'));
            console.log();
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
    }, {
        key: "charge",
        value: function charge() {
            console.log('nana');
            return polymer_element_js_1.html(_templateObject);
        }
    }, {
        key: "computeFilter",
        value: function computeFilter(item) {
            console.log(item);
        }
    }, {
        key: "getChannelReview",
        get: function get() {
            return polymer_element_js_1.html(_templateObject2);
        }
    }, {
        key: "properties",
        get: function get() {
            return {
                pdbId: {
                    type: String,
                    reflectToAttribute: true,
                    notify: true
                }
            };
        }
    }, {
        key: "template",
        get: function get() {
            // language=HTML
            return polymer_element_js_1.html(_templateObject3);
        }
    }]);

    return ChannelsDBPlugin;
}(polymer_element_js_1.PolymerElement);

var LayerWrapper = function LayerWrapper(computedWidth, color, layer) {
    _classCallCheck(this, LayerWrapper);

    this.computedWidth = computedWidth;
    this.color = color;
    this.layer = layer;
};

exports.LayerWrapper = LayerWrapper;
window.customElements.define('channelsdb-plugin', ChannelsDBPlugin);
//# sourceMappingURL=ChannelsDBPlugin.js.map