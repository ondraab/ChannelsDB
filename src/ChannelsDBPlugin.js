"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polymer_element_js_1 = require("@polymer/polymer/polymer-element.js");
require("@polymer/polymer/lib/elements/dom-repeat.js");
require("bootstrap/dist/css/bootstrap.css");
class ChannelsDBPlugin extends polymer_element_js_1.PolymerElement {
    constructor() {
        super(...arguments);
        this.shortResidueNames = {
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
            VAL: "V",
        };
        this.createSubtitle = function (channels) {
            let subtitle = '';
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
            return `${subtitle} ${this.channelsToPlural()}`;
        };
    }
    calculateLining(channel, backbone) {
        let residueLining = channel.Layers.map(((x) => { return x.Residues; }));
        let union = [].concat.apply([], residueLining);
        let result = [];
        if (backbone)
            result = union.filter(function (x) { return x.Backbone; });
        else
            result = union.filter(function (x) { return x.SideChain; });
        return this.liningResiduesString(result);
    }
    ;
    liningResiduesString(residueLining) {
        let lining = {};
        let result = "";
        let uniqueResidues = ChannelsDBPlugin.distinctBy(residueLining, function (x) { return x['SequenceNumber'] + x['Chain']; });
        for (let i = 0; i < uniqueResidues.length; i++) {
            let name = uniqueResidues[i]['Name'];
            let value = this.getShortResidueName(name);
            if (typeof lining[this.getShortResidueName(name)] == 'undefined') {
                lining[this.getShortResidueName(name)] = 1;
            }
            else {
                lining[this.getShortResidueName(name)] = lining[this.getShortResidueName(name)] + 1;
            }
        }
        for (let key in lining) {
            let value = lining[key];
            result = value === 1 ? result + key + '-' : result + value + key + '-';
        }
        return result.substring(0, result.length - 1);
    }
    ;
    getShortResidueName(name) {
        let r = this.shortResidueNames[name];
        if (!r)
            return name;
        return r;
    }
    ;
    static distinctBy(data, key) {
        let elements = {};
        let result = [];
        for (let v of data) {
            let k = key(v);
            if (!elements[k]) {
                result.push(v);
                elements[k] = true;
            }
        }
        return result;
    }
    channelsToPlural() {
        return `channel${this.channelsJson.length > 0 ? 's' : ''}`;
    }
    connectedCallback() {
        const request = new XMLHttpRequest();
        let channels = [];
        request.open('GET', `https://webchem.ncbr.muni.cz/API/ChannelsDB/Component/${this.pdbId}`, true);
        request.onload = function (req) {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    channels = JSON.parse(request.response);
                    callback();
                }
                else {
                    console.error(request.statusText);
                }
            }
        };
        let callback = (() => {
            this.channelsJson = channels;
            ChannelsDBPlugin.channelsList = channels;
            this.subtitle = this.createSubtitle(this.channelsJson);
            this.imgSrc = `https://webchem.ncbr.muni.cz/API/ChannelsDB/Download/${this.pdbId}?type=png`;
            super.connectedCallback();
        });
        request.send(null);
    }
    static get channelLength(length) {
        if (length)
            return length;
        else
            return 1;
    }
    static get getChannelReview() {
        return polymer_element_js_1.html `
                        <!--<li ng-repeat="channel in channels">-->
                            <div>
                                <div>#[[ $index + 1 ]]</div>
                                <div>
                                    <b>
							<span class="hint--bottom" data-hint="Length of the channel [&#8491;].">
								Length:
							</span>
                                    </b>
                                    ${this.channelLength()}
                                    {{channel.Length | number: 1}}&#8491;

                                    <span class="channels-db-delimiter">|</span>

                                    <b>
							<span class="hint--bottom hint--large" data-hint="Channel's hydropathy is an average hydropathy index assigned to the lining residues according to the Kyte and Doolitle.">
								HPthy:
							</span>
                                    </b>
                                    {{channel.Properties.Hydropathy | number: 2}}

                                    <span class="channels-db-delimiter">|</span>
                                    <b>
							<span class="hint--bottom hint--large" data-hint="Charge is calculated as a sum of charged residues (Arg, Lys = +1; Asp, Glu = -1)">
								Charge:
							</span>
                                    </b>
                                    {{channel.Properties.Charge > 0? '+': ''}}{{channel.Properties.Charge}}
                                    <span style="float: right; font-weight: 200;">{{channel.Name}}</span>
                                </div>

                            </div>

                            <div class="channels-db-channel-body">
                                <!--<div style="background: #{{channel.Color}}"></div>-->

                                <div class="channels-db-channel-body-content">
                                    <div style="position: relative">
                                        <b>Bottleneck:</b>

                                        <span class="hint--bottom" data-hint="Channels's lowest profile: radius / length">
								{{bottlenecks[$index].MinRadius | number: 1}} / {{(bottlenecks[$index].EndDistance - bottlenecks[$index].StartDistance) | number: 1}}
							</span>
                                        <span class="channels-db-delimiter">|</span>
                                        <span class="hint--bottom" data-hint="Hydropathy of the bottleneck.">
								{{bottlenecks[$index].Properties.Hydropathy | number: 2}}
							</span>
                                        <span class="channels-db-delimiter">|</span>
                                        <span class="hint--bottom" data-hint="Formal charge of the bottleneck.">
								{{channel.Properties.Charge > 0? '+': ''}}{{bottlenecks[$index].Properties.Charge}}
							</span>
                                        <span class="channels-db-delimiter">|</span>
                                        <span class="hint--bottom" data-hint="Bottleneck lining residues.">
								{{liningResiduesString(bottlenecks[$index].Residues) | cut:true:10:' ...' }}
							</span>
                                    </div>


                                    <div>
                                        <b>Lining:</b>
                                        <span class="hint--top" data-hint="Sidechain lining residues">
								{{calculateLining(channel, false) | cut:true:200:'...' }}
							</span>
                                        <!--<span ng-show="{{calculateLining(channel, true).length > 0}}" class="channels-db-delimiter">|</span>-->
                                        <span class="hint--top" data-hint="Backbone lining residues">
								{{calculateLining(channel, true) | cut:true:200:'...' }}
							</span>



                                    </div>
                                </div>
                            </div>

                            <div class="channels-db-channel-layers-wrapper">

                                <div class="hint--right hint--large" data-hint="The channel is uniformly divided into layers, and each layer is defined by the residues lining it. A new layer starts whenever there is a change in the list of residues lining the channel along its length.">
                                    Layers
                                </div>

                                <div class="channels-db-channel-layers">
                                    <!--<div ng-repeat="layer in channel.wrappedLayers"-->
                                         style="width: {{ layer.computedWidth }}%; background-color:{{ layer.color }};
									 border-bottom: {{layer.layer.LocalMinima ? '3px' : '0'}} solid {{layer.layer.Bottleneck ? 'black' : '	#666666'}}">

                                        <div class="channels-db-channel-layer-info">
                                            <div style="left: 0;" class="channels-db-channel-layer-info-unit">
                                                <div><small><b>Radius:</b> {{layer.layer.MinRadius | number: 1}}&#8491;</small></div>
                                                <div><small><b>Length:</b> {{layer.layer.EndDistance - layer.layer.StartDistance | number: 1}}&#8491;</small></div>
                                            </div>
                                            <div style="left: 96px;" class="channels-db-channel-layer-info-unit">
                                                <div><small><b>Hpthy:</b> {{layer.layer.Properties.Hydropathy | number: 2}}</small></div>
                                                <div><small><b>Charge:</b> {{layer.layer.Properties.Charge > 0? '+': ''}}{{layer.layer.Properties.Charge}}</small></div>
                                            </div>
                                            <div class="channels-db-channel-layer-info-residues">
									<!--<span ng-repeat="residue in layer.layer.Residues">-->
										<!--
										-->
										<!--<small ng-if="residue.Backbone">-->
											<!--
											-->
											<b>
												<!--
												-->
												<span class="hint--top" data-hint="Backbone">
													<!--
													-->
													{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}
                                                    <!--
                                                    -->
												</span>
                                                <!--
                                                -->
											</b>
                                            <!--
                                            -->
										</small>
                                        <!--
                                        -->
										<!--<small ng-if="!residue.Backbone">{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}</small>-->
                                        <!--
                                        -->
									</span>
                                                <!--<div ng-show="{{layer.layer.Bottleneck}}" class="channels-db-channel-layer-info-bottleneck">Bottleneck</div>-->
                                                <!--<div ng-show="{{layer.layer.LocalMinima && !layer.layer.Bottleneck}}" class="channels-db-channel-layer-info-bottleneck">Local minimum</div>-->
                                            </div>
                                            <div style="background: {{ layer.color }}"></div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </li>`;
    }
    static get properties() {
        return {
            pdbId: {
                type: String,
                reflectToAttribute: true,
                notify: true,
            }
        };
    }
    static get template() {
        // language=HTML
        return polymer_element_js_1.html `
            <style>
                @import url( ../public/style.css )
            </style>
            <div class="channels-db-header">
            <span>
                <span class="channels-db-id">[[pdbId]] | <small>[[channelsJson.length]] [[subtitle]]</small> &nbsp;&nbsp;&mdash;&nbsp;&nbsp;</span>ChannelsDB
                <span style="float:right;"><a href="https://webchemdev.ncbr.muni.cz/ChannelsDB/detail/[[pdbId]]">[+ More]</a></span>
            </span>
            </div>
            <div class="channels-db-body">
                <div class="channels-db-left-pane">
                    <div class="channels-db-thumb channels-db-thumb-src">
                        <img src="{{imgSrc}}">
                    </div>
                </div>

                <div class="channels-db-right-pane">
                    <!--<div ng-show="isError" class="channels-db-right-pane-error">Error: {{error}}</div>-->

                    <ul class="channels-db-list">

                        <template is="dom-repeat" id="menu" items="{{channelsJson}}">
                            <li>
                                <div>
                                    <div>#[[index]]</div>
                                    <div>
                                        <b>
                                            <span class="hint--bottom" data-hint="Length of the channel [&#8491;].">
                                                Length:
                                            </span>
                                        </b>{{item.Length}}&#8491;
                                        <span class="channels-db-delimiter">|</span>
                                        <b>
                                            <span class="hint--bottom hint--large" 
                                                  data-hint="Channel's hydropathy is an average hydropathy index 
                                                  assigned to the lining residues according to the Kyte and Doolitle.">
                                            HPthy:
                            </span>
                            </b>
                            {{item.Properties.Hydropathy}}

                            <span class="channels-db-delimiter">|</span>
                            <b>
                            <span class="hint--bottom hint--large" data-hint="Charge is calculated as a sum of charged residues (Arg, Lys = +1; Asp, Glu = -1)">
                            Charge:
                            </span>
                            </b>
                            {{item.Properties.Charge > 0? '+': ''}}{{item.Properties.Charge}}
                            <span style="float: right; font-weight: 200;">{{item.Name}}</span>
                            </div>

                            </div>

                            <div class="channels-db-channel-body">
                            <!--<div style="background: #{{channel.Color}}"></div>-->

                            <div class="channels-db-channel-body-content">
                            <div style="position: relative">
                            <b>Bottleneck:</b>

                            <span class="hint--bottom" data-hint="Channels's lowest profile: radius / length">
                            {{bottlenecks[$index].MinRadius | number: 1}} / {{(bottlenecks[$index].EndDistance - bottlenecks[$index].StartDistance) | number: 1}}
                            </span>
                            <span class="channels-db-delimiter">|</span>
                            <span class="hint--bottom" data-hint="Hydropathy of the bottleneck.">
                            {{bottlenecks[$index].Properties.Hydropathy | number: 2}}
                            </span>
                            <span class="channels-db-delimiter">|</span>
                            <span class="hint--bottom" data-hint="Formal charge of the bottleneck.">
                            {{item.Properties.Charge > 0? '+': ''}}{{bottlenecks[$index].Properties.Charge}}
                            </span>
                            <span class="channels-db-delimiter">|</span>
                            <span class="hint--bottom" data-hint="Bottleneck lining residues.">
                            {{liningResiduesString(bottlenecks[$index].Residues) | cut:true:10:' ...' }}
                            </span>
                            </div>


                            <div>
                            <b>Lining:</b>
                            <span class="hint--top" data-hint="Sidechain lining residues">
                            {{calculateLining(item, false) | cut:true:200:'...' }}
                            </span>
                            <!--<span ng-show="{{calculateLining(channel, true).length > 0}}" class="channels-db-delimiter">|</span>-->
                            <span class="hint--top" data-hint="Backbone lining residues">
                            {{calculateLining(item, true) | cut:true:200:'...' }}
                            </span>



                            </div>
                            </div>
                            </div>

                            <div class="channels-db-channel-layers-wrapper">

                            <div class="hint--right hint--large" data-hint="The channel is uniformly divided into layers, and each layer is defined by the residues lining it. A new layer starts whenever there is a change in the list of residues lining the channel along its length.">
                            Layers
                            </div>

                            <div class="channels-db-channel-layers">
                            <!--<div ng-repeat="layer in channel.wrappedLayers"-->
                            style="width: {{ layer.computedWidth }}%; background-color:{{ layer.color }};
                            border-bottom: {{layer.layer.LocalMinima ? '3px' : '0'}} solid {{layer.layer.Bottleneck ? 'black' : '	#666666'}}">

                            <div class="channels-db-channel-layer-info">
                            <div style="left: 0;" class="channels-db-channel-layer-info-unit">
                            <div><small><b>Radius:</b> {{layer.layer.MinRadius | number: 1}}&#8491;</small></div>
                            <div><small><b>Length:</b> {{layer.layer.EndDistance - layer.layer.StartDistance | number: 1}}&#8491;</small></div>
                            </div>
                            <div style="left: 96px;" class="channels-db-channel-layer-info-unit">
                            <div><small><b>Hpthy:</b> {{layer.layer.Properties.Hydropathy | number: 2}}</small></div>
                            <div><small><b>Charge:</b> {{layer.layer.Properties.Charge > 0? '+': ''}}{{layer.layer.Properties.Charge}}</small></div>
                            </div>
                            <div class="channels-db-channel-layer-info-residues">
                            <!--<span ng-repeat="residue in layer.layer.Residues">-->
                            <!--
                            -->
                            <!--<small ng-if="residue.Backbone">-->
                            <!--
                            -->
                            <b>
                            <!--
                            -->
                            <span class="hint--top" data-hint="Backbone">
                            <!--
                            -->
                            {{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}
                            <!--
                            -->
                            </span>
                            <!--
                            -->
                            </b>
                            <!--
                            -->
                            </small>
                            <!--
                            -->
                            <!--<small ng-if="!residue.Backbone">{{residue.Name}} {{residue.SequenceNumber}}{{residue.Chain}}{{$last? '' : ' &ndash; '}}</small>-->
                            <!--
                            -->
                            </span>
                            <!--<div ng-show="{{layer.layer.Bottleneck}}" class="channels-db-channel-layer-info-bottleneck">Bottleneck</div>-->
                            <!--<div ng-show="{{layer.layer.LocalMinima && !layer.layer.Bottleneck}}" class="channels-db-channel-layer-info-bottleneck">Local minimum</div>-->
                            </div>
                            <div style="background: {{ layer.color }}"></div>
                            </div>

                            </div>
                            </div>
                            </div>
                            </li>
                        </template>
                    </ul>
                </div>

            </div>

            <div class="channels-db-footer">
                <span class="channels-db-powered">powered by <a target="_blank" href="http://mole.chemi.muni.cz">MOLE 2.5</a></span>
                <!--<a target="_blank" href="{{link}}">[+ Custom analysis]</a>-->
            </div>
        `;
    }
}
class LayerWrapper {
    constructor(computedWidth, color, layer) {
        this.computedWidth = computedWidth;
        this.color = color;
        this.layer = layer;
    }
}
exports.LayerWrapper = LayerWrapper;
window.customElements.define('channelsdb-plugin', ChannelsDBPlugin);
