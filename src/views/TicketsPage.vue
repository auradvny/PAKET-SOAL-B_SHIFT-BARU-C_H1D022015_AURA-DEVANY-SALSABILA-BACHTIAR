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

      <!-- Active Tickets -->
      <div class="scrollable-container">
        <ion-list>
          <ion-item-sliding
            v-for="ticket in activeTickets"
            :key="ticket.id"
            :ref="(el) => setItemRef(el, ticket.id!)"
          >
            <ion-item-options side="start" @ionSwipe="handleDelete(ticket)">
              <ion-item-option
                color="danger"
                expandable
                @click="handleDelete(ticket)"
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
                    ticket.event
                  }}</ion-card-title>
                  <ion-card-subtitle class="limited-text">{{
                    ticket.seat
                  }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  <ion-badge>{{ getRelativeTime(ticket.updatedAt) }}</ion-badge>
                </ion-card-content>
              </ion-card>
            </ion-item>

            <ion-item-options side="end" @ionSwipe="handleStatus(ticket)">
              <ion-item-option @click="handleEdit(ticket)">
                <ion-icon
                  slot="icon-only"
                  :icon="create"
                  size="large"
                ></ion-icon>
              </ion-item-option>
              <ion-item-option
                color="success"
                expandable
                @click="handleStatus(ticket)"
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
          <ion-item v-if="activeTickets.length === 0" class="ion-text-center">
            <ion-label>No active tickets</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Completed Tickets -->
      <ion-item class="accordion-container">
        <ion-accordion-group>
          <ion-accordion value="first">
            <ion-item slot="header" color="light">
              <ion-label class="ion-text-center">Completed</ion-label>
            </ion-item>
            <div slot="content" class="scrollable-container">
              <ion-list>
                <ion-item-sliding
                  v-for="ticket in completedTickets"
                  :key="ticket.id"
                  :ref="(el) => setItemRef(el, ticket.id!)"
                >
                  <ion-item-options
                    side="start"
                    @ionSwipe="handleDelete(ticket)"
                  >
                    <ion-item-option
                      color="danger"
                      expandable
                      @click="handleDelete(ticket)"
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
                          ticket.event
                        }}</ion-card-title>
                        <ion-card-subtitle class="limited-text">{{
                          ticket.seat
                        }}</ion-card-subtitle>
                      </ion-card-header>
                      <ion-card-content>
                        <ion-badge>{{
                          getRelativeTime(ticket.updatedAt)
                        }}</ion-badge>
                      </ion-card-content>
                    </ion-card>
                  </ion-item>

                  <ion-item-options side="end" @ionSwipe="handleStatus(ticket)">
                    <ion-item-option @click="handleEdit(ticket)">
                      <ion-icon
                        slot="icon-only"
                        :icon="create"
                        size="large"
                      ></ion-icon>
                    </ion-item-option>
                    <ion-item-option
                      color="warning"
                      expandable
                      @click="handleStatus(ticket)"
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
                  v-if="completedTickets.length === 0"
                  class="ion-text-center"
                >
                  <ion-label>No completed tickets</ion-label>
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
      <InputModal
        v-model:isOpen="isOpen"
        v-model:editingId="editingId"
        :ticket="ticket"
        @submit="handleSubmit"
      />
    </ion-content>
  </ion-page>
</template>
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
import InputModal from "@/components/InputModal.vue";
import { onMounted, ref, computed, onUnmounted } from "vue";
import { firestoreService, type Ticket } from "@/utils/firestore";
import { formatDistanceToNow } from "date-fns";

// Define reactive variables
const isOpen = ref(false);
const editingId = ref<string | null>(null);
const tickets = ref<Ticket[]>([]);
const ticket = ref<Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">>({
  event: "",
  harga: 0,
  seat: "",
});
const activeTickets = computed(() =>
  tickets.value.filter((ticket) => !ticket.status)
);
const completedTickets = computed(() =>
  tickets.value.filter((ticket) => ticket.status)
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
const loadTickets = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({ message: "Loading..." });
    await loading.present();
  }
  try {
    tickets.value = await firestoreService.getTickets();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) await loading.dismiss();
  }
};

onMounted(() => {
  loadTickets();
  intervalId = setInterval(() => timeUpdateTrigger.value++, 60000);
});
onUnmounted(() => clearInterval(intervalId));

// Event handlers
const handleRefresh = async (event: any) => {
  try {
    await loadTickets(false);
  } catch (error) {
    console.error("Error refreshing:", error);
  } finally {
    event.target.complete();
  }
};

const handleSubmit = async (
  ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">
) => {
  if (!ticket.event) {
    await showToast("Event is required", "warning", warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateTicket(editingId.value, ticket as Ticket);
      await showToast(
        "Ticket updated successfully",
        "success",
        checkmarkCircle
      );
    } else {
      await firestoreService.addTicket(ticket as Ticket);
      await showToast("Ticket added successfully", "success", checkmarkCircle);
    }
    loadTickets();
  } catch (error) {
    await showToast("An error occurred", "danger", closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

const handleEdit = async (editTicket: Ticket) => {
  const slidingItem = itemRefs.value.get(editTicket.id!);
  await slidingItem?.close();
  editingId.value = editTicket.id!;
  ticket.value = {
    event: editTicket.event,
    harga: editTicket.harga,
    seat: editTicket.seat,
  };
  isOpen.value = true;
};

const handleDelete = async (deleteTicket: Ticket) => {
  try {
    await firestoreService.deleteTicket(deleteTicket.id!);
    await showToast("Ticket deleted successfully", "success", checkmarkCircle);
    loadTickets();
  } catch (error) {
    await showToast("Failed to delete ticket", "danger", closeCircle);
    console.error(error);
  }
};

const handleStatus = async (statusTicket: Ticket) => {
  const slidingItem = itemRefs.value.get(statusTicket.id!);
  await slidingItem?.close();
  try {
    await firestoreService.updateStatus(statusTicket.id!, !statusTicket.status);
    await showToast(
      `Ticket marked as ${!statusTicket.status ? "completed" : "active"}`,
      "success",
      checkmarkCircle
    );
    loadTickets();
  } catch (error) {
    await showToast("Failed to update status", "danger", closeCircle);
    console.error(error);
  }
};
</script>