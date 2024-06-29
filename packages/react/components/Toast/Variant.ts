import { type VariantProps, vcn } from "@pswui-lib";

const toastColors = {
  background: "bg-white dark:bg-black",
  borders: {
    default: "border-black/10 dark:border-white/20",
    error: "border-red-500/80",
    success: "border-green-500/80",
    warning: "border-yellow-500/80",
    loading: "border-black/50 dark:border-white/50 animate-pulse",
  },
};

export const [toastVariant, resolveToastVariantProps] = vcn({
  base: `flex flex-col gap-2 border p-4 rounded-lg pr-8 pointer-events-auto ${toastColors.background} relative transition-all duration-150`,
  variants: {
    status: {
      default: toastColors.borders.default,
      error: toastColors.borders.error,
      success: toastColors.borders.success,
      warning: toastColors.borders.warning,
      loading: toastColors.borders.loading,
    },
    life: {
      born: "-translate-y-full md:translate-y-full scale-90 ease-[cubic-bezier(0,.6,.7,1)]",
      normal: "translate-y-0 scale-100 ease-[cubic-bezier(0,.6,.7,1)]",
      dead: "-translate-y-full md:translate-y-full scale-90 ease-[cubic-bezier(.6,0,1,.7)]",
    },
  },
  defaults: {
    status: "default",
    life: "born",
  },
});

export interface ToastBody
  extends Omit<VariantProps<typeof toastVariant>, "preset"> {
  title: string;
  description: string;
}
