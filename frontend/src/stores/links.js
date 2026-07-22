import { defineStore } from "pinia";
import { linkService } from "@/services/linkService";

export const useLinksStore = defineStore('links', {
    state: () => ({
        links: [],
        loaded: false,
        loading: null
    }),

    actions: {
        async fetch(force = false) {
            if (this.loaded && !force) return this.links;
            if (this.loading) return this.loading;

            this.loading = (async () => {
                const response = await linkService.getAll();
                this.links = response.data.data || [];
                this.loaded = true;
                return this.links;
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
