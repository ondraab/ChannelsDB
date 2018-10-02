import { PolymerElement, html } from '@polymer/polymer/polymer-element.js'
import * as d3 from 'd3';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import 'bootstrap/dist/css/bootstrap.css';

class ChannelsDBPlugin extends PolymerElement {

    private subtitle: string;
    private pdbId: string;
    private channelsJson: any[];
    private static channelsList: any;
    private imgSrc: string;

    /**
     * Return lining residues of channel
     * @param channel
     * @param backbone
     */
    private calculateLining(channel: any, backbone: any): string{
        let residueLining = channel.Layers.map(
            ((x) => {return x.Residues}));

        let union = [].concat.apply([], residueLining);
        let result = [];

        if (backbone)
            result = union.filter(function (x) { return x.Backbone; });
        else
            result = union.filter(function (x) { return x.SideChain; });

        return this.liningResiduesString(result);
    };

    /**
     * Makes string from lining residues
     * @param residueLining
     */
    private liningResiduesString(residueLining: any): string{
        let lining: { [id: string]: number } = {};
        let result: string = "";

        let uniqueResidues = ChannelsDBPlugin.distinctBy(residueLining, function (x) { return x['SequenceNumber'] + x['Chain']; });


        for (let i = 0; i < uniqueResidues.length; i++) {
            let name: string = uniqueResidues[i]['Name'];

            if (typeof lining[this.getShortResidueName(name)] == 'undefined') {
                lining[this.getShortResidueName(name)] = 1;
            } else {
                lining[this.getShortResidueName(name)] = lining[this.getShortResidueName(name)] + 1;
            }
        }


        for (let key in lining) {
            let value: number = lining[key];
            result = value === 1 ? result + key + '-' : result + value + key + '-';
        }

        return result.substring(0, result.length - 1);
    };

    /**
     * Translator from 3 letter residue name to one letter.
     * @param name
     */
    private getShortResidueName(name: string): string {
        let r = this.shortResidueNames[name];
        if (!r) return name;
        return r;
    };

    /**
     * Custom distinct by function for filtering out residues which are occuring in the channels walls repeatedly.
     * @param data
     * @param key
     */
    private static distinctBy<T>(data: T[], key:(v: T) => string) {
        let elements = {};
        let result: T[] = [];

        for (let v of data) {
            let k = key(v);
            if (!elements[k]) {
                result.push(v);
                elements[k] = true;
            }
        }

        return result;
    }

    /** Dictionary for translating 3-letter AA abbreviations into 1-letter **/
    private shortResidueNames: { [name: string]: string } = {
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

    /** Based on the input parameters create a subtitle for the ChannelsDB window. **/
    private createSubtitle = function (channels: any[]): string {
        let subtitle: string = '';
        if (typeof channels[0] == 'undefined')
            return subtitle;
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

    /** Add s to end if there is more than one channel**/
    private channelsToPlural():string {
        return `channel${this.channelsJson.length > 0 ? 's' : ''}`;
    }

    /** For each layer of a given channel calculates its width in the layer bar and respective color based on the HPthy index. **/
    private prepareLayers(channel: any): LayerWrapper[] {
        const minHpthy: number = -4.5;
        const medHpthy: number = 0.0;
        const maxHpthy: number = 4.5;

        let modifiedLayers: LayerWrapper[] = [];

        let t: number;

        const minColor: Color = { r: 255, g: 0, b: 0 };
        const midColor: Color = { r: 255, g: 255, b: 255 };
        const maxColor: Color = { r: 0, g: 0, b: 255 };

        let totalWidth: number = 0;

        function interpolateColor(min: number, minColor: Color, max: number, maxColor: Color, value: number, target: Color = undefined) {
            let ret = target !== undefined ? target : { r: 0.1, g: 0.1, b: 0.1 };
            let t = (value - min) / (max - min);

            ret.r = (minColor.r + (maxColor.r - minColor.r) * t) | 0;
            ret.g = (minColor.g + (maxColor.g - minColor.g) * t) | 0;
            ret.b = (minColor.b + (maxColor.b - minColor.b) * t) | 0;

            return ret;
        }

        /** Formats Color object into the rgb expression suitable for CSS. **/
        function formatColor(color: Color): string {
            return `rgb(${color.r},${color.g},${color.b})`;
        }

        for (let l of channel.Layers) {
            let width = 100 * (l.EndDistance - l.StartDistance) / channel.Length;
            t = l.Properties.Hydropathy;


            totalWidth += width;

            let color = t <= 0 ? interpolateColor(minHpthy, minColor, medHpthy, midColor, t) : interpolateColor(medHpthy, midColor, maxHpthy, maxColor, t);
            modifiedLayers.push(new LayerWrapper(width, formatColor(color), l));
        }

        if (!modifiedLayers.length) return modifiedLayers;


        modifiedLayers[modifiedLayers.length - 1].computedWidth = modifiedLayers[modifiedLayers.length - 1].computedWidth + 100 - totalWidth - 0.0001;

        return modifiedLayers;
    }

    /** Polymer method, called after initialization. **/
    connectedCallback() {
        /*Download channel report, render after download is done. */
        const request = new XMLHttpRequest();
        let channels = [];
        request.open('GET', `https://webchem.ncbr.muni.cz/API/ChannelsDB/Component/${this.pdbId}`, true);
        request.onload = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    channels = JSON.parse(request.response);
                    callback();
                } else {
                    console.error(request.statusText);
                }
            }
        };

        /* Render, download image. */
        let callback = (() => {
            this.channelsJson = channels;
            ChannelsDBPlugin.channelsList = channels;
            this.subtitle = this.createSubtitle(this.channelsJson);
            this.imgSrc = `https://webchem.ncbr.muni.cz/API/ChannelsDB/Download/${this.pdbId}?type=png`;
            super.connectedCallback();
            if (Object.keys(this.channelsJson).length != 0)
                this.addChannelsReview();
        });
        request.send(null);

    }

    public static get properties() {
        return {
            pdbId: {
                type: String,
                reflectToAttribute: true,
                notify: true,
            }
        }
    }

    /** Main template for polymer element. **/
    static get template() {
        // language=HTML
        return html`
            <style>
                @import url( style.css )
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

                    <ul class="channels-db-list">
                        
                    </ul>
                </div>

            </div>

            <div class="channels-db-footer">
                <span class="channels-db-powered">powered by <a target="_blank" href="http://mole.chemi.muni.cz">MOLE 2.5</a></span>
                <a target="_blank" href="http://mole.upol.cz/api/ebi/?action=newjob&pdbid=[[pdbId]]&ignorehet=0&start=auto">[+ Custom analysis]</a>
            </div>
        `
    }

    /**
     * Add channels review to template, using d3.
     */
    private addChannelsReview() {
        this.channelsJson.forEach((channel: any, index: number) => {
            let wrappedLayers = this.prepareLayers(channel);
            const mainLi = d3.select(document.querySelector('channelsdb-plugin').shadowRoot.querySelector('.channels-db-list'))
                .append('li');

            const mainDiv = mainLi.append('div');
            mainDiv.append('div').text(`#${index+1}`);

            const sumInfoDiv = mainDiv.append('div');

                sumInfoDiv.append('b').text(`Length: `)
                    .attr('class', 'hint--bottom')
                    .attr('data-hint', 'Length of the channel [\u212b].');

            sumInfoDiv.append('span')
                .text(` ${Number(channel.Length).toFixed(1) || 1}\u212b`);

            sumInfoDiv.append('span').classed('channels-db-delimiter', true).text(' | ');

            sumInfoDiv.append('b').text('HPthy: ').attr('class', 'hint--bottom hint--large')
                .attr('data-hint', 'Channel\'s hydropathy is an average hydropathy ' +
                    'index assigned to the lining residues according to the Kyte and Doolitle.');

            sumInfoDiv.append('span')
                .text(`${Number(channel.Properties.Hydropathy).toFixed(2) || 2}`);

            sumInfoDiv.append('span').classed('channels-db-delimiter', true).text(' | ');

            sumInfoDiv.append('b').text('Charge: ').classed('hint--bottom hint--large', true)
                .attr('data-hint', 'Charge is calculated as a sum of charged residues ' +
                    '(Arg, Lys = +1; Asp, Glu = -1)');
            sumInfoDiv.append('span')
                .text(`${Number(channel.Properties.Charge) > 0? '+' : ''}${channel.Properties.Charge}`);

            sumInfoDiv.append('span').text(`${channel.Name}`).attr('style',
                'float: right; font-weight: 200;');

            const bodyContent = mainLi.append('div').attr('class', 'channels-db-channel-body')
                .append('div').attr('class', 'channels-db-channel-body-content');

            const bottleneck = bodyContent.append('div').attr('style', 'position: relative');
            bottleneck.append('b').text('Bottleneck: ');
            bottleneck.append('span').attr('class', 'hint--bottom')
                .attr('data-hint', 'Channels\'s lowest profile: radius / length')
                .text(`${Number(channel.Bottleneck.MinRadius).toFixed(2) || 1} / 
                ${(Number(channel.Bottleneck.EndDistance) - Number(channel.Bottleneck.StartDistance))
                    .toFixed(2)}`);

            bottleneck.append('span').classed('channels-db-delimiter', true).text(' | ');

            bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Hydropathy of the bottleneck.')
                .text(`${Number(channel.Bottleneck.Properties.Hydropathy) || 2}`);

            bottleneck.append('span').attr('class', 'hint--bottom').attr('data-hint', 'Formal charge of the bottleneck.')
                .text(`${Number(channel.Properties.Charge) > 0? '+': ''}${channel.Bottleneck.Properties.Charge}`);

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

            wrappedLayers.forEach((layer: LayerWrapper) => {
                let singleLayer = layersDiv.append('div')
                    .attr('style', `width: ${layer.computedWidth}%; background-color: ${layer.color};
                     border-bottom: ${layer.layer.LocalMinima ? '3px' : '0'} solid 
                     ${layer.layer.Bottleneck ? 'black' : '	#666666; display:inline-block'}`);

                let layerInfoDiv = singleLayer.append('div').attr('class', 'channels-db-channel-layer-info');
                let infoUnit = layerInfoDiv.append('div').attr('class', 'channels-db-channel-layer-info-unit')
                    .attr('style', 'left: 0');

                let small = infoUnit.append('div').append('small');
                small.append('b').text('Radius: ');
                small.append(`text`).text(`${Number(layer.layer.MinRadius).toFixed(1) || 1}\u212b`);
                small = infoUnit.append('div').append('small');
                small.append('b').text('Length: ');
                small.append(`text`).text(`${Number(layer.layer.EndDistance - layer.layer.StartDistance)
                    .toFixed(1) || 1}\u212b`);

                infoUnit = layerInfoDiv.append('div').attr('style', 'left: 111px')
                    .attr('class', 'channels-db-channel-layer-info-unit');

                small = infoUnit.append('div').append('small');
                small.append('b').text('HPthy ');
                small.append(`text`).text(`${Number(layer.layer.Properties.Hydropathy).toFixed(2) || 2}`);
                small = infoUnit.append('div').append('small');
                small.append('b').text('Charge: ');
                small.append(`text`).text(`${layer.layer.Properties.Charge > 0? '+': ''}${Number(layer.layer.Properties.Charge).toFixed(1)}`);

                let infoResidue = layerInfoDiv.append('div')
                    .attr('class', 'channels-db-channel-layer-info-residues');
                layer.layer.Residues.forEach((residue: any, index: any) => {
                    if (residue.Backbone == true) {
                        infoResidue.append('small').append('b').append('span').attr('class', 'hint--top')
                            .attr('data-hint', 'Backbone').text(`${residue.Name} 
                            ${residue.SequenceNumber}${residue.Chain}${layer.layer.Residues.length-1 == index? '' : ' \u2013 '}`)
                    } else {
                        infoResidue.append('small').append('span').attr('class', 'hint--top')
                            .attr('data-hint', 'Backbone').text(`${residue.Name} 
                            ${residue.SequenceNumber}${residue.Chain}${layer.layer.Residues.length - 1 == index ? '' : ' \u2013 '}`)
                    }});
                layerInfoDiv.append('div').attr('style', `background: ${layer.color}`)
            })
        });
    }
}

/** Interface for RGB color scheme - used in layer bars **/
interface Color { r: number; g: number; b: number; }

/** Wrapper around the Layer object -- adds color and width for generating rectangles in the UI. */
export class LayerWrapper {
    constructor(public computedWidth: number, public color: string, public layer: any) {
    }
}

window.customElements.define('channelsdb-plugin', ChannelsDBPlugin);