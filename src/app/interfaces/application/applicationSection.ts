export interface ApplicationSection {
    Id?: number;
    Code: string;
    Section: string;
    ApplicationModuleId: number;
    NameModule: string;
    Sections?: string[];  // Nuevo campo para almacenar las secciones asociadas
}