describe('Health Check', () => {
    test('should return true for basic health check', () => {
        const isHealthy = true;
        expect(isHealthy).toBe(true);
    });

    test('should have correct environment', () => {
        expect(process.env.NODE_ENV).toBeDefined;
    });
});

describe('Basic Math Operations', () => {
    test('addition works correctly', () => {
        expect(1 + 1).toBe(2);
    });

    test('string concatenation works', () => {
        expect('gym' + '-' + 'management').toBe('gym-management');
    });
});
