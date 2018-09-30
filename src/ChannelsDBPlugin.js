"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polymer_element_js_1 = require("@polymer/polymer/polymer-element.js");
const d3 = require("d3");
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
    prepareLayers(channel) {
        const minHpthy = -4.5;
        const medHpthy = 0.0;
        const maxHpthy = 4.5;
        let modifiedLayers = [];
        const dt = 1 / (channel.Layers.length - 1);
        let t = 0;
        const minColor = { r: 255, g: 0, b: 0 };
        const midColor = { r: 255, g: 255, b: 255 };
        const maxColor = { r: 0, g: 0, b: 255 };
        let totalWidth = 0;
        function interpolateColor(min, minColor, max, maxColor, value, target = undefined) {
            let ret = target !== undefined ? target : { r: 0.1, g: 0.1, b: 0.1 };
            let t = (value - min) / (max - min);
            ret.r = (minColor.r + (maxColor.r - minColor.r) * t) | 0;
            ret.g = (minColor.g + (maxColor.g - minColor.g) * t) | 0;
            ret.b = (minColor.b + (maxColor.b - minColor.b) * t) | 0;
            return ret;
        }
        /** Formats Color object into the rgb expression suitable for CSS. **/
        function formatColor(color) {
            return `rgb(${color.r},${color.g},${color.b})`;
        }
        let index = 0;
        for (let l of channel.Layers) {
            let width = 100 * (l.EndDistance - l.StartDistance) / channel.Length;
            t = l.Properties.Hydropathy;
            totalWidth += width;
            let color = t <= 0 ? interpolateColor(minHpthy, minColor, medHpthy, midColor, t) : interpolateColor(medHpthy, midColor, maxHpthy, maxColor, t);
            modifiedLayers.push(new LayerWrapper(width, formatColor(color), l));
        }
        if (!modifiedLayers.length)
            return modifiedLayers;
        modifiedLayers[modifiedLayers.length - 1].computedWidth = modifiedLayers[modifiedLayers.length - 1].computedWidth + 100 - totalWidth - 0.0001;
        return modifiedLayers;
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
            this.addChannelsReview();
        });
        request.send(null);
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
                        <img src="{{imgSrc}}" style="width: 100%">
                    </div>
                </div>

                <div class="channels-db-right-pane">
                    <!--<div ng-show="isError" class="channels-db-right-pane-error">Error: {{error}}</div>-->

                    <ul class="channels-db-list">
                        
                    </ul>
                </div>

            </div>

            <div class="channels-db-footer">
                <span class="channels-db-powered">powered by <a target="_blank" href="http://mole.chemi.muni.cz">MOLE 2.5</a></span>
                <a target="_blank" href="http://mole.upol.cz/api/ebi/?action=newjob&pdbid=[[pdbId]]&ignorehet=0&start=auto">[+ Custom analysis]</a>
            </div>
        `;
    }
    addChannelsReview() {
        let ul = document.querySelector('channelsdb-plugin').shadowRoot.querySelector('.channels-db-list');
        this.channelsJson.forEach((channel, index) => {
            let wrappedLayers = this.prepareLayers(channel);
            const mainLi = d3.select(document.querySelector('channelsdb-plugin').shadowRoot.querySelector('.channels-db-list'))
                .append('li');
            const mainDiv = mainLi.append('div');
            mainDiv.append('div').text(`#${index + 1}`);
            const sumInfoDiv = mainDiv.append('div').attr('class', 'hint--bottom');
            sumInfoDiv.append('b').text(`Length: `);
            sumInfoDiv.append('span')
                .attr('data-hint', 'Length of the channel [\u212b].').text(`${Number(channel.Length).toFixed(1) || 1}\u212b`);
            sumInfoDiv.append('span').classed('channels-db-delimiter', true).text(' | ');
            sumInfoDiv.append('b').text('HPthy: ');
            sumInfoDiv.append('span').classed('hint--bottom hint--large', true)
                .attr('data--hint', 'Channel\'s hydropathy is an average hydropathy index assigned to the lining residues according to the Kyte and Doolitle.')
                .text(`${Number(channel.Properties.Hydropathy).toFixed(2) || 2}`);
            sumInfoDiv.append('span').classed('channels-db-delimiter', true).text(' | ');
            sumInfoDiv.append('b').text('Charge: ');
            sumInfoDiv.append('span').classed('hint--bottom hint--large', true)
                .attr('data--hint', 'Charge is calculated as a sum of charged residues (Arg, Lys = +1; Asp, Glu = -1)')
                .text(`${Number(channel.Properties.Charge) > 0 ? '+' : ''}${channel.Properties.Charge}`);
            sumInfoDiv.append('span').text(`${channel.Name}`).attr('style', 'float: right; font-weight: 200;');
            const bodyContent = mainLi.append('div').attr('class', 'channels-db-channel-body')
                .append('div').attr('class', 'channels-db-channel-body-content');
            const bottleneck = bodyContent.append('div').attr('style', 'position: relative');
            bottleneck.append('b').text('Bottleneck: ');
            bottleneck.append('span').attr('class', 'hint--bottom')
                .attr('data-hint', 'Channels\'s lowest profile: radius / length')
                .text(`${Number(channel.Bottleneck.MinRadius).toFixed(2) || 1} / ${(Number(channel.Bottleneck.EndDistance) - Number(channel.Bottleneck.StartDistance)).toFixed(2)}`);
            bottleneck.append('span').classed('channels-db-delimiter', true).text(' | ');
            bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Hydropathy of the bottleneck.')
                .text(`${Number(channel.Bottleneck.Properties.Hydropathy) || 2}`);
            bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Formal charge of the bottleneck.')
                .text(`${Number(channel.Properties.Charge) > 0 ? '+' : ''}${channel.Bottleneck.Properties.Charge}`);
            bottleneck.append('span').classed('channels-db-delimiter', true).text(' | ');
            bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Bottleneck lining residues.')
                .text(`${this.liningResiduesString(channel.Bottleneck.Residues) || ''}`);
            const lining = bodyContent.append('div');
            lining.append('b').text('Lining: ');
            lining.append('span').attr('class', 'hint--top').attr('data-hint', 'Sidechain lining residues')
                .text(`${this.calculateLining(channel, false) || 'cut:true:200:\'...\''}`);
            lining.append('span').classed('channels-db-delimiter', true).text(' | ');
            lining.append('span').attr('class', 'hint--top').attr('data-hint', 'Backbone lining residues')
                .text(`${this.calculateLining(channel, true) || 'cut:true:200:\'...\''}`);
            const layers = mainLi.append('div').attr('class', 'channels-db-channel-layers-wrapper');
            layers.append('div').attr('class', 'hint--right hint--large')
                .attr('data-hint', 'The channel is uniformly divided into layers, and each layer is defined by the residues lining it. A new layer starts whenever there is a change in the list of residues lining the channel along its length.')
                .text('Layers');
            const layersDiv = layers.append('div').attr('class', 'channels-db-channel-layers');
            wrappedLayers.forEach((layer, index) => {
                let singleLayer = layersDiv.append('div').attr('style', `width: ${layer.computedWidth}%; background-color: ${layer.color};
                     border-bottom: ${layer.layer.LocalMinima ? '3px' : '0'} solid ${layer.layer.Bottleneck ? 'black' : '	#666666;' +
                    'display:inline-block;margin-left:'}${index == 0 ? '0' : '1px'}`);
                let layerInfoDiv = singleLayer.append('div').attr('class', 'channels-db-channel-layer-info');
                let infoUnit = layerInfoDiv.append('div').attr('class', 'channels-db-channel-layer-info-unit')
                    .attr('style', 'left: 0');
                let small = infoUnit.append('div').append('small');
                small.append('b').text('Radius: ');
                small.append(`text`).text(`${Number(layer.layer.MinRadius).toFixed(1) || 1}\u212b`);
                small = infoUnit.append('div').append('small');
                small.append('b').text('Length: ');
                small.append(`text`).text(`${Number(layer.layer.EndDistance - layer.layer.StartDistance).toFixed(1) || 1}\u212b`);
                infoUnit = layerInfoDiv.append('div').attr('style', 'left: 111px')
                    .attr('class', 'channels-db-channel-layer-info-unit');
                small = infoUnit.append('div').append('small');
                small.append('b').text('HPthy ');
                small.append(`text`).text(`${Number(layer.layer.Properties.Hydropathy).toFixed(2) || 2}`);
                small = infoUnit.append('div').append('small');
                ``;
                small.append('b').text('Charge: ');
                small.append(`text`).text(`${layer.layer.Properties.Charge > 0 ? '+' : ''}${Number(layer.layer.Properties.Charge).toFixed(1)}`);
                let infoResidue = layerInfoDiv.append('div').attr('class', 'channels-db-channel-layer-info-residues');
                layer.layer.Residues.forEach((residue, index) => {
                    if (residue.Backbone == true) {
                        infoResidue.append('small').append('b').append('span').attr('class', 'hint--top')
                            .attr('data-hint', 'Backbone').text(`${residue.Name} 
                            ${residue.SequenceNumber}${residue.Chain}${layer.layer.Residues.length - 1 == index ? '' : ' \u2013 '}`);
                    }
                    else {
                        infoResidue.append('small').append('span').attr('class', 'hint--top')
                            .attr('data-hint', 'Backbone').text(`${residue.Name} 
                            ${residue.SequenceNumber}${residue.Chain}${layer.layer.Residues.length - 1 == index ? '' : ' \u2013 '}`);
                    }
                });
                // infoResidue.append('div').attr('class', 'channels-db-channel-layer-info-bottleneck')
                //     .text('Bottleneck');
                // infoResidue.append('div').attr('class', 'channels-db-channel-layer-info-bottleneck')
                //     .text('Local minimum');
                layerInfoDiv.append('div').attr('style', `background: ${layer.color}`);
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
