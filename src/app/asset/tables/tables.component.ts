import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { DisplayedColumns } from 'src/app/models/table.module/DisplayedColumns';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements AfterViewInit {
  /** Inputs */
  @Input() data: any[] = [];
  @Input() columns: DisplayedColumns[] = [];
  @Input() externalSearchTerm = '';

  /** Outputs */
  @Output() buttonClick = new EventEmitter<{ action: string; row: any }>();

  /** Services */
  navigationService = inject(NavigationService);

  /** Material table */
  dataSource = new MatTableDataSource<any>([]);
  displayedColumnsKeys: string[] = [];        // keys used by the table
  hasActions = false;                          // whether we have a Buttons column
  actionButtons = [];                          // merged buttons from all Buttons columns

  /** Search */
  searchTerm = '';

  /** Sorting & Pagination (desktop) */
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('desktopPaginator') desktopPaginator!: MatPaginator;

  /** Mobile pagination (manual) */
  mobilePageIndex = 0;
  mobilePageSize = 10;
  mobilePageSizeOptions = [5, 10, 25];

  /** Lifecycle */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns']) {
      this.setupColumnsAndData();
    }
    if (changes['externalSearchTerm']) {
      this.searchTerm = this.externalSearchTerm || '';
      this.applyFilter();
    }
  }

  ngAfterViewInit(): void {
    // Connect sort/paginator AFTER view init for desktop table
    if (this.sort) this.dataSource.sort = this.sort;
    if (this.desktopPaginator) this.dataSource.paginator = this.desktopPaginator;
      console.log('Mat table columns defined:', this.displayedColumnsKeys);
  console.log('Mat table containers in template:', document.querySelectorAll('[matcolumndef]').length);

  }

  /** Setup displayed columns, merge action buttons, and hydrate data source */
private setupColumnsAndData() {
  // normal data columns (exclude "Buttons")
  const dataCols = this.columns.filter(c => c.type !== 'Buttons');
  this.displayedColumnsKeys = dataCols.map(c => c.key);

  // ✅ Always add one actions column if any Buttons exist
  if (this.columns.some(c => c.type === 'Buttons') && !this.displayedColumnsKeys.includes('actions')) {
    this.displayedColumnsKeys.push('actions');
  }

  // ✅ Merge all buttons from all Buttons columns
  this.actionButtons = this.columns
    .filter(c => c.type === 'Buttons' && Array.isArray(c.buttons))
    .reduce((acc: any[], c) => acc.concat(c.buttons || []), []);
this.hasActions = this.columns.some(c => c.type === 'Buttons');

  // ✅ Initialize data
  this.dataSource = new MatTableDataSource(this.data || []);
  this.configureFilterPredicate();
  this.configureSortingAccessor();

  // ✅ Attach sort/paginator (desktop)
  if (this.sort) this.dataSource.sort = this.sort;
  if (this.desktopPaginator) this.dataSource.paginator = this.desktopPaginator;

  // ✅ Apply search
  this.applyFilter();

  // ✅ Reset mobile pagination
  this.mobilePageIndex = 0;
}

  /** Global search */
  applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.dataSource.filter = term;
  }

  /** Custom filter to include HTML text content as well */
  private configureFilterPredicate() {
    this.dataSource.filterPredicate = (row: any, filter: string) => {
      const values = this.columns
        .filter(c => c.type !== 'Buttons')
        .map(c => {
          const v = row[c.key];
          if (v == null) return '';
          if (c.type === 'HTML') {
            // strip tags
            return String(v).replace(/<[^>]*>/g, '').toLowerCase();
          }
          return String(v).toLowerCase();
        });
      return values.some(v => v.includes(filter));
    };
  }

  /** Sorting rules per column type */
  private configureSortingAccessor() {
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      // Do not sort actions
      if (property === 'actions') return '';

      const col = this.columns.find(c => c.key === property);
      if (!col) return item[property];

      const value = item[property];

      switch (col.type) {
        case 'Number':
          return Number(value);
        case 'Date':
        case 'DateTime':
          return value ? new Date(value).getTime() : 0;
        case 'HTML':
          return value ? String(value).replace(/<[^>]*>/g, '').toLowerCase() : '';
        case 'Image':
          return value ? String(value).toLowerCase() : '';
        default: // 'Text' or anything else
          return value ? String(value).toLowerCase() : '';
      }
    };
  }

  /** Emit action to parent */
  onButtonClick(action: string, row: any) {
    this.buttonClick.emit({ action, row });
  }

  /** Format date for display (not used for sorting) */
  formatDate(value: any): string {
    const d = new Date(value);
    return isNaN(d.getTime()) ? String(value ?? '') : d.toLocaleDateString();
  }

  /** Mobile page change */
  onMobilePage(event: PageEvent) {
    this.mobilePageIndex = event.pageIndex;
    this.mobilePageSize = event.pageSize;
  }

  /** Convenience getter for current mobile page slice */
  get mobilePageData() {
    const filtered = this.dataSource.filteredData ?? this.data;
    const start = this.mobilePageIndex * this.mobilePageSize;
    return filtered.slice(start, start + this.mobilePageSize);
  }
}
