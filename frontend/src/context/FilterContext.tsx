import { createContext, useContext, useState, ReactNode } from "react";

type Filters = {
  q: string;
  categoria: string;
};

type FilterContextType = {
  filters: Filters;
  setQuery: (q: string) => void;
  setCategoria: (categoria: string) => void;
  clearFilters: () => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({ q: "", categoria: "todos" });

  const setQuery = (q: string) => setFilters((s) => ({ ...s, q }));
  const setCategoria = (categoria: string) => setFilters((s) => ({ ...s, categoria }));
  const clearFilters = () => setFilters({ q: "", categoria: "todos" });

  return (
    <FilterContext.Provider value={{ filters, setQuery, setCategoria, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
