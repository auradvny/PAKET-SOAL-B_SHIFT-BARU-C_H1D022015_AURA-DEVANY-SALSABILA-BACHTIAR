<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Refresher -->
      <ion-refresher
        slot="fixed"
        :pull-factor="0.5"
        :pull-min="100"
        :pull-max="200"
        @ionRefresh="handleRefresh($event)"
      >
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Active Todos -->
      <div class="scrollable-container">
        <ion-list>
          <ion-item-sliding
            v-for="todo in activeTodos"
            :key="todo.id"
            :ref="(el) => setItemRef(el, todo.id!)"
          >
            <ion-item-options side="start" @ionSwipe="handleDelete(todo)">
              <ion-item-option
                color="danger"
                expandable
                @click="handleDelete(todo)"
              >
                <ion-icon
                  slot="icon-only"
                  :icon="trash"
                  size="large"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item>
              <ion-card>
                <ion-card-header>
                  <ion-card-title class="ion-text-wrap limited-text">{{
                    todo.title
                  }}</ion-card-title>
                  <ion-card-subtitle class="limited-text">{{
                    todo.description
                  }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  <ion-badge>{{ getRelativeTime(todo.updatedAt) }}</ion-badge>
                </ion-card-content>
              </ion-card>
            </ion-item>

            <ion-item-options side="end" @ionSwipe="handleStatus(todo)">
              <ion-item-option @click="handleEdit(todo)">
                <ion-icon
                  slot="icon-only"
                  :icon="create"
                  size="large"
                ></ion-icon>
              </ion-item-option>
              <ion-item-option
                color="success"
                expandable
                @click="handleStatus(todo)"
              >
                <ion-icon
                  slot="icon-only"
                  :icon="checkmarkCircle"
                  color="light"
                  size="large"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item v-if="activeTodos.length === 0" class="ion-text-center">
            <ion-label>Tidak Ada Resep</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Completed Todos -->
      <ion-item class="accordion-container">
        <ion-accordion-group>
          <ion-accordion value="first">
            <ion-item slot="header" color="light">
              <ion-label class="ion-text-center">Resep Sudah Sesuai</ion-label>
            </ion-item>
            <div slot="content" class="scrollable-container">
              <ion-list>
                <ion-item-sliding
                  v-for="todo in completedTodos"
                  :key="todo.id"
                  :ref="(el) => setItemRef(el, todo.id!)"
                >
                  <ion-item-options side="start" @ionSwipe="handleDelete(todo)">
                    <ion-item-option
                      color="danger"
                      expandable
                      @click="handleDelete(todo)"
                    >
                      <ion-icon
                        slot="icon-only"
                        :icon="trash"
                        size="large"
                      ></ion-icon>
                    </ion-item-option>
                  </ion-item-options>

                  <ion-item>
                    <ion-card>
                      <ion-card-header>
                        <ion-card-title class="ion-text-wrap limited-text">{{
                          todo.title
                        }}</ion-card-title>
                        <ion-card-subtitle class="limited-text">{{
                          todo.description
                        }}</ion-card-subtitle>
                      </ion-card-header>
                      <ion-card-content>
                        <ion-badge>{{
                          getRelativeTime(todo.updatedAt)
                        }}</ion-badge>
                      </ion-card-content>
                    </ion-card>
                  </ion-item>

                  <ion-item-options side="end" @ionSwipe="handleStatus(todo)">
                    <ion-item-option @click="handleEdit(todo)">
                      <ion-icon
                        slot="icon-only"
                        :icon="create"
                        size="large"
                      ></ion-icon>
                    </ion-item-option>
                    <ion-item-option
                      color="warning"
                      expandable
                      @click="handleStatus(todo)"
                    >
                      <ion-icon
                        slot="icon-only"
                        :icon="close"
                        color="light"
                        size="large"
                      ></ion-icon>
                    </ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
                <ion-item
                  v-if="completedTodos.length === 0"
                  class="ion-text-center"
                >
                  <ion-label>No completed Resep</ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-item>

      <!-- Floating Action Button and Modal -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="isOpen = true">
          <ion-icon :icon="add" size="large"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <InputModalTodo
        v-model:isOpen="isOpen"
        v-model:editingId="editingId"
        :todo="todo"
        @submit="handleSubmit"
      />
    </ion-content>
  </ion-page>
</template>
<!-- modifikasi src/views/HomePage.vue tambahkan keseluruhan style -->
<style scoped>
ion-card,
ion-accordion-group {
  width: 100%;
}

ion-fab {
  margin: 25px;
}

.limited-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

ion-card-title.limited-text {
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

ion-card-subtitle.limited-text {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.scrollable-container {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.accordion-container {
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
<script setup lang="ts">
// Import necessary components and utilities
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonAccordion,
  IonAccordionGroup,
  IonLabel,
  IonList,
  loadingController,
  IonRefresher,
  IonRefresherContent,
  toastController,
} from "@ionic/vue";
import {
  add,
  checkmarkCircle,
  close,
  create,
  trash,
  closeCircle,
  warningOutline,
} from "ionicons/icons";
import InputModalTodo from "@/components/InputModalTodo.vue";
import { onMounted, ref, computed, onUnmounted } from "vue";
import { firestoreService, type Todo } from "@/utils/firestore";
import { formatDistanceToNow } from "date-fns";

// Define reactive variables
const isOpen = ref(false);
const editingId = ref<string | null>(null);
const todos = ref<Todo[]>([]);
const todo = ref<Omit<Todo, "id" | "createdAt" | "updatedAt" | "status">>({
  title: "",
  description: "",
});
const activeTodos = computed(() => todos.value.filter((todo) => !todo.status));
const completedTodos = computed(() =>
  todos.value.filter((todo) => todo.status)
);
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());
let intervalId: any;
const timeUpdateTrigger = ref(0);

// Helper functions
const setItemRef = (el: any, id: string) => {
  if (el) itemRefs.value.set(id, el.$el);
};

const showToast = async (
  message: string,
  color: string = "success",
  icon: string = checkmarkCircle
) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: "top",
    icon,
  });
  await toast.present();
};

const getRelativeTime = (date: any) => {
  timeUpdateTrigger.value;
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

// Data loading and lifecycle hooks
const loadTodos = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({ message: "Loading..." });
    await loading.present();
  }
  try {
    todos.value = await firestoreService.getTodos();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) await loading.dismiss();
  }
};

onMounted(() => {
  loadTodos();
  intervalId = setInterval(() => timeUpdateTrigger.value++, 60000);
});
onUnmounted(() => clearInterval(intervalId));

// Event handlers
const handleRefresh = async (event: any) => {
  try {
    await loadTodos(false);
  } catch (error) {
    console.error("Error refreshing:", error);
  } finally {
    event.target.complete();
  }
};

const handleSubmit = async (
  todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "status">
) => {
  if (!todo.title) {
    await showToast("Title is required", "warning", warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateTodo(editingId.value, todo as Todo);
      await showToast(
        "Recipe updated successfully",
        "success",
        checkmarkCircle
      );
    } else {
      await firestoreService.addTodo(todo as Todo);
      await showToast("Recipe added successfully", "success", checkmarkCircle);
    }
    loadTodos();
  } catch (error) {
    await showToast("An error occurred", "danger", closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

const handleEdit = async (editTodo: Todo) => {
  const slidingItem = itemRefs.value.get(editTodo.id!);
  await slidingItem?.close();
  editingId.value = editTodo.id!;
  todo.value = { title: editTodo.title, description: editTodo.description };
  isOpen.value = true;
};

const handleDelete = async (deleteTodo: Todo) => {
  try {
    await firestoreService.deleteTodo(deleteTodo.id!);
    await showToast("Recipe deleted successfully", "success", checkmarkCircle);
    loadTodos();
  } catch (error) {
    await showToast("Failed to delete recipe", "danger", closeCircle);
    console.error(error);
  }
};

const handleStatus = async (statusTodo: Todo) => {
  const slidingItem = itemRefs.value.get(statusTodo.id!);
  await slidingItem?.close();
  try {
    await firestoreService.updateTodoStatus(statusTodo.id!, !statusTodo.status);
    await showToast(
      `Recipe marked as ${!statusTodo.status ? "completed" : "active"}`,
      "success",
      checkmarkCircle
    );
    loadTodos();
  } catch (error) {
    await showToast("Failed to update status", "danger", closeCircle);
    console.error(error);
  }
};
</script>