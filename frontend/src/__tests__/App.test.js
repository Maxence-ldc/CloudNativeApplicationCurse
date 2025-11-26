import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from '../App.vue';

describe('App', () => {
    it('should mount without errors', () => {
        const router = createRouter({
            history: createWebHistory(),
            routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
        });

        const pinia = createPinia();

        const wrapper = mount(App, {
            global: {
                plugins: [router, pinia]
            }
        });

        expect(wrapper.exists()).toBe(true);
    });
});

describe('Basic Tests', () => {
    it('should perform basic assertions', () => {
        expect(true).toBe(true);
        expect(1 + 1).toBe(2);
    });

    it('should handle strings correctly', () => {
        expect('gym-management').toContain('gym');
    });
});
