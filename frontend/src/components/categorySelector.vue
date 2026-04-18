<template>
  <div class="category-selector">
    <label>Categoria</label>
    
    <div class="selector-container">
      <!-- Select para categorias existentes -->
      <select v-model="selectedCategoryId" @change="onCategoryChange">
        <option :value="null">-- Sem categoria --</option>
        <option 
          v-for="category in categories" 
          :key="category._id" 
          :value="category._id"
        >
          {{ category.name }}
        </option>
        <option value="__new__">+ Criar nova categoria</option>
      </select>

      <!-- Modal para criar nova categoria -->
      <div v-if="showNewCategoryModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>Criar Nova Categoria</h3>
          
          <div class="form-group">
            <label>Nome da categoria *</label>
            <input 
              v-model="newCategoryName" 
              type="text"
              placeholder="Ex: Estudos, Trabalho, Pessoal"
              @keyup.enter="createCategory"
            />
          </div>
          
          <div class="form-group">
            <label>Descrição (opcional)</label>
            <textarea 
              v-model="newCategoryDescription" 
              rows="2"
              placeholder="Descreva o propósito desta categoria..."
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">
              Cancelar
            </button>
            <button 
              type="button" 
              @click="createCategory" 
              class="btn-save"
              :disabled="!newCategoryName.trim() || saving"
            >
              {{ saving ? 'Criando...' : 'Criar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview da categoria selecionada -->
    <div v-if="selectedCategory" class="selected-category">
      <span class="category-badge">
        <i class="pi pi-folder">
          
        </i> {{ selectedCategory.name }}
      </span>
      <span v-if="selectedCategory.description" class="category-desc">
        {{ selectedCategory.description }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { categoryService } from '../services/categoryService';

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'category-created']);

const categories = ref([]);
const selectedCategoryId = ref(props.modelValue);
const showNewCategoryModal = ref(false);
const newCategoryName = ref('');
const newCategoryDescription = ref('');
const saving = ref(false);

const selectedCategory = computed(() => {
  if (!selectedCategoryId.value) return null;
  return categories.value.find(c => c._id === selectedCategoryId.value);
});

const loadCategories = async () => {
  try {
    const response = await categoryService.getAll();
    categories.value = response.data.data || [];
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
};

const onCategoryChange = () => {
  if (selectedCategoryId.value === '__new__') {
    showNewCategoryModal.value = true;
    selectedCategoryId.value = props.modelValue;
  } else {
    emit('update:modelValue', selectedCategoryId.value);
  }
};

const createCategory = async () => {
  const name = newCategoryName.value.trim();
  if (!name) return;
  
  saving.value = true;
  try {
    const response = await categoryService.create({
      name: name,
      description: newCategoryDescription.value.trim()
    });
    
    // Recarrega a lista de categorias
    await loadCategories();
    
    // Encontra a nova categoria criada
    const newCategory = categories.value.find(c => c._id === response.data.data.id);
    
    if (newCategory) {
      selectedCategoryId.value = newCategory._id;
      emit('update:modelValue', newCategory._id);
      emit('category-created', newCategory);
    }
    
    closeModal();
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    if (error.response?.data?.error?.includes('já existe')) {
      alert('Já existe uma categoria com este nome');
    } else {
      alert('Erro ao criar categoria. Tente novamente.');
    }
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  showNewCategoryModal.value = false;
  newCategoryName.value = '';
  newCategoryDescription.value = '';
};

// Observa mudanças externas no valor (ex: quando edita um link existente)
watch(() => props.modelValue, (newVal) => {
  selectedCategoryId.value = newVal;
});

// Carrega as categorias quando o componente é montado
onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.category-selector {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.selector-container {
  position: relative;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

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
  max-width: 400px;
}

.modal h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
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
  margin-top: 20px;
}

.btn-cancel {
  padding: 8px 16px;
  background-color: #e9ecef;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save {
  padding: 8px 16px;
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

.selected-category {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #e9ecef;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.category-desc {
  font-size: 12px;
  color: #666;
}
</style>