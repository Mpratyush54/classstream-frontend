import { ColumnType } from "./ColumnType";
import { TableButton } from "./TableButton";

export interface DisplayedColumns {
  key: string;          // property name in your row object (ignored when type = 'Buttons')
  displayName: string;  // header/caption to show
  type: ColumnType;
  sortable?: boolean;   // default: true for data columns; ignored for Buttons
  buttons?: TableButton[]; // only for type = 'Buttons'
}
