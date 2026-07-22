import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import { useLinksStore } from "@/stores/links";
import { useCategoriesStore } from "@/stores/categories";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        token: localStorage.getItem('token') || null
    }),

    actions: 
    {
        async login(credentials) 
        {
            try 
            {
                const response = await authService.login(credentials);
                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);
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


        logout()
        {
            this.user = null;
            this.token = null;
            authService.logout();
            useLinksStore().$reset();
            useCategoriesStore().$reset();
        }

    },

    getters: 
    {
        isAuthenticated: (state) => !!state.token
    }


});