<template>
  <div class="link-list">
    <div class="header">
      <h2>Meus Links</h2>
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
          <h3>{{ link.title }}</h3>
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
          <button @click="editLink(link)" class="btn-edit">✏️</button>
          <button @click="confirmDelete(link)" class="btn-delete">🗑️</button>
        </div>
      </div>
    </div>

    <!-- Modal de formulário -->
    <LinkForm 
      v-if="showForm" 
      :link="editingLink"
      @close="closeForm"
      @saved="fetchLinks"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { linkService } from '../services/linkService';
import LinkForm from './LinkForm.vue';

const links = ref([]);
const loading = ref(false);
const showForm = ref(false);
const editingLink = ref(null);

const fetchLinks = async () => {
  loading.value = true;
  try {
    const response = await linkService.getAll();
    links.value = response.data.data;
  } catch (error) {
    console.error('Erro ao buscar links:', error);
  } finally {
    loading.value = false;
  }
};

const editLink = (link) => {
  editingLink.value = link;
  showForm.value = true;
};

const confirmDelete = async (link) => {
  if (confirm(`Tem certeza que deseja excluir o link "${link.title}"?`)) {
    try {
      await linkService.delete(link._id);
      await fetchLinks();
    } catch (error) {
      console.error('Erro ao excluir link:', error);
    }
  }
};

const closeForm = () => {
  showForm.value = false;
  editingLink.value = null;
};

onMounted(fetchLinks);
</script>

<style scoped>
.link-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
}

.link-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  transition: transform 0.2s;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.link-content {
  flex: 1;
}

.link-content h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.link-url {
  color: #42b883;
  text-decoration: none;
  font-size: 14px;
  word-break: break-all;
}

.link-url:hover {
  text-decoration: underline;
}

.link-desc {
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