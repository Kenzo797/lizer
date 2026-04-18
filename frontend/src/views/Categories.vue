<template>
  <div class="categories-page">
    <header class="page-header">
      <h1>Categorias</h1>
      <button @click="showForm = true" class="btn-add">
        + Nova Categoria
      </button>
    </header>

    <div v-if="loading" class="loading">
      Carregando...
    </div>

    <div v-else-if="categories.length === 0" class="empty">
      <p>Você ainda não tem nenhuma categoria.</p>
      <p>Clique em "Nova Categoria" para começar!</p>
    </div>

    <div v-else class="categories-list">
      <!-- ✅ ADICIONEI O @click no card -->
      <div 
        v-for="category in categories" 
        :key="category._id" 
        class="category-card"
        @click="goToCategoryLinks(category)"
      >
        <div class="category-info">
          <h3>{{ category.name }}</h3>
          <p v-if="category.description">{{ category.description }}</p>
          <small>{{ getLinkCount(category._id) }} links</small>
        </div>
        <!-- ✅ ADICIONEI @click.stop nos botões para não navegar -->
        <div class="category-actions" @click.stop>
          <button @click="editCategory(category)" class="btn-edit" title="Editar">
            <i class="pi pi-pencil"></i>
          </button>
          <button @click="confirmDelete(category)" class="btn-delete" title="Excluir">
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de formulário (criar/editar) -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal">
        <h2>{{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
        
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Nome *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              required
              placeholder="Ex: Estudos, Trabalho, Pessoal"
              autofocus
            />
          </div>

          <div class="form-group">
            <label>Descrição (opcional)</label>
            <textarea 
              v-model="formData.description" 
              maxlength="60"
              rows="3"
              placeholder="Descreva o propósito desta categoria..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeForm" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';  // ← ADICIONAR
import { categoryService } from '../services/categoryService';
import { linkService } from '../services/linkService';

const router = useRouter();  // ← ADICIONAR

const categories = ref([]);
const links = ref([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingCategory = ref(null);

const isEditing = computed(() => !!editingCategory.value);

const formData = ref({
  name: '',
  description: ''
});

// Contar links por categoria
const getLinkCount = (categoryId) => {
  return links.value.filter(link => link.categoryId === categoryId).length;
};

// ✅ FUNÇÃO PARA NAVEGAR
const goToCategoryLinks = (category) => {
  router.push(`/category/${category._id}`);
};

// Carregar dados
const loadCategories = async () => {
  loading.value = true;
  try {
    const response = await categoryService.getAll();
    categories.value = response.data.data || [];
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  } finally {
    loading.value = false;
  }
};

const loadLinks = async () => {
  try {
    const response = await linkService.getAll();
    links.value = response.data.data || [];
  } catch (error) {
    console.error('Erro ao carregar links:', error);
  }
};

// Salvar categoria (criar ou editar)
const saveCategory = async () => {
  const name = formData.value.name.trim();
  if (!name) {
    alert('O nome da categoria é obrigatório');
    return;
  }

  saving.value = true;
  try {
    if (isEditing.value) {
      await categoryService.update(editingCategory.value._id, {
        name,
        description: formData.value.description.trim()
      });
    } else {
      await categoryService.create({
        name,
        description: formData.value.description.trim()
      });
    }
    
    await loadCategories();
    closeForm();
  } catch (error) {
    console.error('Erro ao salvar categoria:', error);
    alert(error.response?.data?.error || 'Erro ao salvar categoria');
  } finally {
    saving.value = false;
  }
};

// Editar categoria
const editCategory = (category) => {
  editingCategory.value = category;
  formData.value = {
    name: category.name,
    description: category.description || ''
  };
  showForm.value = true;
};

// Excluir categoria
const confirmDelete = async (category) => {
  const linkCount = getLinkCount(category._id);
  const message = linkCount > 0
    ? `A categoria "${category.name}" tem ${linkCount} link(s). Excluir mesmo assim? Os links não serão apagados, mas ficarão sem categoria.`
    : `Tem certeza que deseja excluir a categoria "${category.name}"?`;
  
  if (confirm(message)) {
    try {
      await categoryService.delete(category._id);
      await loadCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria');
    }
  }
};

// Fechar modal
const closeForm = () => {
  showForm.value = false;
  editingCategory.value = null;
  formData.value = { name: '', description: '' };
};

onMounted(() => {
  loadCategories();
  loadLinks();
});
</script>

<style scoped>
.categories-page {
  padding: 24px 32px;
  height: 100%;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
}

.btn-add {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-add:hover {
  background-color: #33a06f;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.category-card {
  background: linear-gradient(135deg, #ffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(66, 184, 131, 0.1);
  position: relative;
  overflow: hidden;
}

.category-card::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #42b883;
  transition: width 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(66,184,131,0.15);
  border-color: rgba(66, 184, 131, 0.3);
}

.category-card:hover::before{
  width: 6px;
}

.category-info {
  flex: 1;
}

.category-info h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-info h3::before {
  content: '';
  font-size: 18px;
}

.category-info p {
  margin: 0 0 8px 0;
  color: #6c757d;
  font-size: 13px;
  line-height: 1.4;
}

.category-info small {
  color: #42b883;
  font-size: 12px;
  font-weight: 500;
  background-color: rgba(66, 184, 131, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-block;
}

.category-actions {
  display: flex;
  gap: 8px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.category-card:hover .category-actions {
  opacity: 1;
}

.btn-edit, .btn-delete {
  background: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
}

.modal h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 20px;
  background-color: #e9ecef;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save:hover {
  background-color: #33a06f;
}

.btn-save:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>