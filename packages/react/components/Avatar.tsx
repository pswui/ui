import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [avatarVariants, resolveAvatarVariantProps] = vcn({
  base: "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden border border-neutral-200 bg-neutral-100 font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
  variants: {
    size: {
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-14 text-lg",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-lg",
    },
  },
  defaults: {
    size: "md",
    shape: "circle",
  },
});

type ImageStatus = "idle" | "loading" | "loaded" | "error";

type AvatarImageProps = Omit<
  React.ComponentPropsWithoutRef<"img">,
  "alt" | "children" | "src"
>;

export interface AvatarProps
  extends VariantProps<typeof avatarVariants>,
    Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: React.ReactNode;
  imageProps?: AvatarImageProps;
}

function getInitials(name?: string) {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (words.length === 0) {
    return null;
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function getFallbackLabel({
  alt,
  name,
  fallback,
}: Pick<AvatarProps, "alt" | "name" | "fallback">) {
  if (alt && alt.length > 0) {
    return alt;
  }

  if (name && name.length > 0) {
    return name;
  }

  if (typeof fallback === "string" && fallback.length > 0) {
    return fallback;
  }

  return "Avatar";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const [variantProps, otherPropsCompressed] = resolveAvatarVariantProps(props);
  const {
    src,
    alt,
    name,
    fallback,
    imageProps,
    role,
    "aria-hidden": ariaHidden,
    "aria-label": ariaLabel,
    ...otherPropsExtracted
  } = otherPropsCompressed;
  const isAriaHidden = ariaHidden === true || ariaHidden === "true";

  const [imageStatus, setImageStatus] = React.useState<ImageStatus>(
    src ? "loading" : "idle",
  );

  React.useEffect(() => {
    setImageStatus(src ? "loading" : "idle");
  }, [src]);

  const fallbackContent = fallback ?? getInitials(name) ?? "?";
  const fallbackLabel = ariaLabel ?? getFallbackLabel({ alt, name, fallback });
  const showFallback = !src || imageStatus !== "loaded";
  const showImage = Boolean(src) && imageStatus !== "error";

  return (
    <div
      ref={ref}
      className={avatarVariants(variantProps)}
      data-state={showFallback ? "fallback" : "loaded"}
      role={!isAriaHidden && showFallback ? role ?? "img" : role}
      aria-hidden={ariaHidden}
      aria-label={!isAriaHidden && showFallback ? fallbackLabel : ariaLabel}
      {...otherPropsExtracted}
    >
      {showImage ? (
        <img
          {...imageProps}
          src={src}
          alt={alt ?? name ?? ""}
          ref={(element) => {
            if (element?.complete) {
              setImageStatus(element.naturalWidth > 0 ? "loaded" : "error");
            }
          }}
          className={`absolute inset-0 size-full object-cover ${
            imageStatus === "loaded" ? "" : "hidden"
          } ${imageProps?.className ?? ""}`}
          onLoad={(event) => {
            setImageStatus("loaded");
            imageProps?.onLoad?.(event);
          }}
          onError={(event) => {
            setImageStatus("error");
            imageProps?.onError?.(event);
          }}
        />
      ) : null}
      {showFallback ? (
        <span
          aria-hidden="true"
          className="pointer-events-none leading-none uppercase"
        >
          {fallbackContent}
        </span>
      ) : null}
    </div>
  );
});
Avatar.displayName = "Avatar";

export { Avatar };
