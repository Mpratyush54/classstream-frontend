import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuItem } from '../models/MenuItem';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
   private router = inject(Router);
  showDesktopPanel = signal(false);

  activeItem = signal('Dashboard=');
  isMobile = signal(window.innerWidth < 768);
  showSearchOverlay = signal(false);
  showMobileMenu = signal(false);
  openSearch() {
    if (!this.showSearchOverlay()) {
        history.pushState({ searchOpen: true }, '');
        this.showSearchOverlay.set(true);
    }
  }
  
  private onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }
      toggleDesktopPanel() { this.showDesktopPanel.set(!this.showDesktopPanel()); }
    closeDesktopPanel() { this.showDesktopPanel.set(false); }
  closeSearch() {
    // If the history state was pushed by our search, go back to remove it
    if (history.state?.searchOpen) {
      history.back();
    } else {
      // Otherwise, just hide the overlay (e.g., closed via Esc)
      this.showSearchOverlay.set(false);
    }
  }  constructor() {
    // Listen to router events to automatically set the active item
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
   const allMenuItems = [...this.mainMenu, ...this.academicMenu];
        
        // Sort items by URL length descending to find the most specific match first
        const sortedItems = allMenuItems.sort((a, b) => b.url.length - a.url.length);
        
        const matchingItem = sortedItems.find(item => event.urlAfterRedirects.startsWith(item.url));
        
        this.activeItem.set(matchingItem?.name || 'Dashboard');
    });
    window.addEventListener('resize', this.onResize.bind(this));
    // Listen for browser back button action to close overlays
    window.addEventListener('popstate', () => {
        if (this.showSearchOverlay()) this.showSearchOverlay.set(false);
        if (this.showMobileMenu()) this.showMobileMenu.set(false);
    });
  }


    pillNavItems = computed(() => {
    return [
        this.mainMenu.find(i => i.name === 'Dashboard'),
        this.mainMenu.find(i => i.name === 'Videos'),
        this.mainMenu.find(i => i.name === 'Notes'),
        { name: 'More', icon: this.getIconSvg('more'), url: 'more' }
    ].filter(Boolean) as MenuItem[];
  });
  // Computed signal to derive the items for the mobile bottom nav
  mobileNavItems = computed(() => {
    const dashboardItem = this.mainMenu.find(item => item.name === 'Dashboard');
    const currentActiveItem = [...this.mainMenu, ...this.academicMenu].find(item => item.name === this.activeItem());
    const moreItem = { name: 'More', icon: this.getIconSvg('more'), url: 'more' };
    
    let middleItem = (currentActiveItem && currentActiveItem.name !== 'Dashboard') 
      ? currentActiveItem 
      : this.mainMenu.find(item => item.name === 'Videos');

    return [dashboardItem, middleItem, moreItem].filter(Boolean) as MenuItem[];
  });
  openMobileMenu() {
    if (!this.showMobileMenu()) {
        history.pushState({ overlay: 'menu' }, '');
        this.showMobileMenu.set(true);
    }
    
  }
  closeMobileMenu() {
     if (history.state?.overlay === 'menu') history.back();
     else this.showMobileMenu.set(false);

  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
  getIconSvg(name: string): string {
    return {
      search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>`,
      dashboard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`,
      videos: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
</svg>`,
      notes: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>`,
      notification: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" /></svg>`,
      students: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598M12 14.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z" /></svg>`,
      more: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`,
      live: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0,0,256,256">
<g transform=""><g fill="none" fill-rule="nonzero" stroke="currentColor" stroke-width="1" stroke-linecap="butt" stroke-linejoin="none" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path transform="scale(5.12,5.12)" d="M8.75391,8.75391l2.12891,2.12891c0.383,0.384 0.38058,0.99253 0.01758,1.39453c-3.045,3.37 -4.90039,7.83366 -4.90039,12.72266c0,4.889 1.85539,9.35266 4.90039,12.72266c0.363,0.402 0.36542,1.01153 -0.01758,1.39453l-2.12891,2.12891c-0.397,0.397 -1.05359,0.39838 -1.43359,-0.01562c-3.925,-4.272 -6.32031,-9.97147 -6.32031,-16.23047c0,-6.259 2.39531,-11.95847 6.32031,-16.23047c0.19,-0.207 0.45006,-0.31062 0.71094,-0.3125c0.26088,-0.00188 0.52416,0.09838 0.72266,0.29688zM42.67969,8.76953c3.925,4.272 6.32031,9.97147 6.32031,16.23047c0,6.259 -2.39531,11.95847 -6.32031,16.23047c-0.38,0.413 -1.03659,0.41262 -1.43359,0.01563l-2.12891,-2.12891c-0.383,-0.384 -0.38058,-0.99253 -0.01758,-1.39453c3.045,-3.37 4.90039,-7.83366 4.90039,-12.72266c0,-4.889 -1.85634,-9.35366 -4.90234,-12.72266c-0.363,-0.402 -0.36542,-1.00958 0.01758,-1.39258l2.13086,-2.13086c0.1985,-0.1985 0.46153,-0.2985 0.72266,-0.29687c0.26112,0.00163 0.52094,0.1055 0.71094,0.3125zM36.35352,15.19531c2.272,2.629 3.64648,6.05669 3.64648,9.80469c0,3.748 -1.37448,7.17569 -3.64648,9.80469c-0.386,0.446 -1.06542,0.48341 -1.48242,0.06641l-2.13086,-2.13281c-0.359,-0.359 -0.39827,-0.93717 -0.07227,-1.32617c1.456,-1.737 2.33203,-3.97311 2.33203,-6.41211c0,-2.439 -0.87603,-4.67606 -2.33203,-6.41406c-0.326,-0.389 -0.28674,-0.96717 0.07227,-1.32617l2.13086,-2.13086c0.2085,-0.2085 0.48403,-0.30439 0.75391,-0.29101c0.26987,0.01337 0.53552,0.13442 0.72852,0.35742zM15.12891,15.12891l2.13086,2.13281c0.359,0.359 0.39827,0.93717 0.07227,1.32617c-1.456,1.737 -2.33203,3.97311 -2.33203,6.41211c0,2.439 0.87603,4.67606 2.33203,6.41406c0.326,0.389 0.28674,0.96717 -0.07227,1.32617l-2.13086,2.13086c-0.417,0.417 -1.09642,0.37959 -1.48242,-0.06641c-2.272,-2.629 -3.64648,-6.05669 -3.64648,-9.80469c0,-3.748 1.37448,-7.17473 3.64648,-9.80273c0.193,-0.223 0.45864,-0.34405 0.72852,-0.35742c0.26988,-0.01337 0.54541,0.08056 0.75391,0.28906zM31,25c0,3.314 -2.686,6 -6,6c-3.314,0 -6,-2.686 -6,-6c0,-3.314 2.686,-6 6,-6c3.314,0 6,2.686 6,6z" id="strokeMainSVG" fill="none" stroke="currentColor" stroke-linejoin="round"></path><g transform="scale(5.12,5.12)" fill="none" stroke="currentColor" stroke-linejoin="miter"><path d="M8.03125,8.45703c-0.26088,0.00188 -0.52094,0.1055 -0.71094,0.3125c-3.925,4.272 -6.32031,9.97147 -6.32031,16.23047c0,6.259 2.39531,11.95847 6.32031,16.23047c0.38,0.414 1.03659,0.41262 1.43359,0.01563l2.12891,-2.12891c0.383,-0.383 0.38058,-0.99253 0.01758,-1.39453c-3.045,-3.37 -4.90039,-7.83366 -4.90039,-12.72266c0,-4.889 1.85539,-9.35266 4.90039,-12.72266c0.363,-0.402 0.36542,-1.01053 -0.01758,-1.39453l-2.12891,-2.12891c-0.1985,-0.1985 -0.46178,-0.29875 -0.72266,-0.29687zM41.96875,8.45703c-0.26112,-0.00162 -0.52416,0.09838 -0.72266,0.29688l-2.13086,2.13086c-0.383,0.383 -0.38058,0.99058 -0.01758,1.39258c3.046,3.369 4.90234,7.83366 4.90234,12.72266c0,4.889 -1.85539,9.35266 -4.90039,12.72266c-0.363,0.402 -0.36542,1.01053 0.01758,1.39453l2.12891,2.12891c0.397,0.397 1.05359,0.39738 1.43359,-0.01562c3.925,-4.272 6.32031,-9.97147 6.32031,-16.23047c0,-6.259 -2.39531,-11.95847 -6.32031,-16.23047c-0.19,-0.207 -0.44981,-0.31087 -0.71094,-0.3125zM35.625,14.83789c-0.26987,-0.01338 -0.54541,0.08251 -0.75391,0.29101l-2.13086,2.13086c-0.359,0.359 -0.39827,0.93717 -0.07227,1.32617c1.456,1.738 2.33203,3.97506 2.33203,6.41406c0,2.439 -0.87603,4.67511 -2.33203,6.41211c-0.326,0.389 -0.28674,0.96717 0.07227,1.32617l2.13086,2.13281c0.417,0.417 1.09642,0.37959 1.48242,-0.06641c2.272,-2.629 3.64648,-6.05669 3.64648,-9.80469c0,-3.748 -1.37448,-7.17569 -3.64648,-9.80469c-0.193,-0.223 -0.45864,-0.34405 -0.72852,-0.35742zM14.375,14.83984c-0.26988,0.01337 -0.53552,0.13442 -0.72852,0.35742c-2.272,2.628 -3.64648,6.05473 -3.64648,9.80273c0,3.748 1.37448,7.17569 3.64648,9.80469c0.386,0.446 1.06542,0.48341 1.48242,0.06641l2.13086,-2.13086c0.359,-0.359 0.39827,-0.93717 0.07227,-1.32617c-1.456,-1.738 -2.33203,-3.97506 -2.33203,-6.41406c0,-2.439 0.87603,-4.67511 2.33203,-6.41211c0.326,-0.389 0.28674,-0.96717 -0.07227,-1.32617l-2.13086,-2.13281c-0.2085,-0.2085 -0.48403,-0.30244 -0.75391,-0.28906zM25,19c-3.314,0 -6,2.686 -6,6c0,3.314 2.686,6 6,6c3.314,0 6,-2.686 6,-6c0,-3.314 -2.686,-6 -6,-6z"></path></g></g></g>
</svg>`,
    }[name] || '';
  }

  readonly mainMenu: MenuItem[] = [
    { name: 'Dashboard', icon: this.getIconSvg('dashboard'), url:'/teacher' },
    { name: 'Videos', icon: this.getIconSvg('videos'), url:'/teacher/videos' },
    { name: 'Notes', icon: this.getIconSvg('notes'), url:'/teacher/notes' },
    { name: 'Send Notification', icon: this.getIconSvg('notification'),url:'/teacher/notification' },
    { name: 'Live', icon: this.getIconSvg('live'),url:'/teacher/live' },
  ];

  readonly academicMenu: MenuItem[] = [
    { name: 'Students', icon: this.getIconSvg('students'), url: '/teacher/students' }
  ];
}
