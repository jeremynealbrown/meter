// vendor
import {BoxPanel} from 'phosphor/lib/ui/boxpanel'
import {DockPanel} from 'phosphor/lib/ui/dockpanel'
import {TabPanel, TabPlacement} from 'phosphor/lib/ui/tabpanel'
import {Widget, WidgetFlag} from 'phosphor/lib/ui/widget'

// applicaiton
import {create_main_menu} from './menu'
import {FileBrowser} from './file-browser'
import {Terminal} from './terminal'
import {ToolBrowser} from './tool-browser'

class View {
    constructor(store) {
        this.store = store;

        let main_panel = new BoxPanel({direction: 'left-to-right'});
        main_panel.id = 'main';

        // Left panel
        let source_box_panel = new BoxPanel({direction: 'top-to-bottom'});
        let source_panel = new TabPanel();
        let terminal = new Terminal(store);

        let session_widget = new Widget();
        session_widget.title.label = 'Project';
        session_widget.addClass('content');

        let file_widget = new FileBrowser(store);
        let tools_widget = new ToolBrowser(store);

        // Visualization & Tools area
        let tool_box_panel = new BoxPanel({direction: 'left-to-right'});
        let tool_panel = new DockPanel();
        tool_panel.addClass('content');

        // Add widgets
        source_box_panel.addWidget(source_panel);
        source_box_panel.addWidget(terminal);
        source_panel.addWidget(session_widget);
        source_panel.addWidget(file_widget);
        source_panel.addWidget(tools_widget);
        tool_box_panel.addWidget(tool_panel);
        main_panel.addWidget(source_box_panel);
        main_panel.addWidget(tool_box_panel);

        BoxPanel.setStretch(source_panel, 4);
        BoxPanel.setStretch(terminal, 1);
        BoxPanel.setStretch(source_box_panel, 3);
        BoxPanel.setStretch(tool_box_panel, 10);

        Widget.attach(create_main_menu(), document.body);
        Widget.attach(main_panel, document.body);

        window.onresize = () => 
            main_panel.update();
    }
}

export {View}
