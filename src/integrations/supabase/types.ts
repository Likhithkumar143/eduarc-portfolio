export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      analytics_events: {
        Row: {
          browser: string | null;
          country: string | null;
          created_at: string;
          device_type: string | null;
          duration_seconds: number | null;
          event_label: string | null;
          event_type: string;
          id: string;
          is_new_visitor: boolean | null;
          os: string | null;
          path: string;
          referrer: string | null;
          session_id: string;
          source: string | null;
          visitor_id: string;
        };
        Insert: {
          browser?: string | null;
          country?: string | null;
          created_at?: string;
          device_type?: string | null;
          duration_seconds?: number | null;
          event_label?: string | null;
          event_type: string;
          id?: string;
          is_new_visitor?: boolean | null;
          os?: string | null;
          path: string;
          referrer?: string | null;
          session_id: string;
          source?: string | null;
          visitor_id: string;
        };
        Update: {
          browser?: string | null;
          country?: string | null;
          created_at?: string;
          device_type?: string | null;
          duration_seconds?: number | null;
          event_label?: string | null;
          event_type?: string;
          id?: string;
          is_new_visitor?: boolean | null;
          os?: string | null;
          path?: string;
          referrer?: string | null;
          session_id?: string;
          source?: string | null;
          visitor_id?: string;
        };
        Relationships: [];
      };
      admin_credentials: {
        Row: {
          failed_attempts: number;
          id: number;
          iterations: number;
          locked_until: string | null;
          password_hash: string;
          salt: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          failed_attempts?: number;
          id?: number;
          iterations: number;
          locked_until?: string | null;
          password_hash: string;
          salt: string;
          updated_at?: string;
          username?: string;
        };
        Update: {
          failed_attempts?: number;
          id?: number;
          iterations?: number;
          locked_until?: string | null;
          password_hash?: string;
          salt?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      partner_enquiries: {
        Row: {
          child_name: string | null;
          college: string | null;
          consent_given: boolean | null;
          consent_timestamp: string | null;
          consent_version: string | null;
          created_at: string;
          designation: string | null;
          education: string | null;
          email: string;
          full_name: string;
          id: string;
          marketing_consent: boolean | null;
          marketing_consent_timestamp: string | null;
          mentor_expertise: string | null;
          phone: string;
          remarks: string | null;
          role: string | null;
          status: string | null;
          status_updated_at: string | null;
          whatsapp: string;
        };
        Insert: {
          child_name?: string | null;
          college?: string | null;
          consent_given?: boolean | null;
          consent_timestamp?: string | null;
          consent_version?: string | null;
          created_at?: string;
          designation?: string | null;
          education?: string | null;
          email: string;
          full_name: string;
          id?: string;
          marketing_consent?: boolean | null;
          marketing_consent_timestamp?: string | null;
          mentor_expertise?: string | null;
          phone: string;
          remarks?: string | null;
          role?: string | null;
          status?: string | null;
          status_updated_at?: string | null;
          whatsapp: string;
        };
        Update: {
          child_name?: string | null;
          college?: string | null;
          consent_given?: boolean | null;
          consent_timestamp?: string | null;
          consent_version?: string | null;
          created_at?: string;
          designation?: string | null;
          education?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          marketing_consent?: boolean | null;
          marketing_consent_timestamp?: string | null;
          mentor_expertise?: string | null;
          phone?: string;
          remarks?: string | null;
          role?: string | null;
          status?: string | null;
          status_updated_at?: string | null;
          whatsapp?: string;
        };
        Relationships: [];
      };
      reception_credentials: {
        Row: {
          failed_attempts: number;
          id: number;
          iterations: number;
          locked_until: string | null;
          password_hash: string;
          salt: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          failed_attempts?: number;
          id?: number;
          iterations: number;
          locked_until?: string | null;
          password_hash: string;
          salt: string;
          updated_at?: string;
          username?: string;
        };
        Update: {
          failed_attempts?: number;
          id?: number;
          iterations?: number;
          locked_until?: string | null;
          password_hash?: string;
          salt?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          data: Json;
          id: string;
          updated_at: string;
        };
        Insert: {
          data?: Json;
          id?: string;
          updated_at?: string;
        };
        Update: {
          data?: Json;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
