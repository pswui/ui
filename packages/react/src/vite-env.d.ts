/// <reference types="vite/client" />
import { ImportGlobFunction } from "vite/types/importGlob";

interface ImportMeta {
  glob: ImportGlobFunction;
}