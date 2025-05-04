import { create } from 'zustand';

interface MapState {
    selectedMarkId: string | null;
    setSelectedMarkId: (id: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
    selectedMarkId: null,
    setSelectedMarkId: (id) => set({ selectedMarkId: id }),
}));
