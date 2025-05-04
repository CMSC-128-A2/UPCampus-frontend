import { create } from 'zustand';

export type MapDrawerType = 'buildings' | 'activity' | 'security';

interface MapState {
    selectedMarkId: string | null;
    setSelectedMarkId: (id: string | null) => void;
    activeDrawer: MapDrawerType | null;
    setActiveDrawer: (drawer: MapDrawerType | null) => void;
    toggleDrawer: (drawer: MapDrawerType) => void;
}

export const useMapStore = create<MapState>((set) => ({
    selectedMarkId: null,
    setSelectedMarkId: (id) => set({ selectedMarkId: id }),
    activeDrawer: null,
    setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),
    toggleDrawer: (drawer) =>
        set((state) => ({
            activeDrawer: state.activeDrawer === drawer ? null : drawer,
        })),
}));
