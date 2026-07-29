import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import { useLinksStore } from "@/stores/links";
import { useCategoriesStore } from "@/stores/categories";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null
    }),

    actions:
    {
        async login(credentials)
        {
            try
            {
                const response = await authService.login(credentials);
                this.user = response.data.user;
                this.token = 'authenticated';
                return {success: true};
            }
            catch (error)
            {
                return {
                    success: false,
                    message: error.response?.data?.message || 'Falha no login'
                };
            }
        },

        async register(userData)
        {
            try
            {
                const response = await authService.register(userData);
                this.user = response.data.user;
                this.token = 'authenticated';
                return { success: true, data: response.data };
            }
            catch (error)
            {
                return {
                    success: false,
                    message: error.response?.data?.message || 'Falha no registro'
                };
            }
        },

        // Restaura a sessão a partir do cookie httpOnly (chamado ao carregar a app,
        // já que o token não fica mais acessível/persistido no lado do cliente)
        async checkAuth()
        {
            try
            {
                const response = await authService.me();
                this.user = response.data.user;
                this.token = 'authenticated';
                return true;
            }
            catch (error)
            {
                this.user = null;
                this.token = null;
                return false;
            }
        },

        async logout()
        {
            try
            {
                await authService.logout();
            }
            finally
            {
                this.user = null;
                this.token = null;
                useLinksStore().$reset();
                useCategoriesStore().$reset();
            }
        }

    },

    getters: 
    {
        isAuthenticated: (state) => !!state.token
    }


});