import { TestBed } from '@angular/core/testing';

import { ChatInitService } from './chat-init.service';

describe('ChatInitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatInitService = TestBed.get(ChatInitService);
    expect(service).toBeTruthy();
  });
});
