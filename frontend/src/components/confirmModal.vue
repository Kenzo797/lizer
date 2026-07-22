<template>
  <div v-if="visible" class="modal-overlay" @click.self="cancel">
    <div class="modal" id="confirmModal">
      <div class="modal-header">
        <i class="pi pi-exclamation-circle"></i>
        <h3>{{ title }}</h3>
      </div>
      
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      
      <div class="modal-footer">
        <button @click="cancel" class="btn-cancel">
          <i class="pi pi-times"></i> {{ cancelText }}
        </button>
        <button @click="confirm" class="btn-confirm" >
          <i class="pi pi-trash"></i> {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const visible = ref(false);
let resolvePromise = null;
let rejectPromise = null;

const title = ref('Confirmar');
const message = ref('Tem certeza ');
const confirmText = ref('Confirmar');
const cancelText = ref('Cancelar');


const show = (options) => {
  title.value = options?.title || 'Confirmar';
  message.value = options?.message || 'Tem certeza?';
  confirmText.value = options?.confirmText || 'Confirmar';
  cancelText.value = options?.cancelText || 'Cancelar';
  visible.value = true;
  
  return new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
};

const confirm = () => {
  visible.value = false;
  if (resolvePromise) resolvePromise(true);
};

const cancel = () => {
  visible.value = false;
  if (rejectPromise) rejectPromise(false);
  if (resolvePromise) resolvePromise(false);
};

defineExpose({ show });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  animation: slideIn 0.3s ease;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal.danger .modal-header {
  background: linear-gradient(135deg, #fff5f5 0%, #fee 100%);
  border-bottom-color: #fecaca;
}

.modal.danger .modal-icon {
  color: #dc3545;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
}

.modal-icon {
  font-size: 24px;
  color: #f0ad4e;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.modal-body p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px 24px;
  background-color: #f8f9fa;
}

.btn-cancel, .btn-confirm {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #e9ecef;
  color: #495057;
}

.btn-cancel:hover {
  background-color: #dee2e6;
  transform: scale(1.05);
}

.btn-confirm {
  background-color: #c82333;
  color: white;
}

.btn-confirm:hover {
  /* background-color: #33a06f; */
  transform: scale(1.05);
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>