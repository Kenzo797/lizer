<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <h2>{{ isEditing ? 'Editar Link' : 'Novo Link' }}</h2>
      
      <form @submit.prevent="save">
        
        <div class="form-group">
          <label>Título *</label>
          <input v-model="form.title" type="text" maxlength="50" placeholder="Documentação de..." required/>
        </div>

        <div class="form-group">
          <label>URL *</label>
          <input v-model="form.url" type="url" required />
        </div>

        <CategorySelector 
          v-model="form.categoryId"
          @category-created="handleCategoryCreated"
        />

        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="form.description" maxlength="60" rows="3" placeholder="max 60 caracteres"></textarea>
        </div>

        <div class="form-group">
          <label>Tags (separadas por vírgula)</label>
          <input v-model="tagsInput" @keydown="checkTagLength" @blur="addTag" placeholder="max 25 caracteres" @paste="handlePaste"/>

          <small v-if="tagError" class="error-message">{{ tagError }}</small>
        </div>

        <div class="form-actions">
          <button type="button" @click="close" class="btn btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn btn-save" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { linkService } from '../services/linkService';
import CategorySelector from './categorySelector.vue';  // ← Importa
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);

const tagError = ref('');

const props = defineProps({
  link: {
    type: Object,
    default: null
  },
  preSelectedCategoryId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);

const form = ref({
  title: '',
  url: '',
  description: '',
  tags: [],
  categoryId: null  // <- Adiciona este campo
});

if(!props.link)
{
  form.value.categoryId = props.preSelectedCategoryId;
}

const tagsInput = ref('');
const saving = ref(false);

const isEditing = computed(() => !!props.link);

watch(() => props.link, (newLink) => {
  if (newLink) {
    form.value = {
      title: newLink.title,
      url: newLink.url,
      description: newLink.description || '',
      tags: newLink.tags || [],
      categoryId: newLink.categoryId || null  // <- Carrega a categoria
    };
    tagsInput.value = (newLink.tags || []).join(', ');
  }
}, { immediate: true });

const handleCategoryCreated = (newCategory) => {
  console.log('Categoria criada:', newCategory);
};

const handlePaste = (event) => {

  setTimeout(() => {
    const pastedText = tagsInput.value;
    const tags = pastedText.split(',').map(t => t.trim()).filter(t => t);
    const invalidTags = tags.filter(tag => tag.length > maxTagLength);

    if (invalidTags.length > 0) 
    {
      tagError.value = `Tags muito longas(max ${maxTagLength} caracteres)`;
    }
    else
    {
      tagError.value = '';
    }

  }, 10);
};

const maxTagLength = 25;
const checkTagLength = (e) => {
  if (e.target.value.length >= maxTagLength && e.key !== 'Backspace' && e.key !== 'Delete') {
    e.preventDefault();
  }
};

const save = async () => {
  saving.value = true;
  
  const data = {
    ...form.value,
    tags: tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
  };

  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);

  // Validar tamanho de cada tag
  
  const invalidTags = tags.filter(tag => tag.length > maxTagLength);

  if (invalidTags.length > 0) {
    toast.error(`Tags muito longas (max ${maxTagLength})`, {
      position: "top-right",
      autoClose: 3500,
      theme: isDark.value ? 'dark' : 'light'
    });
    saving.value = false;
    return;
  }
  
  try {
    if (isEditing.value) {
      await linkService.update(props.link._id, data);
    } else {
      await linkService.create(data);
    }
    emit('saved');
    close();
  } catch (error) {
    console.error('Erro ao salvar link:', error);

    if (error.response?.data?.error?.includes('já existe')) 
    {
      toast.error(`Já existe uma categoria com esse nome`, {
      position: "top-right",
      autoClose: 3000,
      theme: isDark.value ? 'dark' : 'light'
      });
    } 
    else 
    {
      toast.error(`Erro ao criar categoria`, {
      position: "top-right",
      autoClose: 3000,
      theme: isDark.value ? 'dark' : 'light'
      });
    }

  } finally {
    saving.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
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
  backdrop-filter: blur(2px);
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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

.error-message {
  display: block;
  color: #dc3545;
  font-size: 11px;
  margin-top: 4px;
}

</style>