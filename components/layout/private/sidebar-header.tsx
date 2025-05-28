import {
  SidebarHeader as ShadcnSidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_NAME } from "@/lib/config/app.config";

export function SidebarHeader() {
  return (
    <ShadcnSidebarHeader className='py-4'>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className='flex items-center justify-center gap-2'>
            <img src='/images/logo.png' alt={APP_NAME} className='h-6' />
            <p className='font-bold'>{APP_NAME}</p>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </ShadcnSidebarHeader>
  );
}
