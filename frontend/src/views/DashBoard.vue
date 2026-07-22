<template>
  <div class="dashboard">
    <header class="content-header">
      <h1>Todos os Links</h1>
      
    </header>
    
    <LinkList 
      title="Meus Links"
      :links="links"
      @refresh="fetchLinks"
    />

    <LinkForm 
      v-if="showLinkForm" 
      @close="showLinkForm = false"
      @saved="handleLinkSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLinksStore } from '../stores/links';
import LinkList from '../components/linkList.vue';
import LinkForm from '../components/linkForm.vue';

const linksStore = useLinksStore();
const showLinkForm = ref(false);

const links = computed(() => {
  return [...linksStore.links].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const fetchLinks = async () => {
  try {
    await linksStore.fetch(true);
  } catch (error) {
    console.error('Erro ao buscar links:', error);
  }
};

const handleLinkSaved = () => {
  showLinkForm.value = false;
  fetchLinks();
};

onMounted(() => {
  linksStore.fetch().catch((error) => {
    console.error('Erro ao buscar links:', error);
  });
});
</script>

<style scoped>
.dashboard {
  padding: 24px 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
}

.content-header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
}

.btn-add-link {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-add-link:hover {
  background-color: #33a06f;
}
</style>