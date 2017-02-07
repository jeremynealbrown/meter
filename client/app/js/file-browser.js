import {Observable} from 'rxjs'
import {Widget} from 'phosphor/lib/ui/widget'

class FileBrowser extends Widget {
    constructor(store) {
        super();
        this.store = store;   
        this.store.subscribe('file_system.midi_library', this.update_list.bind(this));

        this.addClass('content');
        this.title.label = 'Files';
        this.node.innerHTML = 
            `<div>
                <input id='search-input' type='text'></input>
                <div id='midi-library-list'/>
            </div>`
    }

    onAfterAttach(message) {
        var search_input = document.getElementById('search-input');
    }

    update_list(data) {
        var list = document.getElementById('midi-library-list');
        list.className = 'midi-library-list';

        for(var i = 0; i < data.file_system.midi_library.length; i++) {
            var item = document.createElement('div');
            item.className = 'midi-library-list-item';
            item.innerHTML = 
                `<span class='fa fa-file-sound-o'/> 
                    <div class='midi-library-list-item-label'>
                        ${data.file_system.midi_library[i].filename}
                    </div>`
            list.appendChild(item);
        }
    }
}

export {FileBrowser}
