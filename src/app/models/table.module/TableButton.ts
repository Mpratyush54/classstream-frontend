export interface TableButton {
  label: string;
  action: string;       // emitted to parent
  color?: string;
  icon?: string;       
  textColor?:string // Material icon name
  key?:string // Material icon name
}
