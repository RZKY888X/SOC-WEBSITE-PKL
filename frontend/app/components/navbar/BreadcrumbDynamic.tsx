"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";

export function BreadcrumbDynamic() {
  const pathname = usePathname();

    if (pathname === "/") return null;


  const pathArray = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "dashboard");

  const fullPath = pathArray.map((segment, index) => {
    return {
      label: decodeURIComponent(segment),
      href: "/" + pathArray.slice(0, index + 1).join("/"),
    };
  });

  return (
    <div className='px-6 bg-[#0D1B2A] font-semibold font-sans'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/dashboard' className='text-white hover:text-gray-300'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {fullPath.map((item, index) => (
            <React.Fragment key={item.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === fullPath.length - 1 ? (
                  <BreadcrumbPage className='text-blue-400'>
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className='text-white hover:text-gray-300'
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
