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
          <p v-if="link.description" class="link-desc">
            {{ link.description }}
          </p>
          <div v-if="link.tags && link.tags.length" class="link-tags">
            <span v-for="tag in link.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
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
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  transition: transform 0.2s;
  /* align-self: start; */
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.link-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  color: #333;
  font-size: 16px;
  flex: 1;
}

.link-url {
  color: #42b883;
  text-decoration: none;
  font-size: 14px;
  word-break: break-all;
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-url:hover {
  text-decoration: underline;
}

.link-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666;
  font-size: 14px;
  margin: 8px 0;
}

.link-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.link-actions {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.btn-edit, .btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.btn-edit:hover {
  transform: scale(1.1);
}

.btn-delete:hover {
  transform: scale(1.1);
}
</style>