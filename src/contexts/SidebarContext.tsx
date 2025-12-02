import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SidebarType = "tenant" | "platform";

type SidebarCollapsedState = Record<SidebarType, boolean>;

interface SidebarContextValue {
  activeSidebar: SidebarType | null;
  setActiveSidebar: (type: SidebarType | null) => void;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType | null>(null);
  const [collapsedState, setCollapsedState] = useState<SidebarCollapsedState>({
    tenant: false,
    platform: false,
  });

  const setIsCollapsed = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      if (!activeSidebar) {
        return;
      }

      setCollapsedState((previous) => {
        const currentValue = previous[activeSidebar];
        const nextValue =
          typeof value === "function" ? value(currentValue) : value;

        if (currentValue === nextValue) {
          return previous;
        }

        return { ...previous, [activeSidebar]: nextValue };
      });
    },
    [activeSidebar],
  );

  const toggleSidebar = useCallback(() => {
    if (!activeSidebar) {
      return;
    }

    setCollapsedState((previous) => ({
      ...previous,
      [activeSidebar]: !previous[activeSidebar],
    }));
  }, [activeSidebar]);

  const value = useMemo<SidebarContextValue>(() => {
    const isCollapsed =
      activeSidebar === null ? false : collapsedState[activeSidebar];

    return {
      activeSidebar,
      setActiveSidebar,
      isCollapsed,
      setIsCollapsed,
      toggleSidebar,
    };
  }, [activeSidebar, collapsedState, setIsCollapsed, toggleSidebar]);

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}


