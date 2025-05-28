import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type React from "react";

interface PrivateLayoutProps {
  children: React.ReactNode;
  parentBreadcrumb: {
    title: string;
    href: string;
  };
  currentBreadcrumb: string;
}

export default function PrivateLayout({
  children,
  parentBreadcrumb,
  currentBreadcrumb,
}: PrivateLayoutProps) {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink href={parentBreadcrumb.href}>{parentBreadcrumb.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentBreadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className='flex min-h-0 flex-1 flex-col gap-4 p-4'>{children}</div>
    </>
  );
}
