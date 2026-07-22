import { defineStore } from "pinia";
import { categoryService } from "@/services/categoryService";

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [],
        loaded: false,
        loading: null
    }),

    actions: {
        async fetch(force = false) {
            if (this.loaded && !force) return this.categories;
            if (this.loading) return this.loading;

            this.loading = (async () => {
                const response = await categoryService.getAll();
                this.categories = response.data.data || [];
                this.loaded = true;
                return this.categories;
            })();

            try {
                return await this.loading;
            } finally {
                this.loading = null;
            }
        },

        invalidate() {
            this.loaded = false;
        }
    }
});
