import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-primary">ProNode.</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting decades of wisdom with modern innovation. The premier network for retired professionals.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/browse"><a className="hover:text-primary transition-colors">Find Experts</a></Link></li>
              <li><Link href="/about"><a className="hover:text-primary transition-colors">How it Works</a></Link></li>
              <li><Link href="/pricing"><a className="hover:text-primary transition-colors">Pricing</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about"><a className="hover:text-primary transition-colors">About Us</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-primary transition-colors">Contact</a></Link></li>
              <li><Link href="/terms"><a className="hover:text-primary transition-colors">Terms of Service</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Stay Connected</h4>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-16 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ProNode. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
