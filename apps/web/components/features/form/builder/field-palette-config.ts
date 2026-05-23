import {
  TextSquareIcon,
  NoteIcon,
  MailAtSign01Icon,
  SmartPhone01Icon,
  LinkSquare01Icon,
  TextNumberSignIcon,
  StarIcon,
  SlidersHorizontalIcon,
  Menu01Icon,
  TaskAdd01Icon,
  RecordIcon,
  CheckmarkSquare01Icon,
  ToggleOnIcon,
  Calendar01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";

export type IconSvgObject =
  | [string, { [key: string]: string | number }][]
  | readonly (readonly [string, { readonly [key: string]: string | number }])[];

export type FieldTypeConfig = {
  fieldType: string;
  label: string;
  icon: IconSvgObject;
  category: string;
};

export const FIELD_TYPE_CONFIG: FieldTypeConfig[] = [
  { fieldType: "short_text", label: "Short Text", icon: TextSquareIcon, category: "Text" },
  { fieldType: "long_text", label: "Long Text", icon: NoteIcon, category: "Text" },
  { fieldType: "email", label: "Email", icon: MailAtSign01Icon, category: "Text" },
  { fieldType: "phone", label: "Phone", icon: SmartPhone01Icon, category: "Text" },
  { fieldType: "url", label: "URL", icon: LinkSquare01Icon, category: "Text" },
  { fieldType: "number", label: "Number", icon: TextNumberSignIcon, category: "Number" },
  { fieldType: "rating", label: "Rating", icon: StarIcon, category: "Number" },
  { fieldType: "slider", label: "Slider", icon: SlidersHorizontalIcon, category: "Number" },
  { fieldType: "select", label: "Select", icon: Menu01Icon, category: "Choice" },
  { fieldType: "multi_select", label: "Multi Select", icon: TaskAdd01Icon, category: "Choice" },
  { fieldType: "radio", label: "Radio", icon: RecordIcon, category: "Choice" },
  { fieldType: "checkbox", label: "Checkbox", icon: CheckmarkSquare01Icon, category: "Choice" },
  { fieldType: "boolean", label: "Boolean", icon: ToggleOnIcon, category: "Choice" },
  { fieldType: "date", label: "Date", icon: Calendar01Icon, category: "Other" },
  { fieldType: "file", label: "File Upload", icon: File01Icon, category: "Other" },
];

export const FIELD_TYPE_MAP = Object.fromEntries(
  FIELD_TYPE_CONFIG.map((config) => [config.fieldType, config]),
);

export const FIELD_CATEGORIES = [...new Set(FIELD_TYPE_CONFIG.map((c) => c.category))];
