import { TestBed } from '@angular/core/testing';

import { BasicAppService } from './basic-app.service';

describe('BasicAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicAppService = TestBed.get(BasicAppService);
    expect(service).toBeTruthy();
  });
});
