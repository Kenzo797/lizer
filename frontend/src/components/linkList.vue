<template>
  <div class="link-list">
    <div class="header">
      <h2>{{ title }}</h2>
      <button @click="showForm = true" class="btn-add">
        + Adicionar Link
      </button>
    </div>

    <div v-if="loading" class="loading">
      Carregando...
    </div>

    <div v-else-if="links.length === 0" class="empty">
      <p>Você ainda não tem nenhum link.</p>
      <p>Clique em "Adicionar Link" para começar!</p>
    </div>

    <div v-else class="links-grid">
      <div v-for="link in links" :key="link._id" class="link-card">
        <div class="link-content">
          <div class="link-header">
            <img 
              :src="getFaviconUrl(link.url)"
              class="favicon"
              alt="favicon"
              @error="handleImageError"
            />
            <h3>{{ link.title }}</h3>
          </div>
          
          <a :href="link.url" target="_blank" class="link-url">
            {{ link.url }}
          </a>
          
          <div class="link-footer">
            <div v-if="link.tags && link.tags.length" class="link-tags">
              <span v-for="tag in link.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
            
            <div v-if="link.description" class="link-desc-tooltip">
              <i class="pi pi-info-circle"></i>
              <span class="tooltip-text">{{ link.description }}</span>
            </div>
          </div>
        </div>
        <div class="link-actions">
          <button @click="editLink(link)" class="btn-edit">
            <i class="pi pi-pencil"></i>
          </button>
          <button @click="confirmDelete(link)" class="btn-delete">
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de formulário -->
    <LinkForm 
      v-if="showForm" 
      :link="editingLink"
      :pre-selected-category-id="preSelectedCategoryId"
      @close="closeForm"
      @saved="() => emit('refresh')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { linkService } from '../services/linkService';
import LinkForm from './linkForm.vue';

const props = defineProps({
  links: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  preSelectedCategoryId: {
    type: String,
    default: null
  },
  emptyMessage: {
    type: String,
    default: 'Clique em "Adicionar Link" para começar!'
  }
});

const emit = defineEmits(['refresh']);

const loading = ref(false);
const showForm = ref(false);
const editingLink = ref(null);

const getDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

const getFaviconUrl = (url) => {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
};

// Fallback caso o favicon não carregue
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/%3E%3C/svg%3E';
};

const editLink = (link) => {
  editingLink.value = link;
  showForm.value = true;
};

const confirmDelete = async (link) => {
  if (confirm(`Tem certeza que deseja excluir o link "${link.title}"?`)) {
    try {
      await linkService.delete(link._id);
      emit('refresh');
    } catch (error) {
      console.error('Erro ao excluir link:', error);
    }
  }
};

const closeForm = () => {
  showForm.value = false;
  editingLink.value = null;
};
</script>

<style scoped>
.link-list {
  max-width: 1200px;
  /* margin: 0 auto; */
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.btn-add {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.btn-add:hover {
  background-color: #33a06f;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  overflow-y: auto;
  padding-right: 8px;
  flex: 1;
  align-content: start;
}

.links-grid::-webkit-scrollbar {
  width: 8px;
}

.links-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.links-grid::-webkit-scrollbar-thumb {
  background: #42b883;
  border-radius: 4px;
}

.links-grid::-webkit-scrollbar-thumb:hover {
  background: #33a06f;
}

.link-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  transition: all 0.3s ease;
  border: 1px solid rgba(66, 184, 131, 0.1);
  /* align-self: start; */
}


.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(66,184,131,0.15);
  border-color: rgba(66, 184, 131, 0.3);
}


.link-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.favicon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  object-fit: contain;
}

.link-content h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  transition: color 0.2s;
}

.link-card:hover, .link-content h3 {
  color: #42b883;
}

.link-url {
  color: #6c757d;
  text-decoration: none;
  font-size: 15px;
  word-break: break-all;
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* background: rgba(66, 184, 131, 0.05); */
  padding: 2px 0;
  border-radius: 6px;
  transition: all 0.2s;
}

.link-url:hover {
  background: rgba(66, 184, 131, 0.1);
  color:#42b883;
  text-decoration: none;
}

.link-desc {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666;
  font-size: 14px;
  margin: 8px 0;
}

/* Container do tooltip */
.link-desc-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
  flex-shrink: 0;
}

.link-desc-tooltip i {
  color: #42b883;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.link-desc-tooltip:hover i {
  opacity: 1;
}

/* Texto do tooltip */
.link-desc-tooltip .tooltip-text {
  visibility: hidden;
  background-color: #2c3e50;
  color: #fff;
  text-align: left;
  border-radius: 8px;
  padding: 10px 14px;
  position: absolute;
  z-index: 1000;
  left: 30px;
  bottom: 0px;
  white-space: normal;
  max-width: 280px;
  min-width: 200px;
  font-size: 13px;
  line-height: 1.4;
  font-weight: normal;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

/* Seta do tooltip */
.link-desc-tooltip .tooltip-text::after {
  content: '';
  position: absolute;
  top: 60%;                    /* Centraliza verticalmente */
  right: 99%;                 /* Coloca à esquerda do tooltip */
  border-width: 6px;
  border-style: solid;
  border-color: transparent #2c3e50 transparent transparent;  /* Seta apontando para a direita */
}

.link-desc-tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.link-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
  flex-direction: row-reverse;
}

.link-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.tag {
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s;
}

.tag:hover {
  background-color: #42b883;
  color: white;
}
.link-actions {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.btn-edit, .btn-delete {
  background: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.btn-edit {
  color: #42b883;
}

.btn-edit:hover {
  background-color: #42b883;
  color: white;
  transform: scale(1.05);
}

.btn-delete {
  color: #dc3545;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
  transform: scale(1.05);
}
</style>