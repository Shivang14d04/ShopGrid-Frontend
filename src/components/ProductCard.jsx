import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import AppContext from "@/Context/Context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import unplugged from "@/assets/unplugged.png";

const fallbackImage = (imageData) => {
  if (!imageData) return unplugged;
  if (imageData.startsWith("data:") || imageData.startsWith("http")) return imageData;
  return `data:image/jpeg;base64,${imageData}`;
};

const ProductCard = ({ product, compact = false }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(AppContext);
  const discounted = product.originalPrice && product.originalPrice > product.price;
  const percent = product.discountPercentage || (discounted ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);
  const stock = product.stockQuantity ?? 0;
  const inStock = product.productAvailable && stock > 0;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border/50 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:bg-zinc-900/80">
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block">
          <div className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/50 dark:to-zinc-800/50", compact ? "h-48" : "h-64")}>
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-white/5" />
            <img
              src={fallbackImage(product.imageData)}
              alt={product.name}
              className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110 dark:mix-blend-normal"
              onError={(e) => {
                e.currentTarget.src = unplugged;
              }}
            />
          </div>
        </Link>

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {percent > 0 && (
            <Badge className="bg-rose-500/90 text-white backdrop-blur-md hover:bg-rose-600/90 shadow-sm border-none">
              -{percent}%
            </Badge>
          )}
          {stock <= 5 && stock > 0 && (
            <Badge className="bg-amber-500/90 text-white backdrop-blur-md hover:bg-amber-600/90 shadow-sm border-none">
              Low stock
            </Badge>
          )}
          {!inStock && (
            <Badge className="bg-zinc-800/90 text-white backdrop-blur-md hover:bg-zinc-900/90 shadow-sm border-none dark:bg-zinc-200/90 dark:text-zinc-900">
              Sold out
            </Badge>
          )}
        </div>

        <div className="absolute right-4 top-4">
          <button
            type="button"
            className="group/btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-900"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-pressed={isInWishlist(product.id)}
            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-5 w-5 shrink-0 transition-colors duration-300", isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : "text-zinc-600 group-hover/btn:text-rose-500 dark:text-zinc-400")} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {product.brand}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
            {product.rating ?? "4.8"}
          </span>
        </div>

        <Link to={`/product/${product.id}`} className="group-hover:underline decoration-2 underline-offset-4 decoration-primary/30">
          <h3 className="line-clamp-2 min-h-[3.5rem] text-[17px] font-bold leading-tight tracking-tight text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-100">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
          {product.description}
        </p>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {discounted && (
                <span className="text-sm font-medium text-zinc-400 line-through dark:text-zinc-500">
                  ₹{product.originalPrice?.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end">
            {inStock ? (
              <div className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                In stock ({stock})
              </div>
            ) : (
              <div className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500"></span>
                Out of stock
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            asChild
            variant="outline"
            className="h-11 min-w-0 flex-1 rounded-xl border-zinc-200 px-4 text-sm font-semibold transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <Link to={`/product/${product.id}`} className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap">
              Details
            </Link>
          </Button>
          <Button
            type="button"
            className={cn(
              "h-11 min-w-0 flex-1 rounded-xl px-4 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95",
              inStock
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                : "bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-500"
            )}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={!inStock}
          >
            <span className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap">
              {inStock ? (
                <>
                  <ShoppingCart className="h-4 w-4 shrink-0" />
                  Add to Cart
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 shrink-0" />
                  Unavailable
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;