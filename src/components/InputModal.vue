<!-- src/components/InputModal.vue -->
<template>
  <ion-modal :is-open="isOpen" @did-dismiss="cancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editingId ? "Edit" : "Add" }} Ticket</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input
          v-model="ticket.event"
          label="Event"
          label-placement="floating"
          placeholder="Enter Event"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          v-model="ticket.harga"
          label="Harga"
          label-placement="floating"
          placeholder="Enter Harga"
          type="number"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          v-model="ticket.seat"
          label="Seat"
          label-placement="floating"
          placeholder="Enter Seat"
        ></ion-input>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-button
            type="button"
            @click="input"
            shape="round"
            color="primary"
            expand="block"
          >
            {{ editingId ? "Edit" : "Add" }} Ticket
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>
<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonRow,
  IonCol,
  IonItem,
  IonContent,
} from "@ionic/vue";
import { close } from "ionicons/icons";
import { Ticket } from "@/utils/firestore";

const props = defineProps<{
  isOpen: boolean;
  editingId: string | null;
  ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">;
}>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  "update:editingId": [value: string | null];
  submit: [item: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">];
}>();

const cancel = () => {
  emit("update:isOpen", false);
  emit("update:editingId", null);
  props.ticket.event = "";
  props.ticket.harga = 0;
  props.ticket.seat = "";
};
const input = () => {
  emit("submit", props.ticket);
  cancel();
};
</script>