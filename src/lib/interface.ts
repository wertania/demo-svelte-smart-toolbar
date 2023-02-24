export interface MenuItem {
    // meta
    name: string; // unique name
    label?: string;
    // style
    icon?: string;
    // type
    input?: {
        type: 'date' | 'datetime-local' | 'text' | 'select' | 'checkbox' | 'radio';        
        options?: { label: string, value: any }[];
        placeholder?: string;
        update: (data: any) => void;
        bindValueKey?: string;
    } // if set, type will be an input. if not set, type will be a button      
    items?: MenuItem[]; // if set, type will be a button and click will open its items as new main items
    subMenuItems?: MenuItem[]; // is set, type will be a button and click will open a sub menu
    // action
    action?: (name: string) => void; // if set, type will be a button and click will call this action
}