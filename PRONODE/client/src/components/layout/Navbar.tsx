import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Find Experts" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-serif font-bold tracking-tighter text-primary">
            ProNode<span className="text-foreground">.</span>
          </a>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative group",
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}>
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  location === link.href && "scale-x-100"
                )} />
              </a>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="hidden md:flex border-primary/20 hover:bg-primary/10 hover:text-primary text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Join Network
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
