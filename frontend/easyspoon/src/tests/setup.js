import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    console.log("CLEANUP RUN")
    cleanup();
    console.log("RESTORING MOCKS")
    vi.restoreAllMocks()
});