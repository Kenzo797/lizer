<template>
  <div class="category-links-page">
    <div class="page-header">
      <button @click="goBack" class="btn-back">
        <i class="pi pi-arrow-left"></i> Voltar para Categorias
      </button>
    </div>

    <LinkList 
      :title="pageTitle"
      :links="filteredLinks"
      :empty-message="emptyMessage"
      :pre-selected-category-id="category?._id"
      @refresh="() => loadData(true)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { categoryService } from '../services/categoryService';
import { useLinksStore } from '../stores/links';
import LinkList from '../components/linkList.vue';

const route = useRoute();
const router = useRouter();
const linksStore = useLinksStore();
const category = ref(null);

const filteredLinks = computed(() => {
  if (!category.value) return [];
  return [...linksStore.links]
    .filter(link => link.categoryId === category.value._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const pageTitle = computed(() => {
  if (category.value) {
    return `Links da categoria: ${category.value.name}`;
  }
  return 'Carregando...';
});

const emptyMessage = computed(() => {
  if (category.value) {
    return `Nenhum link associado à categoria "${category.value.name}". Clique em "Adicionar Link" para começar!`;
  }
  return 'Carregando...';
});

const goBack = () => {
  router.push('/categories');
};

const loadData = async (forceLinks = false) => {
  const categoryId = route.params.id;

  try {
    const catResponse = await categoryService.getById(categoryId);
    category.value = catResponse.data.data;
  } catch (error) {
    console.error('Erro ao carregar categoria:', error);
  }

  try {
    await linksStore.fetch(forceLinks);
  } catch (error) {
    console.error('Erro ao carregar links:', error);
  }
};

watch(() => route.params.id, () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.category-links-page {
  padding: 24px 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  margin-bottom: 20px;
}

.btn-back {
  background: none;
  border: none;
  color: #42b883;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn-back:hover {
  background-color: rgba(66, 184, 131, 0.1);
}

.btn-back i {
  font-size: 14px;
}
</style>