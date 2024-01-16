export interface Organigram {
    id: number;
    label: string;
    type: string;
    styleClass: string;
    expanded: boolean;
    data: DataPerson;
    children: Organigram[];
}

export interface DataPerson {
    name: string;
    avatar: string;
    cargo: string;
}