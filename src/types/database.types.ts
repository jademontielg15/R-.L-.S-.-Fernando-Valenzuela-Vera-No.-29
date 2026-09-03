export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          slug: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          slug?: string;
        };
      };
      documentos: {
        Row: {
          id: string;
          titulo: string;
          categoria_id: string | null;
          numero_edicion: number | null;
          fecha_publicacion: string;
          archivo_path: string;
          paginas: number | null;
          descripcion: string | null;
          visible: boolean;
          creado_por: string | null;
          creado_en: string;
          actualizado_en: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          categoria_id?: string | null;
          numero_edicion?: number | null;
          fecha_publicacion: string;
          archivo_path: string;
          paginas?: number | null;
          descripcion?: string | null;
          visible?: boolean;
          creado_por?: string | null;
          creado_en?: string;
          actualizado_en?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          categoria_id?: string | null;
          numero_edicion?: number | null;
          fecha_publicacion?: string;
          archivo_path?: string;
          paginas?: number | null;
          descripcion?: string | null;
          visible?: boolean;
          creado_por?: string | null;
          creado_en?: string;
          actualizado_en?: string;
        };
      };
      solicitudes_ingreso: {
        Row: {
          id: string;
          nombre_completo: string;
          fecha_nacimiento: string;
          profesion: string;
          estado_residencia: string;
          interes_ingreso: string;
          conocimiento_institucion: string;
          email: string;
          telefono: string;
          disponible_entre_semana: boolean;
          disponible_sabado: boolean;
          acepta_consentimiento_datos: boolean;
          declara_hombre_libre: boolean;
          creado_en: string;
          revisado: boolean;
        };
        Insert: {
          id?: string;
          nombre_completo: string;
          fecha_nacimiento: string;
          profesion: string;
          estado_residencia: string;
          interes_ingreso: string;
          conocimiento_institucion: string;
          email: string;
          telefono: string;
          disponible_entre_semana: boolean;
          disponible_sabado: boolean;
          acepta_consentimiento_datos: boolean;
          declara_hombre_libre: boolean;
          creado_en?: string;
          revisado?: boolean;
        };
        Update: {
          id?: string;
          nombre_completo?: string;
          fecha_nacimiento?: string;
          profesion?: string;
          estado_residencia?: string;
          interes_ingreso?: string;
          conocimiento_institucion?: string;
          email?: string;
          telefono?: string;
          disponible_entre_semana?: boolean;
          disponible_sabado?: boolean;
          acepta_consentimiento_datos?: boolean;
          declara_hombre_libre?: boolean;
          creado_en?: string;
          revisado?: boolean;
        };
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
};
