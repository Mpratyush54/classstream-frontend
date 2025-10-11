import { TestBed } from '@angular/core/testing';

import { NotificationMapService } from './notification-map.service';

describe('NotificationMapService', () => {
  let service: NotificationMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
