export type Theme = {
    name: string
    description?: string
    colors: {
        "bg-dark": string
        "bg-light": string
        "bg-selected": string
        "selection": string
        "bg-match": string
        "on-bg-focused": string
        "on-bg": string
        "on-bg-secondary": string
        "line-number": string
        "string": string
        "word": string
        "keyword": string
        "cursor": string
        "def": string
        "comment": string
        "parenthesis": string
        "number": string
    }
}

export type State = {
    active: boolean;
    animations: boolean;
    themeId: number;
    themes: Theme[];
}