import type {
  BlogCategory,
  BlogCategoryInsert,
  BlogCategoryUpdate,
} from "./tables/blog_categories";
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from "./tables/blog_posts";
import type { Brand, BrandInsert, BrandUpdate } from "./tables/brands";
import type { CartItem, CartItemInsert, CartItemUpdate } from "./tables/cart_items";
import type { Category, CategoryInsert, CategoryUpdate } from "./tables/categories";
import type { Image, ImageInsert, ImageUpdate } from "./tables/images";
import type {
  NotificationLog,
  NotificationLogInsert,
  NotificationLogUpdate,
} from "./tables/notification_logs";
import type { OrderItem, OrderItemInsert, OrderItemUpdate } from "./tables/order_items";
import type {
  OrderStatusHistory,
  OrderStatusHistoryInsert,
  OrderStatusHistoryUpdate,
} from "./tables/order_status_history";
import type { Order, OrderInsert, OrderUpdate } from "./tables/orders";
import type {
  ProductReview,
  ProductReviewInsert,
  ProductReviewUpdate,
} from "./tables/product_reviews";
import type {
  ProductVariant,
  ProductVariantInsert,
  ProductVariantUpdate,
} from "./tables/product_variants";
import type { Product, ProductInsert, ProductUpdate } from "./tables/products";
import type { Profiles, ProfilesInsert, ProfilesUpdate } from "./tables/profile";
import type { SupportTicketReply, SupportTicketReplyInsert } from "./tables/support_ticket_replies";
import type {
  SupportTicket,
  SupportTicketInsert,
  SupportTicketUpdate,
} from "./tables/support_tickets";
import type {
  SystemSetting,
  SystemSettingInsert,
  SystemSettingUpdate,
} from "./tables/system_settings";
import type { UserAddress, UserAddressInsert, UserAddressUpdate } from "./tables/user_addresses";
import type {
  UserVoucherUsage,
  UserVoucherUsageInsert,
  UserVoucherUsageUpdate,
} from "./tables/user_voucher_usage";
import type { Voucher, VoucherInsert, VoucherUpdate } from "./tables/vouchers";
import type { WishlistItem, WishlistItemInsert, WishlistItemUpdate } from "./tables/wishlist_items";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profiles;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
      };
      user_addresses: {
        Row: UserAddress;
        Insert: UserAddressInsert;
        Update: UserAddressUpdate;
      };
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      brands: {
        Row: Brand;
        Insert: BrandInsert;
        Update: BrandUpdate;
      };
      images: {
        Row: Image;
        Insert: ImageInsert;
        Update: ImageUpdate;
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: ProductVariantInsert;
        Update: ProductVariantUpdate;
      };
      cart_items: {
        Row: CartItem;
        Insert: CartItemInsert;
        Update: CartItemUpdate;
      };
      wishlist_items: {
        Row: WishlistItem;
        Insert: WishlistItemInsert;
        Update: WishlistItemUpdate;
      };
      vouchers: {
        Row: Voucher;
        Insert: VoucherInsert;
        Update: VoucherUpdate;
      };
      user_voucher_usage: {
        Row: UserVoucherUsage;
        Insert: UserVoucherUsageInsert;
        Update: UserVoucherUsageUpdate;
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      order_items: {
        Row: OrderItem;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
      };
      order_status_history: {
        Row: OrderStatusHistory;
        Insert: OrderStatusHistoryInsert;
        Update: OrderStatusHistoryUpdate;
      };
      product_reviews: {
        Row: ProductReview;
        Insert: ProductReviewInsert;
        Update: ProductReviewUpdate;
      };
      blog_categories: {
        Row: BlogCategory;
        Insert: BlogCategoryInsert;
        Update: BlogCategoryUpdate;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: BlogPostInsert;
        Update: BlogPostUpdate;
      };
      support_tickets: {
        Row: SupportTicket;
        Insert: SupportTicketInsert;
        Update: SupportTicketUpdate;
      };
      support_ticket_replies: {
        Row: SupportTicketReply;
        Insert: SupportTicketReplyInsert;
        Update: SupportTicketReply;
      };
      system_settings: {
        Row: SystemSetting;
        Insert: SystemSettingInsert;
        Update: SystemSettingUpdate;
      };
      notification_logs: {
        Row: NotificationLog;
        Insert: NotificationLogInsert;
        Update: NotificationLogUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
