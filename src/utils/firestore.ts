// src/utils/firestore.ts
import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

// interface data
export interface Ticket {
    id?: string;
    event: string;
    harga: number;
    seat: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Todo {
    id?: string;
    title: string;
    description: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// operasi CRUD
export const firestoreService = {
    // get collection ref for tickets
    getTicketRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User  not authenticated');
        return collection(db, 'users', uid, 'tickets');
    },

    // get collection ref for todos
    getTodoRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'todos');
    },

    // CRUD operations for tickets
    async addTicket(ticket: Omit<Ticket, 'id'>) {
        try {
            const ticketRef = this.getTicketRef();
            const docRef = await addDoc(ticketRef, {
                ...ticket,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding ticket:', error);
            throw error;
        }
    },

    async getTickets(): Promise<Ticket[]> {
        try {
            const ticketRef = this.getTicketRef();
            const q = query(ticketRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Ticket));
        } catch (error) {
            console.error('Error getting tickets:', error);
            throw error;
        }
    },

    async updateTicket(id: string, ticket: Partial<Ticket>) {
        try {
            const ticketRef = this.getTicketRef();
            const docRef = doc(ticketRef, id);
            await updateDoc(docRef, {
                ...ticket,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    },

    async deleteTicket(id: string) {
        try {
            const ticketRef = this.getTicketRef();
            const docRef = doc(ticketRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    },

    async updateStatus(id: string, status: boolean) {
        try {
            const ticketRef = this.getTicketRef();
            const docRef = doc(ticketRef, id);
            await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
        } catch (error) {
            console.error('Error updating ticket status:', error);
            throw error;
        }
    },

    // CRUD operations for todos
    async addTodo(todo: Omit<Todo, 'id'>) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = await addDoc(todoRef, {
                ...todo,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Todo:', error);
            throw error;
        }
    },

    async getTodos(): Promise<Todo[]> {
        try {
            const todoRef = this.getTodoRef();
            const q = query(todoRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Todo));
        } catch (error) {
            console.error('Error Get Todos:', error);
            throw error;
        }
    },

    async updateTodo(id: string, todo: Partial<Todo>) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await updateDoc(docRef, {
                ...todo,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Todo:', error);
            throw error;
        }
    },

    // delete
    async deleteTodo(id: string) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Todo:', error);
            throw error;
        }
    },

    async updateTodoStatus(id: string, status: boolean) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
        } catch (error) {
            console.error('Error Update Status:', error);
            throw error;
        }
    }
}