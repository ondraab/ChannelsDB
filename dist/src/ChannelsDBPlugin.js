"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _templateObject = _taggedTemplateLiteral(["\n            <style>\n                @import url( ../public/style.css )\n            </style>\n            <div class=\"channels-db-header\">\n            <span>\n                <span class=\"channels-db-id\">[[pdbId]] | <small>[[channelsJson.length]] [[subtitle]]</small> &nbsp;&nbsp;&mdash;&nbsp;&nbsp;</span>ChannelsDB\n                <span style=\"float:right;\"><a href=\"https://webchemdev.ncbr.muni.cz/ChannelsDB/detail/[[pdbId]]\">[+ More]</a></span>\n            </span>\n            </div>\n            <div class=\"channels-db-body\">\n                <div class=\"channels-db-left-pane\">\n                    <div class=\"channels-db-thumb channels-db-thumb-src\">\n                        <img src=\"{{imgSrc}}\" style=\"width: 100%\">\n                    </div>\n                </div>\n\n                <div class=\"channels-db-right-pane\">\n                    <!--<div ng-show=\"isError\" class=\"channels-db-right-pane-error\">Error: {{error}}</div>-->\n\n                    <ul class=\"channels-db-list\">\n                        \n                    </ul>\n                </div>\n\n            </div>\n\n            <div class=\"channels-db-footer\">\n                <span class=\"channels-db-powered\">powered by <a target=\"_blank\" href=\"http://mole.chemi.muni.cz\">MOLE 2.5</a></span>\n                <a target=\"_blank\" href=\"http://mole.upol.cz/api/ebi/?action=newjob&pdbid=[[pdbId]]&ignorehet=0&start=auto\">[+ Custom analysis]</a>\n            </div>\n        "], ["\n            <style>\n                @import url( ../public/style.css )\n            </style>\n            <div class=\"channels-db-header\">\n            <span>\n                <span class=\"channels-db-id\">[[pdbId]] | <small>[[channelsJson.length]] [[subtitle]]</small> &nbsp;&nbsp;&mdash;&nbsp;&nbsp;</span>ChannelsDB\n                <span style=\"float:right;\"><a href=\"https://webchemdev.ncbr.muni.cz/ChannelsDB/detail/[[pdbId]]\">[+ More]</a></span>\n            </span>\n            </div>\n            <div class=\"channels-db-body\">\n                <div class=\"channels-db-left-pane\">\n                    <div class=\"channels-db-thumb channels-db-thumb-src\">\n                        <img src=\"{{imgSrc}}\" style=\"width: 100%\">\n                    </div>\n                </div>\n\n                <div class=\"channels-db-right-pane\">\n                    <!--<div ng-show=\"isError\" class=\"channels-db-right-pane-error\">Error: {{error}}</div>-->\n\n                    <ul class=\"channels-db-list\">\n                        \n                    </ul>\n                </div>\n\n            </div>\n\n            <div class=\"channels-db-footer\">\n                <span class=\"channels-db-powered\">powered by <a target=\"_blank\" href=\"http://mole.chemi.muni.cz\">MOLE 2.5</a></span>\n                <a target=\"_blank\" href=\"http://mole.upol.cz/api/ebi/?action=newjob&pdbid=[[pdbId]]&ignorehet=0&start=auto\">[+ Custom analysis]</a>\n            </div>\n        "]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var polymer_element_js_1 = require("@polymer/polymer/polymer-element.js");
var d3 = require("d3");
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
        key: "prepareLayers",
        value: function prepareLayers(channel) {
            var minHpthy = -4.5;
            var medHpthy = 0.0;
            var maxHpthy = 4.5;
            var modifiedLayers = [];
            var dt = 1 / (channel.Layers.length - 1);
            var t = 0;
            var minColor = { r: 255, g: 0, b: 0 };
            var midColor = { r: 255, g: 255, b: 255 };
            var maxColor = { r: 0, g: 0, b: 255 };
            var totalWidth = 0;
            function interpolateColor(min, minColor, max, maxColor, value) {
                var target = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

                var ret = target !== undefined ? target : { r: 0.1, g: 0.1, b: 0.1 };
                var t = (value - min) / (max - min);
                ret.r = minColor.r + (maxColor.r - minColor.r) * t | 0;
                ret.g = minColor.g + (maxColor.g - minColor.g) * t | 0;
                ret.b = minColor.b + (maxColor.b - minColor.b) * t | 0;
                return ret;
            }
            /** Formats Color object into the rgb expression suitable for CSS. **/
            function formatColor(color) {
                return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
            }
            var index = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = channel.Layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var l = _step.value;

                    var width = 100 * (l.EndDistance - l.StartDistance) / channel.Length;
                    t = l.Properties.Hydropathy;
                    totalWidth += width;
                    var color = t <= 0 ? interpolateColor(minHpthy, minColor, medHpthy, midColor, t) : interpolateColor(medHpthy, midColor, maxHpthy, maxColor, t);
                    modifiedLayers.push(new LayerWrapper(width, formatColor(color), l));
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

            if (!modifiedLayers.length) return modifiedLayers;
            modifiedLayers[modifiedLayers.length - 1].computedWidth = modifiedLayers[modifiedLayers.length - 1].computedWidth + 100 - totalWidth - 0.0001;
            return modifiedLayers;
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
            var _this3 = this;

            var ul = document.querySelector('channelsdb-plugin').shadowRoot.querySelector('.channels-db-list');
            this.channelsJson.forEach(function (channel, index) {
                var wrappedLayers = _this3.prepareLayers(channel);
                var mainLi = d3.select(document.querySelector('channelsdb-plugin').shadowRoot.querySelector('.channels-db-list')).append('li');
                var mainDiv = mainLi.append('div');
                mainDiv.append('div').text("#" + (index + 1));
                var sumInfoDiv = mainDiv.append('div').attr('class', 'hint--bottom');
                sumInfoDiv.append('b').text("Length: ");
                sumInfoDiv.append('span').attr('data-hint', "Length of the channel [\u212B].").text((Number(channel.Length).toFixed(1) || 1) + "\u212B");
                sumInfoDiv.append('span').classed('channels-db-delimiter', true).text(' | ');
                sumInfoDiv.append('b').text('HPthy: ');
                sumInfoDiv.append('span').classed('hint--bottom hint--large', true).attr('data--hint', 'Channel\'s hydropathy is an average hydropathy index assigned to the lining residues according to the Kyte and Doolitle.').text("" + (Number(channel.Properties.Hydropathy).toFixed(2) || 2));
                sumInfoDiv.append('span').classed('channels-db-delimiter', true).text(' | ');
                sumInfoDiv.append('b').text('Charge: ');
                sumInfoDiv.append('span').classed('hint--bottom hint--large', true).attr('data--hint', 'Charge is calculated as a sum of charged residues (Arg, Lys = +1; Asp, Glu = -1)').text("" + (Number(channel.Properties.Charge) > 0 ? '+' : '') + channel.Properties.Charge);
                sumInfoDiv.append('span').text("" + channel.Name).attr('style', 'float: right; font-weight: 200;');
                var bodyContent = mainLi.append('div').attr('class', 'channels-db-channel-body').append('div').attr('class', 'channels-db-channel-body-content');
                var bottleneck = bodyContent.append('div').attr('style', 'position: relative');
                bottleneck.append('b').text('Bottleneck: ');
                bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Channels\'s lowest profile: radius / length').text((Number(channel.Bottleneck.MinRadius).toFixed(2) || 1) + " / " + (Number(channel.Bottleneck.EndDistance) - Number(channel.Bottleneck.StartDistance)).toFixed(2));
                bottleneck.append('span').classed('channels-db-delimiter', true).text(' | ');
                bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Hydropathy of the bottleneck.').text("" + (Number(channel.Bottleneck.Properties.Hydropathy) || 2));
                bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Formal charge of the bottleneck.').text("" + (Number(channel.Properties.Charge) > 0 ? '+' : '') + channel.Bottleneck.Properties.Charge);
                bottleneck.append('span').classed('channels-db-delimiter', true).text(' | ');
                bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Bottleneck lining residues.').text("" + (_this3.liningResiduesString(channel.Bottleneck.Residues) || ''));
                var lining = bodyContent.append('div');
                lining.append('b').text('Lining: ');
                lining.append('span').attr('class', 'hint--top').attr('data-hint', 'Sidechain lining residues').text("" + (_this3.calculateLining(channel, false) || 'cut:true:200:\'...\''));
                lining.append('span').classed('channels-db-delimiter', true).text(' | ');
                lining.append('span').attr('class', 'hint--top').attr('data-hint', 'Backbone lining residues').text("" + (_this3.calculateLining(channel, true) || 'cut:true:200:\'...\''));
                var layers = mainLi.append('div').attr('class', 'channels-db-channel-layers-wrapper');
                layers.append('div').attr('class', 'hint--right hint--large').attr('data-hint', 'The channel is uniformly divided into layers, and each layer is defined by the residues lining it. A new layer starts whenever there is a change in the list of residues lining the channel along its length.').text('Layers');
                var layersDiv = layers.append('div').attr('class', 'channels-db-channel-layers');
                wrappedLayers.forEach(function (layer, index) {
                    var singleLayer = layersDiv.append('div').attr('style', "width: " + layer.computedWidth + "%; background-color: " + layer.color + ";\n                     border-bottom: " + (layer.layer.LocalMinima ? '3px' : '0') + " solid " + (layer.layer.Bottleneck ? 'black' : '	#666666;' + 'display:inline-block;margin-left:') + (index == 0 ? '0' : '1px'));
                    var layerInfoDiv = singleLayer.append('div').attr('class', 'channels-db-channel-layer-info');
                    var infoUnit = layerInfoDiv.append('div').attr('class', 'channels-db-channel-layer-info-unit').attr('style', 'left: 0');
                    var small = infoUnit.append('div').append('small');
                    small.append('b').text('Radius: ');
                    small.append("text").text((Number(layer.layer.MinRadius).toFixed(1) || 1) + "\u212B");
                    small = infoUnit.append('div').append('small');
                    small.append('b').text('Length: ');
                    small.append("text").text((Number(layer.layer.EndDistance - layer.layer.StartDistance).toFixed(1) || 1) + "\u212B");
                    infoUnit = layerInfoDiv.append('div').attr('style', 'left: 111px').attr('class', 'channels-db-channel-layer-info-unit');
                    small = infoUnit.append('div').append('small');
                    small.append('b').text('HPthy ');
                    small.append("text").text("" + (Number(layer.layer.Properties.Hydropathy).toFixed(2) || 2));
                    small = infoUnit.append('div').append('small');
                    "";
                    small.append('b').text('Charge: ');
                    small.append("text").text("" + (layer.layer.Properties.Charge > 0 ? '+' : '') + Number(layer.layer.Properties.Charge).toFixed(1));
                    var infoResidue = layerInfoDiv.append('div').attr('class', 'channels-db-channel-layer-info-residues');
                    layer.layer.Residues.forEach(function (residue, index) {
                        if (residue.Backbone == true) {
                            infoResidue.append('small').append('b').append('span').attr('class', 'hint--top').attr('data-hint', 'Backbone').text(residue.Name + " \n                            " + residue.SequenceNumber + residue.Chain + (layer.layer.Residues.length - 1 == index ? '' : " \u2013 "));
                        } else {
                            infoResidue.append('small').append('span').attr('class', 'hint--top').attr('data-hint', 'Backbone').text(residue.Name + " \n                            " + residue.SequenceNumber + residue.Chain + (layer.layer.Residues.length - 1 == index ? '' : " \u2013 "));
                        }
                    });
                    // infoResidue.append('div').attr('class', 'channels-db-channel-layer-info-bottleneck')
                    //     .text('Bottleneck');
                    // infoResidue.append('div').attr('class', 'channels-db-channel-layer-info-bottleneck')
                    //     .text('Local minimum');
                    layerInfoDiv.append('div').attr('style', "background: " + layer.color);
                });
                // const li = document.createElement('li');
                // const mainDiv = document.createElement('div');
                // const numberDiv = document.createElement('div');
                // numberDiv.innerHTML += `#${index + 1}`;
                // mainDiv.appendChild(numberDiv);
                //
                //
                // const infoDiv = document.createElement('div');
                // infoDiv.innerHTML = `<div>
                //                         <b>
                // 			<span class="hint--bottom" data-hint="Length of the channel [&#8491;].">
                // 				Length:
                // 			</span>
                //                         </b>
                //
                //                         ${channel.Length || 1}&#8491;
                //
                //                         <span class="channels-db-delimiter">|</span>
                //
                //                         <b>
                // 			<span class="hint--bottom hint--large" data-hint="Channel's hydropathy is an average hydropathy index assigned to the lining residues according to the Kyte and Doolitle.">
                // 				HPthy:
                // 			</span>
                //                         </b>
                //                         ${channel.Properties.Hydropathy || 2}
                //
                //                         <span class="channels-db-delimiter">|</span>
                //                         <b>
                // 			<span class="hint--bottom hint--large" data-hint="Charge is calculated as a sum of charged residues (Arg, Lys = +1; Asp, Glu = -1)">
                // 				Charge:
                // 			</span>
                //                         </b>
                //                         ${channel.Properties.Charge > 0? '+': ''}${channel.Properties.Charge}
                //                         <span style="float: right; font-weight: 200;">${channel.Name}</span>
                //                     </div>`;
                //
                //
                // const channelBodyDiv = document.createElement('div');
                // channelBodyDiv.setAttribute('class', 'channels-db-channel-body');
                //
                // channelBodyDiv.innerHTML += `
                //     <div class="channels-db-channel-body-content">
                //         <div style="position: relative; display: inline-block">
                //                                     <b>
                //                 Bottleneck:
                //                 </b>
                //             <span class="hint--bottom" data-hint="Channels's lowest profile: radius / length">
                //                 ${Number(channel.Bottleneck.MinRadius).toFixed(2) || 1} / ${Number(channel.Bottleneck.EndDistance - channel.Bottleneck.StartDistance).toFixed(2) || 1}
                //             </span>
                //             <span class="channels-db-delimiter">|</span>
                //                             <span class="hint--bottom" data-hint="Hydropathy of the bottleneck.">
                // 				${Number(channel.Bottleneck.Properties.Hydropathy).toFixed(2) || 2}
                // 			</span>
                //                             <span class="channels-db-delimiter">|</span>
                //                             <span class="hint--bottom" data-hint="Formal charge of the bottleneck.">
                // 				${Number(channel.Properties.Charge) > 0 ? '+': ''} ${Number(channel.Bottleneck.Properties.Charge).toFixed(2)}
                // 			</span>
                //                             <span class="channels-db-delimiter">|</span>
                //                             <span class="hint--bottom" data-hint="Bottleneck lining residues.">
                // 				${this.liningResiduesString(channel.Bottleneck.Residues) || 'cut:true:10:\' ...\''}
                // 			</span>
                //         </div>
                //     </div>
                // `;
                //
                // const layersDiv = document.createElement('div');
                // layersDiv.setAttribute('class', 'channels-db-channel-layers');
                // layersDiv.innerHTML = `
                //                     <div class="hint--right hint--large" data-hint="The channel is uniformly divided into layers, and each layer is defined by the residues lining it. A new layer starts whenever there is a change in the list of residues lining the channel along its length.">
                //                         Layers
                //                     </div>
                //
                //                     <div class="channels-db-channel-layers">
                //                         <!--<div ng-repeat="layer in channel.wrappedLayers"-->
                //                              style="width: {{ layer.computedWidth }}%; background-color:{{ layer.color }};
                // 					 border-bottom: {{layer.layer.LocalMinima ? '3px' : '0'}} solid {{layer.layer.Bottleneck ? 'black' : '	#666666'}}">
                //
                //                             <div class="channels-db-channel-layer-info">
                //                                 <div style="left: 0;" class="channels-db-channel-layer-info-unit">
                //                                     <div><small><b>Radius:</b> {{layer.layer.MinRadius | number: 1}}&#8491;</small></div>
                //                                     <div><small><b>Length:</b> {{layer.layer.EndDistance - layer.layer.StartDistance | number: 1}}&#8491;</small></div>
                //                                 </div>
                //                                 <div style="left: 96px;" class="channels-db-channel-layer-info-unit">
                //                                     <div><small><b>Hpthy:</b> {{layer.layer.Properties.Hydropathy | number: 2}}</small></div>
                //                                     <div><small><b>Charge:</b> {{layer.layer.Properties.Charge > 0? '+': ''}}{{layer.layer.Properties.Charge}}</small></div>
                //                                 </div>
                //                                 <div class="channels-db-channel-layer-info-residues">
                // 					<!--<span ng-repeat="residue in layer.layer.Residues">-->
                // 						<!--
                // 						-->
                // 						<!--<small ng-if="residue.Backbone">-->
                // 							<!--
                // 							-->
                // 							<b>
                // 								<!--
                // 								-->
                // 								<span class="hint--top" data-hint="Backbone">
                // 									<!--
                // 									-->
                // 									{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}
                //                                         <!--
                //                                         -->
                // 								</span>
                //                                     <!--
                //                                     -->
                // 							</b>
                //                                 <!--
                //                                 -->
                // 						</small>
                //                             <!--
                //                             -->
                // 						<!--<small ng-if="!residue.Backbone">{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}</small>-->
                //                             <!--
                //                             -->
                // 					</span>
                //                                     <!--<div ng-show="{{layer.layer.Bottleneck}}" class="channels-db-channel-layer-info-bottleneck">Bottleneck</div>-->
                //                                     <!--<div ng-show="{{layer.layer.LocalMinima && !layer.layer.Bottleneck}}" class="channels-db-channel-layer-info-bottleneck">Local minimum</div>-->
                //                                 </div>
                //                                 <div style="background: {{ layer.color }}"></div>
                //                             </div>
                //
                // </div>`
                // mainDiv.appendChild(infoDiv);
                // mainDiv.appendChild(channelBodyDiv);
                // // mainDiv.appendChild(layersDiv);
                // li.appendChild(mainDiv);
                //
                // ul.appendChild(li);
            });
            // ul.appendChild(document.createElement('li'));
            console.log();
        }
    }], [{
        key: "distinctBy",
        value: function distinctBy(data, key) {
            var elements = {};
            var result = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var v = _step2.value;

                    var k = key(v);
                    if (!elements[k]) {
                        result.push(v);
                        elements[k] = true;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return result;
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
            return polymer_element_js_1.html(_templateObject);
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