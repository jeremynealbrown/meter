import * as d3 from 'd3'
import * as Actions from './actions'
import deepEql from 'deep-eql'
import {Drag, IDragEvent} from 'phosphor/lib/dom/dragdrop'
import {MimeData} from 'phosphor/lib/core/mimedata'
import {Observable} from 'rxjs'
import {Widget} from 'phosphor/lib/ui/widget'
import UIBot from 'uibot'

class FileSearch extends Widget {
    constructor(store) {
        super();
        this.drag = null;
        this.store = store;   
        this.addClass('content');
        this.title.label = 'Search';
        this.filters_visible = false;
        this.filters_ui = UIBot();
        this.search = { keywords: ''};

        this.node.innerHTML = 
            `<div class='search-container'>
                <div class='search-input-container'>
                    <div>
                        <div class='search-component-label'>Search</div>
                        <i id='search-spinner' class="fa fa-spinner fa-pulse fa-fw"></i>
                        <input id='search-input' spellcheck='false' type='text' placeholder='keywords'></input>
                    </div>
                </div>
                <div id='search-results-container' class='search-results-container'>
                    <div id='search-results-list' class='search-results-list'/>
                    
                </div>
            </div>`;
        this.store.subscribe('search_results', this.on_search_results_update.bind(this));
    }

    onAfterAttach(message) {
        d3.select('#search-spinner')
            .style('opacity', 0.0);

        d3.select('#search-input')
            .on('keyup', event => {
                if(d3.event.keyCode == 13) {
                    this.search_by_keywords(d3.event.target.value);
                }
            });
    }

    on_search_results_update(data) {
        var files = data.search_results;
        d3.select('#search-spinner')
            .transition()
            .duration(500)
            .style('opacity', 0.0);
        
        if(!files) return;
        if(this.search['keywords'].length == 0) return;
        this.store.dispatch(
            Actions.log('Search returned ' + files.length + ' result(s)'));

        d3.selectAll('.search-result-list-item').remove(); 
        d3.select('#search-results-list').node().scrollTop = 0;
        d3.select('#search-results-list')
            .selectAll('div')
            .data(files)
            .enter()
            .append('div')
            .classed('search-result-list-item', true)
            .on('mousedown', ()=> {
                this.handleEvent(d3.event);
            })
            .each(function(d) {
                d3.select(this)
                    .attr('file-file-data', d.checksum)
                    .append('span')
                    .classed('fa fa-file-sound-o', true)
                    .each(function() {
                        d3.select(this)
                            .append('div')
                            .classed('search-item-label', true)
                            .text(d.filename)
                    })
                    
            });
    }

    search_by_keywords(keywords) {
        var keyword_list = keywords.length ? keywords.split(' ') : [];
        if(keywords.length) {
            this.search['keywords'] = keyword_list;
            d3.select('#search-spinner')
                .transition()
                .duration(250)
                .style('opacity', 1.0);
            this.store.dispatch(
                Actions.log(
                    'Starting search for: ' + keywords));
            this.store.dispatch(
                Actions.search_files(this.search));
        }            
    }

    handleEvent(event) {
        switch(event.type) {
            case 'mousedown':
                this.drag = new Drag({
                    mimeData: null,
                    dragImage: event.target.cloneNode(true),
                })

                let {clientX, clientY} = event;
                this.drag.start(clientX, clientY).then(() => {
                    this.drag = null;
                });
                break;
        }
    }
}

export {FileSearch}
