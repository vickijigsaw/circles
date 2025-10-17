"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) =>
    pathname === path ? "text-primary font-semibold" : "text-muted-foreground";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-6">
        {/* LEFT – main links */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={`px-3 py-2 text-sm font-medium hover:text-primary ${isActive(
                    "/"
                  )}`}
                >
                  Generator
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/gallery"
                  className={`px-3 py-2 text-sm font-medium hover:text-primary ${isActive(
                    "/gallery"
                  )}`}
                >
                  Gallery
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* RIGHT – auth controls */}
        <div className="flex items-center gap-3">
          {!session?.user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                👋 {session.user.name || session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Log Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
